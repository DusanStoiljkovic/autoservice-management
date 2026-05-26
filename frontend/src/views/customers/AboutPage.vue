<template>
  <main class="about-page">
    <section id="hero" class="about-hero text-white">
      <div class="container py-5">
        <div class="row align-items-center min-vh-40">
          <div class="col-lg-8">
            <span class="badge text-bg-primary mb-3">
              O nama
            </span>

            <h1 class="display-5 fw-bold mb-3">
              Pouzdan auto servis za svakodnevne potrebe vašeg vozila.
            </h1>

            <p class="lead text-white-50 mb-0">
              Naš cilj je da servisiranje automobila bude jednostavno, pregledno i brzo —
              od zakazivanja termina do završetka popravke.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-5 bg-light">
      <div class="container">
        <div class="row align-items-center g-5">
          <div class="col-lg-6">
            <h2 class="fw-bold mb-3">
              Ko smo mi?
            </h2>

            <p class="text-muted">
              AutoService je moderan auto servis koji omogućava klijentima da brzo
              zakažu termin, izaberu potrebnu uslugu i dobiju jasne informacije o
              procesu servisiranja.
            </p>

            <p class="text-muted">
              Fokusirani smo na kvalitetnu dijagnostiku, redovno održavanje,
              transparentan rad i dobru komunikaciju sa klijentima.
            </p>

            <RouterLink class="btn btn-primary mt-3" to="/book-appointment">
              Zakaži termin
            </RouterLink>
          </div>

          <div class="col-lg-6">
            <div class="about-card rounded-4 shadow-sm p-4">
              <h5 class="fw-bold mb-4">
                Zašto klijenti biraju nas?
              </h5>

              <div class="about-item">
                <div class="about-icon">
                  🛠️
                </div>

                <div>
                  <h6 class="fw-bold mb-1">
                    Iskusni majstori
                  </h6>
                  <p class="text-muted mb-0">
                    Vaše vozilo pregledaju i servisiraju stručni automehaničari.
                  </p>
                </div>
              </div>

              <div class="about-item">
                <div class="about-icon">
                  📅
                </div>

                <div>
                  <h6 class="fw-bold mb-1">
                    Jednostavno zakazivanje
                  </h6>
                  <p class="text-muted mb-0">
                    Termin možete zakazati online bez pozivanja servisa.
                  </p>
                </div>
              </div>

              <div class="about-item border-0 pb-0 mb-0">
                <div class="about-icon">
                  🧾
                </div>

                <div>
                  <h6 class="fw-bold mb-1">
                    Pregledan proces
                  </h6>
                  <p class="text-muted mb-0">
                    Od prijema vozila do računa, sve je organizovano i jasno.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-5">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="fw-bold">
            Naše vrednosti
          </h2>

          <p class="text-muted mb-0">
            Trudimo se da svaki klijent dobije profesionalnu i poštenu uslugu.
          </p>
        </div>

        <div class="row g-4">
          <div class="col-md-4">
            <div class="card h-100 border-0 shadow-sm rounded-4">
              <div class="card-body p-4 text-center">
                <div class="value-icon mb-3">
                  ✅
                </div>

                <h5 class="fw-bold">
                  Pouzdanost
                </h5>

                <p class="text-muted mb-0">
                  Poštujemo dogovorene termine i jasno komuniciramo stanje vozila.
                </p>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card h-100 border-0 shadow-sm rounded-4">
              <div class="card-body p-4 text-center">
                <div class="value-icon mb-3">
                  🔍
                </div>

                <h5 class="fw-bold">
                  Transparentnost
                </h5>

                <p class="text-muted mb-0">
                  Klijent zna koja usluga se radi i šta je potrebno popraviti.
                </p>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card h-100 border-0 shadow-sm rounded-4">
              <div class="card-body p-4 text-center">
                <div class="value-icon mb-3">
                  🚗
                </div>

                <h5 class="fw-bold">
                  Kvalitet
                </h5>

                <p class="text-muted mb-0">
                  Koristimo proverene metode rada i pažljivo pristupamo svakom vozilu.
                </p>
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
</script>

<style scoped>

#hero {
    background-image: 
    linear-gradient(rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0.88)),
    url('/images/customers/landingHero2.jpg');
    background-size: cover;
}

.about-hero {
  background:
    linear-gradient(rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0.88)),
    radial-gradient(circle at top right, rgba(13, 110, 253, 0.45), transparent 35%);
}

.min-vh-40 {
  min-height: 40vh;
}

.about-card {
  background-color: #ffffff;
  border: 1px solid #e9ecef;
}

.about-item {
  display: flex;
  gap: 1rem;
  padding-bottom: 1.25rem;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid #e9ecef;
}

.about-icon {
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 14px;
  font-size: 1.5rem;
  background-color: #f1f5f9;
}

.value-icon {
  font-size: 3rem;
}
</style>