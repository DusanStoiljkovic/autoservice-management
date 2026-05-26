<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <RouterLink class="navbar-brand" to="/">
        AutoService
      </RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNavbar"
        aria-controls="mainNavbar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="mainNavbar">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/">
              Home
            </RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink class="nav-link" to="/customers">
              Customers
            </RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink class="nav-link" to="/vehicles">
              Vehicles
            </RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink class="nav-link" to="/appointments">
              Appointments
            </RouterLink>
          </li>

          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              More
            </a>

            <ul class="dropdown-menu">
              <li>
                <RouterLink class="dropdown-item" to="/services">
                  Services
                </RouterLink>
              </li>

              <li>
                <RouterLink class="dropdown-item" to="/repair-orders">
                  Repair Orders
                </RouterLink>
              </li>

              <li>
                <RouterLink class="dropdown-item" to="/invoices">
                  Invoices
                </RouterLink>
              </li>
            </ul>
          </li>
        </ul>

        <form class="d-flex" role="search">
          <input
            class="form-control me-2"
            type="search"
            placeholder="Search"
          />

          <button class="btn btn-outline-light" type="submit">
            Search
          </button>
        </form>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>