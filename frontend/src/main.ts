import { createApp } from 'vue'
import { createPinia } from 'pinia'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'

import App from './App.vue'
import router from './router'
import axios from 'axios'

function applySystemTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    document.documentElement.setAttribute('data-bs-theme', prefersDark ? 'dark' : 'light')
}

applySystemTheme()

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applySystemTheme)
document.title = "AutoService Management"
const app = createApp(App)
const iconLink = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
if (iconLink) {
    iconLink.href = "/car-front-fill.svg"
}

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

app.use(createPinia())
app.use(router)

app.mount('#app')
