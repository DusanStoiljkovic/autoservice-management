<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Sidebar from '../components/Sidebar.vue'
import { RouterLink } from 'vue-router'

const API_BASE_URL = import.meta.env.VITE_API_URL

const invoices = ref<any[]>([])
const orders = ref<any[]>([])
const loading = ref(false)
const errorMessage = ref('')

const invoiceStatusLabels: Record<string, string> = {
  DRAFT: 'Nacrt',
  ISSUED: 'Izdata',
  PAID: 'Plaćena',
  CANCELLED: 'Otkazana'
}

const orderStatusLabels: Record<string, string> = {
  OPEN: 'Otvoren',
  IN_PROGRESS: 'U toku',
  COMPLETED: 'Završen',
  CANCELLED: 'Otkazan'
}

// 1) Nalozi koje tek treba fakturisati: bez fakture i nisu otkazani
const ordersToInvoice = computed(() => {
  const invoicedOrderIds = new Set(invoices.value.map((invoice) => invoice.repairOrderId))
  return orders.value.filter(
    (order) => order.status !== 'CANCELLED' && !invoicedOrderIds.has(order.id)
  )
})

// 2) Napravljene a neplaćene (nacrt ili izdata)
const unpaidInvoices = computed(() => {
  return invoices.value.filter(
    (invoice) => invoice.status === 'DRAFT' || invoice.status === 'ISSUED'
  )
})

// 3) Plaćene
const paidInvoices = computed(() => {
  return invoices.value.filter((invoice) => invoice.status === 'PAID')
})

const totalPaid = computed(() => {
  return paidInvoices.value.reduce((sum, invoice) => sum + Number(invoice.total ?? 0), 0)
})

const totalOutstanding = computed(() => {
  return unpaidInvoices.value.reduce((sum, invoice) => sum + Number(invoice.total ?? 0), 0)
})

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

function invoiceStatusClass(status: string) {
  if (status === 'PAID') {
    return 'text-bg-success'
  }

  if (status === 'ISSUED') {
    return 'text-bg-warning'
  }

  if (status === 'CANCELLED') {
    return 'text-bg-danger'
  }

  return 'text-bg-secondary'
}

function repairStatusClass(status: string) {
  if (status === 'COMPLETED') {
    return 'text-bg-success'
  }

  if (status === 'IN_PROGRESS') {
    return 'text-bg-warning'
  }

  if (status === 'CANCELLED') {
    return 'text-bg-danger'
  }

  return 'text-bg-secondary'
}

async function fetchData() {
  try {
    loading.value = true
    errorMessage.value = ''

    const [invoicesRes, ordersRes] = await Promise.all([
      axios.get(`${API_BASE_URL}/invoices/all`),
      axios.get(`${API_BASE_URL}/repair-orders/all`)
    ])

    invoices.value = invoicesRes.data
    orders.value = ordersRes.data
  } catch (error) {
    console.error('Greška prilikom učitavanja faktura:', error)
    errorMessage.value = 'Fakture trenutno ne mogu da se učitaju.'
  } finally {
    loading.value = false
  }
}

async function markAsPaid(invoice: any) {
  try {
    const response = await axios.put(`${API_BASE_URL}/invoices/${invoice.id}/pay`)
    Object.assign(invoice, response.data)
  } catch (error) {
    console.error('Greška prilikom naplate fakture:', error)
    errorMessage.value = 'Faktura trenutno ne može da se naplati.'
  }
}

async function deleteInvoice(invoice: any) {
  const confirmed = window.confirm(`Obrisati fakturu ${invoice.invoiceNumber}?`)

  if (!confirmed) {
    return
  }

  try {
    await axios.delete(`${API_BASE_URL}/invoices/${invoice.id}`)
    await fetchData()
  } catch (error) {
    console.error('Greška prilikom brisanja fakture:', error)
    errorMessage.value = 'Faktura trenutno ne može da se obriše.'
  }
}

onMounted(fetchData)
</script>

