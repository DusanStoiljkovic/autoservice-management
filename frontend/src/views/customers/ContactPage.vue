<template>
  <main class="contact-page bg-body text-body">
    <section id="hero" class="contact-hero text-white">
      <div class="container py-5">
        <div class="row align-items-center min-vh-40">
          <div class="col-lg-8">
            <span class="badge text-bg-primary mb-3">
              Kontakt
            </span>

            <h1 class="display-5 fw-bold mb-3">
              Kontaktirajte naš auto servis.
            </h1>

            <p class="lead text-white-50 mb-0">
              Imate pitanje, želite savet ili želite da zakažete servis?
              Pošaljite nam poruku ili zakažite termin online.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-5 bg-body-tertiary">
      <div class="container">
        <div class="row g-5">
          <div class="col-lg-5">
            <div class="card app-card shadow-sm rounded-4 h-100">
              <div class="card-body p-4">
                <h4 class="fw-bold mb-4">
                  Informacije
                </h4>

                <div class="contact-info-item">
                  <div class="contact-icon">
                    📍
                  </div>

                  <div>
                    <h6 class="fw-bold mb-1">
                      Adresa
                    </h6>
                    <p class="text-body-secondary mb-0">
                      Ulica Auto Servisa 12, Beograd
                    </p>
                  </div>
                </div>

                <div class="contact-info-item">
                  <div class="contact-icon">
                    📞
                  </div>

                  <div>
                    <h6 class="fw-bold mb-1">
                      Telefon
                    </h6>
                    <p class="text-body-secondary mb-0">
                      +381 60 123 4567
                    </p>
                  </div>
                </div>

                <div class="contact-info-item">
                  <div class="contact-icon">
                    ✉️
                  </div>

                  <div>
                    <h6 class="fw-bold mb-1">
                      Email
                    </h6>
                    <p class="text-body-secondary mb-0">
                      autoservice@example.com
                    </p>
                  </div>
                </div>

                <div class="contact-info-item border-0 mb-0 pb-0">
                  <div class="contact-icon">
                    🕒
                  </div>

                  <div>
                    <h6 class="fw-bold mb-1">
                      Radno vreme
                    </h6>
                    <p class="text-body-secondary mb-0">
                      Ponedeljak - Petak: 08:00 - 16:00
                    </p>
                  </div>
                </div>

                <RouterLink class="btn btn-primary w-100 mt-4" to="/book-appointment">
                  Zakaži termin
                </RouterLink>
              </div>
            </div>
          </div>

          <div class="col-lg-7">
            <div class="card app-card shadow-sm rounded-4">
              <div class="card-body p-4 p-md-5">
                <h4 class="fw-bold mb-3">
                  Pošaljite poruku
                </h4>

                <p class="text-body-secondary mb-4">
                  Popunite formu, a mi ćemo vam odgovoriti u najkraćem roku.
                </p>

                <div v-if="successMessage" class="alert alert-success">
                  {{ successMessage }}
                </div>

                <form @submit.prevent="sendMessage">
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label for="fullName" class="form-label">
                        Ime i prezime
                      </label>
                      <input
                        id="fullName"
                        v-model.trim="form.fullName"
                        type="text"
                        class="form-control"
                        required
                      />
                    </div>

                    <div class="col-md-6">
                      <label for="phone" class="form-label">
                        Telefon
                      </label>
                      <input
                        id="phone"
                        v-model.trim="form.phone"
                        type="text"
                        class="form-control"
                        placeholder="+381..."
                        required
                      />
                    </div>

                    <div class="col-12">
                      <label for="email" class="form-label">
                        Email
                        <span class="text-body-secondary">(opciono)</span>
                      </label>
                      <input
                        id="email"
                        v-model.trim="form.email"
                        type="email"
                        class="form-control"
                        placeholder="vas@email.com"
                      />
                    </div>

                    <div class="col-12">
                      <label for="subject" class="form-label">
                        Naslov poruke
                      </label>
                      <input
                        id="subject"
                        v-model.trim="form.subject"
                        type="text"
                        class="form-control"
                        required
                      />
                    </div>

                    <div class="col-12">
                      <label for="message" class="form-label">
                        Poruka
                      </label>
                      <textarea
                        id="message"
                        v-model.trim="form.message"
                        class="form-control"
                        rows="5"
                        placeholder="Napišite ukratko šta vam je potrebno..."
                        required
                      ></textarea>
                    </div>
                  </div>

                  <button class="btn btn-primary btn-lg w-100 mt-4" type="submit">
                    Pošalji poruku
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div class="map-box rounded-4 shadow-sm mt-5">
          <iframe width="100%" height="650px" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/place?key=AIzaSyB2NIWI3Tv9iDPrlnowr_0ZqZWoAQydKJU&q=Belgrade&maptype=roadmap" allowfullscreen></iframe>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'

const successMessage = ref('')

const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=Belgrade&maptype=roadmap`

const form = reactive({
  fullName: '',
  phone: '',
  email: '',
  subject: '',
  message: ''
})

function sendMessage() {
  successMessage.value = 'Vaša poruka je uspešno poslata.'

  form.fullName = ''
  form.phone = ''
  form.email = ''
  form.subject = ''
  form.message = ''
}
</script>

<style scoped>
#hero {
  background-image: 
    linear-gradient(rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0.88)),
    url('/images/customers/landingHero.jpg');
  background-size: cover;
  background-position: center;
}

.min-vh-40 {
  min-height: 40vh;
}

.app-card {
  background-color: var(--bs-body-bg);
  border: 1px solid var(--bs-border-color);
  color: var(--bs-body-color);
}

.contact-info-item {
  display: flex;
  gap: 1rem;
  padding-bottom: 1.25rem;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid var(--bs-border-color);
}

.contact-icon {
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 14px;
  font-size: 1.4rem;
  background-color: var(--bs-tertiary-bg);
  border: 1px solid var(--bs-border-color);
}

.form-control {
  min-height: 46px;
  background-color: var(--bs-body-bg);
  color: var(--bs-body-color);
  border-color: var(--bs-border-color);
}

.form-control::placeholder {
  color: var(--bs-secondary-color);
}

textarea.form-control {
  min-height: 140px;
}

.map-box {
  overflow: hidden;
  background-color: var(--bs-body-bg);
  border: 1px solid var(--bs-border-color);
}

.map-box iframe {
  display: block;
}

.map-icon {
  font-size: 4rem;
}
</style>