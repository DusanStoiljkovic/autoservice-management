<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Sidebar from '../components/Sidebar.vue'
import type { Service } from '@/types/services.ts'

const API_BASE_URL = import.meta.env.VITE_API_URL

const services = ref<Service[]>([])
const loading = ref(false)
const errorMessage = ref('')
const searchQuery = ref('')

const showModal = ref(false)
const editingId = ref<number | null>(null)
const saving = ref(false)
const formError = ref('')

const form = ref({
  name: '',
  description: '',
  price: 0,
  estimatedDurationMinutes: null as number | null,
  isActive: true
})

const filteredServices = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  if (!query) {
    return services.value
  }

  return services.value.filter((service) => {
    return service.name.toLowerCase().includes(query)
  })
})

function formatPrice(price: string | number) {
  const numericPrice = Number(price)

  if (Number.isNaN(numericPrice)) {
    return `${price} RSD`
  }

  return new Intl.NumberFormat('sr-RS', {
    style: 'currency',
    currency: 'RSD',
    minimumFractionDigits: 0
  }).format(numericPrice)
}

async function fetchServices() {
  try {
    loading.value = true
    errorMessage.value = ''

    const response = await axios.get(`${API_BASE_URL}/services/all`)
    services.value = response.data
  } catch (error) {
    console.error('Greška prilikom učitavanja usluga:', error)
    errorMessage.value = 'Usluge trenutno ne mogu da se učitaju.'
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editingId.value = null
  formError.value = ''
  form.value = {
    name: '',
    description: '',
    price: 0,
    estimatedDurationMinutes: null,
    isActive: true
  }
  showModal.value = true
}

function openEdit(service: Service) {
  editingId.value = service.id
  formError.value = ''
  form.value = {
    name: service.name,
    description: service.description ?? '',
    price: Number(service.price),
    estimatedDurationMinutes: service.estimatedDurationMinutes,
    isActive: Boolean(service.isActive)
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function saveService() {
  if (!form.value.name.trim()) {
    formError.value = 'Naziv usluge je obavezan.'
    return
  }

  try {
    saving.value = true
    formError.value = ''

    const payload = {
      name: form.value.name.trim(),
      description: form.value.description.trim() || null,
      price: Number(form.value.price) || 0,
      estimatedDurationMinutes: form.value.estimatedDurationMinutes || null,
      isActive: form.value.isActive ? 1 : 0
    }

    if (editingId.value) {
      await axios.patch(`${API_BASE_URL}/services/${editingId.value}`, payload)
    } else {
      await axios.post(`${API_BASE_URL}/services/create`, payload)
    }

    showModal.value = false
    await fetchServices()
  } catch (error) {
    console.error('Greška prilikom čuvanja usluge:', error)
    formError.value = 'Usluga trenutno ne može da se sačuva.'
  } finally {
    saving.value = false
  }
}

async function deleteService(service: Service) {
  const confirmed = window.confirm(`Obrisati uslugu "${service.name}"?`)

  if (!confirmed) {
    return
  }

  try {
    await axios.delete(`${API_BASE_URL}/services/${service.id}`)
    await fetchServices()
  } catch (error) {
    console.error('Greška prilikom brisanja usluge:', error)
    errorMessage.value = 'Usluga trenutno ne može da se obriše.'
  }
}

onMounted(fetchServices)
</script>

<template>
  <div class="dashboard-layout bg-body text-body">
    <Sidebar />

    <main class="dashboard-content bg-body-tertiary">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="h2 mb-1">
            Usluge
          </h1>

          <p class="text-body-secondary mb-0">
            Cenovnik i upravljanje uslugama servisa.
          </p>
        </div>

        <button class="btn btn-primary" @click="openCreate">
          <i class="bi bi-plus-lg me-1"></i>
          Dodaj uslugu
        </button>
      </div>

      <div class="card dashboard-card shadow-sm rounded-4">
        <div class="card-body p-4">
          <div class="mb-3">
            <input
              v-model="searchQuery"
              type="text"
              class="form-control"
              placeholder="Pretraži usluge po nazivu..."
            />
          </div>

          <div v-if="loading" class="alert alert-info mb-0">
            Učitavanje usluga...
          </div>

          <div v-else-if="errorMessage" class="alert alert-danger mb-0">
            {{ errorMessage }}
          </div>

          <div v-else-if="filteredServices.length === 0" class="alert alert-secondary mb-0">
            Nema usluga za prikaz.
          </div>

          <div v-else class="table-responsive">
            <table class="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Naziv</th>
                  <th>Trajanje</th>
                  <th>Status</th>
                  <th class="text-end">Cena</th>
                  <th class="text-end">Akcije</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="service in filteredServices" :key="service.id">
                  <td>
                    <div class="fw-semibold">{{ service.name }}</div>
                    <small class="text-body-secondary">{{ service.description || 'Bez opisa' }}</small>
                  </td>
                  <td>{{ service.estimatedDurationMinutes || '-' }} min</td>
                  <td>
                    <span class="badge" :class="service.isActive ? 'text-bg-success' : 'text-bg-secondary'">
                      {{ service.isActive ? 'Aktivna' : 'Neaktivna' }}
                    </span>
                  </td>
                  <td class="text-end fw-semibold">{{ formatPrice(service.price) }}</td>
                  <td class="text-end">
                    <button class="btn btn-sm btn-outline-primary me-2" @click="openEdit(service)">
                      <i class="bi bi-pencil"></i>
                    </button>

                    <button class="btn btn-sm btn-outline-danger" @click="deleteService(service)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>

    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-card card dashboard-card shadow rounded-4">
        <div class="card-body p-4">
          <h5 class="fw-bold mb-4">
            {{ editingId ? 'Izmeni uslugu' : 'Nova usluga' }}
          </h5>

          <div class="row g-3">
            <div class="col-12">
              <label class="form-label">Naziv</label>
              <input v-model="form.name" type="text" class="form-control" />
            </div>

            <div class="col-12">
              <label class="form-label">Opis</label>
              <textarea v-model="form.description" class="form-control" rows="3" />
            </div>

            <div class="col-md-6">
              <label class="form-label">Cena (RSD)</label>
              <input v-model.number="form.price" type="number" min="0" class="form-control" />
            </div>

            <div class="col-md-6">
              <label class="form-label">Trajanje (min)</label>
              <input v-model.number="form.estimatedDurationMinutes" type="number" min="0" class="form-control" />
            </div>

            <div class="col-12">
              <div class="form-check form-switch">
                <input v-model="form.isActive" class="form-check-input" type="checkbox" id="serviceActive" />
                <label class="form-check-label" for="serviceActive">Usluga je aktivna</label>
              </div>
            </div>
          </div>

          <p v-if="formError" class="text-danger small mb-0 mt-3">
            {{ formError }}
          </p>

          <div class="d-flex justify-content-end gap-2 mt-4">
            <button class="btn btn-outline-secondary" @click="closeModal">
              Otkaži
            </button>

            <button class="btn btn-primary" :disabled="saving" @click="saveService">
              {{ saving ? 'Čuvanje...' : 'Sačuvaj' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-layout {
  min-height: 100vh;
  display: flex;
}

.dashboard-content {
  flex: 1;
  min-width: 0;
  padding: 1.5rem;
}

.dashboard-card {
  background-color: var(--bs-body-bg);
  border: 1px solid var(--bs-border-color);
  color: var(--bs-body-color);
}

.table {
  --bs-table-bg: transparent;
  --bs-table-color: var(--bs-body-color);
  --bs-table-border-color: var(--bs-border-color);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 1050;
}

.modal-card {
  width: 100%;
  max-width: 640px;
  max-height: 90vh;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .dashboard-layout {
    flex-direction: column;
  }

  .dashboard-content {
    padding: 1rem;
  }
}
</style>