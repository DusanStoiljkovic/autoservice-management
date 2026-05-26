<template>
  <main class="book-appointment-page bg-light">
    <section id="hero" class="booking-hero text-white">
      <div class="container py-5">
        <div class="row align-items-center min-vh-40">
          <div class="col-lg-8">
            <span class="badge text-bg-primary mb-3">
              Zakazivanje termina
            </span>

            <h1 class="display-5 fw-bold mb-3">
              Zakažite servis automobila online.
            </h1>

            <p class="lead text-white-50 mb-0">
              Unesite kontakt podatke, informacije o vozilu i željeni termin dolaska.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-5">
      <div class="container">
        <div v-if="successMessage" class="alert alert-success shadow-sm">
          {{ successMessage }}
        </div>

        <div v-if="errorMessage" class="alert alert-danger shadow-sm">
          {{ errorMessage }}
        </div>

        <div class="row g-5">
          <div class="col-md-5 col-lg-4 order-md-last">
            <div class="card border-0 shadow-sm rounded-4 sticky-summary">
              <div class="card-body p-4">
                <h4 class="d-flex justify-content-between align-items-center mb-3">
                  <span class="text-primary">Pregled termina</span>
                  <span class="badge bg-primary rounded-pill">1</span>
                </h4>

                <ul class="list-group mb-4">
                  <li class="list-group-item d-flex justify-content-between lh-sm">
                    <div>
                      <h6 class="my-0">
                        Izabrana usluga
                      </h6>
                      <small class="text-body-secondary">
                        {{ selectedService?.name || 'Nijedna usluga nije izabrana' }}
                      </small>
                    </div>

                    <span class="text-body-secondary">
                      {{ selectedService ? formatPrice(selectedService.price) : '-' }}
                    </span>
                  </li>

                  <li class="list-group-item d-flex justify-content-between lh-sm">
                    <div>
                      <h6 class="my-0">
                        Vozilo
                      </h6>
                      <small class="text-body-secondary">
                        {{ vehiclePreview }}
                      </small>
                    </div>
                  </li>

                  <li class="list-group-item d-flex justify-content-between lh-sm">
                    <div>
                      <h6 class="my-0">
                        Željeni termin
                      </h6>
                      <small class="text-body-secondary">
                        {{ appointmentPreview }}
                      </small>
                    </div>
                  </li>

                  <li class="list-group-item d-flex justify-content-between">
                    <span>Status</span>
                    <strong class="text-primary">Zahtev</strong>
                  </li>
                </ul>

                <div class="small text-muted">
                  Nakon slanja forme, vaš termin će biti kreiran sa statusom
                  <strong>ZAKAZANO</strong>.
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-7 col-lg-8">
            <div class="card border-0 shadow-sm rounded-4">
              <div class="card-body p-4 p-md-5">
                <h4 class="mb-3">
                  Podaci o klijentu
                </h4>

                <form @submit.prevent="submitAppointment">
                  <div class="row g-3">
                    <div class="col-sm-6">
                      <label for="firstName" class="form-label">Ime</label>
                      <input
                        id="firstName"
                        v-model.trim="form.firstName"
                        type="text"
                        class="form-control"
                        required
                      />
                    </div>

                    <div class="col-sm-6">
                      <label for="lastName" class="form-label">Prezime</label>
                      <input
                        id="lastName"
                        v-model.trim="form.lastName"
                        type="text"
                        class="form-control"
                        required
                      />
                    </div>

                    <div class="col-sm-6">
                      <label for="phone" class="form-label">Telefon</label>
                      <input
                        id="phone"
                        v-model.trim="form.phone"
                        type="text"
                        class="form-control"
                        placeholder="+381..."
                        required
                      />
                    </div>

                    <div class="col-sm-6">
                      <label for="email" class="form-label">
                        Email
                        <span class="text-body-secondary">(opciono)</span>
                      </label>
                      <input
                        id="email"
                        v-model.trim="form.email"
                        type="email"
                        class="form-control"
                        placeholder="vas@email.com"
                      />
                    </div>

                    <div class="col-12">
                      <label for="address" class="form-label">
                        Adresa
                        <span class="text-body-secondary">(opciono)</span>
                      </label>
                      <input
                        id="address"
                        v-model.trim="form.address"
                        type="text"
                        class="form-control"
                        placeholder="Ulica, grad"
                      />
                    </div>
                  </div>

                  <hr class="my-4" />

                  <h4 class="mb-3">
                    Podaci o vozilu
                  </h4>

                  <div class="row g-3">
                    <div class="col-sm-6">
                      <label for="make" class="form-label">Marka</label>
                      <input
                        id="make"
                        v-model.trim="form.make"
                        type="text"
                        class="form-control"
                        placeholder="BMW, Audi, Volkswagen..."
                        required
                      />
                    </div>

                    <div class="col-sm-6">
                      <label for="model" class="form-label">Model</label>
                      <input
                        id="model"
                        v-model.trim="form.model"
                        type="text"
                        class="form-control"
                        placeholder="320d, A4, Golf 7..."
                        required
                      />
                    </div>

                    <div class="col-sm-4">
                      <label for="productionYear" class="form-label">
                        Godište
                        <span class="text-body-secondary">(opciono)</span>
                      </label>
                      <input
                        id="productionYear"
                        v-model.number="form.productionYear"
                        type="number"
                        min="1950"
                        max="2030"
                        class="form-control"
                      />
                    </div>

                    <div class="col-sm-4">
                      <label for="licensePlate" class="form-label">
                        Registarska oznaka
                      </label>
                      <input
                        id="licensePlate"
                        v-model.trim="form.licensePlate"
                        type="text"
                        class="form-control"
                        placeholder="BG-123-AB"
                      />
                    </div>

                    <div class="col-sm-4">
                      <label for="mileage" class="form-label">
                        Kilometraža
                        <span class="text-body-secondary">(opciono)</span>
                      </label>
                      <input
                        id="mileage"
                        v-model.number="form.mileage"
                        type="number"
                        min="0"
                        class="form-control"
                      />
                    </div>

                    <div class="col-12">
                      <label for="vin" class="form-label">
                        VIN broj
                        <span class="text-body-secondary">(opciono)</span>
                      </label>
                      <input
                        id="vin"
                        v-model.trim="form.vin"
                        type="text"
                        class="form-control"
                      />
                    </div>
                  </div>

                  <hr class="my-4" />

                  <h4 class="mb-3">
                    Detalji termina
                  </h4>

                  <div class="row g-3">
                    <div class="col-md-6">
                      <label for="serviceId" class="form-label">Usluga</label>
                      <select
                        id="serviceId"
                        v-model.number="form.serviceId"
                        class="form-select"
                        required
                      >
                        <option :value="0" disabled>
                          Izaberite uslugu...
                        </option>

                        <option
                          v-for="service in activeServices"
                          :key="service.id"
                          :value="service.id"
                        >
                          {{ service.name }} — {{ formatPrice(service.price) }}
                        </option>
                      </select>
                    </div>

                    <div class="col-md-6">
                      <label for="appointmentDate" class="form-label">Datum</label>
                      <input
                        id="appointmentDate"
                        v-model="form.appointmentDate"
                        type="date"
                        class="form-control"
                        required
                      />
                    </div>

                    <div class="col-12">
                      <label class="form-label">
                        Slobodni termini
                      </label>

                      <div v-if="appointmentsLoading" class="text-muted">
                        Učitavanje termina...
                      </div>

                      <div v-else-if="!form.appointmentDate" class="alert alert-info mb-0">
                        Prvo izaberite datum.
                      </div>

                      <div v-else class="time-slots">
                        <button
                          v-for="time in workingSlots"
                          :key="time"
                          type="button"
                          class="btn time-slot-btn"
                          :class="{
                            'btn-primary': form.appointmentTime === time && !isSlotOccupied(time),
                            'btn-outline-primary': form.appointmentTime !== time && !isSlotOccupied(time),
                            'btn-outline-secondary disabled text-decoration-line-through': isSlotOccupied(time)
                          }"
                          :disabled="isSlotOccupied(time)"
                          @click="form.appointmentTime = time"
                        >
                          {{ time }}
                        </button>
                      </div>

                      <div
                        v-if="form.appointmentDate && occupiedTimesForSelectedDate.length > 0"
                        class="form-text mt-2"
                      >
                        Precrtani termini su već zauzeti.
                      </div>
                    </div>

                    <div class="col-12">
                      <label for="problemDescription" class="form-label">
                        Opišite problem
                      </label>
                      <textarea
                        id="problemDescription"
                        v-model.trim="form.problemDescription"
                        class="form-control"
                        rows="4"
                        placeholder="Primer: Čuje se čudan zvuk pri kočenju, curi ulje, upaljena je lampica..."
                      ></textarea>
                    </div>
                  </div>

                  <hr class="my-4" />

                  <button
                    class="w-100 btn btn-primary btn-lg"
                    type="submit"
                    :disabled="submitting || servicesLoading || appointmentsLoading"
                  >
                    <span
                      v-if="submitting"
                      class="spinner-border spinner-border-sm me-2"
                      aria-hidden="true"
                    ></span>

                    {{ submitting ? 'Slanje...' : 'Zakaži termin' }}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import type { Service } from '@/types/services'
 
