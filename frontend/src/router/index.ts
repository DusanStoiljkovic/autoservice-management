import { createRouter, createWebHistory } from 'vue-router'

import LandingPage from '../views/customers/LandingPage.vue'
import ServicesPage from '../views/customers/ServicesPage.vue'
import BookAppointmentPage from '../views/customers/BookAppointmentPage.vue'
import AboutPage from '../views/customers/AboutPage.vue'
import ContactPage from '../views/customers/ContactPage.vue'

import LoginPage from '../views/auth/LoginPage.vue'
import RegisterPage from '../views/auth/RegisterPage.vue'
import DashboardLayout from '../views/auth/DashboardLayout.vue'
import AppointmentDetailsLayout from '../views/auth/AppointmentDetailsLayout.vue'

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
      path: '/dashboard/appointments/:id',
      name: 'appointment-details',
      component: AppointmentDetailsLayout
    },
    {
      path: '/dashboard/customers',
      name: 'customers-management',
      component: AppointmentDetailsLayout
    },
    {
      path: '/dashboard/vehicles',
      name: 'vehicles-management',
      component: AppointmentDetailsLayout
    },
    {
      path: '/dashboard/appointments',
      name: 'appointments',
      component: AppointmentDetailsLayout
    },
    {
      path: '/dashboard/services',
      name: 'services-management',
      component: AppointmentDetailsLayout
    },
    {
      path: '/dashboard/repair-orders',
      name: 'repair-orders-management',
      component: AppointmentDetailsLayout
    },
    {
      path: '/dashboard/repair-orders/:id',
      name: 'repair-orders-details',
      component: AppointmentDetailsLayout
    },
    {
      path: '/dashboard/invoices',
      name: 'invoices-management',
      component: AppointmentDetailsLayout
    },
    {
      path: '/dashboard/settings',
      name: 'settings-management',
      component: AppointmentDetailsLayout
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

export default router