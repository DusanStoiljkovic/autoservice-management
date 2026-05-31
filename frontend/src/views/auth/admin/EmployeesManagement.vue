<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import Sidebar from '../../components/Sidebar.vue'

const API_BASE_URL = import.meta.env.VITE_API_URL

const currentUser = JSON.parse(localStorage.getItem('user') || 'null')

const employees = ref<any[]>([])
const roles = ref<string[]>([])
const loading = ref(false)
const errorMessage = ref('')
const roleFilter = ref('ALL')

const showModal = ref(false)
const editingId = ref<number | null>(null)
const saving = ref(false)
const formError = ref('')

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  role: '',
  password: '',
  confirmPassword: ''
})

const roleLabels: Record<string, string> = {
  ADMIN: 'Administrator',
  MANAGER: 'Menadžer',
  MECHANIC: 'Majstor',
  RECEPTIONIST: 'Recepcioner'
}

function roleLabel(value: string) {
  return roleLabels[value] ?? value
}

const filteredEmployees = computed(() => {
  if (roleFilter.value === 'ALL') {
    return employees.value
  }
  return employees.value.filter((emp) => emp.role === roleFilter.value)
})

async function fetchData() {
  try {
    loading.value = true
    errorMessage.value = ''

    const [usersRes, rolesRes] = await Promise.all([
      axios.get(`${API_BASE_URL}/users/all`),
      axios.get(`${API_BASE_URL}/users/roles`)
    ])

    employees.value = usersRes.data
    roles.value = rolesRes.data
  } catch (error) {
    console.error('Greška prilikom učitavanja zaposlenih:', error)
    errorMessage.value = 'Zaposleni trenutno ne mogu da se učitaju.'
  } finally {
    loading.value = false
  }
}

