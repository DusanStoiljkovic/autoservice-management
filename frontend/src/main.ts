import { createApp } from 'vue'
import { createPinia } from 'pinia'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'

import App from './App.vue'
import router from './router'

function applySystemTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    document.documentElement.setAttribute('data-bs-theme', prefersDark ? 'dark' : 'light')
}

applySystemTheme()

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applySystemTheme)

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
