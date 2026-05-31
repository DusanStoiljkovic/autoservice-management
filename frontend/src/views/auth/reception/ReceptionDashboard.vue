<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Sidebar from '../../components/Sidebar.vue'

const router = useRouter()
const API_BASE_URL = import.meta.env.VITE_API_URL

const appointments = ref<any[]>([])
const invoices = ref<any[]>([])
const loading = ref(false)
const errorMessage = ref('')

const statusOptions = [
  { value: 'SCHEDULED', label: 'Zakazano' },
  { value: 'CONFIRMED', label: 'Potvrđeno' },
  { value: 'COMPLETED', label: 'Završeno' },
  { value: 'CANCELLED', label: 'Otkazano' }
]

function todayKey() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

const todaysAppointments = computed(() => {
  const today = todayKey()
  return appointments.value
    .filter((appointment) => {
      const date = new Date(appointment.scheduledAt)
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${date.getFullYear()}-${month}-${day}` === today
    })
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
})

const scheduledCount = computed(() =>
  appointments.value.filter((a) => a.status === 'SCHEDULED').length
)

const unpaidCount = computed(() =>
  invoices.value.filter((i) => i.status === 'DRAFT' || i.status === 'ISSUED').length
)

function formatTime(date: string) {
  if (!date) return '-'
  return new Intl.DateTimeFormat('sr-RS', { hour: '2-digit', minute: '2-digit' }).format(new Date(date))
}

function statusClass(status: string) {
  if (status === 'CONFIRMED') return 'text-bg-success'
  if (status === 'COMPLETED') return 'text-bg-secondary'
  if (status === 'CANCELLED') return 'text-bg-danger'
  return 'text-bg-primary'
}

function statusLabel(status: string) {
  return statusOptions.find((o) => o.value === status)?.label ?? status
}

async function fetchData() {
  try {
    loading.value = true
    errorMessage.value = ''

    const [appointmentsRes, invoicesRes] = await Promise.all([
      axios.get(`${API_BASE_URL}/appointments/all`),
      axios.get(`${API_BASE_URL}/invoices/all`)
    ])

    appointments.value = appointmentsRes.data
    invoices.value = invoicesRes.data
  } catch (error) {
    console.error('Greška prilikom učitavanja podataka:', error)
    errorMessage.value = 'Podaci trenutno ne mogu da se učitaju.'
  } finally {
    loading.value = false
  }
}

async function changeStatus(appointment: any, status: string) {
  try {
    await axios.patch(`${API_BASE_URL}/appointments/${appointment.id}/status`, { status })
    appointment.status = status
  } catch (error) {
    console.error('Greška prilikom promene statusa:', error)
    errorMessage.value = 'Status termina trenutno ne može da se promeni.'
  }
}

function openAppointment(appointment: any) {
  router.push(`/dashboard/appointments/${appointment.id}`)
}

onMounted(fetchData)
</script>

<template>
  <div class="dashboard-layout bg-body text-body">
    <Sidebar />

    <main class="dashboard-content bg-body-tertiary">
      <div class="mb-4">
        <h1 class="h2 mb-1">Recepcija</h1>
        <p class="text-body-secondary mb-0">Pregled dana, zakazivanje i naplata.</p>
      </div>

      <!-- Brze akcije -->
      <div class="d-flex flex-wrap gap-2 mb-4">
        <button class="btn btn-primary" @click="router.push('/book-appointment')">
          <i class="bi bi-calendar-plus me-1"></i> Novi termin
        </button>
        <button class="btn btn-outline-primary" @click="router.push('/dashboard/customers')">
          <i class="bi bi-person-plus me-1"></i> Klijenti
        </button>
        <button class="btn btn-outline-primary" @click="router.push('/dashboard/invoices/new')">
          <i class="bi bi-receipt me-1"></i> Nova faktura
        </button>
      </div>

      <!-- Stats -->
      <div class="row g-4 mb-4">
        <div class="col-md-4">
          <div class="card dashboard-card shadow-sm rounded-4">
            <div class="card-body p-4">
              <p class="text-body-secondary mb-1">Termini danas</p>
              <h3 class="fw-bold mb-0">{{ todaysAppointments.length }}</h3>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card dashboard-card shadow-sm rounded-4">
            <div class="card-body p-4">
              <p class="text-body-secondary mb-1">Za potvrdu</p>
              <h3 class="fw-bold mb-0 text-primary">{{ scheduledCount }}</h3>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card dashboard-card shadow-sm rounded-4">
            <div class="card-body p-4">
              <p class="text-body-secondary mb-1">Neplaćene fakture</p>
              <h3 class="fw-bold mb-0 text-warning">{{ unpaidCount }}</h3>
            </div>
          </div>
        </div>
      </div>

      <div v-if="loading" class="alert alert-info">Učitavanje...</div>
      <div v-else-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

      <!-- Današnji termini -->
      <div v-else class="card dashboard-card shadow-sm rounded-4">
        <div class="card-body p-4">
          <h5 class="fw-bold mb-4">Današnji termini</h5>

          <div v-if="todaysAppointments.length === 0" class="alert alert-secondary mb-0">
            Danas nema zakazanih termina.
          </div>

          <div v-else class="table-responsive">
            <table class="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Vreme</th>
                  <th>Klijent</th>
                  <th>Vozilo</th>
                  <th>Status</th>
                  <th class="text-end">Akcije</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="appointment in todaysAppointments" :key="appointment.id">
                  <td class="fw-semibold">{{ formatTime(appointment.scheduledAt) }}</td>
                  <td>{{ appointment.customer?.firstName }} {{ appointment.customer?.lastName }}</td>
                  <td>{{ appointment.vehicle?.make }} {{ appointment.vehicle?.model }}</td>
                  <td>
                    <span class="badge" :class="statusClass(appointment.status)">
                      {{ statusLabel(appointment.status) }}
                    </span>
                  </td>
                  <td class="text-end">
                    <button
                      v-if="appointment.status === 'SCHEDULED'"
                      class="btn btn-sm btn-success me-2"
                      @click="changeStatus(appointment, 'CONFIRMED')"
                    >
                      Potvrdi
                    </button>

                    <button
                      v-if="appointment.status === 'SCHEDULED' || appointment.status === 'CONFIRMED'"
                      class="btn btn-sm btn-outline-danger me-2"
                      @click="changeStatus(appointment, 'CANCELLED')"
                    >
                      Otkaži
                    </button>

                    <button class="btn btn-sm btn-outline-primary" @click="openAppointment(appointment)">
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