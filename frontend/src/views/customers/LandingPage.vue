<template>
  <div class="landing-page">
    <main>
      <div
        id="customerCarousel"
        class="carousel slide mb-5"
        data-bs-ride="carousel"
      >
        <div class="carousel-indicators">
          <button
            type="button"
            data-bs-target="#customerCarousel"
            data-bs-slide-to="0"
            class="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>

          <button
            type="button"
            data-bs-target="#customerCarousel"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>

          <button
            type="button"
            data-bs-target="#customerCarousel"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
        </div>

        <div class="carousel-inner">
          <div id="carousel1" class="carousel-item active carousel-bg carousel-bg-primary">
            <div class="container">
              <div class="carousel-caption text-start">
                <span class="badge text-bg-primary mb-3">
                  Professional Auto Service
                </span>

                <h1>Book your car service online.</h1>

                <p class="opacity-75">
                  Schedule your repair, maintenance or diagnostics without calling
                  the workshop.
                </p>

                <p>
                  <RouterLink class="btn btn-lg btn-primary" to="/book-appointment">
                    Book Appointment
                  </RouterLink>
                </p>
              </div>
            </div>
          </div>

          <div id="carousel2" class="carousel-item carousel-bg carousel-bg-secondary">
            <div class="container">
              <div class="carousel-caption">
                <span class="badge text-bg-light mb-3">
                  Fast & Reliable
                </span>

                <h1>Reliable mechanics for your vehicle.</h1>

                <p>
                  We handle diagnostics, oil changes, brakes, repairs and regular
                  maintenance.
                </p>

                <p>
                  <RouterLink class="btn btn-lg btn-primary" to="/services">
                    View Services
                  </RouterLink>
                </p>
              </div>
            </div>
          </div>

          <div id="carousel3" class="carousel-item carousel-bg carousel-bg-dark">
            <div class="container">
              <div class="carousel-caption text-end">
                <span class="badge text-bg-success mb-3">
                  Transparent Process
                </span>

                <h1>Know what happens with your car.</h1>

                <p>
                  From appointment to invoice, your service process is clear and
                  organized.
                </p>

                <p>
                  <RouterLink class="btn btn-lg btn-primary" to="/login">
                    Mechanic Login
                  </RouterLink>
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          class="carousel-control-prev"
          type="button"
          data-bs-target="#customerCarousel"
          data-bs-slide="prev"
        >
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>

        <button
          class="carousel-control-next"
          type="button"
          data-bs-target="#customerCarousel"
          data-bs-slide="next"
        >
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>

      <div class="container marketing">
        <div class="row text-center">
          <div
            v-for="service in mainServices"
            :key="service.title"
            class="col-lg-4 mb-5"
          >
            <div class="service-icon mx-auto mb-4">
              {{ service.icon }}
            </div>

            <h2 class="fw-normal">
              {{ service.title }}
            </h2>

            <p class="text-body-secondary">
              {{ service.description }}
            </p>

            <p>
              <RouterLink class="btn btn-secondary" to="/services">
                View details »
              </RouterLink>
            </p>
          </div>
        </div>

        <hr class="featurette-divider" />

        <div class="row featurette align-items-center">
          <div class="col-md-7">
            <h2 class="featurette-heading fw-normal lh-1">
              Easy appointment booking.
              <span class="text-body-secondary">
                No phone calls needed.
              </span>
            </h2>

            <p class="lead">
              Customers can request a service appointment online by entering basic
              vehicle and contact information.
            </p>
          </div>

          <div class="col-md-5">
            <div class="featurette-box">
              <div class="featurette-emoji">📅</div>
              <h5>Online Scheduling</h5>
              <p class="text-muted mb-0">
                Pick the right service and send a request in minutes.
              </p>
            </div>
          </div>
        </div>

        <hr class="featurette-divider" />

        <div class="row featurette align-items-center">
          <div class="col-md-7 order-md-2">
            <h2 class="featurette-heading fw-normal lh-1">
              Clear service information.
              <span class="text-body-secondary">
                Before the car enters the garage.
              </span>
            </h2>

            <p class="lead">
              Customers can see available services and understand what the auto
              service offers before booking.
            </p>
          </div>

          <div class="col-md-5 order-md-1">
            <div class="featurette-box">
              <div class="featurette-emoji">🛠️</div>
              <h5>Service Overview</h5>
              <p class="text-muted mb-0">
                Oil change, diagnostics, brakes, repairs and more.
              </p>
            </div>
          </div>
        </div>

        <hr class="featurette-divider" />

        <div class="row featurette align-items-center">
          <div class="col-md-7">
            <h2 class="featurette-heading fw-normal lh-1">
              Professional repair workflow.
              <span class="text-body-secondary">
                Built for real workshops.
              </span>
            </h2>

            <p class="lead">
              The customer-facing landing page connects naturally with the mechanic
              dashboard for appointments, repair orders and invoices.
            </p>
          </div>

          <div class="col-md-5">
            <div class="featurette-box">
              <div class="featurette-emoji">🚗</div>
              <h5>Vehicle Service</h5>
              <p class="text-muted mb-0">
                From booking to repair order and final invoice.
              </p>
            </div>
          </div>
        </div>

        <hr class="featurette-divider" />
      </div>

      <footer class="container pb-4">
        <p class="float-end">
          <a href="#">Back to top</a>
        </p>

        <p>
          © 2026 AutoService Management ·
          <a href="#">Privacy</a>
          ·
          <a href="#">Terms</a>
        </p>
      </footer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

