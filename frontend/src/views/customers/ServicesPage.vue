<template>
  <main class="services-page bg-body text-body">
    <section id="hero" class="services-hero text-white">
      <div class="container py-5">
        <div class="row align-items-center min-vh-50">
          <div class="col-lg-8">
            <span class="badge text-bg-primary mb-3">
              Naše usluge
            </span>

            <h1 class="display-4 fw-bold mb-3">
              Profesionalna popravka i održavanje automobila.
            </h1>

            <p class="lead text-white-50 mb-4">
              Izaberite uslugu koja je potrebna vašem vozilu i zakažite termin online.
            </p>

            <RouterLink class="btn btn-primary btn-lg" to="/book-appointment">
              Zakaži termin
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <section class="py-5 bg-body-tertiary">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="fw-bold">
            Dostupne usluge
          </h2>

          <p class="text-body-secondary mb-0">
            Sve što je vašem vozilu potrebno na jednom mestu.
          </p>
        </div>

        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Učitavanje...</span>
          </div>

          <p class="text-body-secondary mt-3 mb-0">
            Učitavanje usluga...
          </p>
        </div>

        <div v-else-if="errorMessage" class="alert alert-danger text-center">
          {{ errorMessage }}
        </div>

        <div v-else-if="activeServices.length === 0" class="alert alert-warning text-center">
          Trenutno nema dostupnih usluga.
        </div>

        <div v-else class="row g-4">
          <div
            v-for="service in activeServices"
            :key="service.id"
            class="col-md-6 col-lg-4"
          >
            <div class="card service-card app-card h-100 shadow-sm rounded-4">
              <div class="card-body p-4">
                <div class="service-icon mb-3">
                  {{ getServiceIcon(service.name) }}
                </div>

                <h5 class="card-title fw-bold">
                  {{ service.name }}
                </h5>

                <p class="card-text text-body-secondary">
                  {{ service.description }}
                </p>

                <div class="d-flex justify-content-between align-items-center mt-4">
                  <span class="fw-bold text-primary">
                    od {{ formatPrice(service.price) }}
                  </span>

                  <RouterLink
                    class="btn btn-outline-primary btn-sm"
                    to="/book-appointment"
                  >
                    Zakaži
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-5 bg-body">
      <div class="container">
        <div class="row align-items-center g-5">
          <div class="col-lg-6">
            <h2 class="fw-bold mb-3">
              Niste sigurni šta je potrebno vašem automobilu?
            </h2>

            <p class="lead text-body-secondary">
              Pošaljite zahtev za termin i opišite problem.
              Naš majstor će pregledati vozilo i preporučiti odgovarajuću uslugu.
            </p>

            <ul class="list-unstyled mt-4">
              <li class="mb-3">
                ✅ Kompjuterska dijagnostika
              </li>

              <li class="mb-3">
                ✅ Transparentan proces popravke
              </li>

              <li class="mb-3">
                ✅ Jasne cene usluga
              </li>

              <li class="mb-3">
                ✅ Profesionalno održavanje
              </li>
            </ul>

            <RouterLink class="btn btn-primary mt-3" to="/book-appointment">
              Zakaži servis
            </RouterLink>
          </div>

          <div class="col-lg-6">
            <div class="app-card rounded-4 shadow-sm p-4">
              <h5 class="fw-bold mb-4">
                Proces servisiranja
              </h5>

              <div class="process-item">
                <span class="process-number">1</span>
                <div>
                  <h6 class="fw-bold mb-1">Zakazivanje termina</h6>
                  <p class="text-body-secondary mb-0">
                    Izaberite uslugu i pošaljite zahtev za servis.
                  </p>
                </div>
              </div>

              <div class="process-item">
                <span class="process-number">2</span>
                <div>
                  <h6 class="fw-bold mb-1">Pregled vozila</h6>
                  <p class="text-body-secondary mb-0">
                    Naš majstor proverava vozilo i potvrđuje potreban rad.
                  </p>
                </div>
              </div>

              <div class="process-item">
                <span class="process-number">3</span>
                <div>
                  <h6 class="fw-bold mb-1">Radni nalog</h6>
                  <p class="text-body-secondary mb-0">
                    Proces popravke se organizuje kroz servisni radni nalog.
                  </p>
                </div>
              </div>

              <div class="process-item border-0 pb-0 mb-0">
                <span class="process-number">4</span>
                <div>
                  <h6 class="fw-bold mb-1">Račun</h6>
                  <p class="text-body-secondary mb-0">
                    Nakon završene popravke kreira se račun i evidentira plaćanje.
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
            throw new Error('Neuspešno učitavanje usluga')
        }

        services.value = await response.json()
    } catch (error) {
        errorMessage.value = 'Usluge trenutno ne mogu da se učitaju. Pokušajte ponovo kasnije.'
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
#hero {
  background-image: 
    linear-gradient(rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0.88)),
    url('/images/customers/landingHero3.jpg');
  background-size: cover;
  background-position: center;
}

.min-vh-50 {
  min-height: 50vh;
}

.app-card {
  background-color: var(--bs-body-bg);
  border: 1px solid var(--bs-border-color);
  color: var(--bs-body-color);
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
  background-color: var(--bs-tertiary-bg);
  border: 1px solid var(--bs-border-color);
}

.process-item {
  display: flex;
  gap: 1rem;
  padding-bottom: 1.25rem;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid var(--bs-border-color);
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