interface CustomerResponse {
  id: number
}

interface VehicleResponse {
  id: number
}

interface Appointment {
  id: number
  scheduledAt: string
  status: string
}

const API_URL = import.meta.env.VITE_API_URL

const services = ref<Service[]>([])
const servicesLoading = ref(false)
const submitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const appointments = ref<Appointment[]>([])
const appointmentsLoading = ref(false)

const workingSlots = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00'
]

const form = reactive({
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  address: '',

  make: '',
  model: '',
  productionYear: null as number | null,
  licensePlate: '',
  vin: '',
  mileage: null as number | null,

  serviceId: 0,
  appointmentDate: '',
  appointmentTime: '',
  problemDescription: ''
})

const activeServices = computed(() => {
  return services.value.filter((service) => {
    return  service.isActive === 1
  })
})

const selectedService = computed(() => {
  return activeServices.value.find((service) => service.id === form.serviceId)
})

const vehiclePreview = computed(() => {
  if (!form.make && !form.model) {
    return 'Vozilo nije uneto'
  }

  return `${form.make} ${form.model}`.trim()
})

const appointmentPreview = computed(() => {
  if (!form.appointmentDate || !form.appointmentTime) {
    return 'Vreme nije izabrano'
  }

  return `${form.appointmentDate} at ${form.appointmentTime}`
})

