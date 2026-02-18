<template>
  <nav class="nav" id="principal-nav">
    <ul class="navbar-lista">
      <li class="navbar-item">
        <RouterLink to="/Inicio" class="navbar-links">Inicio</RouterLink>
      </li>
      <li class="navbar-item">
        <RouterLink to="/Informacion" class="navbar-links"
          >Información</RouterLink
        >
      </li>
      <li class="navbar-item">
        <RouterLink to="/Grafos" class="navbar-links">Grafos</RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.nav {
  display: flex;
  align-items: center;
  gap: clamp(14px, 3vw, 40px);
  transition: all 0.3s ease;
  padding: 1rem;
  background-color: rgba(22, 31, 59, 0.808);
  width: 100%;
  align-items: center;
  justify-content: center;
}

.navbar-lista {
  list-style: none;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: clamp(10px, 2.5vw, 40px);
  margin: 0;
  padding: 0;
}

.navbar-links {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  text-decoration: none;
  color: #e2e8f0;
  font-weight: 600;
  padding: 0.45rem 0.7rem;
  border-radius: 0.6rem;
  transition:
    background 0.2s ease,
    color 0.2s ease;
}
.navbar-item {
  font-size: 20px;
  padding-right: 50px;
}

.navbar-links:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

.router-link-exact-active {
  background: rgba(34, 197, 94, 0.16);
  box-shadow: inset 0 0 0 1px rgba(34, 197, 94, 0.4);
  color: #fff;
}

@media (max-width: 900px) {
  .navbar-lista {
    gap: 15px;
  }

  .navbar-links {
    font-size: 0.9rem;
    padding: 0.4rem 0.6rem;
  }
}
</style>
