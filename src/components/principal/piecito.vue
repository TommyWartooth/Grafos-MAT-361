<template>
  <div class="agria">
    <footer class="footer">
      <div class="contenedor-footer-columna">
        <nav class="contenedor-footer-lateral">
          <ul>
            <li>
              <RouterLink to="/Inicio" class="navbar-links">Inicio</RouterLink>
            </li>
            <li>
              <RouterLink to="/Informacion" class="navbar-links"
                >Información</RouterLink
              >
            </li>
            <li>
              <RouterLink to="/Grafos" class="navbar-links">Grafos</RouterLink>
            </li>
          </ul>
        </nav>
      </div>

      <div class="contenedor-footer-columna border-gold">
        <div class="footer-texto-medio">
          <span>Emilia Fernanda Crespo Herrera</span>
          <span>emilia.crespo@ucb.edu.bo</span>
          <span>+591 73223283</span>
          <span>Ingeniería de Sistemas</span>

          <span>Semestre 1-2026 MAT-361</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.agria {
  background-color: rgba(22, 31, 59, 0.808);
}
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 1000px;
  margin: auto;
  padding: 30px 0;
  color: #ccc;
  font-size: 20px;
  gap: 40px;
  background-color: rgba(22, 31, 59, 0.808);
}

.contenedor-footer-columna {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.border-gold {
  border-left: 2px solid gold;
  padding-left: 40px;
}

.footer-texto-medio {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: center;
}

.contenedor-footer-lateral ul {
  padding: 0;
  margin: 0;
  list-style: none;
  text-align: center;
}

.contenedor-footer-lateral li {
  margin-bottom: 15px;
}

.footer a {
  text-decoration: none;
  color: #f1f1f1;
  position: relative;
  transition: color 0.3s ease;
}

/* Efecto subrayado dorado */
.footer a::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 100%;
  height: 2px;
  background: gold;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.footer a:hover {
  color: gold;
}

.footer a:hover::after {
  transform: scaleX(1);
}

/* Responsive */
@media (max-width: 700px) {
  .footer {
    flex-direction: column;
    gap: 30px;
    font-size: 18px;
  }

  .border-gold {
    border-left: none;
    border-top: 2px solid gold;
    padding-left: 0;
    padding-top: 20px;
    width: 80%;
  }
}
</style>
