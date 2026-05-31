<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Sidebar from '../../components/Sidebar.vue'

const router = useRouter()
const API_BASE_URL = import.meta.env.VITE_API_URL

const orders = ref<any[]>([])
const loading = ref(false)
const errorMessage = ref('')

const currentUser = JSON.parse(localStorage.getItem('user') || 'null')

const statusLabels: Record<string, string> = {
  OPEN: 'Otvoren',
  IN_PROGRESS: 'U toku',
  COMPLETED: 'Završen',
  CANCELLED: 'Otkazan'
}

// Samo nalozi dodeljeni ulogovanom majstoru
const myOrders = computed(() => {
  if (!currentUser) {
    return []
  }
  return orders.value.filter((order) => order.mechanicId === currentUser.id)
})

const activeOrders = computed(() =>
  myOrders.value.filter((order) => order.status === 'OPEN' || order.status === 'IN_PROGRESS')
)

const completedOrders = computed(() =>
  myOrders.value.filter((order) => order.status === 'COMPLETED')
)

const inProgressCount = computed(() =>
  myOrders.value.filter((order) => order.status === 'IN_PROGRESS').length
)

function formatDate(date: string) {
  if (!date) {
    return '-'
  }
  return new Intl.DateTimeFormat('sr-RS', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date))
}

function statusClass(status: string) {
  if (status === 'COMPLETED') return 'text-bg-success'
  if (status === 'IN_PROGRESS') return 'text-bg-primary'
  if (status === 'CANCELLED') return 'text-bg-danger'
  return 'text-bg-secondary'
}

async function fetchOrders() {
  try {
    loading.value = true
    errorMessage.value = ''
    // Ako backend podrzava ?mechanicId, mozes ga dodati ovde radi serverskog filtriranja
    const response = await axios.get(`${API_BASE_URL}/repair-orders/all`)
    orders.value = response.data
  } catch (error) {
    console.error('Greška prilikom učitavanja naloga:', error)
    errorMessage.value = 'Nalozi trenutno ne mogu da se učitaju.'
  } finally {
    loading.value = false
  }
}

async function startWork(order: any) {
  try {
    await axios.put(`${API_BASE_URL}/repair-orders/${order.id}`, {
      status: 'IN_PROGRESS',
      startedAt: order.startedAt ?? new Date().toISOString()
    })
    order.status = 'IN_PROGRESS'
    if (!order.startedAt) {
      order.startedAt = new Date().toISOString()
    }
  } catch (error) {
    console.error('Greška prilikom pokretanja naloga:', error)
    errorMessage.value = 'Nalog trenutno ne može da se pokrene.'
  }
}

async function completeWork(order: any) {
  try {
    const completedAt = new Date().toISOString()
    await axios.put(`${API_BASE_URL}/repair-orders/${order.id}`, {
      status: 'COMPLETED',
      completedAt
    })
    order.status = 'COMPLETED'
    order.completedAt = completedAt
  } catch (error) {
    console.error('Greška prilikom završavanja naloga:', error)
    errorMessage.value = 'Nalog trenutno ne može da se završi.'
  }
}

function openDetails(order: any) {
  router.push(`/dashboard/repair-orders/${order.id}`)
}

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  router.push('/login')
}

onMounted(fetchOrders)
</script>

