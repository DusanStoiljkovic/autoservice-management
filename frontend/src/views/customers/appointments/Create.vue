<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

const currentStep = ref(1)
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const createdCustomerId = ref<number | null>(null)
const createdVehicleId = ref<number | null>(null)
const appointmentSubmitted = ref(false)

const serviceOptions = [
  {
    value: 'DIAGNOSTICS',
    label: 'Dijagnostika vozila',
    description: 'Provera problema, čitanje grešaka i procena kvara.',
  },
  {
    value: 'REGULAR_SERVICE',
    label: 'Redovan servis',
    description: 'Zamena ulja, filtera i osnovna kontrola vozila.',
  },
  {
    value: 'REPAIR',
    label: 'Popravka kvara',
    description: 'Popravka prijavljenog problema na vozilu.',
  },
  {
    value: 'BRAKES',
    label: 'Kočioni sistem',
    description: 'Provera i servis kočionog sistema.',
  },
  {
    value: 'OTHER',
    label: 'Ostalo',
    description: 'Druga vrsta pregleda ili servisne intervencije.',
  },
]

const form = reactive({
  customer: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  },

  vehicle: {
    make: '',
    model: '',
    year: '',
    licensePlate: '',
    vin: '',
  },

  appointment: {
    serviceType: '',
    preferredDate: '',
    preferredTime: '',
    problemDescription: '',
    customerNote: '',
  },
})

const minDate = computed(() => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
})

const selectedService = computed(() => {
  return serviceOptions.find(service => service.value === form.appointment.serviceType)
})

const isCustomerStepValid = computed(() => {
  return (
    form.customer.firstName.trim() &&
    form.customer.lastName.trim() &&
    form.customer.email.trim() &&
    form.customer.phone.trim()
  )
})

const isVehicleStepValid = computed(() => {
  return (
    form.vehicle.make.trim() &&
    form.vehicle.model.trim() &&
    form.vehicle.licensePlate.trim()
  )
})

const isAppointmentStepValid = computed(() => {
  return (
    form.appointment.serviceType &&
    form.appointment.preferredDate &&
    form.appointment.preferredTime &&
    form.appointment.problemDescription.trim()
  )
})

const canSubmitAppointment = computed(() => {
  return (
    createdCustomerId.value !== null &&
    createdVehicleId.value !== null &&
    isAppointmentStepValid.value &&
    !appointmentSubmitted.value
  )
})

function resetMessages() {
  successMessage.value = ''
  errorMessage.value = ''
}

function getResponseId(responseData: any, fallbackKey: string) {
  return responseData?.id ?? responseData?.[fallbackKey]?.id ?? null
}

async function saveCustomerAndContinue() {
  resetMessages()

  if (!isCustomerStepValid.value) {
    errorMessage.value = 'Popunite obavezna polja za customer-a.'
    return
  }

  if (createdCustomerId.value !== null) {
    currentStep.value = 2
    return
  }

  try {
    loading.value = true

    const payload = {
      firstName: form.customer.firstName,
      lastName: form.customer.lastName,
      email: form.customer.email,
      phone: form.customer.phone,
    }

    const response = await axios.post(`${API_URL}/customers/create`, payload)

    const customerId = getResponseId(response.data, 'customer')

    if (!customerId) {
      throw new Error('CUSTOMER_ID_NOT_RETURNED')
    }

    createdCustomerId.value = customerId
    successMessage.value = 'Customer je uspešno sačuvan u bazi.'
    currentStep.value = 2
  } catch (error: any) {
    console.error(error)

    if (error.response?.status === 409) {
      errorMessage.value = 'Customer sa ovim email-om već postoji.'
    } else {
      errorMessage.value = 'Došlo je do greške prilikom čuvanja customer-a.'
    }
  } finally {
    loading.value = false
  }
}

