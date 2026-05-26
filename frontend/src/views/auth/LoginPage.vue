<script lang="ts">

</script>

<template>
  <div class="d-flex align-items-center min-vh-100 py-3 py-md-0">
    <main class="form-signin w-100 m-auto"> 
      <form class="d-flex flex-column gap-2"> 
        <h1 class="h3 mb-3 fw-normal">Prijava</h1> 

        <div class="form-floating"> 
          <input 
            type="email" 
            class="form-control" 
            id="floatingInput" 
            placeholder="ime@example.com"
          > 
          <label for="floatingInput">Email adresa</label> 
        </div> 

        <div class="form-floating"> 
          <input 
            type="password" 
            class="form-control" 
            id="floatingPassword" 
            placeholder="Lozinka"
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

        <p class="mt-5 mb-3 text-body-secondary">
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

.form-signin {
  max-width: 330px;
  padding: 1rem;
}
</style>