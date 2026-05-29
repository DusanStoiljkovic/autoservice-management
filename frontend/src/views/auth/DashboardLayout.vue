<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import Sidebar from '../components/Sidebar.vue'
import type { Customer } from '@/types/customer.ts'
import type { Service } from '@/types/services.ts'

const customers = ref<Customer[]>([])
const vehicles = ref<any[]>([])
const services = ref<Service[]>([])
const showAppointments = ref<any[]>([])
const allAppointments = ref<any[]>([])
const workingOrders = ref<any[]>([])
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
      workingOrdersRes,
      invoicesRes
    ] = await Promise.all([
      axios.get(`${API_BASE_URL}/customers/all`),
      axios.get(`${API_BASE_URL}/vehicles/all`),
      axios.get(`${API_BASE_URL}/services/all`),

      axios.get(
        `${API_BASE_URL}/appointments/all?status=${selectedStatus.value}&dateFrom=${getDateFrom(selectedPeriod.value)}&dateTo=${getDateTo(selectedPeriod.value)}`
      ),

      axios.get(`${API_BASE_URL}/appointments/all`),

      axios.get(
        `${API_BASE_URL}/repair-orders/all?status=IN_PROGRESS`
      ),

      axios.get(`${API_BASE_URL}/invoices/all`)
    ])

    customers.value = customersRes.data
    vehicles.value = vehiclesRes.data
    services.value = servicesRes.data
    showAppointments.value = showAppointmentsRes.data
    allAppointments.value = allAppointmentsRes.data
    workingOrders.value = workingOrdersRes.data
    invoices.value = invoicesRes.data
  } catch (error) {
    console.error('Greška prilikom učitavanja podataka:', error)
  }
}

const paidInvoices = computed(() => {
  return invoices.value.filter(invoice => invoice.status === 'PAID')
})

const unpaidInvoices = computed(() => {
  return invoices.value.filter(invoice => invoice.status === 'DRAFTED')
})

const overdueInvoices = computed(() => {
  return invoices.value.filter(invoice => invoice.status === 'ISSUED')
})

const totalInvoiceAmount = computed(() => {
  return invoices.value.reduce((acc, invoice) => {
    return acc + Number(invoice.total ?? 0)
  }, 0)
})

const unpaidInvoiceAmount = computed(() => {
  return unpaidInvoices.value.reduce((acc, invoice) => {
    return acc + Number(invoice.total ?? 0)
  }, 0)
})

const stats = computed(() => {
  return [
    {
      title: 'Zarađeno',
      value: formatCurrency(totalInvoiceAmount.value),
      icon: 'bi bi-cash-stack'
    },
    {
      title: 'Ukupno vozila',
      value: vehicles.value.length,
      icon: 'bi bi-car-front'
    },
    {
      title: 'Nepotvrđeni termini',
      value: getNumOfNoCompletedAppointments(),
      icon: 'bi bi-calendar-event'
    },
    {
      title: 'Otvoreni radni nalozi',
      value: workingOrders.value.length,
      icon: 'bi bi-clipboard-check'
    }
  ]
})

function getNumOfNoCompletedAppointments() {
  return allAppointments.value.filter(
    app => app.status === 'SCHEDULED'
  ).length
}

