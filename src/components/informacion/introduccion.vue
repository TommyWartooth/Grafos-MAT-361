<template>
  <section class="intro">
    <div class="Definicion">
      <h2>Definición</h2>
      <!-- texto hecho con ia -->
      <p>
        Un <strong>algoritmo </strong>es una secuencia lógica, finita y definida
        de pasos o instrucciones diseñadas para resolver un problema específico
        o ejecutar una tarea. Si lo pensamos fuera de las computadoras, una
        receta de cocina o el manual para armar un mueble son algoritmos: tienes
        una entrada (ingredientes/piezas), un proceso (pasos a seguir) y una
        salida (el plato terminado/mueble).
      </p>
    </div>
    <br> </br>

    <div class="comp">
        <h2>Componentes</h2>
        <p>
            Para que una secuencia de pasos sea considerada un algoritmo "bien hecho", debe cumplir con tres partes:
            </p>
            <ol type="1">
                <li>Input (Entrada): La información o datos iniciales que necesita el algoritmo para empezar a trabajar. </li>

                <li>Proceso: El conjunto de operaciones lógicas y cálculos que transforman la entrada. </li>

                <li>Output (Salida): El resultado final obtenido tras procesar la información. </li>
            </ol>
        
    </div>
    <div class="imagen">
        <img src="/imagenes/proceso.jpg" alt="">
    </div>

     <div class="carac">
        <h2>Características</h2>
        <p>
            No cualquier lista de pasos es un algoritmo eficiente. Para serlo, requiere:
            </p>
            <ul>
                <li><strong>Precisión: </strong> Cada paso debe estar claramente definido, sin ambigüedades.</li>

                <li> <strong>Finitud: </strong> Debe tener un inicio y un final (un número determinado de pasos). </li>

                 <li> <strong>Definición: </strong> Si sigues el mismo algoritmo dos veces con los mismos datos, el resultado debe ser siempre el mismo. </li>   
                 
                  <li> <strong>Efectividad: </strong> Los pasos deben ser lo suficientemente sencillos para que, en teoría, alguien pueda realizarlos con papel y lápiz. </li>   
            </ul>
        
    </div>


    <div class = "tabla">
      <h2>Tipos de algoritmos</h2>
   <table>
  <thead>
    <tr>
      <th>Tipo</th>
      <th>Descripción</th>
      <th>Ejemplo</th>
    </tr>
  </thead>
  
  <tbody> <tr>
      <td><strong>Búsqueda</strong></td>
      <td>Encuentran un elemento específico dentro de un conjunto de datos.</td>
      <td>Buscar un nombre en una agenda.</td>
    </tr>
    <tr>
      <td><strong>Ordenamiento</strong></td>
      <td>Organizan elementos bajo un criterio (numérico, alfabético).</td>
      <td>Ordenar una lista de precios de menor a mayor.</td>
    </tr>

    <tr>
      <td><strong>Probabilísticos</strong></td>
      <td>Basan su resultado en el azar o en estimaciones.</td>
      <td>Algoritmos de juegos de azar o simulaciones.</td>
    </tr>

    <tr>
      <td><strong>Optimización</strong></td>
      <td>Buscan la "mejor" solución entre muchas opciones posibles.</td>
      <td>Google Maps calculando la ruta más rápida.</td>
    </tr>
  </tbody> </table>
    </div>

    <div class = "impo">
      <h2>Importancia</h2>
      <p>Hoy en día, los algoritmos no solo mueven programas simples; son los que deciden qué ves en redes sociales (algoritmos de recomendación), detectan fraudes bancarios en milisegundos y permiten que la Inteligencia Artificial "aprenda" patrones complejos a partir de millones de datos.</p>
    </div>
  </section>
</template>
<style scoped>

.intro {
  max-width: 1000px;
  margin: 60px auto;
  padding: 20px;
}

.Definicion,
.comp, .carac,.tabla, .impo{
  background: rgba(5, 9, 39, 0.774);
  padding: 30px;
  border-radius: 15px;
  margin-bottom: 40px;
  backdrop-filter: blur(5px);
}

h2 {
  font-size: 40px;
  color: #ffffff;
  margin-bottom: 20px;
}

p {
  color: #e6e6e6;
  font-size: 20px;
  line-height: 1.8;
  text-align: justify;
}

ol {
  padding-left: 25px;
  margin-top: 20px;
  color: #e6e6e6;
  font-size: 20px;
  line-height: 1.8;
}

li {
  margin-bottom: 10px;
}

.imagen {
  display: flex;
  justify-content: center;
  margin-top: 40px;
  margin-bottom: 40px;
}

.imagen img {
  max-width: 500px;
  width: 100%;
  border-radius: 15px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
}
ul {
  padding-left: 25px;
  margin-top: 20px;
  color: #e6e6e6;
  font-size: 20px;
  line-height: 1.8;
}

table {
  width: 100%;
  border-collapse: collapse; 
  margin-top: 20px;
  background-color: #1e293b; 
  color: white;
}

th, td {
  border: 1px solid #475569; 
  padding: 12px;             
  text-align: left;
  font-size: 20px;
}

th {
  background-color: #334155; 
  font-weight: bold;
}
</style>