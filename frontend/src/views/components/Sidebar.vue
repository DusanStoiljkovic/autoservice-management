<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <aside class="sidebar bg-body-tertiary border-end">
    <div class="sidebar-header px-3 py-4 border-bottom">
      <RouterLink class="sidebar-brand text-decoration-none text-body fw-bold" to="/dashboard">
        AutoService
      </RouterLink>

      <p class="text-body-secondary small mb-0 mt-1">
        Panel za majstora
      </p>
    </div>

    <div class="sidebar-body p-3">
      <ul class="nav flex-column gap-1">
        <li class="nav-item">
          <RouterLink class="nav-link d-flex align-items-center gap-2" to="/dashboard">
            <i class="bi bi-speedometer2"></i>
            Dashboard
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink class="nav-link d-flex align-items-center gap-2" to="/dashboard/customers">
            <i class="bi bi-people"></i>
            Klijenti
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink class="nav-link d-flex align-items-center gap-2" to="/dashboard/vehicles">
            <i class="bi bi-car-front"></i>
            Vozila
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink class="nav-link d-flex align-items-center gap-2" to="/dashboard/appointments">
            <i class="bi bi-calendar-event"></i>
            Termini
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink class="nav-link d-flex align-items-center gap-2" to="/dashboard/services">
            <i class="bi bi-tools"></i>
            Usluge
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink class="nav-link d-flex align-items-center gap-2" to="/dashboard/repair-orders">
            <i class="bi bi-clipboard-check"></i>
            Radni nalozi
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink class="nav-link d-flex align-items-center gap-2" to="/dashboard/invoices">
            <i class="bi bi-receipt"></i>
            Fakture
          </RouterLink>
        </li>
      </ul>

      <hr class="my-4" />

      <ul class="nav flex-column gap-1">
        <li class="nav-item">
          <RouterLink class="nav-link d-flex align-items-center gap-2" to="/dashboard/settings">
            <i class="bi bi-gear"></i>
            Podešavanja
          </RouterLink>
        </li>

        <li class="nav-item">
          <button class="nav-link logout-btn d-flex align-items-center gap-2 w-100">
            <i class="bi bi-box-arrow-right"></i>
            Odjavi se
          </button>
        </li>
      </ul>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 260px;
  min-height: 100vh;
  flex-shrink: 0;
}

.sidebar-brand {
  font-size: 1.2rem;
  letter-spacing: 0.3px;
}

.nav-link {
  color: var(--bs-body-color);
  border-radius: 10px;
  padding: 0.65rem 0.85rem;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.nav-link:hover {
  background-color: var(--bs-tertiary-bg);
  color: var(--bs-primary);
}

.nav-link.router-link-active {
  background-color: var(--bs-primary);
  color: #ffffff;
}

.logout-btn {
  border: 0;
  background: transparent;
  text-align: left;
}

hr {
  border-color: var(--bs-border-color);
  opacity: 1;
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    min-height: auto;
  }
}
</style>