async function saveVehicleAndContinue() {
  resetMessages()

  if (!createdCustomerId.value) {
    errorMessage.value = 'Prvo mora biti sačuvan customer.'
    currentStep.value = 1
    return
  }

  if (!isVehicleStepValid.value) {
    errorMessage.value = 'Popunite obavezna polja za vozilo.'
    return
  }

  if (createdVehicleId.value !== null) {
    currentStep.value = 3
    return
  }

  try {
    loading.value = true

    const payload = {
      customerId: createdCustomerId.value,
      make: form.vehicle.make,
      model: form.vehicle.model,
      year: form.vehicle.year ? Number(form.vehicle.year) : null,
      licensePlate: form.vehicle.licensePlate,
      vin: form.vehicle.vin || null,
    }

    const response = await axios.post(`${API_URL}/vehicles`, payload)

    const vehicleId = getResponseId(response.data, 'vehicle')

    if (!vehicleId) {
      throw new Error('VEHICLE_ID_NOT_RETURNED')
    }

    createdVehicleId.value = vehicleId
    successMessage.value = 'Vozilo je uspešno sačuvano u bazi.'
    currentStep.value = 3
  } catch (error: any) {
    console.error(error)

    if (error.response?.status === 404) {
      errorMessage.value = 'Backend ruta POST /api/vehicles nije napravljena.'
    } else {
      errorMessage.value = 'Došlo je do greške prilikom čuvanja vozila.'
    }
  } finally {
    loading.value = false
  }
}

async function submitAppointment() {
  resetMessages()

  if (!canSubmitAppointment.value) {
    errorMessage.value = 'Customer, vozilo i podaci za termin moraju biti popunjeni.'
    return
  }

  try {
    loading.value = true

    const payload = {
      customerId: createdCustomerId.value,
      vehicleId: createdVehicleId.value,
      serviceType: form.appointment.serviceType,
      scheduledAt: `${form.appointment.preferredDate}T${form.appointment.preferredTime}:00`,
      problemDescription: form.appointment.problemDescription,
      customerNote: form.appointment.customerNote || null,
    }

    await axios.post(`${API_URL}/appointments`, payload)

    appointmentSubmitted.value = true
    successMessage.value = 'Termin je uspešno zakazan.'
  } catch (error: any) {
    console.error(error)

    if (error.response?.status === 404) {
      errorMessage.value = 'Backend ruta POST /api/appointments nije napravljena.'
    } else {
      errorMessage.value = 'Došlo je do greške prilikom zakazivanja termina.'
    }
  } finally {
    loading.value = false
  }
}

function previousStep() {
  resetMessages()

  if (currentStep.value > 1) {
    currentStep.value--
  }
}

function resetForm() {
  currentStep.value = 1
  loading.value = false
  successMessage.value = ''
  errorMessage.value = ''
  appointmentSubmitted.value = false

  createdCustomerId.value = null
  createdVehicleId.value = null

  form.customer.firstName = ''
  form.customer.lastName = ''
  form.customer.email = ''
  form.customer.phone = ''

  form.vehicle.make = ''
  form.vehicle.model = ''
  form.vehicle.year = ''
  form.vehicle.licensePlate = ''
  form.vehicle.vin = ''

  form.appointment.serviceType = ''
  form.appointment.preferredDate = ''
  form.appointment.preferredTime = ''
  form.appointment.problemDescription = ''
  form.appointment.customerNote = ''
}
</script>

