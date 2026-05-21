import CreateCustomerView from '@/views/customers/CreateCustomerView.vue'
import CustomerDetailsView from '@/views/customers/CustomerDetailsView.vue'
import CustomersView from '@/views/customers/CustomersView.vue'
import EditCustomerView from '@/views/customers/EditCustomerView.vue'
import HomeCustomer from '@/views/customers/HomeCustomer.vue'
import LandingPage from '@/views/customers/LandingPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: LandingPage
    },
    {
      path: '/customers',
      name: 'customers',
      component: CustomersView,
      meta: {
        requiredAuth: true,
        roles: ['ADMIN', 'MANAGER', 'RECEPTIONIST'],
      }
    },
    {
      path: '/customers/create',
      name: 'create-customer',
      component: CreateCustomerView
    },
    {
      path: '/customers/:id',
      name: 'customer-details',
      component: CustomerDetailsView
    },
    {
      path: '/customers/:id/edit',
      name: 'edit-customer',
      component: EditCustomerView,
    }
  ],
})

export default router