function openEdit(employee: any) {
  editingId.value = employee.id
  formError.value = ''
  form.value = {
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.email,
    role: employee.role,
    password: '',
    confirmPassword: ''
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function saveEmployee() {
  if (!form.value.firstName.trim() || !form.value.lastName.trim() || !form.value.email.trim()) {
    formError.value = 'Ime, prezime i email su obavezni.'
    return
  }

  if (!form.value.role) {
    formError.value = 'Izaberi rolu.'
    return
  }

  // Lozinka je opciona pri izmeni - menja se samo ako je uneta
  if (form.value.password) {
    if (form.value.password.length < 6) {
      formError.value = 'Lozinka mora imati bar 6 karaktera.'
      return
    }
    if (form.value.password !== form.value.confirmPassword) {
      formError.value = 'Lozinke se ne poklapaju.'
      return
    }
  }

  // Admin ne sme sam sebi da promeni rolu (da se ne zakljuca)
  if (editingId.value === currentUser?.id && form.value.role !== currentUser?.role) {
    formError.value = 'Ne možeš menjati sopstvenu rolu.'
    return
  }

  try {
    saving.value = true
    formError.value = ''

    const payload: Record<string, any> = {
      firstName: form.value.firstName.trim(),
      lastName: form.value.lastName.trim(),
      email: form.value.email.trim(),
      role: form.value.role
    }

    // šaljemo lozinku samo ako je admin uneo novu
    if (form.value.password) {
      payload.password = form.value.password
    }

    await axios.patch(`${API_BASE_URL}/users/${editingId.value}`, payload)

    showModal.value = false
    await fetchData()
  } catch (error: any) {
    console.error('Greška prilikom čuvanja zaposlenog:', error)
    formError.value = error.response?.data?.message || 'Zaposleni ne može da se sačuva.'
  } finally {
    saving.value = false
  }
}

async function deleteEmployee(employee: any) {
  if (employee.id === currentUser?.id) {
    errorMessage.value = 'Ne možeš obrisati sopstveni nalog.'
    return
  }

  const confirmed = window.confirm(`Obrisati zaposlenog ${employee.firstName} ${employee.lastName}?`)
  if (!confirmed) {
    return
  }

  try {
    await axios.delete(`${API_BASE_URL}/users/${employee.id}`)
    await fetchData()
  } catch (error) {
    console.error('Greška prilikom brisanja zaposlenog:', error)
    errorMessage.value = 'Zaposleni trenutno ne može da se obriše.'
  }
}

onMounted(fetchData)
</script>

<template>
  <div class="dashboard-layout bg-body text-body">
    <Sidebar />

    <main class="dashboard-content bg-body-tertiary">
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h1 class="h2 mb-1">Zaposleni</h1>
          <p class="text-body-secondary mb-0">Upravljanje nalozima i rolama zaposlenih.</p>
        </div>

        <div class="d-flex gap-2">
          <router-link to="/dashboard/users/new" class="btn btn-primary">
            <i class="bi bi-person-plus me-1"></i>
            Novi zaposleni
          </router-link>

          <select v-model="roleFilter" class="form-select w-auto">
            <option value="ALL">Sve role</option>
            <option v-for="r in roles" :key="r" :value="r">{{ roleLabel(r) }}</option>
          </select>
        </div>
      </div>

      <div class="card dashboard-card shadow-sm rounded-4">
        <div class="card-body p-4">
          <div v-if="loading" class="alert alert-info mb-0">Učitavanje...</div>
          <div v-else-if="errorMessage" class="alert alert-danger mb-0">{{ errorMessage }}</div>
          <div v-else-if="filteredEmployees.length === 0" class="alert alert-secondary mb-0">
            Nema zaposlenih za prikaz.
          </div>

          <div v-else class="table-responsive">
            <table class="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Ime i prezime</th>
                  <th>Email</th>
                  <th>Rola</th>
                  <th class="text-end">Akcije</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="employee in filteredEmployees" :key="employee.id">
                  <td class="fw-semibold">
                    {{ employee.firstName }} {{ employee.lastName }}
                    <span v-if="employee.id === currentUser?.id" class="badge text-bg-light ms-1">ti</span>
                  </td>
                  <td>{{ employee.email }}</td>
                  <td>
                    <span class="badge text-bg-secondary">{{ roleLabel(employee.role) }}</span>
                  </td>
                  <td class="text-end">
                    <button class="btn btn-sm btn-outline-primary me-2" @click="openEdit(employee)">
                      <i class="bi bi-pencil"></i>
                    </button>

                    <button
                      class="btn btn-sm btn-outline-danger"
                      :disabled="employee.id === currentUser?.id"
                      @click="deleteEmployee(employee)"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal za izmenu -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-card card dashboard-card shadow rounded-4">
        <div class="card-body p-4">
          <h5 class="fw-bold mb-4">Izmeni zaposlenog</h5>

          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Ime</label>
              <input v-model="form.firstName" type="text" class="form-control" />
            </div>

            <div class="col-md-6">
              <label class="form-label">Prezime</label>
              <input v-model="form.lastName" type="text" class="form-control" />
            </div>

            <div class="col-12">
              <label class="form-label">Email</label>
              <input v-model="form.email" type="email" class="form-control" autocomplete="off" />
            </div>

            <div class="col-12">
              <label class="form-label">Rola</label>
              <select
                v-model="form.role"
                class="form-select"
                :disabled="editingId === currentUser?.id"
              >
                <option v-for="r in roles" :key="r" :value="r">{{ roleLabel(r) }}</option>
              </select>
              <small v-if="editingId === currentUser?.id" class="text-body-secondary">
                Ne možeš menjati sopstvenu rolu.
              </small>
            </div>

            <div class="col-12">
              <hr class="my-1" />
              <p class="text-body-secondary small mb-0">
                Lozinku popuni samo ako želiš da je promeniš.
              </p>
            </div>

            <div class="col-md-6">
              <label class="form-label">Nova lozinka</label>
              <input v-model="form.password" type="password" class="form-control" autocomplete="new-password" />
            </div>

            <div class="col-md-6">
              <label class="form-label">Potvrdi lozinku</label>
              <input v-model="form.confirmPassword" type="password" class="form-control" autocomplete="new-password" />
            </div>
          </div>

          <p v-if="formError" class="text-danger small mb-0 mt-3">{{ formError }}</p>

          <div class="d-flex justify-content-end gap-2 mt-4">
            <button class="btn btn-outline-secondary" @click="closeModal">Otkaži</button>
            <button class="btn btn-primary" :disabled="saving" @click="saveEmployee">
              {{ saving ? 'Čuvanje...' : 'Sačuvaj' }}
            </button>
          </div>
        </div>
      </div>
    </div>
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

.table {
  --bs-table-bg: transparent;
  --bs-table-color: var(--bs-body-color);
  --bs-table-border-color: var(--bs-border-color);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 1050;
}

.modal-card {
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow-y: auto;
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