<template>
  <main class="appointment-page">
    <section class="appointment-hero">
      <div class="container">
        <div class="row align-items-center g-4">
          <div class="col-lg-7">
            <RouterLink to="/" class="back-link">
              ← Nazad na početnu
            </RouterLink>

            <p class="section-label mt-4">
              Online zakazivanje
            </p>

            <h1 class="display-4 fw-bold text-white mb-3">
              Zakažite servis vozila
            </h1>

            <p class="lead text-white-50 mb-0">
              Prvo unosite customer-a, zatim vozilo, a na kraju birate termin.
              Svaki korak se posebno čuva u bazi.
            </p>
          </div>

          <div class="col-lg-5">
            <div class="hero-info-card">
              <div class="d-flex align-items-center gap-2 mb-3">
                <span class="status-dot"></span>
                <span class="fw-semibold text-white">Zakazivanje u 3 koraka</span>
              </div>

              <div class="d-grid gap-3">
                <div class="mini-step">
                  <span>01</span>
                  <p>Customer se čuva u bazu.</p>
                </div>

                <div class="mini-step">
                  <span>02</span>
                  <p>Vozilo se povezuje sa customer-om.</p>
                </div>

                <div class="mini-step">
                  <span>03</span>
                  <p>Termin se povezuje sa vozilom.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="appointment-content">
      <div class="container">
        <div class="row g-4 align-items-start">
          <div class="col-lg-8">
            <div class="card border-0 shadow-sm rounded-4">
              <div class="card-body p-4 p-md-5">
                <div class="mb-4">
                  <p class="section-label mb-2">
                    Zahtev za termin
                  </p>

                  <h2 class="h3 fw-bold mb-2">
                    Popunite podatke
                  </h2>

                  <p class="text-secondary mb-0">
                    Klik na dugme “Nastavi” čuva trenutni korak u bazi.
                  </p>
                </div>

                <div class="steps-wrapper mb-5">
                  <button
                    type="button"
                    class="step-tab"
                    :class="{ active: currentStep === 1, completed: createdCustomerId !== null }"
                    @click="currentStep = 1"
                  >
                    <span>1</span>
                    Customer
                  </button>

                  <button
                    type="button"
                    class="step-tab"
                    :class="{ active: currentStep === 2, completed: createdVehicleId !== null }"
                    :disabled="createdCustomerId === null"
                    @click="currentStep = 2"
                  >
                    <span>2</span>
                    Vozilo
                  </button>

                  <button
                    type="button"
                    class="step-tab"
                    :class="{ active: currentStep === 3, completed: appointmentSubmitted }"
                    :disabled="createdCustomerId === null || createdVehicleId === null"
                    @click="currentStep = 3"
                  >
                    <span>3</span>
                    Termin
                  </button>
                </div>

                <div
                  v-if="successMessage"
                  class="alert alert-success rounded-3"
                  role="alert"
                >
                  {{ successMessage }}
                </div>

                <div
                  v-if="errorMessage"
                  class="alert alert-danger rounded-3"
                  role="alert"
                >
                  {{ errorMessage }}
                </div>

                <form @submit.prevent="submitAppointment">
                  <section v-if="currentStep === 1">
                    <div class="d-flex justify-content-between align-items-start gap-3 mb-3">
                      <div>
                        <h3 class="h5 fw-bold mb-1">
                          1. Podaci o customer-u
                        </h3>

                        <p class="text-secondary mb-0">
                          Nakon čuvanja, customer dobija ID iz baze.
                        </p>
                      </div>

                      <span
                        v-if="createdCustomerId"
                        class="badge text-bg-success rounded-pill"
                      >
                        Sačuvano
                      </span>
                    </div>

                    <div
                      v-if="createdCustomerId"
                      class="alert alert-light border rounded-3"
                    >
                      Customer je već sačuvan. Za novu prijavu kliknite “Resetuj”.
                    </div>

                    <div class="row g-3">
                      <div class="col-md-6">
                        <label for="firstName" class="form-label fw-semibold">
                          Ime *
                        </label>

                        <input
                          id="firstName"
                          v-model.trim="form.customer.firstName"
                          type="text"
                          class="form-control form-control-lg"
                          placeholder="npr. Marko"
                          :disabled="createdCustomerId !== null"
                        >
                      </div>

                      <div class="col-md-6">
                        <label for="lastName" class="form-label fw-semibold">
                          Prezime *
                        </label>

                        <input
                          id="lastName"
                          v-model.trim="form.customer.lastName"
                          type="text"
                          class="form-control form-control-lg"
                          placeholder="npr. Petrović"
                          :disabled="createdCustomerId !== null"
                        >
                      </div>

                      <div class="col-md-6">
                        <label for="email" class="form-label fw-semibold">
                          Email *
                        </label>

                        <input
                          id="email"
                          v-model.trim="form.customer.email"
                          type="email"
                          class="form-control form-control-lg"
                          placeholder="npr. marko@gmail.com"
                          :disabled="createdCustomerId !== null"
                        >
                      </div>

                      <div class="col-md-6">
                        <label for="phone" class="form-label fw-semibold">
                          Telefon *
                        </label>

                        <input
                          id="phone"
                          v-model.trim="form.customer.phone"
                          type="text"
                          class="form-control form-control-lg"
                          placeholder="npr. 0601234567"
                          :disabled="createdCustomerId !== null"
                        >
                      </div>
                    </div>
                  </section>

                  <section v-if="currentStep === 2">
                    <div class="d-flex justify-content-between align-items-start gap-3 mb-3">
                      <div>
                        <h3 class="h5 fw-bold mb-1">
                          2. Podaci o vozilu
                        </h3>

                        <p class="text-secondary mb-0">
                          Vozilo se čuva u bazu i povezuje sa customer-om.
                        </p>
                      </div>

                      <span
                        v-if="createdVehicleId"
                        class="badge text-bg-success rounded-pill"
                      >
                        Sačuvano
                      </span>
                    </div>

                    <div
                      v-if="createdVehicleId"
                      class="alert alert-light border rounded-3"
                    >
                      Vozilo je već sačuvano. Za novu prijavu kliknite “Resetuj”.
                    </div>

                    <div class="row g-3">
                      <div class="col-md-6">
                        <label for="vehicleMake" class="form-label fw-semibold">
                          Marka vozila *
                        </label>

                        <input
                          id="vehicleMake"
                          v-model.trim="form.vehicle.make"
                          type="text"
                          class="form-control form-control-lg"
                          placeholder="npr. Volkswagen"
                          :disabled="createdVehicleId !== null"
                        >
                      </div>

                      <div class="col-md-6">
                        <label for="vehicleModel" class="form-label fw-semibold">
                          Model vozila *
                        </label>

                        <input
                          id="vehicleModel"
                          v-model.trim="form.vehicle.model"
                          type="text"
                          class="form-control form-control-lg"
                          placeholder="npr. Golf 7"
                          :disabled="createdVehicleId !== null"
                        >
                      </div>

                      <div class="col-md-6">
                        <label for="vehicleYear" class="form-label fw-semibold">
                          Godište
                        </label>

                        <input
                          id="vehicleYear"
                          v-model="form.vehicle.year"
                          type="number"
                          min="1980"
                          max="2030"
                          class="form-control form-control-lg"
                          placeholder="npr. 2016"
                          :disabled="createdVehicleId !== null"
                        >
                      </div>

                      <div class="col-md-6">
                        <label for="licensePlate" class="form-label fw-semibold">
                          Registarske oznake *
                        </label>

                        <input
                          id="licensePlate"
                          v-model.trim="form.vehicle.licensePlate"
                          type="text"
                          class="form-control form-control-lg text-uppercase"
                          placeholder="npr. ZA-123-AB"
                          :disabled="createdVehicleId !== null"
                        >
                      </div>

                      <div class="col-12">
                        <label for="vin" class="form-label fw-semibold">
                          Broj šasije / VIN
                        </label>

                        <input
                          id="vin"
                          v-model.trim="form.vehicle.vin"
                          type="text"
                          class="form-control form-control-lg text-uppercase"
                          placeholder="Opciono"
                          :disabled="createdVehicleId !== null"
                        >
                      </div>
                    </div>
                  </section>

                  <section v-if="currentStep === 3">
                    <div class="d-flex justify-content-between align-items-start gap-3 mb-3">
                      <div>
                        <h3 class="h5 fw-bold mb-1">
                          3. Zakazivanje termina
                        </h3>

                        <p class="text-secondary mb-0">
                          Termin se čuva tek kada kliknete “Zakaži termin”.
                        </p>
                      </div>

                      <span
                        v-if="appointmentSubmitted"
                        class="badge text-bg-success rounded-pill"
                      >
                        Zakazano
                      </span>
                    </div>

                    <div class="mb-4">
                      <label for="serviceType" class="form-label fw-semibold">
                        Vrsta usluge *
                      </label>

                      <select
                        id="serviceType"
                        v-model="form.appointment.serviceType"
                        class="form-select form-select-lg"
                        :disabled="appointmentSubmitted"
                      >
                        <option value="" disabled>
                          Izaberite uslugu
                        </option>

                        <option
                          v-for="service in serviceOptions"
                          :key="service.value"
                          :value="service.value"
                        >
                          {{ service.label }}
                        </option>
                      </select>

                      <div
                        v-if="selectedService"
                        class="form-text mt-2"
                      >
                        {{ selectedService.description }}
                      </div>
                    </div>

                    <div class="row g-3 mb-4">
                      <div class="col-md-6">
                        <label for="preferredDate" class="form-label fw-semibold">
                          Željeni datum *
                        </label>

                        <input
                          id="preferredDate"
                          v-model="form.appointment.preferredDate"
                          type="date"
                          class="form-control form-control-lg"
                          :min="minDate"
                          :disabled="appointmentSubmitted"
                        >
                      </div>

                      <div class="col-md-6">
                        <label for="preferredTime" class="form-label fw-semibold">
                          Željeno vreme *
                        </label>

                        <input
                          id="preferredTime"
                          v-model="form.appointment.preferredTime"
                          type="time"
                          class="form-control form-control-lg"
                          :disabled="appointmentSubmitted"
                        >
                      </div>
                    </div>

                    <div class="mb-4">
                      <label for="problemDescription" class="form-label fw-semibold">
                        Opis problema *
                      </label>

                      <textarea
                        id="problemDescription"
                        v-model.trim="form.appointment.problemDescription"
                        class="form-control"
                        rows="5"
                        placeholder="Ukratko opišite problem koji ste primetili na vozilu..."
                        :disabled="appointmentSubmitted"
                      ></textarea>
                    </div>

                    <div class="mb-4">
                      <label for="customerNote" class="form-label fw-semibold">
                        Dodatna napomena
                      </label>

                      <textarea
                        id="customerNote"
                        v-model.trim="form.appointment.customerNote"
                        class="form-control"
                        rows="3"
                        placeholder="Unesite dodatnu napomenu ako postoji..."
                        :disabled="appointmentSubmitted"
                      ></textarea>
                    </div>
                  </section>

                  <div class="d-flex flex-column flex-md-row justify-content-between gap-3 mt-5">
                    <button
                      type="button"
                      class="btn btn-outline-secondary btn-lg px-4"
                      :disabled="currentStep === 1 || loading"
                      @click="previousStep"
                    >
                      Nazad
                    </button>

                    <div class="d-flex flex-column flex-md-row gap-3">
                      <button
                        type="button"
                        class="btn btn-outline-danger btn-lg px-4"
                        :disabled="loading"
                        @click="resetForm"
                      >
                        Resetuj
                      </button>

                      <button
                        v-if="currentStep === 1"
                        type="button"
                        class="btn btn-primary btn-lg px-4"
                        :disabled="loading || !isCustomerStepValid"
                        @click="saveCustomerAndContinue"
                      >
                        <span
                          v-if="loading"
                          class="spinner-border spinner-border-sm me-2"
                          aria-hidden="true"
                        ></span>

                        {{ loading ? 'Čuvanje customer-a...' : 'Sačuvaj customer-a i nastavi' }}
                      </button>

                      <button
                        v-else-if="currentStep === 2"
                        type="button"
                        class="btn btn-primary btn-lg px-4"
                        :disabled="loading || !isVehicleStepValid"
                        @click="saveVehicleAndContinue"
                      >
                        <span
                          v-if="loading"
                          class="spinner-border spinner-border-sm me-2"
                          aria-hidden="true"
                        ></span>

                        {{ loading ? 'Čuvanje vozila...' : 'Sačuvaj vozilo i nastavi' }}
                      </button>

                      <button
                        v-else
                        type="submit"
                        class="btn btn-primary btn-lg px-4"
                        :disabled="!canSubmitAppointment || loading"
                      >
                        <span
                          v-if="loading"
                          class="spinner-border spinner-border-sm me-2"
                          aria-hidden="true"
                        ></span>

                        {{ loading ? 'Zakazivanje...' : 'Zakaži termin' }}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div class="col-lg-4">
            <aside class="summary-card card border-0 shadow-sm rounded-4 sticky-lg-top">
              <div class="card-body p-4">
                <p class="section-label mb-2">
                  Pregled zahteva
                </p>

                <h2 class="h4 fw-bold mb-4">
                  Rezime
                </h2>

                <div class="saved-status mb-3">
                  <div>
                    <span>Customer ID</span>
                    <strong>{{ createdCustomerId || 'Nije sačuvan' }}</strong>
                  </div>

                  <div>
                    <span>Vehicle ID</span>
                    <strong>{{ createdVehicleId || 'Nije sačuvano' }}</strong>
                  </div>
                </div>

                <div class="summary-group">
                  <h3>Customer</h3>

                  <div class="summary-row">
                    <span>Ime i prezime</span>
                    <strong>
                      <template v-if="form.customer.firstName || form.customer.lastName">
                        {{ form.customer.firstName }} {{ form.customer.lastName }}
                      </template>

                      <template v-else>
                        Nije uneto
                      </template>
                    </strong>
                  </div>

                  <div class="summary-row">
                    <span>Email</span>
                    <strong>{{ form.customer.email || 'Nije uneto' }}</strong>
                  </div>

                  <div class="summary-row">
                    <span>Telefon</span>
                    <strong>{{ form.customer.phone || 'Nije uneto' }}</strong>
                  </div>
                </div>

                <div class="summary-group">
                  <h3>Vozilo</h3>

                  <div class="summary-row">
                    <span>Auto</span>
                    <strong>
                      <template v-if="form.vehicle.make || form.vehicle.model">
                        {{ form.vehicle.make }} {{ form.vehicle.model }}
                      </template>

                      <template v-else>
                        Nije uneto
                      </template>
                    </strong>
                  </div>

                  <div class="summary-row">
                    <span>Godište</span>
                    <strong>{{ form.vehicle.year || 'Nije uneto' }}</strong>
                  </div>

                  <div class="summary-row">
                    <span>Registracija</span>
                    <strong>{{ form.vehicle.licensePlate || 'Nije uneto' }}</strong>
                  </div>
                </div>

                <div class="summary-group mb-0">
                  <h3>Termin</h3>

                  <div class="summary-row">
                    <span>Usluga</span>
                    <strong>{{ selectedService?.label || 'Nije izabrano' }}</strong>
                  </div>

                  <div class="summary-row">
                    <span>Datum</span>
                    <strong>{{ form.appointment.preferredDate || 'Nije izabrano' }}</strong>
                  </div>

                  <div class="summary-row">
                    <span>Vreme</span>
                    <strong>{{ form.appointment.preferredTime || 'Nije izabrano' }}</strong>
                  </div>
                </div>

                <div
                  class="alert mt-4 mb-0 rounded-3"
                  :class="appointmentSubmitted ? 'alert-success' : 'alert-primary'"
                >
                  <template v-if="appointmentSubmitted">
                    Termin je uspešno poslat u bazu.
                  </template>

                  <template v-else>
                    Podaci se čuvaju redom: customer → vozilo → appointment.
                  </template>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.appointment-page {
  min-height: 100vh;
  background: #f8fafc;
}

