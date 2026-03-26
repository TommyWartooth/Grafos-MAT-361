<script setup>
import Swal from "sweetalert2";
import interact from 'interactjs';

// Recibimos la instancia de Cytoscape para procesar los datos
const props = defineProps({
  cy: { type: Object, default: null }
});

// Función principal que el padre llamará
const mostrarMatriz = () => {
  if (!props.cy) return;

  const nodos = props.cy.nodes();
  const edges = props.cy.edges();
  const nombresNodos = nodos.map((n) => n.data("label") || n.id());
  const idsNodos = nodos.map((n) => n.id());
  const size = idsNodos.length;

  if (size === 0) {
    Swal.fire({
      icon: 'info',
      title: 'Grafo vacío',
      text: 'Agrega algunos nodos para generar la matriz.',
      background: "#1e293b",
      color: "#fff"
    });
    return;
  }

  // Inicializar matriz con ceros
  const matricita = Array.from({ length: size }, () => Array(size).fill(0));

  // Llenar pesos y verificar si es dirigida o no
  edges.forEach((edge) => {
    const source = edge.data("source");
    const target = edge.data("target");
    const weight = parseFloat(edge.data("weight")) || 0;
    
    const i = idsNodos.indexOf(source);
    const j = idsNodos.indexOf(target);
    
    if (i !== -1 && j !== -1) {
      matricita[i][j] = weight;
      // Si la arista NO tiene flecha (no es dirigida), es simétrica
      if (edge.style("target-arrow-shape") === "none") {
        matricita[j][i] = weight;
      }
    }
  });

  // Cálculos de Grados y Sumas
  const sumasColumnas = Array(size).fill(0);
  const gradosEntrada = Array(size).fill(0);
  const gradosSalida = matricita.map(fila => 
    fila.reduce((acc, val) => acc + (val !== 0 ? 1 : 0), 0)
  );

  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      sumasColumnas[j] += matricita[i][j];
      if (matricita[i][j] !== 0) gradosEntrada[j]++;
    }
  }

  // Construcción del HTML de la tabla
  let tablaHTML = `
    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-family: sans-serif; color: #fff; font-size: 0.9rem;">
        <thead>
          <tr>
            <th style="border: 1px solid #475569; padding: 8px; background: #6366f1;">Nodo</th>
            ${nombresNodos.map(nombre => `<th style="border: 1px solid #475569; padding: 8px; background: #6366f1">${nombre}</th>`).join('')}
            <th style="border: 1px solid #475569; padding: 8px; background: #4f46e5;">G. Salida</th>
            <th style="border: 1px solid #475569; padding: 8px; background: #b2b3ef; color: #000;">Σ Filas</th>
          </tr>
        </thead>
        <tbody>
          ${matricita.map((fila, i) => {
            const sumaFila = fila.reduce((a, b) => a + b, 0);
            return `
              <tr>
                <td style="border: 1px solid #475569; padding: 8px; font-weight: bold; background: #6366f1;">${nombresNodos[i]}</td>
                ${fila.map(valor => `<td style="border: 1px solid #475569; padding: 8px; text-align: center;">${Number.isInteger(valor) ? valor : valor.toFixed(2)}</td>`).join('')}
                <td style="border: 1px solid #475569; padding: 8px; text-align: center; background:#4f46e5; font-weight:bold;">${gradosSalida[i]}</td>
                <td style="border: 1px solid #475569; padding: 8px; text-align: center; font-weight: bold; background: #b2b3ef; color: #000;">${Number.isInteger(sumaFila) ? sumaFila : sumaFila.toFixed(2)}</td>
              </tr>`;
          }).join('')}
          <tr>
            <td style="border: 1px solid #475569; padding: 8px; font-weight: bold; background: #4f46e5;">G. Entrada</td>
            ${gradosEntrada.map(grado => `<td style="border: 1px solid #475569; padding: 8px; text-align: center; background:#4f46e5; font-weight:bold;">${grado}</td>`).join('')}
            <td colspan="2" style="background: #1e293b; border: 1px solid #475569;"></td>
          </tr>
          <tr>
            <td style="border: 1px solid #475569; padding: 8px; font-weight: bold; background: #b2b3ef; color: #000;">Σ Col.</td>
            ${sumasColumnas.map(suma => `<td style="border: 1px solid #475569; padding: 8px; text-align: center; font-weight: bold; background: #b2b3ef; color: #000;">${Number.isInteger(suma) ? suma : suma.toFixed(2)}</td>`).join('')}
            <td colspan="2" style="background: #1e293b; border: 1px solid #475569;"></td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  // Lanzar SweetAlert2
  Swal.fire({
    title: 'Matriz de Adyacencia',
    html: tablaHTML,
    width: '800px', 
    showCloseButton: true,
    backdrop: false,
    background: 'rgba(30, 41, 59, 0.98)',
    color: '#fff',
    customClass: { popup: 'draggable-swal' },
    didOpen: () => {
      interact('.draggable-swal').draggable({
        allowFrom: '.swal2-title',
        listeners: {
          move(event) {
            const { target } = event;
            const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
            const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
            target.style.transform = `translate(${x}px, ${y}px)`;
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
          },
        },
      });
    }
  });
};

// Exponemos la función para que el padre la use con una ref
defineExpose({ mostrarMatriz });
</script>

<template>
  </template>

<style scoped>
:deep(.draggable-swal) {
  cursor: default;
  touch-action: none; 
  user-select: none;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5) !important;
  border: 1px solid #4f46e5 !important;
}
</style>