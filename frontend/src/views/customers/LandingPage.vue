<script setup lang="ts">
import { ref } from 'vue'

const isMenuOpen = ref(false)

const services = [
  {
    icon: '🔍',
    title: 'Dijagnostika vozila',
    description: 'Brza provera problema, čitanje grešaka i predlog daljih koraka za popravku.',
  },
  {
    icon: '🛠️',
    title: 'Redovan servis',
    description: 'Zamena ulja, filtera, kontrola kočnica i osnovna provera ispravnosti vozila.',
  },
  {
    icon: '⚙️',
    title: 'Popravke kvarova',
    description: 'Prijava problema, evidencija kvara i praćenje statusa popravke vozila.',
  },
]

const steps = [
  {
    number: '01',
    title: 'Izaberite termin',
    description: 'Odaberite datum i vreme koje vam najviše odgovara za dolazak u servis.',
  },
  {
    number: '02',
    title: 'Unesite podatke',
    description: 'Opišite problem, unesite podatke o vozilu i pošaljite zahtev za zakazivanje.',
  },
  {
    number: '03',
    title: 'Pratite status',
    description: 'Nakon zakazivanja možete pratiti termin, servis i tok popravke vozila.',
  },
]

const benefits = [
  'Brzo online zakazivanje',
  'Pregled statusa popravke',
  'Evidencija vozila i termina',
  'Jednostavna komunikacija sa servisom',
]

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
}
</script>

