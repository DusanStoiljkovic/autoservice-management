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
import RepairOrderDetailsPage from '@/views/auth/RepairOrderDetailsPage.vue'
import InvoiceCreatePage from '@/views/auth/InvoiceCreatePage.vue'
import InvoiceDetailsPage from '@/views/auth/InvoiceDetailsPage.vue'

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
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardLayout,
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard/customers',
      name: 'customers-management',
      component: CustomersManagement,
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard/vehicles',
      name: 'vehicles-management',
      component: VehiclesManagement,
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard/appointments',
      name: 'appointments',
      component: AppointmentsManagement,
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard/appointments/:id',
      name: 'appointment-details',
      component: AppointmentDetailsLayout,
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard/services',
      name: 'services-management',
      component: ServicesManagement,
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard/repair-orders',
      name: 'repair-orders-management',
      component: RepairOrdersManagement,
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard/repair-orders/:id',
      name: 'repair-orders-details',
      component: RepairOrderDetailsPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard/invoices',
      name: 'invoices-management',
      component: InvoicesManagement,
      meta: { requiresAuth: true }
    },
    { 
      path: '/dashboard/invoices/new', 
      name: 'invoice-create', 
      component: InvoiceCreatePage,
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard/invoices/:id',
      name: 'invoice-details',
      component: InvoiceDetailsPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard/settings',
      name: 'settings-management',
      component: SettingsPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard/register',
      name: 'register',
      component: RegisterPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to) => {
    const token = localStorage.getItem('token')
    
    if(to.meta.requiresAuth && !token) {
      return '/login'
    }
})

export default router