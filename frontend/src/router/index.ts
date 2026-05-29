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
import CustomersManagement from '../views/auth/CustomersManagement.vue'
import VehiclesManagement from '../views/auth/VehicleManagement.vue'
import AppointmentsManagement from '../views/auth/AppointmentsManagement.vue'
import ServicesManagement from '../views/auth/ServiceManagement.vue'
import RepairOrdersManagement from '../views/auth/RepairsOrdersManagement.vue'
import InvoicesManagement from '../views/auth/InvoicesManagement.vue'
import SettingsPage from '../views/auth/SettingsPage.vue'

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
      path: '/dashboard/customers',
      name: 'customers-management',
      component: CustomersManagement
    },
    {
      path: '/dashboard/vehicles',
      name: 'vehicles-management',
      component: VehiclesManagement
    },
    {
      path: '/dashboard/appointments',
      name: 'appointments',
      component: AppointmentsManagement
    },
    {
      path: '/dashboard/appointments/:id',
      name: 'appointment-details',
      component: AppointmentDetailsLayout
    },
    {
      path: '/dashboard/services',
      name: 'services-management',
      component: ServicesManagement
    },
    {
      path: '/dashboard/repair-orders',
      name: 'repair-orders-management',
      component: RepairOrdersManagement
    },
    {
      path: '/dashboard/repair-orders/:id',
      name: 'repair-orders-details',
      component: AppointmentDetailsLayout
    },
    {
      path: '/dashboard/invoices',
      name: 'invoices-management',
      component: InvoicesManagement
    },
    {
      path: '/dashboard/settings',
      name: 'settings-management',
      component: SettingsPage
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

export default router