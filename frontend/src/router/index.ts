import { createRouter, createWebHistory } from 'vue-router'

import LandingPage from '../views/customers/LandingPage.vue'
import ServicesPage from '../views/customers/ServicesPage.vue'
import BookAppointmentPage from '../views/customers/BookAppointmentPage.vue'
import AboutPage from '../views/customers/AboutPage.vue'
import ContactPage from '../views/customers/ContactPage.vue'

import LoginPage from '../views/auth/LoginPage.vue'
import RegisterPage from '../views/auth/admin/RegisterPage.vue'
import DashboardLayout from '../views/auth/admin/DashboardLayout.vue'
import AppointmentDetailsLayout from '../views/auth/admin/AppointmentDetailsLayout.vue'
import CustomersManagement from '../views/auth/admin/CustomersManagement.vue'
import VehiclesManagement from '../views/auth/admin/VehicleManagement.vue'
import AppointmentsManagement from '../views/auth/admin/AppointmentsManagement.vue'
import ServicesManagement from '../views/auth/admin/ServiceManagement.vue'
import RepairOrdersManagement from '../views/auth/admin/RepairsOrdersManagement.vue'
import InvoicesManagement from '../views/auth/admin/InvoicesManagement.vue'
import SettingsPage from '../views/auth/admin/SettingsPage.vue'
import RepairOrderDetailsPage from '@/views/auth/admin/RepairOrderDetailsPage.vue'
import InvoiceCreatePage from '@/views/auth/admin/InvoiceCreatePage.vue'
import InvoiceDetailsPage from '@/views/auth/admin/InvoiceDetailsPage.vue'
import MechanicDashboardLayout from '@/views/auth/mechanic/MechanicDashboardLayout.vue'
import ReceptionDashboard from '@/views/auth/reception/ReceptionDashboard.vue'
import MechanicOrderDetails from '@/views/auth/mechanic/MechanicOrderDetails.vue'

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
      meta: { requiresAuth: true, role: 'ADMIN'}
    },
    {
      path: '/dashboard/customers',
      name: 'customers-management',
      component: CustomersManagement,
      meta: { requiresAuth: true, role: ['ADMIN', 'RECEPTIONIST']}
    },
    {
      path: '/dashboard/vehicles',
      name: 'vehicles-management',
      component: VehiclesManagement,
      meta: { requiresAuth: true, role: ['ADMIN', 'RECEPTIONIST']}
    },
    {
      path: '/dashboard/appointments',
      name: 'appointments',
      component: AppointmentsManagement,
      meta: { requiresAuth: true, role: ['ADMIN', 'RECEPTIONIST']}
    },
    {
      path: '/dashboard/appointments/:id',
      name: 'appointment-details',
      component: AppointmentDetailsLayout,
      meta: { requiresAuth: true, role: ['ADMIN', 'RECEPTIONIST']}
    },
    {
      path: '/dashboard/services',
      name: 'services-management',
      component: ServicesManagement,
      meta: { requiresAuth: true, role: ['ADMIN', 'RECEPTIONIST']}
    },
    {
      path: '/dashboard/repair-orders',
      name: 'repair-orders-management',
      component: RepairOrdersManagement,
      meta: { requiresAuth: true, role: ['ADMIN', 'RECEPTIONIST']}
    },
    {
      path: '/dashboard/repair-orders/:id',
      name: 'repair-orders-details',
      component: RepairOrderDetailsPage,
      meta: { requiresAuth: true, role: ['ADMIN', 'MECHANIC']}
    },
    {
      path: '/dashboard/invoices',
      name: 'invoices-management',
      component: InvoicesManagement,
      meta: { requiresAuth: true, role: ['ADMIN', 'RECEPTIONIST']}
    },
    { 
      path: '/dashboard/invoices/new', 
      name: 'invoice-create', 
      component: InvoiceCreatePage,
      meta: { requiresAuth: true, role: ['ADMIN', 'RECEPTIONIST']}
    },
    {
      path: '/dashboard/invoices/:id',
      name: 'invoice-details',
      component: InvoiceDetailsPage,
      meta: { requiresAuth: true, role: ['ADMIN', 'RECEPTIONIST']}
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
      meta: { requiresAuth: true, role: ['ADMIN', 'RECEPTIONIST'] }
    },
    { 
      path: '/dashboard/receptionist', 
      name: 'reception-dashboard', 
      component: ReceptionDashboard, 
      meta: { requiresAuth: true, role: 'RECEPTIONIST' } 
    },
    { 
      path: '/dashboard/mechanic', 
      name: 'mechanic-dashboard', 
      component: MechanicDashboardLayout, 
      meta: { requiresAuth: true, role: 'MECHANIC' } 
    },
    { 
      path: '/dashboard/mechanic/orders/:id', 
      name: 'mechanic-order', 
      component: MechanicOrderDetails, 
      meta: { requiresAuth: true, role: 'MECHANIC' } 
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  if (to.meta.requiresAuth && !token) {
    return '/login'
  }

  if (to.meta.role && !(to.meta.role as string[]).includes(user?.role)) {
    if (user?.role === 'MECHANIC') return '/dashboard/mechanic'
    if (user?.role === 'RECEPTIONIST') return '/dashboard/receptionist'
    return '/dashboard'
  }
})

export default router