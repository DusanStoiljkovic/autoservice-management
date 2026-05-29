<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import Sidebar from '../components/Sidebar.vue'

const route = useRoute()
const router = useRouter()

const API_BASE_URL = import.meta.env.VITE_API_URL

const appointment = ref<any>(null)
const isEditingDiagnosis = ref(false)
const diagnosisDraft = ref('')
const diagnosisError = ref('')
const loading = ref(false)
const errorMessage = ref('')

const appointmentId = computed(() => {
  return Number(route.params.id)
})

const repairOrder = computed(() => {
  return appointment.value?.repairOrders || null
})

async function fetchAppointment() {
  try {
    loading.value = true
    errorMessage.value = ''

    if (!appointmentId.value || Number.isNaN(appointmentId.value)) {
      throw new Error('Neispravan ID termina.')
    }

    const response = await axios.get(`${API_BASE_URL}/appointments/${appointmentId.value}`)

    appointment.value = response.data
  } catch (error) {
    console.error('Greška prilikom učitavanja termina:', error)
    errorMessage.value = 'Termin trenutno ne može da se učita.'
  } finally {
    loading.value = false
  }
}

function editDiagnosis() {
  diagnosisDraft.value = repairOrder.value?.diagnosis || ''
  diagnosisError.value = ''
  isEditingDiagnosis.value = true
}

function cancelEditDiagnosis() {
  isEditingDiagnosis.value = false
  diagnosisDraft.value = ''
  diagnosisError.value = ''
}

async function saveDiagnosis() {
  if (!repairOrder.value) {
    return
  }

  try {
    diagnosisError.value = ''

    await axios.put(`${API_BASE_URL}/repair-orders/${repairOrder.value.id}`, {
      diagnosis: diagnosisDraft.value
    })

    appointment.value.repairOrders.diagnosis = diagnosisDraft.value
    isEditingDiagnosis.value = false
  } catch (error) {
    console.error('Greška prilikom čuvanja dijagnoze:', error)
    diagnosisError.value = 'Dijagnoza trenutno ne može da se sačuva.'
  }
}

function goBack() {
  router.back()
}

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

