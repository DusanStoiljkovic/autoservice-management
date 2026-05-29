<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Sidebar from '../components/Sidebar.vue'

const router = useRouter()
const API_BASE_URL = import.meta.env.VITE_API_URL

const orders = ref<any[]>([])
const loading = ref(false)
const errorMessage = ref('')
const statusFilter = ref('ALL')

const statusOptions = [
  { value: 'OPEN', label: 'Otvoren' },
  { value: 'IN_PROGRESS', label: 'U toku' },
  { value: 'COMPLETED', label: 'Završen' },
  { value: 'CANCELLED', label: 'Otkazan' }
]

const filteredOrders = computed(() => {
  if (statusFilter.value === 'ALL') {
    return orders.value
  }

  return orders.value.filter((order) => order.status === statusFilter.value)
})

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

async function fetchOrders() {
  try {
    loading.value = true
    errorMessage.value = ''

    const response = await axios.get(`${API_BASE_URL}/repair-orders/all`)
    orders.value = response.data
  } catch (error) {
    console.error('Greška prilikom učitavanja radnih naloga:', error)
    errorMessage.value = 'Radni nalozi trenutno ne mogu da se učitaju.'
  } finally {
    loading.value = false
  }
}

function openDetails(order: any) {
  router.push(`/dashboard/repair-orders/${order.id}`)
}

onMounted(fetchOrders)
</script>

<template>
  <div class="dashboard-layout bg-body text-body">
    <Sidebar />

    <main class="dashboard-content bg-body-tertiary">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="h2 mb-1">
            Radni nalozi
          </h1>

          <p class="text-body-secondary mb-0">
            Pregled svih radnih naloga servisa.
          </p>
        </div>

        <select v-model="statusFilter" class="form-select w-auto">
          <option value="ALL">Svi statusi</option>
          <option v-for="option in statusOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>

      <div class="card dashboard-card shadow-sm rounded-4">
        <div class="card-body p-4">
          <div v-if="loading" class="alert alert-info mb-0">
            Učitavanje radnih naloga...
          </div>

          <div v-else-if="errorMessage" class="alert alert-danger mb-0">
            {{ errorMessage }}
          </div>

          <div v-else-if="filteredOrders.length === 0" class="alert alert-secondary mb-0">
            Nema radnih naloga za prikaz.
          </div>

          <div v-else class="table-responsive">
            <table class="table align-middle mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Klijent</th>
                  <th>Vozilo</th>
                  <th>Majstor</th>
                  <th>Status</th>
                  <th>Datum</th>
                  <th class="text-end">Akcije</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="order in filteredOrders" :key="order.id">
                  <td class="fw-semibold">#{{ order.id }}</td>
                  <td>{{ order.customer?.firstName }} {{ order.customer?.lastName }}</td>
                  <td>{{ order.vehicle?.make }} {{ order.vehicle?.model }}</td>
                  <td>
                    <template v-if="order.mechanic">
                      {{ order.mechanic.firstName }} {{ order.mechanic.lastName }}
                    </template>
                    <span v-else class="text-body-secondary">Nedodeljen</span>
                  </td>
                  <td>
                    <span class="badge" :class="getStatusClass(order.status)">
                      {{ getStatusLabel(order.status) }}
                    </span>
                  </td>
                  <td>{{ formatDate(order.createdAt) }}</td>
                  <td class="text-end">
                    <button class="btn btn-sm btn-outline-primary" @click="openDetails(order)">
                      <i class="bi bi-eye"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
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

.table {
  --bs-table-bg: transparent;
  --bs-table-color: var(--bs-body-color);
  --bs-table-border-color: var(--bs-border-color);
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