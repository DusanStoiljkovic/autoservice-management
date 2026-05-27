<template>
  <footer class="border-top bg-body">
    <div class="container">
      <div class="d-flex flex-wrap justify-content-between align-items-center py-4">
        <div class="col-md-5 d-flex align-items-center">
          <RouterLink
            to="/"
            class="me-2 text-body text-decoration-none fw-bold"
          >
            AutoService
          </RouterLink>

          <span class="text-body-secondary">
            © 2026 AutoService Management
          </span>
        </div>

        <ul class="nav col-md-4 justify-content-end list-unstyled d-flex">
          <li class="ms-3">
            <a class="text-body-secondary text-decoration-none" href="#">
              Instagram
            </a>
          </li>

          <li class="ms-3">
            <a class="text-body-secondary text-decoration-none" href="#">
              Facebook
            </a>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>