function getStatusClass(status: string) {
  if (status === 'CONFIRMED') {
    return 'text-bg-success'
  }

  if (status === 'COMPLETED') {
    return 'text-bg-warning'
  }

  return 'text-bg-primary'
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

function getWorkingHoursPerVehicle(vehicleId: number) {
  const appointment = allAppointments.value.find(
    app => app.vehicle?.id === vehicleId
  )

  if (!appointment?.services) {
    return 0
  }

  const workingHours = appointment.services.reduce(
    (total: number, service: Service) => {
      return total + (service.estimatedDurationMinutes ?? 0)
    },
    0
  )

  return workingHours
}

function formatCurrency(value: number) {
  return `${value.toLocaleString('sr-RS')} RSD`
}

onMounted(async () => {
  await fetchData()
})
</script>

<template>
  <div class="dashboard-layout bg-body text-body">
    <Sidebar />

    <main class="dashboard-content bg-body-tertiary">
      <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-4">
        <div>
          <h1 class="h2 mb-1">
            Dashboard
          </h1>

          <p class="text-body-secondary mb-0">
            Pregled rada auto servisa, termina, klijenata i faktura.
          </p>
        </div>

        <div class="btn-toolbar mt-3 mt-md-0">
          <button type="button" class="btn btn-sm btn-outline-secondary me-2">
            Izvezi
          </button>

          <button type="button" class="btn btn-sm btn-outline-secondary">
            Ova nedelja
          </button>
        </div>
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
                    Današnji termini
                  </h5>

                  <p class="text-body-secondary mb-0">
                    Pregled zakazanih termina za danas.
                  </p>
                </div>
                <div class="d-flex gap-2">
                  <select class="form-select"  aria-label="status" v-model="selectedStatus" @change="fetchData">
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

              <div class="table-responsive">
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
                      @click="() => $router.push(`/dashboard/appointments/${appointment.id}`)"
                    >
                      <td>{{ Intl.DateTimeFormat('sr-RS', {hour: '2-digit', minute: '2-digit'}).format(new Date(appointment.scheduledAt)) }}</td>
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
                <button class="btn btn-primary">
                  Novi termin
                </button>

                <button class="btn btn-outline-primary">
                  Dodaj klijenta
                </button>

                <button class="btn btn-outline-primary">
                  Dodaj vozilo
                </button>

                <button class="btn btn-outline-primary">
                  Novi radni nalog
                </button>
              </div>

              <hr class="my-4" />

              <h6 class="fw-bold mb-3">
                Status servisa
              </h6>

              <div class="d-flex justify-content-between mb-2">
                <span class="text-body-secondary">Aktivni termini</span>
                <strong>8</strong>
              </div>

              <div class="d-flex justify-content-between mb-2">
                <span class="text-body-secondary">Nalozi u toku</span>
                <strong>5</strong>
              </div>

              <div class="d-flex justify-content-between">
                <span class="text-body-secondary">Neplaćene fakture</span>
                <strong>3</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4 mt-2">
        <div class="col-xl-6">
          <div class="card dashboard-card shadow-sm rounded-4 h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h5 class="fw-bold mb-1">
                    Vozila na servisu
                  </h5>
                </div>
              </div>

              <div class="table-responsive">
                <table class="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Početak</th>
                      <th>Trajanje</th>
                      <th>Klijent</th>
                      <th>Vozilo</th>
                      <th>Mehaničar</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr
                      v-for="order in workingOrders"
                      :key="order.id"
                      @click="() => $router.push(`/dashboard/repair-orders/${order.id}`)"
                    >
                      <td>{{ new Date(order.startedAt).getHours()}}:{{ new Date(order.startedAt).getMinutes() }}</td>
                      <td>{{ getWorkingHoursPerVehicle(order.vehicle.id) }} min</td>
                      <td>{{ order.customer.firstName }} {{ order.customer.lastName }}</td>
                      <td>{{ order.vehicle.make }} {{ order.vehicle.model }}</td>
                      <td>
                        <span class="badge" :class="getStatusClass(order?.mechanic?.status)">
                          {{ order.mechanic?.firstName || "Nedodeljen" }} {{ order.mechanic?.lastName }}
                        </span>
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

              <div class="d-flex justify-content-between mb-2">
                <span class="text-body-secondary">Neplaćene fakture</span>
                <strong class="text-warning">{{ unpaidInvoices.length }}</strong>
              </div>

              <div class="d-flex justify-content-between mb-3">
                <span class="text-body-secondary">Dospele fakture</span>
                <strong class="text-danger">{{ overdueInvoices.length }}</strong>
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