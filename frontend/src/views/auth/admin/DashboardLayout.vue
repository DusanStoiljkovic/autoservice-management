<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Sidebar from '../../components/Sidebar.vue'
import type { Customer } from '@/types/customer.ts'
import type { Service } from '@/types/services.ts'

const router = useRouter()

const customers = ref<Customer[]>([])
const vehicles = ref<any[]>([])
const services = ref<Service[]>([])
const showAppointments = ref<any[]>([])
const allAppointments = ref<any[]>([])
const repairOrders = ref<any[]>([])
const invoices = ref<any[]>([])

const selectedStatus = ref('SCHEDULED')
const selectedPeriod = ref('today')

const API_BASE_URL = import.meta.env.VITE_API_URL

async function fetchData() {
  try {
    const [
      customersRes,
      vehiclesRes,
      servicesRes,
      showAppointmentsRes,
      allAppointmentsRes,
      repairOrdersRes,
      invoicesRes
    ] = await Promise.all([
      axios.get(`${API_BASE_URL}/customers/all`),
      axios.get(`${API_BASE_URL}/vehicles/all`),
      axios.get(`${API_BASE_URL}/services/all`),

      axios.get(
        `${API_BASE_URL}/appointments/all?status=${selectedStatus.value}&dateFrom=${getDateFrom(selectedPeriod.value)}&dateTo=${getDateTo(selectedPeriod.value)}`
      ),

      axios.get(`${API_BASE_URL}/appointments/all`),

      axios.get(`${API_BASE_URL}/repair-orders/all`),

      axios.get(`${API_BASE_URL}/invoices/all`)
    ])

    customers.value = customersRes.data
    vehicles.value = vehiclesRes.data
    services.value = servicesRes.data
    showAppointments.value = showAppointmentsRes.data
    allAppointments.value = allAppointmentsRes.data
    repairOrders.value = repairOrdersRes.data
    invoices.value = invoicesRes.data
  } catch (error) {
    console.error('Greška prilikom učitavanja podataka:', error)
  }
}

// ----- Radni nalozi -----
const ordersInProgress = computed(() => {
  return repairOrders.value.filter(order => order.status === 'IN_PROGRESS')
})

const openOrdersCount = computed(() => {
  return repairOrders.value.filter(
    order => order.status === 'OPEN' || order.status === 'IN_PROGRESS'
  ).length
})

// ----- Fakture -----
const paidInvoices = computed(() => {
  return invoices.value.filter(invoice => invoice.status === 'PAID')
})

// Neplaćene = sve sto nije placeno niti otkazano (DRAFT ili ISSUED)
const unpaidInvoices = computed(() => {
  return invoices.value.filter(
    invoice => invoice.status !== 'PAID' && invoice.status !== 'CANCELLED'
  )
})

const totalInvoiceAmount = computed(() => {
  return invoices.value.reduce((acc, invoice) => acc + Number(invoice.total ?? 0), 0)
})

const paidInvoiceAmount = computed(() => {
  return paidInvoices.value.reduce((acc, invoice) => acc + Number(invoice.total ?? 0), 0)
})

const unpaidInvoiceAmount = computed(() => {
  return unpaidInvoices.value.reduce((acc, invoice) => acc + Number(invoice.total ?? 0), 0)
})

// ----- Termini -----
const scheduledCount = computed(() => {
  return allAppointments.value.filter(app => app.status === 'SCHEDULED').length
})

const activeAppointmentsCount = computed(() => {
  return allAppointments.value.filter(
    app => app.status === 'SCHEDULED' || app.status === 'CONFIRMED'
  ).length
})

const stats = computed(() => {
  return [
    {
      title: 'Naplaćeno',
      value: formatCurrency(paidInvoiceAmount.value),
      icon: 'bi bi-cash-stack'
    },
    {
      title: 'Ukupno vozila',
      value: vehicles.value.length,
      icon: 'bi bi-car-front'
    },
    {
      title: 'Nepotvrđeni termini',
      value: scheduledCount.value,
      icon: 'bi bi-calendar-event'
    },
    {
      title: 'Otvoreni radni nalozi',
      value: openOrdersCount.value,
      icon: 'bi bi-clipboard-check'
    }
  ]
})

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