.appointment-hero {
  position: relative;
  padding: 92px 0;
  background:
    linear-gradient(
      90deg,
      rgba(2, 6, 23, 0.96) 0%,
      rgba(15, 23, 42, 0.9) 50%,
      rgba(15, 23, 42, 0.65) 100%
    ),
    url('/images/customers/landingHero.jpg');
  background-size: cover;
  background-position: center;
  color: white;
}

.back-link {
  display: inline-flex;
  align-items: center;
  color: #dbeafe;
  font-weight: 700;
  text-decoration: none;
}

.back-link:hover {
  color: white;
}

.section-label {
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.appointment-hero .section-label {
  color: #93c5fd;
}

.hero-info-card {
  padding: 28px;
  border-radius: 28px;
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(16px);
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #22c55e;
  box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.16);
}

.mini-step {
  display: flex;
  gap: 14px;
  padding: 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.08);
}

.mini-step span {
  color: #93c5fd;
  font-weight: 900;
}

.mini-step p {
  margin: 0;
  color: #e2e8f0;
}

.appointment-content {
  padding: 64px 0;
}

.steps-wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.step-tab {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 58px;
  padding: 12px 16px;
  border: 1px solid #dbe3ef;
  border-radius: 16px;
  background: white;
  color: #64748b;
  font-weight: 800;
  text-align: left;
  transition: 0.2s ease;
}

