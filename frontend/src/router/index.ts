import { createRouter, createWebHistory } from 'vue-router'

import LandingPage from '../views/customers/LandingPage.vue'
import ServicesPage from '../views/customers/ServicesPage.vue'
import BookAppointmentPage from '../views/customers/BookAppointmentPage.vue'
import AboutPage from '../views/customers/AboutPage.vue'
import ContactPage from '../views/customers/ContactPage.vue'

import LoginPage from '../views/auth/LoginPage.vue'
import RegisterPage from '../views/auth/RegisterPage.vue'
import DashboardLayout from '../views/auth/DashboardLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingPage
    },
    {
      path: '/services',
      name: 'services',
      component: ServicesPage
    },
    {
      path: '/book-appointment',
      name: 'book-appointment',
      component: BookAppointmentPage
    },
    {
      path: '/about',
      name: 'about',
      component: AboutPage
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactPage
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardLayout
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

export default router