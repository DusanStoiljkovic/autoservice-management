<script lang="ts">

</script>

<template>
  <div class="d-flex align-items-center min-vh-100 py-3 py-md-0">
    <main class="form-signin w-100 m-auto"> 
      <form class="d-flex flex-column gap-2"> 
        <h1 class="h3 mb-3 fw-normal">Registracija</h1>

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