function formatTime(date: string) {
  if (!date) {
    return '-'
  }

  return new Intl.DateTimeFormat('sr-RS', {
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
  if (status === 'SCHEDULED') {
    return 'Zakazano'
  }

  if (status === 'CONFIRMED') {
    return 'Potvrđeno'
  }

  if (status === 'COMPLETED') {
    return 'Završeno'
  }

  if (status === 'CANCELLED') {
    return 'Otkazano'
  }

  return status
}

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

const customerFullName = computed(() => {
  if (!appointment.value?.customer) {
    return 'Nepoznat klijent'
  }

  return `${appointment.value.customer.firstName} ${appointment.value.customer.lastName}`
})

const vehicleName = computed(() => {
  if (!appointment.value?.vehicle) {
    return 'Nepoznato vozilo'
  }

  return `${appointment.value.vehicle.make} ${appointment.value.vehicle.model}`
})

onMounted(async () => {
  await fetchAppointment()
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
            Detalji termina
          </h1>

          <p class="text-body-secondary mb-0">
            Pregled informacija o zakazanom terminu, klijentu i vozilu.
          </p>
        </div>

        <span
          v-if="appointment"
          class="badge fs-6"
          :class="getStatusClass(appointment.status)"
        >
          {{ getStatusLabel(appointment.status) }}
        </span>
      </div>

      <div v-if="loading" class="alert alert-info">
        Učitavanje termina...
      </div>

      <div v-else-if="errorMessage" class="alert alert-danger">
        {{ errorMessage }}
      </div>

      <div v-else-if="appointment" class="row g-4">
        <div class="col-lg-8">
          <div class="card dashboard-card shadow-sm rounded-4 mb-4">
            <div class="card-body p-4">
              <h5 class="fw-bold mb-4">
                Informacije o terminu
              </h5>

              <div class="row g-3">
                <div class="col-md-6">
                  <p class="text-body-secondary mb-1">
                    Datum
                  </p>

                  <h6 class="mb-0">
                    {{ formatDate(appointment.scheduledAt) }}
                  </h6>
                </div>

                <div class="col-md-6">
                  <p class="text-body-secondary mb-1">
                    Vreme
                  </p>

                  <h6 class="mb-0">
                    {{ formatTime(appointment.scheduledAt) }}
                  </h6>
                </div>

                <div class="col-12">
                  <p class="text-body-secondary mb-1">
                    Opis problema
                  </p>

                  <p class="mb-0">
                    {{ appointment.description || 'Opis problema nije unet.' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="card dashboard-card shadow-sm rounded-4">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h5 class="fw-bold mb-1">
                    Radni nalog
                  </h5>

                  <p class="text-body-secondary mb-0">
                    Servisi koji treba da se odrade za ovaj termin.
                  </p>
                </div>

                <span
                  v-if="repairOrder"
                  class="badge text-bg-primary"
                >
                  {{ repairOrder.status }}
                </span>
              </div>

              <div v-if="!repairOrder" class="alert alert-warning mb-0">
                Radni nalog još nije kreiran za ovaj termin.
              </div>

              <div v-else>
                <div class="mb-4">
                  <div class="d-flex justify-content-between align-items-center mb-1">
                    <p class="text-body-secondary mb-0">
                      Dijagnoza
                    </p>

                    <div>
                      <button
                        v-if="!isEditingDiagnosis"
                        class="btn btn-sm btn-outline-primary"
                        @click="editDiagnosis"
                      >
                        Izmeni
                      </button>

                      <div v-else class="d-flex gap-2">
                        <button
                          class="btn btn-sm btn-success"
                          @click="saveDiagnosis"
                        >
                          Sačuvaj
                        </button>

                        <button
                          class="btn btn-sm btn-outline-secondary"
                          @click="cancelEditDiagnosis"
                        >
                          Otkaži
                        </button>
                      </div>
                    </div>
                  </div>

                  <div v-if="!isEditingDiagnosis">
                    <p class="mb-0">
                      {{ repairOrder.diagnosis || 'Dijagnoza još nije uneta.' }}
                    </p>
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

                <div v-if="!appointment.services?.length" class="alert alert-info mb-0">
                  Za ovaj radni nalog još nisu dodate usluge.
                </div>

                <div v-else class="table-responsive">
                  <table class="table align-middle mb-0">
                    <thead>
                      <tr>
                        <th>Usluga</th>
                        <th>Trajanje</th>
                        <th class="text-end">Cena</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr
                        v-for="service in appointment.services"
                        :key="service.id"
                      >
                        <td>
                          <div class="fw-semibold">
                            {{ service.name }}
                          </div>

                          <small class="text-body-secondary">
                            {{ service.description || 'Bez opisa' }}
                          </small>
                        </td>

                        <td>
                          {{ service.estimatedDurationMinutes || '-' }} min
                        </td>

                        <td class="text-end fw-semibold">
                          {{ formatPrice(service.price) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card dashboard-card shadow-sm rounded-4 mb-4">
            <div class="card-body p-4">
              <h5 class="fw-bold mb-4">
                Klijent
              </h5>

              <div class="detail-item">
                <span class="text-body-secondary">Ime i prezime</span>
                <strong>{{ customerFullName }}</strong>
              </div>

              <div class="detail-item">
                <span class="text-body-secondary">Telefon</span>
                <strong>{{ appointment.customer?.phone || '-' }}</strong>
              </div>

              <div class="detail-item border-0 pb-0 mb-0">
                <span class="text-body-secondary">Email</span>
                <strong>{{ appointment.customer?.email || '-' }}</strong>
              </div>
            </div>
          </div>

          <div class="card dashboard-card shadow-sm rounded-4">
            <div class="card-body p-4">
              <h5 class="fw-bold mb-4">
                Vozilo
              </h5>

              <div class="detail-item">
                <span class="text-body-secondary">Vozilo</span>
                <strong>{{ vehicleName }}</strong>
              </div>

              <div class="detail-item">
                <span class="text-body-secondary">Godište</span>
                <strong>{{ appointment.vehicle?.productionYear || '-' }}</strong>
              </div>

              <div class="detail-item">
                <span class="text-body-secondary">Registracija</span>
                <strong>{{ appointment.vehicle?.licensePlate || '-' }}</strong>
              </div>

              <div class="detail-item border-0 pb-0 mb-0">
                <span class="text-body-secondary">Kilometraža</span>
                <strong>{{ appointment.vehicle?.mileage || '-' }} km</strong>
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