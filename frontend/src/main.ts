import { createApp } from 'vue'
import { createPinia } from 'pinia'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'

import App from './App.vue'
import router from './router'
import axios from 'axios'

const app = createApp(App)

// -------------------- Theme ------------------------------------------- 
function applySystemTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    document.documentElement.setAttribute('data-bs-theme', prefersDark ? 'dark' : 'light')
}
applySystemTheme()

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applySystemTheme)


//Title
document.title = "AutoService Management"
// Icon
const iconLink = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
if (iconLink) {
    iconLink.href = "/car-front-fill.svg"
}

// --------------------- AUTH --------------------------------------------
const API_URL = import.meta.env.VITE_API_URL

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let refreshPromise: Promise<string> | null = null

async function refreshAccessToken() : Promise<string> {
  const refreshToken = localStorage.getItem("refreshToken")
  if(!refreshToken) {
    throw new Error('Nema refresh tokena')
  }

  const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken })

  localStorage.setItem('token', data.accessToken)
  localStorage.setItem('refreshToken', data.refreshToken)
  localStorage.setItem('user', JSON.stringify(data.user))

  return data.accessToken
}

axios.interceptors.response.use(
  (response) => response, async (error) => {
    const original = error.config
    const is401 = error.response?.status === 401
    const isRefreshCall = original?.url?.includes('/auth/refresh')

    // ne diramo: ako nije 401, ako smo već probali, ili ako je baš refresh pao
    if (!is401 || original?._retry || isRefreshCall) {
      return Promise.reject(error)
    }

    original._retry = true

    try {
      // jedan refresh deljen među svim zahtevima koji su istovremeno pali
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => { refreshPromise = null })
      }

      const newToken = await refreshPromise
      original.headers.Authorization = `Bearer ${newToken}`
      return axios(original) // ponovi originalni zahtev sa novim tokenom
    } catch (refreshError) {
      // refresh ne uspeva -> sesija je gotova
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      router.push('/login')
      return Promise.reject(refreshError)
    }
  }
)

app.use(createPinia())
app.use(router)

app.mount('#app')