<template>
  <div class="dashboard-layout bg-body text-body">
    <Sidebar />

    <main class="dashboard-content bg-body-tertiary">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="h2 mb-1">Fakture</h1>
          <p class="text-body-secondary mb-0">Pregled i naplata faktura.</p>
        </div>

        <router-link to="/dashboard/invoices/new" class="btn btn-primary">
          <i class="bi bi-plus-lg me-1"></i>
          Nova faktura
        </router-link>
      </div>

      <div class="row g-4 mb-4">
        <div class="col-md-6">
          <div class="card dashboard-card shadow-sm rounded-4">
            <div class="card-body p-4">
              <p class="text-body-secondary mb-1">Naplaćeno</p>
              <h4 class="fw-bold mb-0 text-success">{{ formatPrice(totalPaid) }}</h4>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card dashboard-card shadow-sm rounded-4">
            <div class="card-body p-4">
              <p class="text-body-secondary mb-1">Za naplatu</p>
              <h4 class="fw-bold mb-0 text-warning">{{ formatPrice(totalOutstanding) }}</h4>
            </div>
          </div>
        </div>
      </div>

      <div v-if="loading" class="alert alert-info">Učitavanje...</div>
      <div v-else-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

      <template v-else>
        <!-- 1) Za fakturisanje -->
        <div class="card dashboard-card shadow-sm rounded-4 mb-4">
          <div class="card-body p-4">
            <h5 class="fw-bold mb-1">Za fakturisanje</h5>
            <p class="text-body-secondary mb-4">Završeni nalozi koji još nemaju fakturu.</p>

            <div v-if="ordersToInvoice.length === 0" class="alert alert-secondary mb-0">
              Nema naloga koji čekaju fakturisanje.
            </div>

            <div v-else class="table-responsive">
              <table class="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Nalog</th>
                    <th>Klijent</th>
                    <th>Vozilo</th>
                    <th>Status</th>
                    <th class="text-end">Akcija</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="order in ordersToInvoice" :key="order.id">
                    <td class="fw-semibold">#{{ order.id }}</td>
                    <td>{{ order.customer?.firstName }} {{ order.customer?.lastName }}</td>
                    <td>{{ order.vehicle?.make }} {{ order.vehicle?.model }}</td>
                    <td>
                      <span class= "badge" :class= "repairStatusClass(order.status)">
                        {{ orderStatusLabels[order.status] ?? order.status }}
                      </span>
                    </td>
                    <td class="text-end">
                      <RouterLink
                        :to="`/dashboard/invoices/new?orderId=${order.id}`"
                        class="btn btn-sm btn-primary"
                      >
                        Napravi fakturu
                      </RouterLink>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- 2) Neplaćene fakture -->
        <div class="card dashboard-card shadow-sm rounded-4 mb-4">
          <div class="card-body p-4">
            <h5 class="fw-bold mb-1">Neplaćene fakture</h5>
            <p class="text-body-secondary mb-4">Izdate fakture koje čekaju naplatu.</p>

            <div v-if="unpaidInvoices.length === 0" class="alert alert-secondary mb-0">
              Nema neplaćenih faktura.
            </div>

            <div v-else class="table-responsive">
              <table class="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Broj fakture</th>
                    <th>Status</th>
                    <th>Izdata</th>
                    <th class="text-end">Iznos</th>
                    <th class="text-end">Akcije</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="invoice in unpaidInvoices" :key="invoice.id" @click="$router.push(`/dashboard/invoices/${invoice.id}`)">
                    <td class="fw-semibold">{{ invoice.invoiceNumber }}</td>
                    <td>
                      <span class="badge" :class="invoiceStatusClass(invoice.status)">
                        {{ invoiceStatusLabels[invoice.status] ?? invoice.status }}
                      </span>
                    </td>
                    <td>{{ formatDate(invoice.issuedAt) }}</td>
                    <td class="text-end fw-semibold">{{ formatPrice(invoice.total) }}</td>
                    <td class="text-end">
                      <button class="btn btn-sm btn-success me-2" @click.stop="markAsPaid(invoice)">
                        Naplati
                      </button>

                      <button class="btn btn-sm btn-outline-danger" @click.stop="deleteInvoice(invoice)">
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- 3) Plaćene fakture -->
        <div class="card dashboard-card shadow-sm rounded-4">
          <div class="card-body p-4">
            <h5 class="fw-bold mb-1">Plaćene fakture</h5>
            <p class="text-body-secondary mb-4">Naplaćene fakture.</p>

            <div v-if="paidInvoices.length === 0" class="alert alert-secondary mb-0">
              Još nema plaćenih faktura.
            </div>

            <div v-else class="table-responsive">
              <table class="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Broj fakture</th>
                    <th>Izdata</th>
                    <th>Plaćena</th>
                    <th class="text-end">Iznos</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="invoice in paidInvoices" :key="invoice.id" @click="$router.push(`/dashboard/invoices/${invoice.id}`)">
                    <td class="fw-semibold">{{ invoice.invoiceNumber }}</td>
                    <td>{{ formatDate(invoice.issuedAt) }}</td>
                    <td>{{ formatDate(invoice.paidAt) }}</td>
                    <td class="text-end fw-semibold">{{ formatPrice(invoice.total) }}</td>
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