.step-tab span {
  display: inline-flex;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #e2e8f0;
  color: #475569;
  font-size: 14px;
  font-weight: 900;
}

.step-tab.active {
  border-color: #2563eb;
  background: #eff6ff;
  color: #1d4ed8;
}

.step-tab.active span {
  background: #2563eb;
  color: white;
}

.step-tab.completed:not(.active) {
  border-color: #bbf7d0;
  background: #f0fdf4;
  color: #15803d;
}

.step-tab.completed:not(.active) span {
  background: #22c55e;
  color: white;
}

.step-tab:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.form-control,
.form-select {
  border-color: #dbe3ef;
  border-radius: 14px;
}

.form-control:focus,
.form-select:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 0.25rem rgba(37, 99, 235, 0.16);
}

.btn {
  border-radius: 14px;
  font-weight: 800;
}

.btn-primary {
  background: #2563eb;
  border-color: #2563eb;
}

.btn-primary:hover {
  background: #1d4ed8;
  border-color: #1d4ed8;
}

.summary-card {
  top: 96px;
}

.saved-status {
  display: grid;
  gap: 12px;
}

.saved-status div {
  padding: 14px;
  border-radius: 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.saved-status span {
  display: block;
  color: #64748b;
  font-size: 13px;
  font-weight: 700;
}

.saved-status strong {
  color: #0f172a;
}

.summary-group {
  margin-bottom: 22px;
  padding: 18px;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  background: #ffffff;
}

.summary-group h3 {
  margin-bottom: 14px;
  color: #0f172a;
  font-size: 15px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.summary-row {
  display: grid;
  gap: 4px;
  padding: 10px 0;
  border-bottom: 1px solid #f1f5f9;
}

.summary-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.summary-row span {
  color: #64748b;
  font-size: 14px;
}

.summary-row strong {
  color: #0f172a;
  overflow-wrap: anywhere;
}

@media (max-width: 991px) {
  .appointment-hero {
    padding: 64px 0;
  }

  .appointment-content {
    padding: 42px 0;
  }

  .summary-card {
    position: static !important;
  }
}

@media (max-width: 767px) {
  .steps-wrapper {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 575px) {
  .appointment-hero {
    padding: 48px 0;
  }

  .display-4 {
    font-size: 2.35rem;
  }

  .card-body {
    padding: 24px !important;
  }
}
</style>