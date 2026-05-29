<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Sidebar from '../components/Sidebar.vue'
import type { Customer } from '@/types/customer.ts'

const API_BASE_URL = import.meta.env.VITE_API_URL

const customers = ref<Customer[]>([])
const loading = ref(false)
const errorMessage = ref('')
const searchQuery = ref('')

const showModal = ref(false)
const editingId = ref<number | null>(null)
const saving = ref(false)
const formError = ref('')

const form = ref({
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  address: '',
  notes: ''
})

const filteredCustomers = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  if (!query) {
    return customers.value
  }

  return customers.value.filter((customer) => {
    const haystack = `${customer.firstName} ${customer.lastName} ${customer.phone} ${customer.email ?? ''}`.toLowerCase()
    return haystack.includes(query)
  })
})

async function fetchCustomers() {
  try {
    loading.value = true
    errorMessage.value = ''

    const response = await axios.get(`${API_BASE_URL}/customers/all`)
    customers.value = response.data
  } catch (error) {
    console.error('Greška prilikom učitavanja klijenata:', error)
    errorMessage.value = 'Klijenti trenutno ne mogu da se učitaju.'
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editingId.value = null
  formError.value = ''
  form.value = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
  }
  showModal.value = true
}

function openEdit(customer: Customer) {
  editingId.value = customer.id
  formError.value = ''
  form.value = {
    firstName: customer.firstName,
    lastName: customer.lastName,
    phone: customer.phone,
    email: customer.email ?? '',
    address: customer.address ?? '',
    notes: customer.notes ?? ''
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function saveCustomer() {
  if (!form.value.firstName.trim() || !form.value.lastName.trim() || !form.value.phone.trim()) {
    formError.value = 'Ime, prezime i telefon su obavezni.'
    return
  }

  try {
    saving.value = true
    formError.value = ''

    const payload = {
      firstName: form.value.firstName.trim(),
      lastName: form.value.lastName.trim(),
      phone: form.value.phone.trim(),
      email: form.value.email.trim() || null,
      address: form.value.address.trim() || null,
      notes: form.value.notes.trim() || null
    }

    if (editingId.value) {
      await axios.patch(`${API_BASE_URL}/customers/${editingId.value}`, payload)
    } else {
      await axios.post(`${API_BASE_URL}/customers/create`, payload)
    }

    showModal.value = false
    await fetchCustomers()
  } catch (error) {
    console.error('Greška prilikom čuvanja klijenta:', error)
    formError.value = 'Klijent trenutno ne može da se sačuva.'
  } finally {
    saving.value = false
  }
}

async function deleteCustomer(customer: Customer) {
  const confirmed = window.confirm(`Obrisati klijenta ${customer.firstName} ${customer.lastName}?`)

  if (!confirmed) {
    return
  }

  try {
    await axios.delete(`${API_BASE_URL}/customers/${customer.id}`)
    await fetchCustomers()
  } catch (error) {
    console.error('Greška prilikom brisanja klijenta:', error)
    errorMessage.value = 'Klijent trenutno ne može da se obriše (proveri da li ima vezana vozila ili termine).'
  }
}

onMounted(fetchCustomers)
</script>

<template>
  <div class="dashboard-layout bg-body text-body">
    <Sidebar />

    <main class="dashboard-content bg-body-tertiary">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="h2 mb-1">
            Klijenti
          </h1>

          <p class="text-body-secondary mb-0">
            Pregled i upravljanje klijentima servisa.
          </p>
        </div>

        <button class="btn btn-primary" @click="openCreate">
          <i class="bi bi-plus-lg me-1"></i>
          Dodaj klijenta
        </button>
      </div>

      <div class="card dashboard-card shadow-sm rounded-4">
        <div class="card-body p-4">
          <div class="mb-3">
            <input
              v-model="searchQuery"
              type="text"
              class="form-control"
              placeholder="Pretraži po imenu, telefonu ili email-u..."
            />
          </div>

          <div v-if="loading" class="alert alert-info mb-0">
            Učitavanje klijenata...
          </div>

          <div v-else-if="errorMessage" class="alert alert-danger mb-0">
            {{ errorMessage }}
          </div>

          <div v-else-if="filteredCustomers.length === 0" class="alert alert-secondary mb-0">
            Nema klijenata za prikaz.
          </div>

          <div v-else class="table-responsive">
            <table class="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Ime i prezime</th>
                  <th>Telefon</th>
                  <th>Email</th>
                  <th>Adresa</th>
                  <th class="text-end">Akcije</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="customer in filteredCustomers" :key="customer.id">
                  <td class="fw-semibold">{{ customer.firstName }} {{ customer.lastName }}</td>
                  <td>{{ customer.phone }}</td>
                  <td>{{ customer.email || '-' }}</td>
                  <td>{{ customer.address || '-' }}</td>
                  <td class="text-end">
                    <button class="btn btn-sm btn-outline-primary me-2" @click="openEdit(customer)">
                      <i class="bi bi-pencil"></i>
                    </button>

                    <button class="btn btn-sm btn-outline-danger" @click="deleteCustomer(customer)">
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
            {{ editingId ? 'Izmeni klijenta' : 'Novi klijent' }}
          </h5>

          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Ime</label>
              <input v-model="form.firstName" type="text" class="form-control" />
            </div>

            <div class="col-md-6">
              <label class="form-label">Prezime</label>
              <input v-model="form.lastName" type="text" class="form-control" />
            </div>

            <div class="col-md-6">
              <label class="form-label">Telefon</label>
              <input v-model="form.phone" type="text" class="form-control" />
            </div>

            <div class="col-md-6">
              <label class="form-label">Email</label>
              <input v-model="form.email" type="email" class="form-control" />
            </div>

            <div class="col-12">
              <label class="form-label">Adresa</label>
              <input v-model="form.address" type="text" class="form-control" />
            </div>

            <div class="col-12">
              <label class="form-label">Napomena</label>
              <textarea v-model="form.notes" class="form-control" rows="3" />
            </div>
          </div>

          <p v-if="formError" class="text-danger small mb-0 mt-3">
            {{ formError }}
          </p>

          <div class="d-flex justify-content-end gap-2 mt-4">
            <button class="btn btn-outline-secondary" @click="closeModal">
              Otkaži
            </button>

            <button class="btn btn-primary" :disabled="saving" @click="saveCustomer">
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