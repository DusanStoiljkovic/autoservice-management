<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Sidebar from '../components/Sidebar.vue'

const API_BASE_URL = import.meta.env.VITE_API_URL

const invoices = ref<any[]>([])
const loading = ref(false)
const errorMessage = ref('')
const statusFilter = ref('ALL')

const statusOptions = [
  { value: 'DRAFT', label: 'Nacrt' },
  { value: 'ISSUED', label: 'Izdata' },
  { value: 'PAID', label: 'Plaćena' },
  { value: 'CANCELLED', label: 'Otkazana' }
]

const filteredInvoices = computed(() => {
  if (statusFilter.value === 'ALL') {
    return invoices.value
  }

  return invoices.value.filter((invoice) => invoice.status === statusFilter.value)
})

const totalPaid = computed(() => {
  return invoices.value
    .filter((invoice) => invoice.status === 'PAID')
    .reduce((sum, invoice) => sum + Number(invoice.total ?? 0), 0)
})

const totalOutstanding = computed(() => {
  return invoices.value
    .filter((invoice) => invoice.status === 'ISSUED' || invoice.status === 'DRAFT')
    .reduce((sum, invoice) => sum + Number(invoice.total ?? 0), 0)
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

function getStatusClass(status: string) {
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

function getStatusLabel(status: string) {
  return statusOptions.find((option) => option.value === status)?.label ?? status
}

async function fetchInvoices() {
  try {
    loading.value = true
    errorMessage.value = ''

    const response = await axios.get(`${API_BASE_URL}/invoices/all`)
    invoices.value = response.data
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
    await fetchInvoices()
  } catch (error) {
    console.error('Greška prilikom brisanja fakture:', error)
    errorMessage.value = 'Faktura trenutno ne može da se obriše.'
  }
}

onMounted(fetchInvoices)
</script>

<template>
  <div class="dashboard-layout bg-body text-body">
    <Sidebar />

    <main class="dashboard-content bg-body-tertiary">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="h2 mb-1">
            Fakture
          </h1>

          <p class="text-body-secondary mb-0">
            Pregled i naplata faktura.
          </p>
        </div>

        <select v-model="statusFilter" class="form-select w-auto">
          <option value="ALL">Svi statusi</option>
          <option v-for="option in statusOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
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

      <div class="card dashboard-card shadow-sm rounded-4">
        <div class="card-body p-4">
          <div v-if="loading" class="alert alert-info mb-0">
            Učitavanje faktura...
          </div>

          <div v-else-if="errorMessage" class="alert alert-danger mb-0">
            {{ errorMessage }}
          </div>

          <div v-else-if="filteredInvoices.length === 0" class="alert alert-secondary mb-0">
            Nema faktura za prikaz.
          </div>

          <div v-else class="table-responsive">
            <table class="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Broj fakture</th>
                  <th>Status</th>
                  <th>Izdata</th>
                  <th>Plaćena</th>
                  <th class="text-end">Iznos</th>
                  <th class="text-end">Akcije</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="invoice in filteredInvoices" :key="invoice.id">
                  <td class="fw-semibold">{{ invoice.invoiceNumber }}</td>
                  <td>
                    <span class="badge" :class="getStatusClass(invoice.status)">
                      {{ getStatusLabel(invoice.status) }}
                    </span>
                  </td>
                  <td>{{ formatDate(invoice.issuedAt) }}</td>
                  <td>{{ formatDate(invoice.paidAt) }}</td>
                  <td class="text-end fw-semibold">{{ formatPrice(invoice.total) }}</td>
                  <td class="text-end">
                    <button
                      v-if="invoice.status !== 'PAID' && invoice.status !== 'CANCELLED'"
                      class="btn btn-sm btn-success me-2"
                      @click="markAsPaid(invoice)"
                    >
                      Naplati
                    </button>

                    <button class="btn btn-sm btn-outline-danger" @click="deleteInvoice(invoice)">
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