const occupiedTimesForSelectedDate = computed(() => {
  if (!form.appointmentDate) {
    return []
  }

  return appointments.value
    .filter((appointment) => {
      const appointmentDate = getAppointmentDate(appointment.scheduledAt)

      const isSameDate = appointmentDate === form.appointmentDate

      const isBlockingStatus =
        appointment.status === 'SCHEDULED' ||
        appointment.status === 'CONFIRMED'

      return isSameDate && isBlockingStatus
    })
    .map((appointment) => {
      return getAppointmentTime(appointment.scheduledAt)
    })
})

async function loadServices() {
  try {
    servicesLoading.value = true

    const response = await fetch(`${API_URL}/services/all`)

    if (!response.ok) {
      throw new Error('Failed to load services')
    }

    services.value = await response.json()
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Could not load services. Please try again later.'
  } finally {
    servicesLoading.value = false
  }
}

async function loadAppointments() {
  try {
    appointmentsLoading.value = true

    const response = await fetch(`${API_URL}/appointments/all`)

    if (!response.ok) {
      throw new Error('Failed to load appointments')
    }

    appointments.value = await response.json()
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Could not load appointment slots. Please try again later.'
  } finally {
    appointmentsLoading.value = false
  }
}

async function submitAppointment() {
  try {
    submitting.value = true
    errorMessage.value = ''
    successMessage.value = ''

    if (!API_URL) {
      throw new Error('VITE_API_URL is missing in frontend .env file.')
    }

    if (!selectedService.value) {
      throw new Error('Please choose a service.')
    }

    if (!form.appointmentTime) {
      throw new Error('Please choose an available appointment time.')
    }

    if (isSlotOccupied(form.appointmentTime)) {
      throw new Error('This appointment time is already taken.')
    }

    const customer = await Post<CustomerResponse>('/customers/create', {
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      email: form.email || null,
      address: form.address || null,
      notes: null
    })

    const vehicle = await Post<VehicleResponse>('/vehicles/create', {
      customerId: customer.id,
      make: form.make,
      model: form.model,
      productionYear: form.productionYear || null,
      licensePlate: form.licensePlate || null,
      vin: form.vin || null,
      mileage: form.mileage || 0
    })

    const scheduledAt = `${form.appointmentDate}T${form.appointmentTime}:00`

    await Post('/appointments/create', {
      customerId: customer.id,
      vehicleId: vehicle.id,
      scheduledAt,
      serviceType: selectedService.value.name,
      problemDescription: form.problemDescription || null,
    })

    successMessage.value = 'Appointment request has been created successfully.'

    await loadAppointments()

    resetForm()
  } catch (error) {
    console.error(error)

    if (error instanceof Error) {
      errorMessage.value = error.message
      return
    }

    errorMessage.value = 'Could not create appointment. Please try again.'
  } finally {
    submitting.value = false
  }
}

