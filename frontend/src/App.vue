<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from './views/components/Navbar.vue'
import Footer from './views/components/Footer.vue'
</script>

<template>
  <div class="app-layout min-vh-100 d-flex flex-column bg-body text-body">
    <Navbar
      v-if="!$route.path.startsWith('/dashboard') && !$route.path.startsWith('/appointments')"
    />

    <main class="flex-grow-1">
      <RouterView />
    </main>

    <Footer
      v-if="!$route.path.startsWith('/dashboard') && !$route.path.startsWith('/appointments')"
      class="mt-5"
    />
  </div>
</template>

<style scoped>
.app-layout {
  width: 100%;
}
</style>