const mainServices = [
  {
    icon: '🛢️',
    title: 'Oil Change',
    description:
      'Regular oil and filter replacement to keep your engine healthy and reliable.'
  },
  {
    icon: '💻',
    title: 'Diagnostics',
    description:
      'Computer diagnostics and fault detection for modern vehicles.'
  },
  {
    icon: '🛞',
    title: 'Brake Service',
    description:
      'Brake pads, discs and braking system inspection for safe driving.'
  }
]
</script>

<style scoped>

#carousel1 {
    background-image: url('/images/customers/landingHero.jpg');
    background-size: cover;
    
}

#carousel2 {
    background-image: url('/images/customers/landingHero2.jpg');
    background-size: cover;
}

#carousel3 {
    background-image: url('/images/customers/landingHero3.jpg');
    background-size: cover;
}


.carousel {
  margin-bottom: 4rem;
}

.carousel-item {
  height: 32rem;
}

.carousel-caption {
  bottom: 7rem;
  z-index: 10;
}

.carousel-caption h1 {
  font-size: clamp(2.25rem, 5vw, 4.5rem);
  font-weight: 700;
}

.carousel-caption p {
  font-size: 1.25rem;
  max-width: 620px;
}

.carousel-caption.text-end p {
  margin-left: auto;
}

.carousel-caption:not(.text-start):not(.text-end) p {
  margin-left: auto;
  margin-right: auto;
}

.carousel-bg {
  position: relative;
  background-size: cover;
  background-position: center;
}

.carousel-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.75)),
    radial-gradient(circle at top right, rgba(13, 110, 253, 0.45), transparent 35%);
}

.carousel-bg-primary {
  background: linear-gradient(135deg, #111827, #1d4ed8);
}

.carousel-bg-secondary {
  background: linear-gradient(135deg, #1f2937, #475569);
}

.carousel-bg-dark {
  background: linear-gradient(135deg, #020617, #14532d);
}

.marketing .col-lg-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.service-icon {
  width: 140px;
  height: 140px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  font-size: 4rem;
  background-color: #f1f5f9;
  border: 1px solid #e5e7eb;
}

.featurette-divider {
  margin: 5rem 0;
}

.featurette-heading {
  letter-spacing: -0.05rem;
}

.featurette-box {
  min-height: 320px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 2rem;
  text-align: center;
  border-radius: 24px;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
}

.featurette-emoji {
  font-size: 5rem;
}

.navbar-brand {
  letter-spacing: 0.3px;
}

@media (max-width: 768px) {
  .carousel-item {
    height: 36rem;
  }

  .carousel-caption {
    bottom: 4rem;
    text-align: center !important;
  }

  .carousel-caption p {
    margin-left: auto;
    margin-right: auto;
  }

  .featurette-divider {
    margin: 3rem 0;
  }

  .featurette-heading {
    font-size: 2rem;
  }
}
</style>