<template>
  <div class="landing-page">
    <header class="navbar">
      <div class="navbar-container">
        <NuxtLink to="/" class="logo" @click="closeMenu">
          <span class="logo-mark">A</span>
          <span>AutoService</span>
        </NuxtLink>

        <nav class="desktop-nav" aria-label="Glavna navigacija">
          <NuxtLink to="/" class="nav-link">
            Početna
          </NuxtLink>

          <a href="#services" class="nav-link">
            Usluge
          </a>

          <a href="#process" class="nav-link">
            Kako funkcioniše
          </a>

          <NuxtLink to="/login" class="nav-link">
            Prijava
          </NuxtLink>
        </nav>

        <div class="desktop-actions">
          <NuxtLink to="/customer/appointments/create" class="navbar-cta">
            Zakaži termin
          </NuxtLink>
        </div>

        <button
          class="menu-button"
          type="button"
          aria-label="Otvori meni"
          @click="toggleMenu"
        >
          ☰
        </button>
      </div>

      <nav v-if="isMenuOpen" class="mobile-nav" aria-label="Mobilna navigacija">
        <NuxtLink to="/" class="mobile-link" @click="closeMenu">
          Početna
        </NuxtLink>

        <a href="#services" class="mobile-link" @click="closeMenu">
          Usluge
        </a>

        <a href="#process" class="mobile-link" @click="closeMenu">
          Kako funkcioniše
        </a>

        <NuxtLink to="/login" class="mobile-link" @click="closeMenu">
          Prijava
        </NuxtLink>

        <NuxtLink
          to="/customer/appointments/create"
          class="mobile-cta"
          @click="closeMenu"
        >
          Zakaži termin
        </NuxtLink>
      </nav>
    </header>

    <main>
      <section class="hero">
        <div class="hero-overlay"></div>

        <div class="hero-container">
          <div class="hero-content">
            <p class="eyebrow">Auto Service Management</p>

            <h1>
              Zakažite servis vozila brzo i jednostavno
            </h1>

            <p class="hero-description">
              Online zakazivanje termina za pregled, servis i popravku vozila.
              Pratite svoje termine i status popravke na jednom mestu.
            </p>

            <div class="hero-actions">
              <NuxtLink to="/customer/appointments/create" class="primary-button">
                Zakaži termin
              </NuxtLink>

              <NuxtLink to="/login" class="secondary-button">
                Prijavi se
              </NuxtLink>
            </div>

            <div class="hero-stats" aria-label="Prednosti servisa">
              <div>
                <strong>24/7</strong>
                <span>Online zahtev</span>
              </div>

              <div>
                <strong>3</strong>
                <span>Koraka do termina</span>
              </div>

              <div>
                <strong>100%</strong>
                <span>Pregledno praćenje</span>
              </div>
            </div>
          </div>

          <aside class="hero-card" aria-label="Brza rezervacija termina">
            <div class="card-header">
              <span class="status-dot"></span>
              <span>Dostupno danas</span>
            </div>

            <h2>Brza rezervacija termina</h2>

            <div class="appointment-preview">
              <div>
                <span>Usluga</span>
                <strong>Pregled vozila</strong>
              </div>

              <div>
                <span>Trajanje</span>
                <strong>30-60 min</strong>
              </div>

              <div>
                <span>Status</span>
                <strong>Slobodni termini</strong>
              </div>
            </div>

            <NuxtLink to="/customer/appointments/create" class="card-button">
              Nastavi na zakazivanje
            </NuxtLink>
          </aside>
        </div>
      </section>

      <section class="benefits-strip">
        <div class="container benefits-grid">
          <div
            v-for="benefit in benefits"
            :key="benefit"
            class="benefit-item"
          >
            <span>✓</span>
            <p>{{ benefit }}</p>
          </div>
        </div>
      </section>

      <section id="services" class="section">
        <div class="container">
          <div class="section-header centered">
            <p class="eyebrow">Usluge</p>
            <h2>Šta možete zakazati?</h2>
            <p>
              Izaberite vrstu servisa, pošaljite zahtev i servis će obraditi vaš termin.
            </p>
          </div>

          <div class="services-grid">
            <article
              v-for="service in services"
              :key="service.title"
              class="service-card"
            >
              <div class="service-icon">
                {{ service.icon }}
              </div>

              <h3>{{ service.title }}</h3>
              <p>{{ service.description }}</p>
            </article>
          </div>
        </div>
      </section>

      <section id="process" class="section process-section">
        <div class="container">
          <div class="section-header">
            <p class="eyebrow">Kako funkcioniše</p>
            <h2>Zakazivanje u tri jednostavna koraka</h2>
            <p>
              Cilj aplikacije je da korisnik bez telefonskog poziva može da pošalje zahtev
              za termin i kasnije prati status svoje popravke.
            </p>
          </div>

          <div class="steps-grid">
            <article
              v-for="step in steps"
              :key="step.number"
              class="step-card"
            >
              <span class="step-number">{{ step.number }}</span>
              <h3>{{ step.title }}</h3>
              <p>{{ step.description }}</p>
            </article>
          </div>
        </div>
      </section>

      <section class="section info-section">
        <div class="container info-grid">
          <div class="info-content">
            <p class="eyebrow">Za korisnike</p>

            <h2>
              Sve informacije o servisu vozila na jednom mestu
            </h2>

            <p>
              Nakon zakazivanja, korisnik može da ima pregled svojih termina,
              vozila i radnih naloga. Servis sa druge strane lakše organizuje posao,
              mehaničare i status popravki.
            </p>

            <NuxtLink to="/customer/appointments/create" class="primary-button">
              Započni zakazivanje
            </NuxtLink>
          </div>

          <div class="info-panel">
            <div class="panel-row">
              <span>Termin</span>
              <strong>Pregled vozila</strong>
            </div>

            <div class="panel-row">
              <span>Vozilo</span>
              <strong>Audi A4 2.0 TDI</strong>
            </div>

            <div class="panel-row">
              <span>Status</span>
              <strong class="status-text">Čeka potvrdu</strong>
            </div>

            <div class="panel-row">
              <span>Opis problema</span>
              <strong>Nepravilan rad motora</strong>
            </div>
          </div>
        </div>
      </section>

      <section class="final-cta">
        <div class="container cta-container">
          <div>
            <p class="eyebrow">Online zakazivanje</p>

            <h2>
              Spremni ste da zakažete servis?
            </h2>

            <p>
              Pošaljite zahtev za termin i servis će obraditi vašu prijavu.
            </p>
          </div>

          <NuxtLink to="/customer/appointments/create" class="cta-button">
            Zakaži termin
          </NuxtLink>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
*,
*::before,
*::after {
  box-sizing: border-box;
}

.landing-page {
  min-height: 100vh;
  background: #f8fafc;
  color: #0f172a;
}

.container {
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
}

.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.92);
  border-bottom: 1px solid rgba(226, 232, 240, 0.9);
  backdrop-filter: blur(16px);
}

.navbar-container {
  width: min(1180px, calc(100% - 48px));
  min-height: 72px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #0f172a;
  font-size: 20px;
  font-weight: 900;
  text-decoration: none;
  letter-spacing: -0.04em;
}

.logo-mark {
  display: inline-flex;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #2563eb;
  color: white;
  font-size: 18px;
  font-weight: 900;
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 28px;
}

.nav-link {
  color: #475569;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: #2563eb;
}

.desktop-actions {
  display: flex;
  align-items: center;
}

.navbar-cta {
  display: inline-flex;
  min-height: 42px;
  align-items: center;
  justify-content: center;
  padding: 0 18px;
  border-radius: 999px;
  background: #2563eb;
  color: white;
  font-size: 14px;
  font-weight: 800;
  text-decoration: none;
  transition: 0.2s ease;
}

