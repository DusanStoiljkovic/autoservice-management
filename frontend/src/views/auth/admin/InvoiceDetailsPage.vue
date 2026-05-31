<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import Sidebar from '../../components/Sidebar.vue'

const route = useRoute()
const router = useRouter()
const API_BASE_URL = import.meta.env.VITE_API_URL

const invoice = ref<any>(null)
const order = ref<any>(null)
const items = ref<any[]>([])
const loading = ref(false)
const errorMessage = ref('')

// Servis (izdavalac) - prilagodi svojim podacima
const company = {
  name: 'AutoService',
  address: 'Bulevar kralja Aleksandra 100, Beograd',
  phone: '+381 11 123 456',
  taxId: 'PIB: 123456789'
}

const invoiceStatusLabels: Record<string, string> = {
  DRAFT: 'Nacrt',
  ISSUED: 'Izdata',
  PAID: 'Plaćena',
  CANCELLED: 'Otkazana'
}

const invoiceId = computed(() => Number(route.params.id))

const canBePaid = computed(() => {
  return invoice.value && invoice.value.status !== 'PAID' && invoice.value.status !== 'CANCELLED'
})

function formatPrice(value: string | number) {
  const numeric = Number(value)
  if (Number.isNaN(numeric)) {
    return `${value} RSD`
  }
  return new Intl.NumberFormat('sr-RS', {
    style: 'currency',
    currency: 'RSD',
    minimumFractionDigits: 2
  }).format(numeric)
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

function statusClass(status: string) {
  if (status === 'PAID') return 'text-bg-success'
  if (status === 'ISSUED') return 'text-bg-warning'
  if (status === 'CANCELLED') return 'text-bg-danger'
  return 'text-bg-secondary'
}

async function fetchInvoice() {
  try {
    loading.value = true
    errorMessage.value = ''

    if (!invoiceId.value || Number.isNaN(invoiceId.value)) {
      throw new Error('Neispravan ID fakture.')
    }

    const invoiceRes = await axios.get(`${API_BASE_URL}/invoices/${invoiceId.value}`)
    invoice.value = invoiceRes.data

    // Faktura ne nosi klijenta/vozilo/stavke - sklapamo iz naloga i termina.
    if (invoice.value.repairOrderId) {
      try {
        const orderRes = await axios.get(`${API_BASE_URL}/repair-orders/${invoice.value.repairOrderId}`)
        order.value = orderRes.data

        if (order.value?.appointmentId) {
          const appointmentRes = await axios.get(`${API_BASE_URL}/appointments/${order.value.appointmentId}`)
          const services = appointmentRes.data?.services || []
          items.value = services.map((service: any) => ({
            description: service.name,
            quantity: 1,
            unitPrice: Number(service.price) || 0
          }))
        }
      } catch (relatedError) {
        // Nalog/termin možda ne postoje više - faktura se svejedno prikazuje sa iznosima
        console.error('Povezani podaci nisu dostupni:', relatedError)
      }
    }
  } catch (error) {
    console.error('Greška prilikom učitavanja fakture:', error)
    errorMessage.value = 'Faktura trenutno ne može da se učita.'
  } finally {
    loading.value = false
  }
}

async function markAsPaid() {
  try {
    const response = await axios.put(`${API_BASE_URL}/invoices/${invoice.value.id}/pay`)
    Object.assign(invoice.value, response.data)
  } catch (error) {
    console.error('Greška prilikom naplate:', error)
    errorMessage.value = 'Faktura trenutno ne može da se naplati.'
  }
}

function exportPdf() {
  // U dijalogu štampe iskljuci "Headers and footers" za čist PDF.
  window.print()
}

function goBack() {
  router.back()
}

onMounted(fetchInvoice)
</script>

<template>
  <div class="dashboard-layout bg-body text-body">
    <div class="no-print">
      <Sidebar />
    </div>

    <main class="dashboard-content bg-body-tertiary">
      <div class="no-print">
        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <div>
            <button type="button" class="btn btn-link p-0 text-decoration-none mb-2" @click="goBack">
              ← Nazad
            </button>
            <h1 class="h2 mb-0">Faktura</h1>
          </div>

          <div class="d-flex gap-2">
            <button v-if="canBePaid" class="btn btn-success" @click="markAsPaid">
              Naplati
            </button>

            <button class="btn btn-primary" :disabled="!invoice" @click="exportPdf">
              <i class="bi bi-filetype-pdf me-1"></i>
              Izvezi PDF
            </button>
          </div>
        </div>

        <div v-if="loading" class="alert alert-info">Učitavanje fakture...</div>
        <div v-else-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
      </div>

      <div v-if="invoice" class="invoice-preview-col m-auto">
        <div class="invoice-paper">
          <!-- Zaglavlje -->
          <div class="d-flex justify-content-between align-items-start flex-wrap gap-3">
            <div>
              <h2 class="fw-bold mb-2">{{ company.name }}</h2>
              <p class="text-muted mb-1">{{ company.address }}</p>
              <p class="text-muted mb-1"><i class="bi bi-telephone me-1"></i>{{ company.phone }}</p>
              <p class="text-muted mb-0">{{ company.taxId }}</p>
            </div>

            <div class="text-end">
              <h4 class="fw-bold text-uppercase mb-2" style="letter-spacing: 2px">Faktura</h4>
              <p class="mb-1"><strong>{{ invoice.invoiceNumber }}</strong></p>
              <p class="text-muted mb-1">Izdata: {{ formatDate(invoice.issuedAt) }}</p>
              <p v-if="invoice.paidAt" class="text-muted mb-2">Plaćena: {{ formatDate(invoice.paidAt) }}</p>
              <span class="badge no-print" :class="statusClass(invoice.status)">
                {{ invoiceStatusLabels[invoice.status] ?? invoice.status }}
              </span>
            </div>
          </div>

          <hr class="my-4" />

          <!-- Kupac / Vozilo -->
          <div class="invoice-parties">
            <div class="party">
              <h6 class="text-uppercase text-muted small mb-2">Kupac</h6>
              <h6 class="fw-semibold mb-1">
                {{ order?.customer?.firstName }} {{ order?.customer?.lastName || '—' }}
              </h6>
              <p class="text-muted mb-1">{{ order?.customer?.address || '' }}</p>
              <p class="text-muted mb-0">{{ order?.customer?.phone || '' }}</p>
              <p class="text-muted mb-0">{{ order?.customer?.email || '' }}</p>
            </div>

            <div class="party party-vehicle">
              <h6 class="text-uppercase text-muted small mb-2">Vozilo</h6>
              <h6 class="fw-semibold mb-1">
                {{ order?.vehicle?.make }} {{ order?.vehicle?.model || '—' }}
              </h6>
              <p class="text-muted mb-1">Reg: {{ order?.vehicle?.licensePlate || '' }}</p>
              <p class="text-muted mb-0">Radni nalog #{{ invoice.repairOrderId }}</p>
            </div>
          </div>

          <!-- Stavke -->
          <div class="py-2 mt-3">
            <h6 class="text-uppercase text-muted small mb-2">Pregled stavki</h6>

            <div class="table-responsive">
              <table class="table align-middle mb-0 invoice-table">
                <thead>
                  <tr>
                    <th style="width: 48px">#</th>
                    <th>Opis</th>
                    <th class="text-end">Cena</th>
                    <th class="text-center">Kol.</th>
                    <th class="text-end" style="width: 140px">Ukupno</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in items" :key="index">
                    <th scope="row">{{ String(index + 1).padStart(2, '0') }}</th>
                    <td>{{ item.description }}</td>
                    <td class="text-end">{{ formatPrice(item.unitPrice) }}</td>
                    <td class="text-center">{{ item.quantity }}</td>
                    <td class="text-end">{{ formatPrice(item.quantity * item.unitPrice) }}</td>
                  </tr>
                  <tr v-if="items.length === 0">
                    <td colspan="5" class="text-center text-muted">Stavke nisu dostupne.</td>
                  </tr>

                  <tr>
                    <th scope="row" colspan="4" class="text-end">Osnovica</th>
                    <td class="text-end">{{ formatPrice(invoice.subtotal) }}</td>
                  </tr>
                  <tr>
                    <th scope="row" colspan="4" class="border-0 text-end">PDV ({{ invoice.taxRate }}%)</th>
                    <td class="border-0 text-end">{{ formatPrice(invoice.taxAmount) }}</td>
                  </tr>
                  <tr>
                    <th scope="row" colspan="4" class="border-0 text-end">Za naplatu</th>
                    <td class="border-0 text-end">
                      <h5 class="m-0 fw-bold">{{ formatPrice(invoice.total) }}</h5>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <p class="text-center text-muted small mt-4 mb-0">Hvala na poverenju.</p>
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

.invoice-preview-col {
  max-width: 800px;
}

.invoice-paper {
  background: #ffffff;
  color: #1a1a1a;
  padding: 2.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 20px 27px rgba(0, 0, 0, 0.05);
  height: 1123px;
  width: 794px;
}

.invoice-paper .text-muted {
  color: #6b7280 !important;
}

.invoice-table {
  --bs-table-bg: transparent;
  --bs-table-color: #1a1a1a;
  --bs-table-border-color: #e5e7eb;
}

.invoice-table th,
.invoice-table td {
  color: #1a1a1a;
}

.invoice-parties {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 0.5rem;
}

.invoice-parties .party {
  min-width: 0;
}

.invoice-parties .party-vehicle {
  text-align: right;
}

/* ===== STAMPANJE: samo papir ===== */
@page {
  margin: 16mm;
}

@media print {
  .no-print {
    display: none !important;
  }

  .dashboard-layout {
    display: block !important;
    min-height: auto !important;
    background: #ffffff !important;
  }

  .dashboard-content {
    display: block !important;
    padding: 0 !important;
    margin: 0 !important;
    background: #ffffff !important;
  }

  .invoice-preview-col {
    max-width: 100%;
  }

  .invoice-paper {
    border: 0;
    border-radius: 0;
    box-shadow: none;
    padding: 0;
    width: 100%;
    max-width: 100%;
  }
}

@media (max-width: 575px) {
  .invoice-parties {
    flex-direction: column;
    gap: 1rem;
  }

  .invoice-parties .party-vehicle {
    text-align: left;
  }
}
</style>