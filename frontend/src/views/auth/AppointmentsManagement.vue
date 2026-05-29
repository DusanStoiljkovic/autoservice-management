<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Sidebar from '../components/Sidebar.vue'

const router = useRouter()
const API_BASE_URL = import.meta.env.VITE_API_URL

const appointments = ref<any[]>([])
const loading = ref(false)
const errorMessage = ref('')
const statusFilter = ref('ALL')

const statusOptions = [
  { value: 'SCHEDULED', label: 'Zakazano' },
  { value: 'CONFIRMED', label: 'Potvrđeno' },
  { value: 'COMPLETED', label: 'Završeno' },
  { value: 'CANCELLED', label: 'Otkazano' }
]

const filteredAppointments = computed(() => {
  if (statusFilter.value === 'ALL') {
    return appointments.value
  }

  return appointments.value.filter((appointment) => appointment.status === statusFilter.value)
})

function formatDateTime(date: string) {
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
  if (status === 'CONFIRMED') {
    return 'text-bg-success'
  }

  if (status === 'COMPLETED') {
    return 'text-bg-secondary'
  }

  if (status === 'CANCELLED') {
    return 'text-bg-danger'
  }

  return 'text-bg-primary'
}

function getStatusLabel(status: string) {
  return statusOptions.find((option) => option.value === status)?.label ?? status
}

async function fetchAppointments() {
  try {
    loading.value = true
    errorMessage.value = ''

    const response = await axios.get(`${API_BASE_URL}/appointments/all`)
    appointments.value = response.data
  } catch (error) {
    console.error('Greška prilikom učitavanja termina:', error)
    errorMessage.value = 'Termini trenutno ne mogu da se učitaju.'
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

async function deleteAppointment(appointment: any) {
  const confirmed = window.confirm('Obrisati ovaj termin?')

  if (!confirmed) {
    return
  }

  try {
    await axios.delete(`${API_BASE_URL}/appointments/${appointment.id}`)
    await fetchAppointments()
  } catch (error) {
    console.error('Greška prilikom brisanja termina:', error)
    errorMessage.value = 'Termin trenutno ne može da se obriše.'
  }
}

function openDetails(appointment: any) {
  router.push(`/dashboard/appointments/${appointment.id}`)
}

onMounted(fetchAppointments)
</script>

<template>
  <div class="dashboard-layout bg-body text-body">
    <Sidebar />

    <main class="dashboard-content bg-body-tertiary">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="h2 mb-1">
            Termini
          </h1>

          <p class="text-body-secondary mb-0">
            Pregled svih zakazanih termina.
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
            Učitavanje termina...
          </div>

          <div v-else-if="errorMessage" class="alert alert-danger mb-0">
            {{ errorMessage }}
          </div>

          <div v-else-if="filteredAppointments.length === 0" class="alert alert-secondary mb-0">
            Nema termina za prikaz.
          </div>

          <div v-else class="table-responsive">
            <table class="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Datum i vreme</th>
                  <th>Klijent</th>
                  <th>Vozilo</th>
                  <th>Status</th>
                  <th class="text-end">Akcije</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="appointment in filteredAppointments" :key="appointment.id">
                  <td class="fw-semibold">{{ formatDateTime(appointment.scheduledAt) }}</td>
                  <td>
                    {{ appointment.customer?.firstName }} {{ appointment.customer?.lastName }}
                  </td>
                  <td>
                    {{ appointment.vehicle?.make }} {{ appointment.vehicle?.model }}
                  </td>
                  <td>
                    <span class="badge" :class="getStatusClass(appointment.status)">
                      {{ getStatusLabel(appointment.status) }}
                    </span>
                  </td>
                  <td class="text-end">
                    <div class="dropdown d-inline-block me-2">
                      <button
                        class="btn btn-sm btn-outline-secondary dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                      >
                        Status
                      </button>

                      <ul class="dropdown-menu dropdown-menu-end">
                        <li v-for="option in statusOptions" :key="option.value">
                          <button class="dropdown-item" @click="changeStatus(appointment, option.value)">
                            {{ option.label }}
                          </button>
                        </li>
                      </ul>
                    </div>

                    <button class="btn btn-sm btn-outline-primary me-2" @click="openDetails(appointment)">
                      <i class="bi bi-eye"></i>
                    </button>

                    <button class="btn btn-sm btn-outline-danger" @click="deleteAppointment(appointment)">
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