<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import Sidebar from '../../components/Sidebar.vue'

const route = useRoute()
const router = useRouter()

const API_BASE_URL = import.meta.env.VITE_API_URL

const order = ref<any>(null)
const mechanics = ref<any[]>([])
const loading = ref(false)
const errorMessage = ref('')

const isEditingDiagnosis = ref(false)
const diagnosisDraft = ref('')
const diagnosisError = ref('')

const statusOptions = [
  { value: 'OPEN', label: 'Otvoren' },
  { value: 'IN_PROGRESS', label: 'U toku' },
  { value: 'COMPLETED', label: 'Završen' },
  { value: 'CANCELLED', label: 'Otkazan' }
]

const orderId = computed(() => {
  return Number(route.params.id)
})

async function fetchOrder() {
  try {
    loading.value = true
    errorMessage.value = ''

    if (!orderId.value || Number.isNaN(orderId.value)) {
      throw new Error('Neispravan ID radnog naloga.')
    }

    const response = await axios.get(`${API_BASE_URL}/repair-orders/${orderId.value}`)
    order.value = response.data
  } catch (error) {
    console.error('Greška prilikom učitavanja radnog naloga:', error)
    errorMessage.value = 'Radni nalog trenutno ne može da se učita.'
  } finally {
    loading.value = false
  }
}

async function fetchMechanics() {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/all`)
    // Backend ne filtrira po roli, pa filtriramo ovde.
    mechanics.value = response.data.filter((user: any) => user.role === 'MECHANIC')
  } catch (error) {
    console.error('Greška prilikom učitavanja majstora:', error)
  }
}

function formatDate(date: string) {
  if (!date) {
    return '-'
  }

  return new Intl.DateTimeFormat('sr-RS', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

function getStatusClass(status: string) {
  if (status === 'COMPLETED') {
    return 'text-bg-success'
  }

  if (status === 'IN_PROGRESS') {
    return 'text-bg-primary'
  }

  if (status === 'CANCELLED') {
    return 'text-bg-danger'
  }

  return 'text-bg-secondary'
}

function getStatusLabel(status: string) {
  return statusOptions.find((option) => option.value === status)?.label ?? status
}

const mechanicName = computed(() => {
  if (!order.value?.mechanic) {
    return 'Nedodeljen'
  }

  return `${order.value.mechanic.firstName} ${order.value.mechanic.lastName}`
})

const customerFullName = computed(() => {
  if (!order.value?.customer) {
    return 'Nepoznat klijent'
  }

  return `${order.value.customer.firstName} ${order.value.customer.lastName}`
})

const vehicleName = computed(() => {
  if (!order.value?.vehicle) {
    return 'Nepoznato vozilo'
  }

  return `${order.value.vehicle.make} ${order.value.vehicle.model}`
})

function editDiagnosis() {
  diagnosisDraft.value = order.value?.diagnosis || ''
  diagnosisError.value = ''
  isEditingDiagnosis.value = true
}

function cancelEditDiagnosis() {
  isEditingDiagnosis.value = false
  diagnosisDraft.value = ''
  diagnosisError.value = ''
}

async function saveDiagnosis() {
  if (!order.value) {
    return
  }

  try {
    diagnosisError.value = ''

    await axios.put(`${API_BASE_URL}/repair-orders/${order.value.id}`, {
      diagnosis: diagnosisDraft.value
    })

    order.value.diagnosis = diagnosisDraft.value
    isEditingDiagnosis.value = false
  } catch (error) {
    console.error('Greška prilikom čuvanja dijagnoze:', error)
    diagnosisError.value = 'Dijagnoza trenutno ne može da se sačuva.'
  }
}

async function changeStatus(status: string) {
  if (!order.value) {
    return
  }

  try {
    const payload: Record<string, any> = { status }

    if (status === 'COMPLETED' && !order.value.completedAt) {
      payload.completedAt = new Date().toISOString()
    }

    await axios.put(`${API_BASE_URL}/repair-orders/${order.value.id}`, payload)

    order.value.status = status
    if (payload.completedAt) {
      order.value.completedAt = payload.completedAt
    }
  } catch (error) {
    console.error('Greška prilikom promene statusa:', error)
    errorMessage.value = 'Status naloga trenutno ne može da se promeni.'
  }
}

async function assignMechanic(mechanic: any) {
  if (!order.value) {
    return
  }

  try {
    await axios.put(`${API_BASE_URL}/repair-orders/${order.value.id}`, {
      mechanicId: mechanic.id
    })

    order.value.mechanic = mechanic
    order.value.mechanicId = mechanic.id
  } catch (error) {
    console.error('Greška prilikom dodele majstora:', error)
    errorMessage.value = 'Majstor trenutno ne može da se dodeli.'
  }
}

async function deleteOrder() {
  if (!order.value) {
    return
  }

  const confirmed = window.confirm(`Obrisati radni nalog #${order.value.id}?`)

  if (!confirmed) {
    return
  }

  try {
    await axios.delete(`${API_BASE_URL}/repair-orders/${order.value.id}`)
    router.push('/dashboard/repair-orders')
  } catch (error) {
    console.error('Greška prilikom brisanja naloga:', error)
    errorMessage.value = 'Nalog trenutno ne može da se obriše.'
  }
}

function goBack() {
  router.back()
}

onMounted(async () => {
  await fetchOrder()
  await fetchMechanics()
})
</script>

