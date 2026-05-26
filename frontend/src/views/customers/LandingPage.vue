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
            aria-label="Slajd 1"
          ></button>

          <button
            type="button"
            data-bs-target="#customerCarousel"
            data-bs-slide-to="1"
            aria-label="Slajd 2"
          ></button>

          <button
            type="button"
            data-bs-target="#customerCarousel"
            data-bs-slide-to="2"
            aria-label="Slajd 3"
          ></button>
        </div>

        <div class="carousel-inner">
          <div id="carousel1" class="carousel-item active carousel-bg carousel-bg-primary">
            <div class="container">
              <div class="carousel-caption text-start">
                <span class="badge text-bg-primary mb-3">
                  Profesionalni auto servis
                </span>

                <h1>Zakažite servis automobila online.</h1>

                <p class="opacity-75">
                  Zakažite popravku, redovno održavanje ili dijagnostiku bez pozivanja
                  servisa.
                </p>

                <p>
                  <RouterLink class="btn btn-lg btn-primary" to="/book-appointment">
                    Zakaži termin
                  </RouterLink>
                </p>
              </div>
            </div>
          </div>

          <div id="carousel2" class="carousel-item carousel-bg carousel-bg-secondary">
            <div class="container">
              <div class="carousel-caption">
                <span class="badge text-bg-light mb-3">
                  Brzo i pouzdano
                </span>

                <h1>Pouzdani majstori za vaše vozilo.</h1>

                <p>
                  Radimo dijagnostiku, zamenu ulja, kočnice, popravke i redovno
                  održavanje vozila.
                </p>

                <p>
                  <RouterLink class="btn btn-lg btn-primary" to="/services">
                    Pogledaj usluge
                  </RouterLink>
                </p>
              </div>
            </div>
          </div>

          <div id="carousel3" class="carousel-item carousel-bg carousel-bg-dark">
            <div class="container">
              <div class="carousel-caption text-end">
                <span class="badge text-bg-success mb-3">
                  Transparentan proces
                </span>

                <h1>Znajte šta se dešava sa vašim automobilom.</h1>

                <p>
                  Od zakazivanja termina do izdavanja računa, proces servisiranja je
                  jasan i organizovan.
                </p>

                <p>
                  <RouterLink class="btn btn-lg btn-primary" to="/login">
                    Prijava za majstora
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
          <span class="visually-hidden">Prethodni</span>
        </button>

        <button
          class="carousel-control-next"
          type="button"
          data-bs-target="#customerCarousel"
          data-bs-slide="next"
        >
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Sledeći</span>
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
                Pogledaj detalje »
              </RouterLink>
            </p>
          </div>
        </div>

        <hr class="featurette-divider" />

        <div class="row featurette align-items-center">
          <div class="col-md-7">
            <h2 class="featurette-heading fw-normal lh-1">
              Jednostavno zakazivanje termina.
              <span class="text-body-secondary">
                Bez telefonskih poziva.
              </span>
            </h2>

            <p class="lead">
              Klijenti mogu online da pošalju zahtev za servis unosom osnovnih
              podataka o vozilu i kontakt informacija.
            </p>
          </div>

          <div class="col-md-5">
            <div class="featurette-box">
              <div class="featurette-emoji">📅</div>
              <h5>Online zakazivanje</h5>
              <p class="text-muted mb-0">
                Izaberite odgovarajuću uslugu i pošaljite zahtev za nekoliko minuta.
              </p>
            </div>
          </div>
        </div>

        <hr class="featurette-divider" />

        <div class="row featurette align-items-center">
          <div class="col-md-7 order-md-2">
            <h2 class="featurette-heading fw-normal lh-1">
              Jasne informacije o uslugama.
              <span class="text-body-secondary">
                Pre nego što vozilo stigne u servis.
              </span>
            </h2>

            <p class="lead">
              Klijenti mogu da vide dostupne usluge i razumeju šta auto servis
              nudi pre zakazivanja termina.
            </p>
          </div>

          <div class="col-md-5 order-md-1">
            <div class="featurette-box">
              <div class="featurette-emoji">🛠️</div>
              <h5>Pregled usluga</h5>
              <p class="text-muted mb-0">
                Zamena ulja, dijagnostika, kočnice, popravke i još mnogo toga.
              </p>
            </div>
          </div>
        </div>

        <hr class="featurette-divider" />

        <div class="row featurette align-items-center">
          <div class="col-md-7">
            <h2 class="featurette-heading fw-normal lh-1">
              Profesionalan tok popravke.
              <span class="text-body-secondary">
                Napravljeno za stvarne auto servise.
              </span>
            </h2>

            <p class="lead">
              Customer landing strana se prirodno povezuje sa dashboard-om za
              majstora, terminima, radnim nalozima i fakturama.
            </p>
          </div>

          <div class="col-md-5">
            <div class="featurette-box">
              <div class="featurette-emoji">🚗</div>
              <h5>Servis vozila</h5>
              <p class="text-muted mb-0">
                Od zakazivanja termina do radnog naloga i konačnog računa.
              </p>
            </div>
          </div>
        </div>

        <hr class="featurette-divider" />
      </div>

      <footer class="container pb-4">
        <p class="float-end">
          <a href="#">Nazad na vrh</a>
        </p>

        <p>
          © 2026 AutoService Management ·
          <a href="#">Privatnost</a>
          ·
          <a href="#">Uslovi korišćenja</a>
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
    title: 'Zamena ulja',
    description:
      'Redovna zamena ulja i filtera za bolji rad motora i duži vek trajanja vozila.'
  },
  {
    icon: '💻',
    title: 'Dijagnostika',
    description:
      'Kompjuterska dijagnostika i očitavanje grešaka kod modernih vozila.'
  },
  {
    icon: '🛞',
    title: 'Servis kočnica',
    description:
      'Zamena kočionih pločica, diskova i provera kočionog sistema za bezbednu vožnju.'
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