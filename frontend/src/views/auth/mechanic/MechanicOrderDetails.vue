<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import Sidebar from '../../components/Sidebar.vue'

const route = useRoute()
const router = useRouter()
const API_BASE_URL = import.meta.env.VITE_API_URL

const currentUser = JSON.parse(localStorage.getItem('user') || 'null')

const order = ref<any>(null)
const loading = ref(false)
const errorMessage = ref('')

const isEditingDiagnosis = ref(false)
const diagnosisDraft = ref('')
const diagnosisError = ref('')

const orderId = computed(() => Number(route.params.id))

// Da li ovaj nalog pripada ulogovanom majstoru
const isMine = computed(() => {
  return order.value && currentUser && order.value.mechanicId === currentUser.id
})

const statusLabels: Record<string, string> = {
  OPEN: 'Otvoren',
  IN_PROGRESS: 'U toku',
  COMPLETED: 'Završen',
  CANCELLED: 'Otkazan'
}

function statusClass(status: string) {
  if (status === 'COMPLETED') return 'text-bg-success'
  if (status === 'IN_PROGRESS') return 'text-bg-primary'
  if (status === 'CANCELLED') return 'text-bg-danger'
  return 'text-bg-secondary'
}

function formatDate(date: string) {
  if (!date) return '-'
  return new Intl.DateTimeFormat('sr-RS', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }).format(new Date(date))
}

async function fetchOrder() {
  try {
    loading.value = true
    errorMessage.value = ''

    if (!orderId.value || Number.isNaN(orderId.value)) {
      throw new Error('Neispravan ID naloga.')
    }

    const response = await axios.get(`${API_BASE_URL}/repair-orders/${orderId.value}`)
    order.value = response.data
  } catch (error) {
    console.error('Greška prilikom učitavanja naloga:', error)
    errorMessage.value = 'Nalog trenutno ne može da se učita.'
  } finally {
    loading.value = false
  }
}

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

async function startWork() {
  try {
    await axios.put(`${API_BASE_URL}/repair-orders/${order.value.id}`, {
      status: 'IN_PROGRESS',
      startedAt: order.value.startedAt ?? new Date().toISOString()
    })
    order.value.status = 'IN_PROGRESS'
    if (!order.value.startedAt) {
      order.value.startedAt = new Date().toISOString()
    }
  } catch (error) {
    console.error('Greška prilikom pokretanja:', error)
    errorMessage.value = 'Nalog ne može da se pokrene.'
  }
}

async function completeWork() {
  try {
    const completedAt = new Date().toISOString()
    await axios.put(`${API_BASE_URL}/repair-orders/${order.value.id}`, {
      status: 'COMPLETED',
      completedAt
    })
    order.value.status = 'COMPLETED'
    order.value.completedAt = completedAt
  } catch (error) {
    console.error('Greška prilikom završavanja:', error)
    errorMessage.value = 'Nalog ne može da se završi.'
  }
}

function goBack() {
  router.back()
}

onMounted(fetchOrder)
</script>

<template>
  <div class="dashboard-layout bg-body text-body">
    <Sidebar />

    <main class="dashboard-content bg-body-tertiary">
      <div class="mb-4">
        <button type="button" class="btn btn-link p-0 text-decoration-none mb-2" @click="goBack">
          ← Nazad
        </button>
        <h1 class="h2 mb-0">Radni nalog <span v-if="order">#{{ order.id }}</span></h1>
      </div>

      <div v-if="loading" class="alert alert-info">Učitavanje...</div>
      <div v-else-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

      <!-- Zaštita: nalog koji nije njegov ne sme da menja -->
      <div v-else-if="order && !isMine" class="alert alert-warning">
        Ovaj nalog nije dodeljen tebi.
      </div>

      <div v-else-if="order" class="row g-4">
        <div class="col-lg-8">
          <div class="card dashboard-card shadow-sm rounded-4 mb-4">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h5 class="fw-bold mb-0">Informacije o nalogu</h5>
                <span class="badge fs-6" :class="statusClass(order.status)">
                  {{ statusLabels[order.status] ?? order.status }}
                </span>
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
                  <p class="mb-0">{{ order.problemDescription || 'Bez opisa.' }}</p>
                </div>
              </div>

              <!-- Dijagnoza -->
              <div class="d-flex justify-content-between align-items-center mb-1">
                <p class="text-body-secondary mb-0">Dijagnoza</p>
                <div>
                  <button v-if="!isEditingDiagnosis" class="btn btn-sm btn-outline-primary" @click="editDiagnosis">
                    Izmeni
                  </button>
                  <div v-else class="d-flex gap-2">
                    <button class="btn btn-sm btn-success" @click="saveDiagnosis">Sačuvaj</button>
                    <button class="btn btn-sm btn-outline-secondary" @click="cancelEditDiagnosis">Otkaži</button>
                  </div>
                </div>
              </div>

              <div v-if="!isEditingDiagnosis">
                <p class="mb-0">{{ order.diagnosis || 'Dijagnoza još nije uneta.' }}</p>
              </div>
              <div v-else>
                <textarea v-model="diagnosisDraft" class="form-control" rows="4" placeholder="Unesi dijagnozu..." />
                <p v-if="diagnosisError" class="text-danger small mb-0 mt-2">{{ diagnosisError }}</p>
              </div>

              <!-- Akcije statusa -->
              <hr class="my-4" />
              <div class="d-flex gap-2">
                <button
                  v-if="order.status === 'OPEN'"
                  class="btn btn-primary"
                  @click="startWork"
                >
                  Započni rad
                </button>
                <button
                  v-if="order.status === 'IN_PROGRESS'"
                  class="btn btn-success"
                  @click="completeWork"
                >
                  Završi nalog
                </button>
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
                <strong>{{ order.customer?.firstName }} {{ order.customer?.lastName }}</strong>
              </div>
              <div class="detail-item border-0 pb-0 mb-0">
                <span class="text-body-secondary">Telefon</span>
                <strong>{{ order.customer?.phone || '-' }}</strong>
              </div>
            </div>
          </div>

          <div class="card dashboard-card shadow-sm rounded-4">
            <div class="card-body p-4">
              <h5 class="fw-bold mb-4">Vozilo</h5>
              <div class="detail-item">
                <span class="text-body-secondary">Vozilo</span>
                <strong>{{ order.vehicle?.make }} {{ order.vehicle?.model }}</strong>
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