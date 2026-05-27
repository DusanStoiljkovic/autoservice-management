<script setup lang="ts">

</script>

<template>
  <div class="auth-page d-flex align-items-center justify-content-center py-5 bg-body-tertiary">
    <main class="form-signin w-100">
      <form class="auth-card d-flex flex-column gap-2 rounded-4 shadow-sm p-4">
        <div class="text-center mb-3">
          <div class="auth-icon mx-auto mb-3">
            🧑‍🔧
          </div>

          <h1 class="h3 mb-1 fw-normal">
            Registracija
          </h1>

          <p class="text-body-secondary mb-0">
            Kreirajte nalog za korišćenje AutoService sistema.
          </p>
        </div>

        <div class="form-floating">
          <input
            type="text"
            class="form-control"
            id="firstName"
            placeholder="Petar"
          >
          <label for="firstName">Ime</label>
        </div>

        <div class="form-floating">
          <input
            type="text"
            class="form-control"
            id="lastName"
            placeholder="Petrović"
          >
          <label for="lastName">Prezime</label>
        </div>

        <div class="form-floating">
          <input
            type="email"
            class="form-control"
            id="email"
            placeholder="ime@example.com"
          >
          <label for="email">Email adresa</label>
        </div>

        <div class="form-floating">
          <input
            type="password"
            class="form-control"
            id="password"
            placeholder="Lozinka"
          >
          <label for="password">Lozinka</label>
        </div>

        <button class="btn btn-primary w-100 py-2 mt-3" type="submit">
          Registruj se
        </button>

        <p class="mt-4 mb-0 text-body-secondary text-center">
          © AutoService
        </p>
      </form>
    </main>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.auth-page {
  min-height: 75vh;
}

.form-signin {
  max-width: 380px;
  padding: 1rem;
}

.auth-card {
  background-color: var(--bs-body-bg);
  border: 1px solid var(--bs-border-color);
  color: var(--bs-body-color);
}

.auth-icon {
  width: 64px;
  height: 64px;
  display: grid;
  place-items: center;
  border-radius: 18px;
  font-size: 2rem;
  background-color: var(--bs-tertiary-bg);
  border: 1px solid var(--bs-border-color);
}

.form-control {
  background-color: var(--bs-body-bg);
  color: var(--bs-body-color);
  border-color: var(--bs-border-color);
}

.form-control::placeholder {
  color: var(--bs-secondary-color);
}
</style>