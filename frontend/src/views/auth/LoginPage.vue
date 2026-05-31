<script setup lang="ts">
import axios from 'axios'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()
const API_BASE_URL = import.meta.env.VITE_API_URL

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

async function handleLogin() {
  errorMessage.value = ''
  loading.value = true

  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: email.value.trim(),
      password: password.value
    })

    const { user, accessToken, refreshToken } = response.data

    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('token', accessToken)
    localStorage.setItem('refreshToken', refreshToken)

    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

    router.push('/dashboard')
  } catch (error) {
    errorMessage.value = 'Neispravna email adresa ili lozinka.'
  } finally {
    loading.value = false
  }
}



</script>

<template>
  <div class="auth-page d-flex align-items-center justify-content-center py-5 bg-body-tertiary">
    <main class="form-signin w-100">
      <form class="auth-card d-flex flex-column gap-2 rounded-4 shadow-sm p-4">
        <div class="text-center mb-3">
          <div class="auth-icon mx-auto mb-3">
            🔐
          </div>

          <h1 class="h3 mb-1 fw-normal">
            Prijava
          </h1>

          <p class="text-body-secondary mb-0">
            Prijavite se za pristup sistemu auto servisa.
          </p>
        </div>

        <div class="form-floating">
          <input
            type="email"
            class="form-control"
            id="floatingInput"
            v-model="email"
          >
          <label for="floatingInput">Email adresa</label>
        </div>

        <div class="form-floating">
          <input
            type="password"
            class="form-control"
            id="floatingPassword"
            v-model="password"
          >
          <label for="floatingPassword">Lozinka</label>
        </div>

        <div class="form-check text-start my-3">
          <input
            class="form-check-input"
            type="checkbox"
            value="remember-me"
            id="checkDefault"
          >
          <label class="form-check-label" for="checkDefault">
            Zapamti me
          </label>

          <label class="error-message text-danger mt-3">
            {{ errorMessage }}
          </label>
        </div>

        <button class="btn btn-primary w-100 py-2" type="submit" @click="handleLogin" :disabled="loading">
          Prijavi se
        </button>

        <p class="mt-4 mb-0 text-body-secondary text-center">
          © AutoService
        </p>
      </form>
    </main>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.auth-page {
  min-height: 75vh;
}

.form-signin {
  max-width: 380px;
  padding: 1rem;
}

.auth-card {
  background-color: var(--bs-body-bg);
  border: 1px solid var(--bs-border-color);
  color: var(--bs-body-color);
}

.auth-icon {
  width: 64px;
  height: 64px;
  display: grid;
  place-items: center;
  border-radius: 18px;
  font-size: 2rem;
  background-color: var(--bs-tertiary-bg);
  border: 1px solid var(--bs-border-color);
}

.form-control {
  background-color: var(--bs-body-bg);
  color: var(--bs-body-color);
  border-color: var(--bs-border-color);
}

.form-control::placeholder {
  color: var(--bs-secondary-color);
}

.form-check-input {
  border-color: var(--bs-border-color);
}
</style>