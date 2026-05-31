<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Sidebar from '../components/Sidebar.vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()

const API_BASE_URL = import.meta.env.VITE_API_URL

interface LineItem {
  description: string
  quantity: number
  unitPrice: number
}

const orders = ref<any[]>([])
const invoices = ref<any[]>([])
const loading = ref(false)
const errorMessage = ref('')
const saving = ref(false)
const saveMessage = ref('')

const selectedOrderId = ref<number | null>(null)
const invoiceNumber = ref('')
const taxRate = ref(20)
const issuedAt = ref(new Date().toISOString().slice(0, 10))
const notes = ref('')
const items = ref<LineItem[]>([])

// Servis (izdavalac) - prilagodi svojim podacima
const company = {
  name: 'AutoService',
  address: 'Bulevar kralja Aleksandra 100, Beograd',
  phone: '+381 11 123 456',
  taxId: 'PIB: 123456789'
}

// Nalozi koji jos nemaju fakturu (repair_order_id je UNIQUE -> 1 faktura po nalogu)
const availableOrders = computed(() => {
  const invoicedOrderIds = new Set(invoices.value.map((invoice) => invoice.repairOrderId))
  return orders.value.filter((order) => !invoicedOrderIds.has(order.id))
})

const selectedOrder = computed(() => {
  return orders.value.find((order) => order.id === selectedOrderId.value) || null
})

const subtotal = computed(() => {
  return items.value.reduce((sum, item) => sum + Number(item.quantity) * Number(item.unitPrice), 0)
})

const taxAmount = computed(() => {
  return subtotal.value * (Number(taxRate.value) / 100)
})

const total = computed(() => {
  return subtotal.value + taxAmount.value
})

