<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import axios from 'axios'

const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
const role = computed(() => user.value.role)

// Gde vodi "Dashboard" link, po roli
const dashboardPath = computed(() => {
  if (role.value === 'MECHANIC') return '/dashboard/mechanic'
  if (role.value === 'RECEPTIONIST') return '/dashboard/receptionist'
  if (role.value === 'MANAGER') return '/dashboard/manager'
  return '/dashboard'
})

// Da li trenutna rola sme da vidi stavku
function allowed(roles: string[]) {
  return roles.includes(role.value)
}

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
  delete axios.defaults.headers.common['Authorization']
  window.location.href = '/login'
}
</script>

<template>
  <aside class="sidebar bg-body-tertiary border-end">
    <div class="sidebar-header px-3 py-4 border-bottom">
      <RouterLink class="sidebar-brand text-decoration-none text-body fw-bold" :to="dashboardPath">
        AutoService
      </RouterLink>

      <p v-if="role" class="text-body-secondary small mb-0 mt-1">
        {{ role }} panel
      </p>
    </div>

    <div class="sidebar-body p-3">
      <ul class="nav flex-column gap-1">
        <!-- Dashboard - svi, ali vodi po roli -->
        <li class="nav-item">
          <RouterLink class="nav-link d-flex align-items-center gap-2" :to="dashboardPath">
            <i class="bi bi-speedometer2"></i>
            Dashboard
          </RouterLink>
        </li>

        <!-- Klijenti - admin, menadžer, recepcioner -->
        <li v-if="allowed(['ADMIN', 'MANAGER', 'RECEPTIONIST'])" class="nav-item">
          <RouterLink class="nav-link d-flex align-items-center gap-2" to="/dashboard/customers">
            <i class="bi bi-people"></i>
            Klijenti
          </RouterLink>
        </li>

        <!-- Vozila - admin, menadžer, recepcioner -->
        <li v-if="allowed(['ADMIN', 'MANAGER', 'RECEPTIONIST'])" class="nav-item">
          <RouterLink class="nav-link d-flex align-items-center gap-2" to="/dashboard/vehicles">
            <i class="bi bi-car-front"></i>
            Vozila
          </RouterLink>
        </li>

        <!-- Termini - admin, menadžer, recepcioner -->
        <li v-if="allowed(['ADMIN', 'MANAGER', 'RECEPTIONIST'])" class="nav-item">
          <RouterLink class="nav-link d-flex align-items-center gap-2" to="/dashboard/appointments">
            <i class="bi bi-calendar-event"></i>
            Termini
          </RouterLink>
        </li>

        <!-- Usluge (cenovnik) - admin, menadžer -->
        <li v-if="allowed(['ADMIN', 'MANAGER'])" class="nav-item">
          <RouterLink class="nav-link d-flex align-items-center gap-2" to="/dashboard/services">
            <i class="bi bi-tools"></i>
            Usluge
          </RouterLink>
        </li>

        <!-- Radni nalozi - admin, menadžer, recepcioner (majstor ima svoj prikaz) -->
        <li v-if="allowed(['ADMIN', 'MANAGER', 'RECEPTIONIST'])" class="nav-item">
          <RouterLink class="nav-link d-flex align-items-center gap-2" to="/dashboard/repair-orders">
            <i class="bi bi-clipboard-check"></i>
            Radni nalozi
          </RouterLink>
        </li>

        <!-- Fakture - admin, menadžer, recepcioner -->
        <li v-if="allowed(['ADMIN', 'MANAGER', 'RECEPTIONIST'])" class="nav-item">
          <RouterLink class="nav-link d-flex align-items-center gap-2" to="/dashboard/invoices">
            <i class="bi bi-receipt"></i>
            Fakture
          </RouterLink>
        </li>

        <!-- Zaposleni - samo admin -->
        <li v-if="allowed(['ADMIN'])" class="nav-item">
          <RouterLink class="nav-link d-flex align-items-center gap-2" to="/dashboard/users/new">
            <i class="bi bi-person-badge"></i>
            Zaposleni
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
          <button class="nav-link logout-btn d-flex align-items-center gap-2 w-100" @click="logout">
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