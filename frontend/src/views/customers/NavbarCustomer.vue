<script setup lang="ts">
import { ref } from 'vue'

const isMenuOpen = ref(false)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
}
</script>

<template>
  <header class="navbar">
    <div class="navbar-container">
      <NuxtLink to="/" class="logo" @click="closeMenu">
        AutoService
      </NuxtLink>

      <nav class="desktop-nav">
        <NuxtLink to="/" class="nav-link">
          Početna
        </NuxtLink>

        <NuxtLink to="/services" class="nav-link">
          Usluge
        </NuxtLink>

        <NuxtLink to="/customer/appointments/create" class="nav-link">
          Zakazivanje
        </NuxtLink>

        <NuxtLink to="/customer/profile" class="nav-link">
          Moj profil
        </NuxtLink>
      </nav>

      <div class="desktop-actions">
        <NuxtLink to="/login" class="login-link">
          Prijava
        </NuxtLink>

        <NuxtLink to="/customer/appointments/create" class="primary-button">
          Zakaži termin
        </NuxtLink>
      </div>

      <button class="menu-button" @click="toggleMenu">
        ☰
      </button>
    </div>

    <nav v-if="isMenuOpen" class="mobile-nav">
      <NuxtLink to="/" class="mobile-link" @click="closeMenu">
        Početna
      </NuxtLink>

      <NuxtLink to="/services" class="mobile-link" @click="closeMenu">
        Usluge
      </NuxtLink>

      <NuxtLink
        to="/customer/appointments/create"
        class="mobile-link"
        @click="closeMenu"
      >
        Zakazivanje
      </NuxtLink>

      <NuxtLink to="/customer/profile" class="mobile-link" @click="closeMenu">
        Moj profil
      </NuxtLink>

      <NuxtLink to="/login" class="mobile-link" @click="closeMenu">
        Prijava
      </NuxtLink>
    </nav>
  </header>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(248, 250, 252, 0.92);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid #e2e8f0;
}

.navbar-container {
  max-width: 1180px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  color: #0f172a;
  font-size: 22px;
  font-weight: 800;
  text-decoration: none;
  letter-spacing: -0.04em;
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 28px;
}

.nav-link {
  color: #475569;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: 0.2s ease;
}

.nav-link:hover {
  color: #2563eb;
}

.desktop-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.login-link {
  color: #0f172a;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
}

.primary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0 18px;
  border-radius: 12px;
  background: #2563eb;
  color: white;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  transition: 0.2s ease;
}

.primary-button:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
}

.menu-button {
  display: none;
  border: none;
  background: transparent;
  font-size: 28px;
  cursor: pointer;
  color: #0f172a;
}

.mobile-nav {
  display: none;
  padding: 12px 24px 20px;
  border-top: 1px solid #e2e8f0;
  background: white;
}

.mobile-link {
  display: block;
  padding: 12px 0;
  color: #0f172a;
  font-weight: 700;
  text-decoration: none;
  border-bottom: 1px solid #f1f5f9;
}

.mobile-link:last-child {
  border-bottom: none;
}

.router-link-active {
  color: #2563eb;
}

@media (max-width: 900px) {
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
}
</style>