.navbar-cta:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
}

.menu-button {
  display: none;
  border: none;
  background: transparent;
  color: #0f172a;
  font-size: 30px;
  cursor: pointer;
}

.mobile-nav {
  display: none;
  padding: 10px 24px 22px;
  background: white;
  border-top: 1px solid #e2e8f0;
}

.mobile-link,
.mobile-cta {
  display: block;
  padding: 14px 0;
  color: #0f172a;
  font-weight: 800;
  text-decoration: none;
  border-bottom: 1px solid #f1f5f9;
}

.mobile-cta {
  margin-top: 12px;
  padding: 14px 18px;
  border-radius: 14px;
  background: #2563eb;
  color: white;
  text-align: center;
  border-bottom: none;
}

.hero {
  position: relative;
  min-height: calc(100vh - 72px);
  display: flex;
  align-items: center;
  overflow: hidden;
  background-image: url('/images/customers/landingHero.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      90deg,
      rgba(2, 6, 23, 0.96) 0%,
      rgba(15, 23, 42, 0.88) 42%,
      rgba(15, 23, 42, 0.58) 72%,
      rgba(15, 23, 42, 0.35) 100%
    );
}

.hero-container {
  position: relative;
  z-index: 2;
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
  padding: 92px 0;
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 54px;
  align-items: center;
}

.hero-content {
  max-width: 760px;
}

.eyebrow {
  margin: 0 0 14px;
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.hero .eyebrow,
.final-cta .eyebrow {
  color: #93c5fd;
}

.hero h1 {
  margin: 0;
  color: white;
  font-size: clamp(44px, 6vw, 74px);
  line-height: 0.98;
  letter-spacing: -0.065em;
}

.hero-description {
  max-width: 620px;
  margin: 26px 0 0;
  color: #e2e8f0;
  font-size: 19px;
  line-height: 1.75;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 34px;
}

.primary-button,
.secondary-button,
.card-button,
.cta-button {
  display: inline-flex;
  min-height: 50px;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 900;
  text-decoration: none;
  transition: 0.2s ease;
}

.primary-button,
.card-button,
.cta-button {
  background: #2563eb;
  color: white;
}

.primary-button:hover,
.card-button:hover,
.cta-button:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
}

.secondary-button {
  background: rgba(255, 255, 255, 0.96);
  color: #0f172a;
}

.secondary-button:hover {
  background: white;
  transform: translateY(-2px);
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(3, max-content);
  gap: 28px;
  margin-top: 44px;
}

.hero-stats div {
  display: grid;
  gap: 4px;
}

.hero-stats strong {
  color: white;
  font-size: 26px;
  line-height: 1;
}

.hero-stats span {
  color: #cbd5e1;
  font-size: 14px;
}

.hero-card {
  justify-self: end;
  width: min(100%, 420px);
  padding: 30px;
  border-radius: 30px;
  background: rgba(15, 23, 42, 0.76);
  color: white;
  box-shadow: 0 32px 90px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.16);
}

.card-header {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(34, 197, 94, 0.12);
  color: #dcfce7;
  font-size: 14px;
  font-weight: 800;
}

.status-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.14);
}

.hero-card h2 {
  margin: 28px 0;
  font-size: 30px;
  line-height: 1.15;
  letter-spacing: -0.04em;
}

.appointment-preview {
  display: grid;
  gap: 14px;
  margin-bottom: 22px;
}

.appointment-preview div {
  padding: 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.08);
}

.appointment-preview span {
  display: block;
  margin-bottom: 6px;
  color: #94a3b8;
  font-size: 14px;
}

.appointment-preview strong {
  color: white;
}

.card-button {
  width: 100%;
}

.benefits-strip {
  position: relative;
  z-index: 3;
  margin-top: -34px;
  padding-bottom: 46px;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 76px;
  padding: 18px;
  border-radius: 18px;
  background: white;
  border: 1px solid #e2e8f0;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
}

.benefit-item span {
  display: inline-flex;
  width: 26px;
  height: 26px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #dcfce7;
  color: #15803d;
  font-weight: 900;
}

.benefit-item p {
  margin: 0;
  color: #334155;
  font-weight: 800;
}

.section {
  padding: 72px 0;
}

.section-header {
  max-width: 680px;
  margin-bottom: 34px;
}

.section-header.centered {
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

.section-header h2 {
  margin: 0;
  color: #0f172a;
  font-size: clamp(32px, 4vw, 46px);
  line-height: 1.08;
  letter-spacing: -0.05em;
}

.section-header p {
  margin: 16px 0 0;
  color: #64748b;
  font-size: 17px;
  line-height: 1.75;
}

.services-grid,
.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

.service-card,
.step-card {
  padding: 30px;
  border-radius: 26px;
  background: white;
  border: 1px solid #e2e8f0;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.06);
  transition: 0.2s ease;
}

.service-card:hover,
.step-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.1);
}

