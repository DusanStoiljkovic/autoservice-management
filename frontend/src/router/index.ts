import LoginPage from '@/views/auth/LoginPage.vue'
import RegisterPage from '@/views/auth/RegisterPage.vue'
import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/views/customers/LandingPage.vue'
import ServicesPage from '@/views/customers/ServicesPage.vue'
import BookAppointmentPage from '@/views/customers/BookAppointmentPage.vue'
import ContactPage from '@/views/customers/ContactPage.vue'
import AboutPage from '@/views/customers/AboutPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login-page',
      component: LoginPage,
    },
    {
      path: '/register',
      name: 'register-page',
      component: RegisterPage,
    }, 
    {
      path: '/',
      name: 'home-page',
      component: LandingPage,
    }, 
    {
      path: '/services',
      name: 'services-page',
      component: ServicesPage,
    }, 
    {
      path: '/book-appointment',
      name: 'book-appointment-page',
      component: BookAppointmentPage,
    },
    {
      path: '/about',
      name: 'about-page',
      component: AboutPage,
    },
    {
      path: '/contact',
      name: 'contact-page',
      component: ContactPage,
    }
  ],
})

export default router
