<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import Sidebar from '../components/Sidebar.vue'
import type { Customer } from '@/types/customer.ts'
import type { Service } from '@/types/services.ts'

const customers = ref<Customer[]>([])
const vehicles = ref<any[]>([])
const services = ref<Service[]>([])
const allAppointments = ref<any[]>([])
const workingOrders = ref<any[]>([])
const invoices = ref<any[]>([])

const API_BASE_URL = import.meta.env.VITE_API_URL
async function fetchData() {
  try {
    const [customersRes, vehiclesRes, servicesRes, appointmentsRes, workingOrdersRes, invoicesRes] = await Promise.all([
      axios.get(`${API_BASE_URL}/customers/all`),
      axios.get(`${API_BASE_URL}/vehicles/all`),
      axios.get(`${API_BASE_URL}/services/all`),
      axios.get(`${API_BASE_URL}/appointments/all`),
      axios.get(`${API_BASE_URL}/repair-orders/all`),
      axios.get(`${API_BASE_URL}/invoices/all`)
    ])

    customers.value = customersRes.data
    vehicles.value = vehiclesRes.data
    services.value = servicesRes.data
    allAppointments.value = appointmentsRes.data
    workingOrders.value = workingOrdersRes.data
    invoices.value = invoicesRes.data
  } catch (error) {
    console.error('Greška prilikom učitavanja podataka:', error)
  }
}

const stats = computed(() => {
  return [
    {
      title: 'Klijenti',
      value: customers.value.length,
      icon: 'bi bi-people'
    },
  {
    title: 'Vozila',
    value: vehicles.value.length,
    icon: 'bi bi-car-front'
  },
  {
    title: 'Današnji termini',
    value: allAppointments.value.length,
    icon: 'bi bi-calendar-event'
  },
  {
    title: 'Otvoreni nalozi',
    value: workingOrders.value.length,
    icon: 'bi bi-clipboard-check'
  }
]})

const appointments = [
  {
    id: 1,
    time: '08:00',
    customer: 'Marko Petrović',
    vehicle: 'BMW 320d',
    status: 'Zakazano'
  },
  {
    id: 2,
    time: '10:00',
    customer: 'Nikola Jovanović',
    vehicle: 'Audi A4',
    status: 'Potvrđeno'
  },
  {
    id: 3,
    time: '12:00',
    customer: 'Ivan Ilić',
    vehicle: 'Golf 7',
    status: 'U toku'
  }
]

function getStatusClass(status: string) {
  if (status === 'Potvrđeno') {
    return 'text-bg-success'
  }

  if (status === 'U toku') {
    return 'text-bg-warning'
  }

  return 'text-bg-primary'
}

onMounted( async() => {
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
                      v-for="appointment in appointments"
                      :key="appointment.id"
                    >
                      <td>{{ appointment.time }}</td>
                      <td>{{ appointment.customer }}</td>
                      <td>{{ appointment.vehicle }}</td>
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