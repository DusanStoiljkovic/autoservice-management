<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from './views/components/Navbar.vue'
import Footer from './views/components/Footer.vue'
import Sidebar from './views/components/Sidebar.vue';
</script>

<template>
  <div class="app-layout min-vh-100 d-flex flex-column bg-body text-body">
    <Navbar v-if="!$route.path.startsWith('/dashboard')" />

    <!-- <Sidebar v-if="$route.path.startsWith('/dashboard')" /> -->
    <main class="flex-grow-1">
      <RouterView />
    </main>

    <Footer class="mt-5" />
  </div>
</template>

<style scoped>
.app-layout {
  width: 100%;
}
</style>