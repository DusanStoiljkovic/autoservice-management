<script setup lang="ts">

</script>

<template>
  <div class="auth-page d-flex align-items-center justify-content-center py-5 bg-body-tertiary">
    <main class="form-signin w-100">
      <form class="auth-card d-flex flex-column gap-2 rounded-4 shadow-sm p-4">
        <div class="text-center mb-3">
          <div class="auth-icon mx-auto mb-3">
            🔐
          </div>

          <h1 class="h3 mb-1 fw-normal">
            Prijava
          </h1>

          <p class="text-body-secondary mb-0">
            Prijavite se za pristup sistemu auto servisa.
          </p>
        </div>

        <div class="form-floating">
          <input
            type="email"
            class="form-control"
            id="floatingInput"
          >
          <label for="floatingInput">Email adresa</label>
        </div>

        <div class="form-floating">
          <input
            type="password"
            class="form-control"
            id="floatingPassword"
          >
          <label for="floatingPassword">Lozinka</label>
        </div>

        <div class="form-check text-start my-3">
          <input
            class="form-check-input"
            type="checkbox"
            value="remember-me"
            id="checkDefault"
          >
          <label class="form-check-label" for="checkDefault">
            Zapamti me
          </label>
        </div>

        <button class="btn btn-primary w-100 py-2" type="submit">
          Prijavi se
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

.form-check-input {
  border-color: var(--bs-border-color);
}
</style>