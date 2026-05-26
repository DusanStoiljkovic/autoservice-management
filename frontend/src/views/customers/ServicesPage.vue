<template>
  <main class="services-page">
    <section class="services-hero text-white">
      <div class="container py-5">
        <div class="row align-items-center min-vh-50">
          <div class="col-lg-8">
            <span class="badge text-bg-primary mb-3">
              Our Services
            </span>

            <h1 class="display-4 fw-bold mb-3">
              Professional car repair and maintenance.
            </h1>

            <p class="lead text-white-50 mb-4">
              Choose the service your vehicle needs and schedule an appointment online.
            </p>

            <RouterLink class="btn btn-primary btn-lg" to="/book-appointment">
              Book Appointment
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <section class="py-5 bg-light">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="fw-bold">
            Available Services
          </h2>

          <p class="text-muted mb-0">
            Everything your vehicle needs in one place.
          </p>
        </div>

        <div class="row g-4">
          <div
            v-for="service in activeServices"
            :key="service.id"
            class="col-md-6 col-lg-4"
          >
            <div class="card service-card h-100 border-0 shadow-sm rounded-4">
              <div class="card-body p-4">
                <div class="service-icon mb-3">
                  {{ getServiceIcon(service.name) }}
                </div>

                <h5 class="card-title fw-bold">
                  {{ service.name }}
                </h5>

                <p class="card-text text-muted">
                  {{ service.description }}
                </p>

                <div class="d-flex justify-content-between align-items-center mt-4">
                  <span class="fw-bold text-primary">
                    from {{ formatPrice(service.price) }}
                  </span>

                  <RouterLink
                    class="btn btn-outline-primary btn-sm"
                    to="/book-appointment"
                  >
                    Book now
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-5">
      <div class="container">
        <div class="row align-items-center g-5">
          <div class="col-lg-6">
            <h2 class="fw-bold mb-3">
              Not sure what your car needs?
            </h2>

            <p class="lead text-muted">
              Send us an appointment request and describe the problem.
              Our mechanic will inspect the vehicle and recommend the right service.
            </p>

            <ul class="list-unstyled mt-4">
              <li class="mb-3">
                ✅ Computer diagnostics
              </li>

              <li class="mb-3">
                ✅ Transparent repair process
              </li>

              <li class="mb-3">
                ✅ Clear service prices
              </li>

              <li class="mb-3">
                ✅ Professional maintenance
              </li>
            </ul>

            <RouterLink class="btn btn-primary mt-3" to="/book-appointment">
              Schedule Service
            </RouterLink>
          </div>

          <div class="col-lg-6">
            <div class="info-box rounded-4 shadow-sm p-4">
              <h5 class="fw-bold mb-4">
                Service Process
              </h5>

              <div class="process-item">
                <span class="process-number">1</span>
                <div>
                  <h6 class="fw-bold mb-1">Book appointment</h6>
                  <p class="text-muted mb-0">
                    Choose a service and send your request.
                  </p>
                </div>
              </div>

              <div class="process-item">
                <span class="process-number">2</span>
                <div>
                  <h6 class="fw-bold mb-1">Vehicle inspection</h6>
                  <p class="text-muted mb-0">
                    Our mechanic checks the vehicle and confirms the work.
                  </p>
                </div>
              </div>

              <div class="process-item">
                <span class="process-number">3</span>
                <div>
                  <h6 class="fw-bold mb-1">Repair order</h6>
                  <p class="text-muted mb-0">
                    The repair process is organized through a service order.
                  </p>
                </div>
              </div>

              <div class="process-item border-0 pb-0">
                <span class="process-number">4</span>
                <div>
                  <h6 class="fw-bold mb-1">Invoice</h6>
                  <p class="text-muted mb-0">
                    After the repair, the invoice is created and payment is tracked.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import type { Service } from '../../types/services'

const services = ref<Service[]>([])
const loading = ref(false)
const errorMessage = ref('')

const API_URL = import.meta.env.VITE_API_URL

const activeServices = computed(() => {
    return services.value.filter((service) => {
        return service.isActive === 1
    })
})

async function fetchServices() {
    try {
        loading.value = true
        errorMessage.value = ''

        const response = await fetch(`${API_URL}/services/all`)
        if (!response.ok) {
            throw new Error('Failed to fetch services')
        }

        services.value = await response.json()
    } catch (error) {
        errorMessage.value = 'Could not load services. Please try again later.'
    } finally {
        loading.value = false
    }
}

function formatPrice(price: string) {
    const numericPrice = Number(price)

    if(Number.isNaN(numericPrice)) {
        return `${price} RSD`
    }

    return new Intl.NumberFormat('sr-RS', {
    style: 'currency',
    currency: 'RSD',
    minimumFractionDigits: 0
  }).format(numericPrice)

}

function getServiceIcon(service: string) {
    const name = service.toLowerCase()

  if (name.includes('oil') || name.includes('ulje')) {
    return '🛢️'
  }

  if (name.includes('diagnostic') || name.includes('dijagnost')) {
    return '💻'
  }

  if (name.includes('brake') || name.includes('koč')) {
    return '🛞'
  }

  if (name.includes('battery') || name.includes('akumulator')) {
    return '🔋'
  }

  return '🧰'
}

onMounted(() => {
    fetchServices()
})


</script>

<style scoped>
.services-hero {
  background:
    linear-gradient(rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0.88)),
    radial-gradient(circle at top right, rgba(13, 110, 253, 0.45), transparent 35%);
}

.min-vh-50 {
  min-height: 50vh;
}

.service-card {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.service-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.12) !important;
}

.service-icon {
  width: 64px;
  height: 64px;
  display: grid;
  place-items: center;
  font-size: 2rem;
  border-radius: 18px;
  background-color: #f1f5f9;
}

.info-box {
  background-color: #ffffff;
  border: 1px solid #e9ecef;
}

.process-item {
  display: flex;
  gap: 1rem;
  padding-bottom: 1.25rem;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid #e9ecef;
}

.process-number {
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: #ffffff;
  font-weight: 700;
  background-color: #0d6efd;
}
</style>