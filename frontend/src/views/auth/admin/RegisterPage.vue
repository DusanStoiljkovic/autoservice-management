<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Sidebar from '../../components/Sidebar.vue'

const API_BASE_URL = import.meta.env.VITE_API_URL

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const role = ref('')

const roles = ref<string[]>([])
const errorMessage = ref('')
const successMessage = ref('')
const loading = ref(false)

const roleLabels: Record<string, string> = {
  ADMIN: 'Administrator',
  MANAGER: 'Menadžer',
  MECHANIC: 'Majstor',
  RECEPTIONIST: 'Recepcioner'
}

function roleLabel(value: string) {
  return roleLabels[value] ?? value
}

async function fetchRoles() {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/roles`)
    roles.value = response.data

    role.value = roles.value.includes('RECEPTIONIST') ? 'RECEPTIONIST' : (roles.value[0] ?? '')
  } catch (error) {
    console.error('Greška prilikom učitavanja rola:', error)
    errorMessage.value = 'Role trenutno ne mogu da se učitaju.'
  }
}

async function createEmployee() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!firstName.value.trim() || !lastName.value.trim() || !email.value.trim() || !password.value) {
    errorMessage.value = 'Popuni sva polja.'
    return
  }

  if (!role.value) {
    errorMessage.value = 'Izaberi rolu.'
    return
  }

  if (password.value.length < 6) {
    errorMessage.value = 'Lozinka mora imati bar 6 karaktera.'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Lozinke se ne poklapaju.'
    return
  }

  try {
    loading.value = true

    await axios.post(`${API_BASE_URL}/auth/register`, {
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      email: email.value.trim(),
      password: password.value,
      role: role.value
    })

    // VAŽNO: ne diramo localStorage / sesiju.
    // Admin pravi zaposlenog - ne želimo da se admin izloguje u novi nalog.
    successMessage.value = `Zaposleni ${firstName.value} ${lastName.value} je kreiran.`

    // reset forme
    firstName.value = ''
    lastName.value = ''
    email.value = ''
    password.value = ''
    confirmPassword.value = ''
    role.value = roles.value.includes('RECEPTIONIST') ? 'RECEPTIONIST' : (roles.value[0] ?? '')
  } catch (error: any) {
    console.error('Greška prilikom kreiranja zaposlenog:', error)
    errorMessage.value = error.response?.data?.message || 'Zaposleni ne može da se kreira.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchRoles)
</script>

<template>
  <div class="dashboard-layout bg-body text-body">
    <Sidebar />

    <main class="dashboard-content bg-body-tertiary">
      <div class="mb-4">
        <h1 class="h2 mb-1">Novi zaposleni</h1>
        <p class="text-body-secondary mb-0">Kreiraj nalog za zaposlenog i dodeli mu rolu.</p>
      </div>

      <div class="row">
        <div class="col-lg-7 col-xl-6">
          <div class="card dashboard-card shadow-sm rounded-4">
            <div class="card-body p-4">
              <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
              <div v-if="successMessage" class="alert alert-success">{{ successMessage }}</div>

              <div class="row g-3">
                <div class="col-sm-6">
                  <label class="form-label">Ime</label>
                  <input v-model="firstName" type="text" class="form-control" />
                </div>

                <div class="col-sm-6">
                  <label class="form-label">Prezime</label>
                  <input v-model="lastName" type="text" class="form-control" />
                </div>

                <div class="col-12">
                  <label class="form-label">Email</label>
                  <input v-model="email" type="email" class="form-control" autocomplete="off" />
                </div>

                <div class="col-12">
                  <label class="form-label">Rola</label>
                  <select v-model="role" class="form-select">
                    <option value="" disabled>Izaberi rolu...</option>
                    <option v-for="r in roles" :key="r" :value="r">
                      {{ roleLabel(r) }}
                    </option>
                  </select>
                </div>

                <div class="col-sm-6">
                  <label class="form-label">Lozinka</label>
                  <input v-model="password" type="password" class="form-control" autocomplete="new-password" />
                </div>

                <div class="col-sm-6">
                  <label class="form-label">Potvrdi lozinku</label>
                  <input v-model="confirmPassword" type="password" class="form-control" autocomplete="new-password" />
                </div>
              </div>

              <div class="d-flex justify-content-end mt-4">
                <button class="btn btn-primary" :disabled="loading" @click="createEmployee">
                  {{ loading ? 'Kreiranje...' : 'Kreiraj zaposlenog' }}
                </button>
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

@media (max-width: 768px) {
  .dashboard-layout {
    flex-direction: column;
  }

  .dashboard-content {
    padding: 1rem;
  }
}
</style>