<template>
  <div class="mechanic-layout bg-body-tertiary text-body d-flex">
    <Sidebar/>
    <main class="mechanic-content">
      <div class="mb-4">
        <h1 class="h2 mb-1">Moji radni nalozi</h1>
        <p class="text-body-secondary mb-0">Pregled naloga koji su tebi dodeljeni.</p>
      </div>

      <div class="row g-4 mb-4">
        <div class="col-md-4">
          <div class="card dashboard-card shadow-sm rounded-4">
            <div class="card-body p-4">
              <p class="text-body-secondary mb-1">Aktivni nalozi</p>
              <h3 class="fw-bold mb-0">{{ activeOrders.length }}</h3>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card dashboard-card shadow-sm rounded-4">
            <div class="card-body p-4">
              <p class="text-body-secondary mb-1">U toku</p>
              <h3 class="fw-bold mb-0 text-primary">{{ inProgressCount }}</h3>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card dashboard-card shadow-sm rounded-4">
            <div class="card-body p-4">
              <p class="text-body-secondary mb-1">Završeni</p>
              <h3 class="fw-bold mb-0 text-success">{{ completedOrders.length }}</h3>
            </div>
          </div>
        </div>
      </div>

      <div v-if="loading" class="alert alert-info">Učitavanje...</div>
      <div v-else-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

      <template v-else>
        <!-- Aktivni nalozi -->
        <div class="card dashboard-card shadow-sm rounded-4 mb-4">
          <div class="card-body p-4">
            <h5 class="fw-bold mb-4">Za rad</h5>

            <div v-if="activeOrders.length === 0" class="alert alert-secondary mb-0">
              Trenutno nemaš dodeljene naloge.
            </div>

            <div v-else class="d-flex flex-column gap-3">
              <div
                v-for="order in activeOrders"
                :key="order.id"
                class="order-item border rounded-4 p-3"
              >
                <div class="d-flex justify-content-between align-items-start flex-wrap gap-2">
                  <div>
                    <div class="d-flex align-items-center gap-2 mb-1">
                      <span class="fw-bold">Nalog #{{ order.id }}</span>
                      <span class="badge" :class="statusClass(order.status)">
                        {{ statusLabels[order.status] ?? order.status }}
                      </span>
                    </div>

                    <div class="text-body-secondary small mb-2">
                      {{ order.customer?.firstName }} {{ order.customer?.lastName }}
                      · {{ order.vehicle?.make }} {{ order.vehicle?.model }}
                      · {{ order.vehicle?.licensePlate }}
                    </div>

                    <p class="mb-0">{{ order.problemDescription || 'Bez opisa problema.' }}</p>
                  </div>

                  <div class="d-flex flex-column gap-2">
                    <button
                      v-if="order.status === 'OPEN'"
                      class="btn btn-sm btn-primary"
                      @click="startWork(order)"
                    >
                      Započni rad
                    </button>

                    <button
                      v-if="order.status === 'IN_PROGRESS'"
                      class="btn btn-sm btn-success"
                      @click="completeWork(order)"
                    >
                      Završi
                    </button>

                    <button class="btn btn-sm btn-outline-primary" @click="openDetails(order)">
                      Detalji / dijagnoza
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Završeni -->
        <div class="card dashboard-card shadow-sm rounded-4">
          <div class="card-body p-4">
            <h5 class="fw-bold mb-4">Završeni nalozi</h5>

            <div v-if="completedOrders.length === 0" class="alert alert-secondary mb-0">
              Još nema završenih naloga.
            </div>

            <div v-else class="table-responsive">
              <table class="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Nalog</th>
                    <th>Vozilo</th>
                    <th>Završen</th>
                    <th class="text-end">Akcija</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="order in completedOrders" :key="order.id">
                    <td class="fw-semibold">#{{ order.id }}</td>
                    <td>{{ order.vehicle?.make }} {{ order.vehicle?.model }}</td>
                    <td>{{ formatDate(order.completedAt) }}</td>
                    <td class="text-end">
                      <button class="btn btn-sm btn-outline-primary" @click="openDetails(order)">
                        Detalji
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </template>
    </main>
  </div>
</template>

<style scoped>
.mechanic-layout {
  min-height: 100vh;
}

.mechanic-content {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.dashboard-card {
  background-color: var(--bs-body-bg);
  border: 1px solid var(--bs-border-color);
  color: var(--bs-body-color);
}

.order-item {
  border-color: var(--bs-border-color) !important;
}

.table {
  --bs-table-bg: transparent;
  --bs-table-color: var(--bs-body-color);
  --bs-table-border-color: var(--bs-border-color);
}

@media (max-width: 768px) {
  .mechanic-content {
    padding: 1.5rem 1rem;
  }
}
</style>