<template>
  <div class="dashboard-layout bg-body text-body">
    <Sidebar />

    <main class="dashboard-content bg-body-tertiary">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <button
            type="button"
            class="btn btn-link p-0 text-decoration-none mb-2"
            @click="goBack"
          >
            ← Nazad
          </button>

          <h1 class="h2 mb-1">
            Radni nalog <span v-if="order">#{{ order.id }}</span>
          </h1>

          <p class="text-body-secondary mb-0">
            Detalji radnog naloga, dijagnoza i dodela majstora.
          </p>
        </div>

        <span
          v-if="order"
          class="badge fs-6"
          :class="getStatusClass(order.status)"
        >
          {{ getStatusLabel(order.status) }}
        </span>
      </div>

      <div v-if="loading" class="alert alert-info">
        Učitavanje radnog naloga...
      </div>

      <div v-else-if="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>

      <div v-else-if="order" class="row g-4">
        <div class="col-lg-8">
          <div class="card dashboard-card shadow-sm rounded-4 mb-4">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h5 class="fw-bold mb-0">
                  Informacije o nalogu
                </h5>

                <div class="d-flex gap-2">
                  <div class="dropdown">
                    <button
                      class="btn btn-sm btn-outline-secondary dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                    >
                      Status
                    </button>

                    <ul class="dropdown-menu dropdown-menu-end">
                      <li v-for="option in statusOptions" :key="option.value">
                        <button class="dropdown-item" @click="changeStatus(option.value)">
                          {{ option.label }}
                        </button>
                      </li>
                    </ul>
                  </div>

                  <button class="btn btn-sm btn-outline-danger" @click="deleteOrder">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>

              <div class="row g-3 mb-4">
                <div class="col-md-6">
                  <p class="text-body-secondary mb-1">Započet</p>
                  <h6 class="mb-0">{{ formatDate(order.startedAt) }}</h6>
                </div>

                <div class="col-md-6">
                  <p class="text-body-secondary mb-1">Završen</p>
                  <h6 class="mb-0">{{ order.completedAt ? formatDate(order.completedAt) : 'U toku' }}</h6>
                </div>

                <div class="col-12">
                  <p class="text-body-secondary mb-1">Opis problema</p>
                  <p class="mb-0">{{ order.problemDescription || 'Opis problema nije unet.' }}</p>
                </div>
              </div>

              <div class="d-flex justify-content-between align-items-center mb-1">
                <p class="text-body-secondary mb-0">Dijagnoza</p>

                <div>
                  <button
                    v-if="!isEditingDiagnosis"
                    class="btn btn-sm btn-outline-primary"
                    @click="editDiagnosis"
                  >
                    Izmeni
                  </button>

                  <div v-else class="d-flex gap-2">
                    <button class="btn btn-sm btn-success" @click="saveDiagnosis">
                      Sačuvaj
                    </button>

                    <button class="btn btn-sm btn-outline-secondary" @click="cancelEditDiagnosis">
                      Otkaži
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="!isEditingDiagnosis">
                <p class="mb-0">{{ order.diagnosis || 'Dijagnoza još nije uneta.' }}</p>
              </div>

              <div v-else>
                <textarea
                  v-model="diagnosisDraft"
                  class="form-control"
                  rows="4"
                  placeholder="Unesi dijagnozu..."
                />

                <p v-if="diagnosisError" class="text-danger small mb-0 mt-2">
                  {{ diagnosisError }}
                </p>
              </div>
            </div>
          </div>

          <div class="card dashboard-card shadow-sm rounded-4">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h5 class="fw-bold mb-1">Majstor</h5>
                  <p class="text-body-secondary mb-0">Dodeljeni majstor za ovaj nalog.</p>
                </div>

                <div class="dropdown">
                  <button
                    class="btn btn-outline-primary dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    {{ mechanicName }}
                  </button>

                  <ul class="dropdown-menu dropdown-menu-end">
                    <li v-if="mechanics.length === 0">
                      <span class="dropdown-item-text text-body-secondary">Nema majstora</span>
                    </li>

                    <li v-for="mechanic in mechanics" :key="mechanic.id">
                      <button class="dropdown-item" @click="assignMechanic(mechanic)">
                        {{ mechanic.firstName }} {{ mechanic.lastName }}
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card dashboard-card shadow-sm rounded-4 mb-4">
            <div class="card-body p-4">
              <h5 class="fw-bold mb-4">Klijent</h5>

              <div class="detail-item">
                <span class="text-body-secondary">Ime i prezime</span>
                <strong>{{ customerFullName }}</strong>
              </div>

              <div class="detail-item">
                <span class="text-body-secondary">Telefon</span>
                <strong>{{ order.customer?.phone || '-' }}</strong>
              </div>

              <div class="detail-item border-0 pb-0 mb-0">
                <span class="text-body-secondary">Email</span>
                <strong>{{ order.customer?.email || '-' }}</strong>
              </div>
            </div>
          </div>

          <div class="card dashboard-card shadow-sm rounded-4">
            <div class="card-body p-4">
              <h5 class="fw-bold mb-4">Vozilo</h5>

              <div class="detail-item">
                <span class="text-body-secondary">Vozilo</span>
                <strong>{{ vehicleName }}</strong>
              </div>

              <div class="detail-item">
                <span class="text-body-secondary">Godište</span>
                <strong>{{ order.vehicle?.productionYear || '-' }}</strong>
              </div>

              <div class="detail-item">
                <span class="text-body-secondary">Registracija</span>
                <strong>{{ order.vehicle?.licensePlate || '-' }}</strong>
              </div>

              <div class="detail-item border-0 pb-0 mb-0">
                <span class="text-body-secondary">Kilometraža</span>
                <strong>{{ order.vehicle?.mileage || '-' }} km</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
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

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--bs-border-color);
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