.service-icon {
  display: inline-flex;
  width: 54px;
  height: 54px;
  align-items: center;
  justify-content: center;
  margin-bottom: 22px;
  border-radius: 18px;
  background: #eff6ff;
  font-size: 26px;
}

.service-card h3,
.step-card h3 {
  margin: 0 0 12px;
  color: #0f172a;
  font-size: 21px;
  letter-spacing: -0.02em;
}

.service-card p,
.step-card p {
  margin: 0;
  color: #64748b;
  line-height: 1.75;
}

.process-section {
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.12), transparent 34%),
    #f1f5f9;
}

.step-number {
  display: inline-flex;
  margin-bottom: 22px;
  color: #2563eb;
  font-size: 22px;
  font-weight: 950;
}

.info-section {
  background: white;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 0.85fr;
  gap: 54px;
  align-items: center;
}

.info-content h2 {
  max-width: 620px;
  margin: 0;
  color: #0f172a;
  font-size: clamp(32px, 4vw, 48px);
  line-height: 1.08;
  letter-spacing: -0.05em;
}

.info-content p {
  max-width: 620px;
  margin: 20px 0 28px;
  color: #64748b;
  font-size: 17px;
  line-height: 1.8;
}

.info-panel {
  padding: 28px;
  border-radius: 28px;
  background: #0f172a;
  color: white;
  box-shadow: 0 28px 70px rgba(15, 23, 42, 0.22);
}

.panel-row {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  padding: 18px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.panel-row:first-child {
  padding-top: 0;
}

.panel-row:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.panel-row span {
  color: #94a3b8;
}

.panel-row strong {
  text-align: right;
}

.status-text {
  color: #93c5fd;
}

.final-cta {
  padding: 74px 0;
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.94), rgba(30, 64, 175, 0.9)),
    url('/images/customers/landingHero.jpg');
  background-size: cover;
  background-position: center;
  color: white;
}

.cta-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 36px;
}

.final-cta h2 {
  max-width: 620px;
  margin: 0;
  font-size: clamp(32px, 4vw, 48px);
  line-height: 1.08;
  letter-spacing: -0.05em;
}

.final-cta p {
  max-width: 620px;
  margin: 16px 0 0;
  color: #dbeafe;
  font-size: 17px;
  line-height: 1.7;
}

.cta-button {
  flex-shrink: 0;
  background: white;
  color: #0f172a;
}

.cta-button:hover {
  background: #eff6ff;
}

@media (max-width: 980px) {
  .desktop-nav,
  .desktop-actions {
    display: none;
  }

  .menu-button {
    display: block;
  }

  .mobile-nav {
    display: block;
  }

  .hero {
    min-height: auto;
  }

  .hero-overlay {
    background:
      linear-gradient(
        180deg,
        rgba(2, 6, 23, 0.96) 0%,
        rgba(15, 23, 42, 0.9) 60%,
        rgba(15, 23, 42, 0.78) 100%
      );
  }

  .hero-container {
    grid-template-columns: 1fr;
    padding: 72px 0;
  }

  .hero-card {
    justify-self: stretch;
    width: 100%;
  }

  .benefits-grid,
  .services-grid,
  .steps-grid,
  .info-grid {
    grid-template-columns: 1fr;
  }

  .benefits-strip {
    margin-top: 0;
    padding-top: 24px;
  }

  .cta-container {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 620px) {
  .container,
  .navbar-container,
  .hero-container {
    width: min(100% - 36px, 1180px);
  }

  .navbar-container {
    min-height: 66px;
  }

  .logo {
    font-size: 18px;
  }

  .logo-mark {
    width: 34px;
    height: 34px;
  }

  .hero-container {
    padding: 58px 0;
  }

  .hero h1 {
    font-size: 38px;
  }

  .hero-description {
    font-size: 16px;
  }

  .hero-actions {
    display: grid;
  }

  .primary-button,
  .secondary-button,
  .cta-button {
    width: 100%;
  }

  .hero-stats {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .hero-card,
  .service-card,
  .step-card,
  .info-panel {
    padding: 24px;
    border-radius: 22px;
  }

  .section {
    padding: 56px 0;
  }

  .panel-row {
    flex-direction: column;
    gap: 6px;
  }

  .panel-row strong {
    text-align: left;
  }

  .final-cta {
    padding: 58px 0;
  }
}
</style>