function formatTime(date: string) {
  if (!date) {
    return '-'
  }

  return new Intl.DateTimeFormat('sr-RS', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

function getDateFrom(period: string) {
  const now = new Date()
  const dateFrom = new Date(now)

  if (period === 'today') {
    dateFrom.setHours(0, 0, 0, 0)
    return dateFrom.toISOString()
  }

  if (period === 'week') {
    const dayOfWeek = now.getDay() || 7

    dateFrom.setDate(now.getDate() - dayOfWeek + 1)
    dateFrom.setHours(0, 0, 0, 0)

    return dateFrom.toISOString()
  }

  if (period === 'month') {
    dateFrom.setDate(1)
    dateFrom.setHours(0, 0, 0, 0)

    return dateFrom.toISOString()
  }

  if (period === 'nextmonth') {
    dateFrom.setMonth(now.getMonth() + 1)
    dateFrom.setDate(1)
    dateFrom.setHours(0, 0, 0, 0)

    return dateFrom.toISOString()
  }

  if (period === 'all') {
    dateFrom.setFullYear(2000)
    dateFrom.setHours(0, 0, 0, 0)

    return dateFrom.toISOString()
  }

  dateFrom.setHours(0, 0, 0, 0)

  return dateFrom.toISOString()
}

function getDateTo(period: string) {
  const now = new Date()
  const dateTo = new Date(now)

  if (period === 'today') {
    dateTo.setHours(23, 59, 59, 999)

    return dateTo.toISOString()
  }

  if (period === 'week') {
    const dayOfWeek = now.getDay() || 7

    dateTo.setDate(now.getDate() + (7 - dayOfWeek))
    dateTo.setHours(23, 59, 59, 999)

    return dateTo.toISOString()
  }

  if (period === 'month') {
    dateTo.setMonth(now.getMonth() + 1)
    dateTo.setDate(0)
    dateTo.setHours(23, 59, 59, 999)

    return dateTo.toISOString()
  }

  if (period === 'nextmonth') {
    dateTo.setMonth(now.getMonth() + 2)
    dateTo.setDate(0)
    dateTo.setHours(23, 59, 59, 999)

    return dateTo.toISOString()
  }

  if (period === 'all') {
    dateTo.setFullYear(2100)
    dateTo.setHours(23, 59, 59, 999)

    return dateTo.toISOString()
  }

  dateTo.setHours(23, 59, 59, 999)

  return dateTo.toISOString()
}

function getWorkingMinutesPerVehicle(vehicleId: number) {
  if (!vehicleId) {
    return 0
  }

  const appointment = allAppointments.value.find(app => app.vehicle?.id === vehicleId)

  if (!appointment?.services) {
    return 0
  }

  return appointment.services.reduce(
    (total: number, service: Service) => total + (service.estimatedDurationMinutes ?? 0),
    0
  )
}

function formatCurrency(value: number) {
  return `${value.toLocaleString('sr-RS')} RSD`
}

onMounted(fetchData)
</script>

<template>
  <div class="dashboard-layout bg-body text-body">
    <Sidebar />

    <main class="dashboard-content bg-body-tertiary">
      <div class="mb-4">
        <h1 class="h2 mb-1">
          Dashboard
        </h1>

        <p class="text-body-secondary mb-0">
          Pregled rada auto servisa, termina, klijenata i faktura.
        </p>
      </div>

      <div class="row g-4 mb-4">
        <div
          v-for="stat in stats"
          :key="stat.title"
          class="col-md-6 col-xl-3"
        >
          <div class="card dashboard-card h-100 shadow-sm rounded-4">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <p class="text-body-secondary mb-1">
                    {{ stat.title }}
                  </p>

                  <h3 class="fw-bold mb-0">
                    {{ stat.value }}
                  </h3>
                </div>

                <div class="dashboard-icon">
                  <i :class="stat.icon"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-xl-8">
          <div class="card dashboard-card shadow-sm rounded-4 h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h5 class="fw-bold mb-1">
                    Termini
                  </h5>

                  <p class="text-body-secondary mb-0">
                    Pregled zakazanih termina.
                  </p>
                </div>

                <div class="d-flex gap-2">
                  <select class="form-select" aria-label="status" v-model="selectedStatus" @change="fetchData">
                    <option value="SCHEDULED">Zakazani</option>
                    <option value="CONFIRMED">Potvrđeni</option>
                    <option value="COMPLETED">Završeni</option>
                  </select>

                  <select class="form-select" aria-label="Period" v-model="selectedPeriod" @change="fetchData">
                    <option value="today">Danas</option>
                    <option value="week">Ove nedelje</option>
                    <option value="month">Ceo mesec</option>
                    <option value="nextmonth">Sledeći mesec</option>
                    <option value="all">Svi</option>
                  </select>
                </div>
              </div>

              <div v-if="showAppointments.length === 0" class="alert alert-secondary mb-0">
                Nema termina za izabrani period.
              </div>

              <div v-else class="table-responsive">
                <table class="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Vreme</th>
                      <th>Klijent</th>
                      <th>Vozilo</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr
                      v-for="appointment in showAppointments"
                      :key="appointment.id"
                      class="cursor-pointer"
                      @click="router.push(`/dashboard/appointments/${appointment.id}`)"
                    >
                      <td>{{ formatTime(appointment.scheduledAt) }}</td>
                      <td>{{ appointment.customer?.firstName }} {{ appointment.customer?.lastName }}</td>
                      <td>{{ appointment.vehicle?.make }} {{ appointment.vehicle?.model }}</td>
                      <td>
                        <span class="badge" :class="getStatusClass(appointment.status)">
                          {{ appointment.status }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-4">
          <div class="card dashboard-card shadow-sm rounded-4 h-100">
            <div class="card-body">
              <h5 class="fw-bold mb-4">
                Brze akcije
              </h5>

              <div class="d-grid gap-2">
                <button class="btn btn-primary" @click="router.push('/book-appointment')">
                  Novi termin
                </button>

                <button class="btn btn-outline-primary" @click="router.push('/dashboard/customers')">
                  Dodaj klijenta
                </button>

                <button class="btn btn-outline-primary" @click="router.push('/dashboard/vehicles')">
                  Dodaj vozilo
                </button>

                <button class="btn btn-outline-primary" @click="router.push('/dashboard/repair-orders')">
                  Radni nalozi
                </button>
              </div>

              <hr class="my-4" />

              <h6 class="fw-bold mb-3">
                Status servisa
              </h6>

              <div class="d-flex justify-content-between mb-2">
                <span class="text-body-secondary">Aktivni termini</span>
                <strong>{{ activeAppointmentsCount }}</strong>
              </div>

              <div class="d-flex justify-content-between mb-2">
                <span class="text-body-secondary">Nalozi u toku</span>
                <strong>{{ ordersInProgress.length }}</strong>
              </div>

              <div class="d-flex justify-content-between">
                <span class="text-body-secondary">Neplaćene fakture</span>
                <strong>{{ unpaidInvoices.length }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4 mt-2">
        <div class="col-xl-6">
          <div class="card dashboard-card shadow-sm rounded-4 h-100">
            <div class="card-body">
              <h5 class="fw-bold mb-4">
                Vozila na servisu
              </h5>

              <div v-if="ordersInProgress.length === 0" class="alert alert-secondary mb-0">
                Trenutno nema vozila na servisu.
              </div>

              <div v-else class="table-responsive">
                <table class="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Početak</th>
                      <th>Trajanje</th>
                      <th>Klijent</th>
                      <th>Vozilo</th>
                      <th>Majstor</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr
                      v-for="order in ordersInProgress"
                      :key="order.id"
                      class="cursor-pointer"
                      @click="router.push(`/dashboard/repair-orders/${order.id}`)"
                    >
                      <td>{{ formatTime(order.startedAt) }}</td>
                      <td>{{ getWorkingMinutesPerVehicle(order.vehicle?.id) }} min</td>
                      <td>{{ order.customer?.firstName }} {{ order.customer?.lastName }}</td>
                      <td>{{ order.vehicle?.make }} {{ order.vehicle?.model }}</td>
                      <td>
                        <span v-if="order.mechanic">
                          {{ order.mechanic.firstName }} {{ order.mechanic.lastName }}
                        </span>
                        <span v-else class="text-body-secondary">Nedodeljen</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div class="col-xl-6">
          <div class="card dashboard-card shadow-sm rounded-4 h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h5 class="fw-bold mb-1">
                    Fakture
                  </h5>

                  <p class="text-body-secondary mb-0">
                    Pregled naplate i statusa faktura.
                  </p>
                </div>

                <div class="dashboard-icon">
                  <i class="bi bi-receipt"></i>
                </div>
              </div>

              <div class="d-flex justify-content-between mb-2">
                <span class="text-body-secondary">Ukupno faktura</span>
                <strong>{{ invoices.length }}</strong>
              </div>

              <div class="d-flex justify-content-between mb-2">
                <span class="text-body-secondary">Plaćene fakture</span>
                <strong class="text-success">{{ paidInvoices.length }}</strong>
              </div>

              <div class="d-flex justify-content-between mb-3">
                <span class="text-body-secondary">Neplaćene fakture</span>
                <strong class="text-warning">{{ unpaidInvoices.length }}</strong>
              </div>

              <hr class="my-4" />

              <div class="d-flex justify-content-between mb-2">
                <span class="text-body-secondary">Ukupan iznos</span>
                <strong>{{ formatCurrency(totalInvoiceAmount) }}</strong>
              </div>

              <div class="d-flex justify-content-between">
                <span class="text-body-secondary">Za naplatu</span>
                <strong class="text-danger">{{ formatCurrency(unpaidInvoiceAmount) }}</strong>
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

.dashboard-icon {
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  font-size: 1.5rem;
  color: var(--bs-primary);
  background-color: var(--bs-tertiary-bg);
  border: 1px solid var(--bs-border-color);
}

.table {
  --bs-table-bg: transparent;
  --bs-table-color: var(--bs-body-color);
  --bs-table-border-color: var(--bs-border-color);
}

.cursor-pointer {
  cursor: pointer;
}

hr {
  border-color: var(--bs-border-color);
  opacity: 1;
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