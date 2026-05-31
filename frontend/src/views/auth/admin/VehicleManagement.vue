<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Sidebar from '../../components/Sidebar.vue'
import type { Vehicle } from '@/types/vehicle.ts'
import type { Customer } from '@/types/customer.ts'

const API_BASE_URL = import.meta.env.VITE_API_URL

const vehicles = ref<Vehicle[]>([])
const customers = ref<Customer[]>([])
const loading = ref(false)
const errorMessage = ref('')
const searchQuery = ref('')

const showModal = ref(false)
const editingId = ref<number | null>(null)
const saving = ref(false)
const formError = ref('')

const form = ref({
  customerId: null as number | null,
  make: '',
  model: '',
  productionYear: null as number | null,
  licensePlate: '',
  vin: '',
  mileage: 0
})

const customerNameById = computed(() => {
  const map = new Map<number, string>()
  customers.value.forEach((customer) => {
    map.set(customer.id, `${customer.firstName} ${customer.lastName}`)
  })
  return map
})

const filteredVehicles = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  if (!query) {
    return vehicles.value
  }

  return vehicles.value.filter((vehicle) => {
    const haystack = `${vehicle.make} ${vehicle.model} ${vehicle.licensePlate} ${vehicle.vin ?? ''}`.toLowerCase()
    return haystack.includes(query)
  })
})

