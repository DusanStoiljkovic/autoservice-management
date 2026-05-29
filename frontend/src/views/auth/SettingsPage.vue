<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Sidebar from '../components/Sidebar.vue'

type Theme = 'light' | 'dark' | 'system'

const theme = ref<Theme>('system')
const savedMessage = ref('')

function resolveSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(value: Theme) {
  const resolved = value === 'system' ? resolveSystemTheme() : value
  document.documentElement.setAttribute('data-bs-theme', resolved)
}

function selectTheme(value: Theme) {
  theme.value = value
  applyTheme(value)
  localStorage.setItem('theme', value)

  savedMessage.value = 'Tema je sačuvana.'
  window.setTimeout(() => {
    savedMessage.value = ''
  }, 2000)
}

onMounted(() => {
  const stored = localStorage.getItem('theme') as Theme | null

  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    theme.value = stored
    applyTheme(stored)
  }
})
</script>

<template>
  <div class="dashboard-layout bg-body text-body">
    <Sidebar />

    <main class="dashboard-content bg-body-tertiary">
      <div class="mb-4">
        <h1 class="h2 mb-1">
          Podešavanja
        </h1>

        <p class="text-body-secondary mb-0">
          Prilagodi izgled i opcije aplikacije.
        </p>
      </div>

      <div class="row g-4">
        <div class="col-lg-8">
          <div class="card dashboard-card shadow-sm rounded-4">
            <div class="card-body p-4">
              <h5 class="fw-bold mb-1">Izgled</h5>
              <p class="text-body-secondary mb-4">Izaberi temu aplikacije.</p>

              <div class="d-flex flex-wrap gap-3">
                <button
                  class="btn theme-btn"
                  :class="theme === 'light' ? 'btn-primary' : 'btn-outline-secondary'"
                  @click="selectTheme('light')"
                >
                  <i class="bi bi-sun me-2"></i>
                  Svetla
                </button>

                <button
                  class="btn theme-btn"
                  :class="theme === 'dark' ? 'btn-primary' : 'btn-outline-secondary'"
                  @click="selectTheme('dark')"
                >
                  <i class="bi bi-moon-stars me-2"></i>
                  Tamna
                </button>

                <button
                  class="btn theme-btn"
                  :class="theme === 'system' ? 'btn-primary' : 'btn-outline-secondary'"
                  @click="selectTheme('system')"
                >
                  <i class="bi bi-display me-2"></i>
                  Sistemska
                </button>
              </div>

              <p v-if="savedMessage" class="text-success small mb-0 mt-3">
                {{ savedMessage }}
              </p>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card dashboard-card shadow-sm rounded-4">
            <div class="card-body p-4">
              <h5 class="fw-bold mb-3">O aplikaciji</h5>

              <div class="detail-item">
                <span class="text-body-secondary">Aplikacija</span>
                <strong>AutoService</strong>
              </div>

              <div class="detail-item border-0 pb-0 mb-0">
                <span class="text-body-secondary">Verzija</span>
                <strong>1.0.0</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.dashboard-layout {
  min-height: 100vh;
  display: flex;
}

.dashboard-content {
  flex: 1;
  min-width: 0;
  padding: 1.5rem;
}

.dashboard-card {
  background-color: var(--bs-body-bg);
  border: 1px solid var(--bs-border-color);
  color: var(--bs-body-color);
}

.theme-btn {
  min-width: 130px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--bs-border-color);
}

@media (max-width: 768px) {
  .dashboard-layout {
    flex-direction: column;
  }

  .dashboard-content {
    padding: 1rem;
  }
}
</style>