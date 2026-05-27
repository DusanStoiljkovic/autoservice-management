<template>
  <nav class="navbar navbar-expand-lg bg-body border-bottom shadow-sm">
    <div class="container">
      <RouterLink class="navbar-brand fw-bold text-body" to="/">
        AutoService
      </RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#customerNavbar"
        aria-controls="customerNavbar"
        aria-expanded="false"
        aria-label="Otvori navigaciju"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div id="customerNavbar" class="collapse navbar-collapse">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/">
              Početna
            </RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink class="nav-link" to="/services">
              Usluge
            </RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink class="nav-link" to="/book-appointment">
              Zakazivanje
            </RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink class="nav-link" to="/about">
              O nama
            </RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink class="nav-link" to="/contact">
              Kontakt
            </RouterLink>
          </li>

          <li class="nav-item ms-lg-3 mt-2 mt-lg-0">
            <RouterLink class="btn btn-outline-primary btn-sm" to="/login">
              Prijava za majstora
            </RouterLink>
          </li>

          <li class="nav-item ms-lg-2 mt-2 mt-lg-0">
            <RouterLink class="btn btn-primary btn-sm" to="/book-appointment">
              Zakaži termin
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.navbar-brand {
  letter-spacing: 0.3px;
}

.nav-link.router-link-active {
  color: var(--bs-primary);
  font-weight: 600;
}

.nav-link {
  transition: color 0.2s ease;
}
</style>