function formatPrice(value: number) {
  return new Intl.NumberFormat('sr-RS', {
    style: 'currency',
    currency: 'RSD',
    minimumFractionDigits: 2
  }).format(value)
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

function generateInvoiceNumber() {
  const year = new Date().getFullYear()
  const suffix = Date.now().toString().slice(-6)
  return `INV-${year}-${suffix}`
}

async function fetchData() {
  try {
    loading.value = true
    errorMessage.value = ''

    const [ordersRes, invoicesRes] = await Promise.all([
      axios.get(`${API_BASE_URL}/repair-orders/all`),
      axios.get(`${API_BASE_URL}/invoices/all`)
    ])

    orders.value = ordersRes.data
    invoices.value = invoicesRes.data
  } catch (error) {
    console.error('Greška prilikom učitavanja podataka:', error)
    errorMessage.value = 'Podaci za fakturu trenutno ne mogu da se učitaju.'
  } finally {
    loading.value = false
  }
}

async function onOrderSelected() {
  saveMessage.value = ''
  items.value = []

  const order = selectedOrder.value

  if (!order) {
    return
  }

  // Stavke prefilujemo iz usluga termina vezanog za nalog (ako postoji).
  if (order.appointmentId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/appointments/${order.appointmentId}`)
      const services = response.data?.services || []

      items.value = services.map((service: any) => ({
        description: service.name,
        quantity: 1,
        unitPrice: Number(service.price) || 0
      }))
    } catch (error) {
      console.error('Greška prilikom učitavanja usluga:', error)
    }
  }

  if (items.value.length === 0) {
    addItem()
  }
}

function addItem() {
  items.value.push({ description: '', quantity: 1, unitPrice: 0 })
}

function removeItem(index: number) {
  items.value.splice(index, 1)
}

async function saveInvoice() {
  if (!selectedOrderId.value) {
    errorMessage.value = 'Izaberi radni nalog za fakturu.'
    return
  }

  if (!invoiceNumber.value.trim()) {
    errorMessage.value = 'Broj fakture je obavezan.'
    return
  }

  try {
    saving.value = true
    errorMessage.value = ''
    saveMessage.value = ''

    const payload = {
      repairOrderId: selectedOrderId.value,
      invoiceNumber: invoiceNumber.value.trim(),
      status: 'ISSUED',
      subtotal: Number(subtotal.value.toFixed(2)),
      taxRate: Number(Number(taxRate.value).toFixed(2)),
      taxAmount: Number(taxAmount.value.toFixed(2)),
      total: Number(total.value.toFixed(2)),
      issuedAt: new Date(issuedAt.value).toISOString()
    }

    await axios.post(`${API_BASE_URL}/invoices/`, payload)

    saveMessage.value = 'Faktura je sačuvana. Sada je možeš izvesti kao PDF.'
    await fetchData()
  } catch (error) {
    console.error('Greška prilikom čuvanja fakture:', error)
    errorMessage.value = 'Faktura ne može da se sačuva (možda nalog već ima fakturu ili je broj zauzet).'
  } finally {
    saving.value = false
  }
}

function exportPdf() {
  // Browser print -> "Sačuvaj kao PDF". U dijalogu iskljuci "Headers and footers".
  window.print()
}

onMounted(async () => {
  invoiceNumber.value = generateInvoiceNumber()
  await fetchData()

  const preselect = Number(route.query.orderId)
  if(preselect) {
    selectedOrderId.value = preselect
    await onOrderSelected()
  }
})
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
            <h1 class="h2 mb-1">Nova faktura</h1>
            <p class="text-body-secondary mb-0">Unosi podatke levo — pregled se uživo prikazuje desno.</p>
          </div>

          <div class="d-flex gap-2">
            <button class="btn btn-outline-primary" :disabled="saving" @click="saveInvoice">
              {{ saving ? 'Čuvanje...' : 'Sačuvaj fakturu' }}
            </button>

            <button class="btn btn-primary" :disabled="!selectedOrderId" @click="exportPdf">
              <i class="bi bi-filetype-pdf me-1"></i>
              Izvezi PDF
            </button>
          </div>
        </div>

        <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
        <div v-if="saveMessage" class="alert alert-success">{{ saveMessage }}</div>
      </div>

      <div class="row g-4 invoice-layout-row">
        <!-- ===== LEVA STRANA: forma ===== -->
        <div class="col-lg-6 no-print">
          <div class="card dashboard-card shadow-sm rounded-4">
            <div class="card-body p-4">
              <div class="row g-3">
                <div class="col-12">
                  <label class="form-label">Radni nalog</label>
                  <select v-model="selectedOrderId" class="form-select" @change="onOrderSelected">
                    <option :value="null" disabled>Izaberi nalog...</option>
                    <option v-for="order in availableOrders" :key="order.id" :value="order.id">
                      #{{ order.id }} — {{ order.customer?.firstName }} {{ order.customer?.lastName }}
                      ({{ order.vehicle?.make }} {{ order.vehicle?.model }})
                    </option>
                  </select>
                  <small v-if="availableOrders.length === 0" class="text-body-secondary">
                    Svi nalozi već imaju fakturu.
                  </small>
                </div>

                <div class="col-sm-6">
                  <label class="form-label">Broj fakture</label>
                  <input v-model="invoiceNumber" type="text" class="form-control" />
                </div>

                <div class="col-sm-4">
                  <label class="form-label">Datum</label>
                  <input v-model="issuedAt" type="date" class="form-control" />
                </div>

                <div class="col-sm-2">
                  <label class="form-label">PDV (%)</label>
                  <input v-model.number="taxRate" type="number" min="0" step="0.01" class="form-control" />
                </div>

                <div class="col-12">
                  <label class="form-label">Napomena</label>
                  <input v-model="notes" type="text" class="form-control" placeholder="Opciono..." />
                </div>
              </div>

              <hr class="my-4" />

              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="fw-bold mb-0">Stavke</h6>
                <button class="btn btn-sm btn-outline-primary" @click="addItem">
                  <i class="bi bi-plus-lg me-1"></i>Dodaj stavku
                </button>
              </div>

              <div v-for="(item, index) in items" :key="index" class="item-row">
                <input
                  v-model="item.description"
                  type="text"
                  class="form-control form-control-sm item-desc"
                  placeholder="Opis usluge"
                />
                <input
                  v-model.number="item.quantity"
                  type="number"
                  min="0"
                  class="form-control form-control-sm item-qty"
                  placeholder="Kol."
                />
                <input
                  v-model.number="item.unitPrice"
                  type="number"
                  min="0"
                  class="form-control form-control-sm item-price"
                  placeholder="Cena"
                />
                <button class="btn btn-sm btn-outline-danger item-remove" @click="removeItem(index)">
                  <i class="bi bi-x-lg"></i>
                </button>
              </div>

              <p v-if="items.length === 0" class="text-body-secondary small mb-0">
                Nema stavki. Klikni „Dodaj stavku".
              </p>
            </div>
          </div>
        </div>

        <!-- ===== DESNA STRANA: pregled / PDF ===== -->
        <div class="col-lg-6 invoice-preview-col">
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
                <p class="mb-1"><strong>{{ invoiceNumber }}</strong></p>
                <p class="text-muted mb-0">Datum: {{ formatDate(issuedAt) }}</p>
              </div>
            </div>

            <hr class="my-4" />

            <!-- Kupac / Vozilo -->
            <div class="invoice-parties">
              <div class="party">
                <h6 class="text-uppercase text-muted small mb-2">Kupac</h6>
                <h6 class="fw-semibold mb-1">
                  {{ selectedOrder?.customer?.firstName }} {{ selectedOrder?.customer?.lastName || '—' }}
                </h6>
                <p class="text-muted mb-1">{{ selectedOrder?.customer?.address || '' }}</p>
                <p class="text-muted mb-0">{{ selectedOrder?.customer?.phone || '' }}</p>
                <p class="text-muted mb-0">{{ selectedOrder?.customer?.email || '' }}</p>
              </div>

              <div class="party party-vehicle">
                <h6 class="text-uppercase text-muted small mb-2">Vozilo</h6>
                <h6 class="fw-semibold mb-1">
                  {{ selectedOrder?.vehicle?.make }} {{ selectedOrder?.vehicle?.model || '—' }}
                </h6>
                <p class="text-muted mb-1">Reg: {{ selectedOrder?.vehicle?.licensePlate || '' }}</p>
                <p class="text-muted mb-0">Radni nalog #{{ selectedOrder?.id || '' }}</p>
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
                      <td>{{ item.description || '—' }}</td>
                      <td class="text-end">{{ formatPrice(Number(item.unitPrice)) }}</td>
                      <td class="text-center">{{ item.quantity }}</td>
                      <td class="text-end">{{ formatPrice(Number(item.quantity) * Number(item.unitPrice)) }}</td>
                    </tr>

                    <tr>
                      <th scope="row" colspan="4" class="text-end">Osnovica</th>
                      <td class="text-end">{{ formatPrice(subtotal) }}</td>
                    </tr>
                    <tr>
                      <th scope="row" colspan="4" class="border-0 text-end">PDV ({{ taxRate }}%)</th>
                      <td class="border-0 text-end">{{ formatPrice(taxAmount) }}</td>
                    </tr>
                    <tr>
                      <th scope="row" colspan="4" class="border-0 text-end">Za naplatu</th>
                      <td class="border-0 text-end">
                        <h5 class="m-0 fw-bold">{{ formatPrice(total) }}</h5>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <p v-if="notes" class="invoice-notes">{{ notes }}</p>

            <p class="text-center text-muted small mt-4 mb-0">Hvala na poverenju.</p>
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

/* Redovi stavki u formi - poravnati, bez preklapanja */
.item-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.item-desc {
  flex: 1 1 auto;
}

.item-qty {
  flex: 0 0 70px;
}

.item-price {
  flex: 0 0 110px;
}

.item-remove {
  flex: 0 0 auto;
}

/* Lepljivi pregled desno */
.invoice-preview-col {
  align-self: flex-start;
  position: sticky;
  top: 1.5rem;
}

/* Papir fakture - fiksne boje da izgleda isto i u dark mode-u i na stampi */
.invoice-paper {
  background: #ffffff;
  color: #1a1a1a;
  width: 100%;
  padding: 2.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 20px 27px rgba(0, 0, 0, 0.05);
}

/* Boje teksta u papiru drzimo fiksne (ne nasledjuju dark temu) */
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

.invoice-notes {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  color: #374151;
  font-size: 0.9rem;
}

/* Kupac / Vozilo - sopstveni flex (ne zavisi od Bootstrap .row pri stampi) */
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

/* ===== STAMPANJE: samo papir, preko cele sirine ===== */
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

  /* samo spoljni raspored kolona se ponistava, NE i unutrasnji sadrzaj */
  .invoice-layout-row {
    display: block !important;
    margin: 0 !important;
  }

  .invoice-preview-col {
    position: static !important;
    width: 100% !important;
    max-width: 100% !important;
    flex: 0 0 100% !important;
    padding: 0 !important;
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

@media (max-width: 991px) {
  .invoice-preview-col {
    position: static;
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

@media (max-width: 768px) {
  .dashboard-layout {
    flex-direction: column;
  }

  .dashboard-content {
    padding: 1rem;
  }
}
</style>