async function Post<T = unknown>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.message || 'Request failed.')
  }

  return data as T
}

function isSlotOccupied(time: string) {
  return occupiedTimesForSelectedDate.value.includes(time)
}

function getAppointmentDate(scheduledAt: string) {
  const date = new Date(scheduledAt)

  if (Number.isNaN(date.getTime())) {
    return scheduledAt.slice(0, 10)
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getAppointmentTime(scheduledAt: string) {
  const date = new Date(scheduledAt)

  if (Number.isNaN(date.getTime())) {
    return scheduledAt.slice(11, 16)
  }

  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${hours}:${minutes}`
}

function resetForm() {
  form.firstName = ''
  form.lastName = ''
  form.phone = ''
  form.email = ''
  form.address = ''

  form.make = ''
  form.model = ''
  form.productionYear = null
  form.licensePlate = ''
  form.vin = ''
  form.mileage = null

  form.serviceId = 0
  form.appointmentDate = ''
  form.appointmentTime = ''
  form.problemDescription = ''
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

watch(
  () => form.appointmentDate,
  () => {
    form.appointmentTime = ''
  }
)

onMounted(() => {
  loadServices()
  loadAppointments()
})
</script>

<style scoped>
#hero {
    background-image: 
    linear-gradient(rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0.88)),
    url('/images/customers/landingHero3.jpg');
    background-size: cover;
    background-position: center;
}

.booking-hero {
  background:
    linear-gradient(rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0.88)),
    radial-gradient(circle at top right, rgba(13, 110, 253, 0.45), transparent 35%);
}

.min-vh-40 {
  min-height: 40vh;
}

.sticky-summary {
  position: sticky;
  top: 90px;
}

.form-control,
.form-select {
  min-height: 46px;
}

textarea.form-control {
  min-height: 120px;
}

.time-slots {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.time-slot-btn {
  min-width: 90px;
}

@media (max-width: 768px) {
  .sticky-summary {
    position: static;
  }
}
</style>