async function fetchData() {
  try {
    loading.value = true
    errorMessage.value = ''

    const [vehiclesRes, customersRes] = await Promise.all([
      axios.get(`${API_BASE_URL}/vehicles/all`),
      axios.get(`${API_BASE_URL}/customers/all`)
    ])

    vehicles.value = vehiclesRes.data
    customers.value = customersRes.data
  } catch (error) {
    console.error('Greška prilikom učitavanja vozila:', error)
    errorMessage.value = 'Vozila trenutno ne mogu da se učitaju.'
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editingId.value = null
  formError.value = ''
  form.value = {
    customerId: null,
    make: '',
    model: '',
    productionYear: null,
    licensePlate: '',
    vin: '',
    mileage: 0
  }
  showModal.value = true
}

function openEdit(vehicle: Vehicle) {
  editingId.value = vehicle.id
  formError.value = ''
  form.value = {
    customerId: vehicle.customerId,
    make: vehicle.make,
    model: vehicle.model,
    productionYear: vehicle.productionYear,
    licensePlate: vehicle.licensePlate,
    vin: vehicle.vin,
    mileage: vehicle.mileage
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function saveVehicle() {
  if (!form.value.customerId || !form.value.make.trim() || !form.value.model.trim() || !form.value.licensePlate.trim()) {
    formError.value = 'Klijent, marka, model i registracija su obavezni.'
    return
  }

  try {
    saving.value = true
    formError.value = ''

    const payload = {
      customerId: form.value.customerId,
      make: form.value.make.trim(),
      model: form.value.model.trim(),
      productionYear: form.value.productionYear || null,
      licensePlate: form.value.licensePlate.trim(),
      vin: form.value.vin.trim() || null,
      mileage: Number(form.value.mileage) || 0
    }

    if (editingId.value) {
      await axios.patch(`${API_BASE_URL}/vehicles/${editingId.value}`, payload)
    } else {
      await axios.post(`${API_BASE_URL}/vehicles/create`, payload)
    }

    showModal.value = false
    await fetchData()
  } catch (error) {
    console.error('Greška prilikom čuvanja vozila:', error)
    formError.value = 'Vozilo trenutno ne može da se sačuva.'
  } finally {
    saving.value = false
  }
}

async function deleteVehicle(vehicle: Vehicle) {
  const confirmed = window.confirm(`Obrisati vozilo ${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})?`)

  if (!confirmed) {
    return
  }

  try {
    await axios.delete(`${API_BASE_URL}/vehicles/${vehicle.id}`)
    await fetchData()
  } catch (error) {
    console.error('Greška prilikom brisanja vozila:', error)
    errorMessage.value = 'Vozilo trenutno ne može da se obriše (proveri vezane termine).'
  }
}

onMounted(fetchData)
</script>

<template>
  <div class="dashboard-layout bg-body text-body">
    <Sidebar />

    <main class="dashboard-content bg-body-tertiary">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="h2 mb-1">
            Vozila
          </h1>

          <p class="text-body-secondary mb-0">
            Pregled i upravljanje vozilima klijenata.
          </p>
        </div>

        <button class="btn btn-primary" @click="openCreate">
          <i class="bi bi-plus-lg me-1"></i>
          Dodaj vozilo
        </button>
      </div>

      <div class="card dashboard-card shadow-sm rounded-4">
        <div class="card-body p-4">
          <div class="mb-3">
            <input
              v-model="searchQuery"
              type="text"
              class="form-control"
              placeholder="Pretraži po marki, modelu, registraciji ili VIN-u..."
            />
          </div>

          <div v-if="loading" class="alert alert-info mb-0">
            Učitavanje vozila...
          </div>

          <div v-else-if="errorMessage" class="alert alert-danger mb-0">
            {{ errorMessage }}
          </div>

          <div v-else-if="filteredVehicles.length === 0" class="alert alert-secondary mb-0">
            Nema vozila za prikaz.
          </div>

          <div v-else class="table-responsive">
            <table class="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Vozilo</th>
                  <th>Vlasnik</th>
                  <th>Godište</th>
                  <th>Registracija</th>
                  <th>Kilometraža</th>
                  <th class="text-end">Akcije</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="vehicle in filteredVehicles" :key="vehicle.id">
                  <td class="fw-semibold">{{ vehicle.make }} {{ vehicle.model }}</td>
                  <td>{{ customerNameById.get(vehicle.customerId) || '-' }}</td>
                  <td>{{ vehicle.productionYear || '-' }}</td>
                  <td>{{ vehicle.licensePlate }}</td>
                  <td>{{ vehicle.mileage }} km</td>
                  <td class="text-end">
                    <button class="btn btn-sm btn-outline-primary me-2" @click="openEdit(vehicle)">
                      <i class="bi bi-pencil"></i>
                    </button>

                    <button class="btn btn-sm btn-outline-danger" @click="deleteVehicle(vehicle)">
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
            {{ editingId ? 'Izmeni vozilo' : 'Novo vozilo' }}
          </h5>

          <div class="row g-3">
            <div class="col-12">
              <label class="form-label">Vlasnik</label>
              <select v-model="form.customerId" class="form-select">
                <option :value="null" disabled>Izaberi klijenta...</option>
                <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                  {{ customer.firstName }} {{ customer.lastName }}
                </option>
              </select>
            </div>

            <div class="col-md-6">
              <label class="form-label">Marka</label>
              <input v-model="form.make" type="text" class="form-control" />
            </div>

            <div class="col-md-6">
              <label class="form-label">Model</label>
              <input v-model="form.model" type="text" class="form-control" />
            </div>

            <div class="col-md-6">
              <label class="form-label">Godište</label>
              <input v-model.number="form.productionYear" type="number" class="form-control" />
            </div>

            <div class="col-md-6">
              <label class="form-label">Registracija</label>
              <input v-model="form.licensePlate" type="text" class="form-control" />
            </div>

            <div class="col-md-6">
              <label class="form-label">VIN</label>
              <input v-model="form.vin" type="text" class="form-control" />
            </div>

            <div class="col-md-6">
              <label class="form-label">Kilometraža</label>
              <input v-model.number="form.mileage" type="number" class="form-control" />
            </div>
          </div>

          <p v-if="formError" class="text-danger small mb-0 mt-3">
            {{ formError }}
          </p>

          <div class="d-flex justify-content-end gap-2 mt-4">
            <button class="btn btn-outline-secondary" @click="closeModal">
              Otkaži
            </button>

            <button class="btn btn-primary" :disabled="saving" @click="saveVehicle">
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