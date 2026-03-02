<script setup>
import { onMounted, ref } from "vue";
import cytoscape from "cytoscape";
import panel from "../components/grafos/panel.vue";
import Swal from "sweetalert2";
import interact from 'interactjs';
const cyContainer = ref(null);
let cy;
let selectedNode = null;
let nodeCount = 1;


const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  background: "#1e293b",
  color: "#fff",
});

onMounted(() => {
  cy = cytoscape({
    container: cyContainer.value,
    elements: [],
    style: [
      {
        selector: "node",
        style: {
          "background-color": "#4f46e5",
          label: "data(label)",
          color: "#fff",
          "text-valign": "center",
          "text-halign": "center",
          width: 45,
          height: 45,
          "font-weight": "bold",
        },
      },
      {
        selector: "node:selected",
        style: {
          "border-width": 4,
          "border-color": "#fbbf24",
          "background-color": "#6366f1",
        },
      },
      {
        selector: "edge",
        style: {
          width: 3,
          label: "data(weight)",
          "curve-style": "bezier",
          "target-arrow-shape": "triangle",
          "line-color": "#6366f1",
          "target-arrow-color": "#6366f1",
          color: "#fff",
          "text-outline-width": 2,
          "text-outline-color": "#0e294e",
          "font-size": "20px",
        },
      },
    ],
  });

  cy.on("dbltap", async (event) => {
    if (event.target === cy) {
      const { value: nombreNodo} = await Swal.fire({
        title: "Nombre del nodo",
        input: "text",
        inputLabel: "Ingresa el nombre del nodo",
         background: "#1e293b",
        color: "#f8fafc",
        showCancelButton: true,
         confirmButtonText: "Crear",
      cancelButtonText: "Cancelar",
      preConfirm: (value) => {
        if (!value) {
          
        Toast.fire({ icon: "error", title: "El nodo necesita un nombre" });
        
        }
      }
    })
      if(nombreNodo){
      cy.add({
        group: "nodes",
        data: { id: `n${nodeCount}`, label: nombreNodo },
        position: event.position,
      });
      nodeCount++;
    }}
  });

  // Lógica de conexión con SweetAlert2
  cy.on("tap", "node", async (event) => {
    const node = event.target;

    if (!selectedNode) {
      selectedNode = node;
      node.select();
    } else {
      const sourceNode = selectedNode;

      const { value: formValues } = await Swal.fire({
        title: "Nueva Conexión",
        background: "#1e293b",
        color: "#f8fafc",
        confirmButtonColor: "#4f46e5",
        cancelButtonColor: "#ef4444",
        showCancelButton: true,
        confirmButtonText: "Crear",
        cancelButtonText: "Cancelar",
        html: `
          <div style="text-align: left; padding: 0 10px;">
            <label style="display:block; margin-bottom: 8px;">Peso de la arista:</label>
            <input id="swal-weight" class="swal2-input" type="number" step ="any" value="1" style="width: 80%; margin: 0 auto 20px auto; display: block;">
            <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
              <input type="checkbox" id="swal-directed" checked style="width: 20px; height: 20px;">
              <label for="swal-directed">¿Es una arista dirigida?</label>
            </div>
          </div>
        `,
        preConfirm: () => {
          return {
            weight: document.getElementById("swal-weight").value,
            isDirected: document.getElementById("swal-directed").checked,
          };
        },
      });

      if (formValues) {
        const newEdge = cy.add({
          group: "edges",
          data: {
            id: `e${sourceNode.id()}-${node.id()}-${Date.now()}`,
            source: sourceNode.id(),
            target: node.id(),
            weight: formValues.weight || "1",
          },
        });

        if (!formValues.isDirected) {
          newEdge.style("target-arrow-shape", "none");
        }

        Toast.fire({ icon: "success", title: "Arista creada" });
      }

      sourceNode.unselect();
      selectedNode = null;
    }
  });
  

  cy.on("dbltap", "edge", async (event) => {
  const edge = event.target

  const esDirigida = edge.style("target-arrow-shape") !== "none"

  const { value: formValues } = await Swal.fire({
    title: "Editar Conexión",
    background: "#1e293b",
    color: "#f8fafc",
    confirmButtonColor: "#4f46e5",
    cancelButtonColor: "#ef4444",
    showCancelButton: true,
    confirmButtonText: "Actualizar",
    cancelButtonText: "Cancelar",
    html: `
      <div style="text-align: left; padding: 0 10px;">
        <label style="display:block; margin-bottom: 8px;">Peso de la arista:</label>
        <input id="swal-weight" class="swal2-input" type="number" step="any"
          value="${edge.data("weight")}"
          style="width: 80%; margin: 0 auto 20px auto; display: block;">
        
        <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
          <input type="checkbox" id="swal-directed"
            ${esDirigida ? "checked" : ""}
            style="width: 20px; height: 20px;">
          <label for="swal-directed">¿Es una arista dirigida?</label>
        </div>
      </div>
    `,
    preConfirm: () => {
      const weight = document.getElementById("swal-weight").value
      const isDirected = document.getElementById("swal-directed").checked

      if (weight === "" || weight === null) {
        Toast.fire({
          icon: "error",
          title: "El peso no puede estar vacío"
        })
        return false
      }

      return { weight, isDirected }
    },
  })

  if (formValues) {
    edge.data("weight", formValues.weight)

    if (formValues.isDirected) {
      edge.style("target-arrow-shape", "triangle")
    } else {
      edge.style("target-arrow-shape", "none")
    }

    Toast.fire({
      icon: "success",
      title: "Arista actualizada"
    })
  }
})
  // Borrar con teclado + Notificación
  window.addEventListener("keydown", (e) => {
    if (e.key === "Delete" || e.key === "Backspace") {
      const selectedEles = cy.$(":selected");
      if (selectedEles.length > 0) {
        cy.remove(selectedEles);
        selectedNode = null;
        Toast.fire({ icon: "info", title: "Elemento eliminado" });
      }
    }
  });
});

const clearGraph = () => {
  cy.elements().remove();
  selectedNode = null;
  nodeCount = 1;

  Toast.fire({
    icon: "info",
    title: "Grafo eliminado",
  });
};

const changeNodeColor = (color) => {
  const selectedNodes = cy.$("node:selected");
  if (selectedNodes.length === 0) {
    Toast.fire({ icon: "warning", title: "Selecciona un nodo" });
    return;
  }

  selectedNodes.forEach((node) => {
    node.style("background-color", color);
  });

  Toast.fire({ icon: "success", title: "Color de nodo actualizado" });
};

const changeEdgeColor = (color) => {
  const selectedEdges = cy.$("edge:selected");
  if (selectedEdges.length === 0) {
    Toast.fire({ icon: "warning", title: "Selecciona una arista" });
    return;
  }

  selectedEdges.forEach((edge) => {
    edge.style({
      "line-color": color,
      "target-arrow-color": color,
    });
  });

  Toast.fire({ icon: "success", title: "Color de arista actualizado" });
};

const generarMatriz = () => {
  const nodos = cy.nodes();
  const edges = cy.edges();
const nombresNodos = nodos.map((n) => n.data("label"));
const idsNodos = nodos.map((n) => n.id());
 const size = idsNodos.length;
  
 
  const matricita = Array.from({ length: size }, () => Array(size).fill(0));

  edges.forEach((edge) => {
    const source = edge.data("source");
    const target = edge.data("target");
    

    const weight = parseFloat(edge.data("weight")) || 0;
    
   const i = idsNodos.indexOf(source);
const j = idsNodos.indexOf(target);
    
    if (i !== -1 && j !== -1) {
      matricita[i][j] = weight;
      if (edge.style("target-arrow-shape") === "none") {
        matricita[j][i] = weight;
      }
    }
  });

  
  const sumasColumnas = Array(size).fill(0);
  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      sumasColumnas[j] += matricita[i][j];
    }
  }

  let tablaHTML = `
    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-family: sans-serif; color: #fff;">
        <thead>
          <tr>
            <th style="border: 1px solid #fff; padding: 8px; background: #6366f1;"></th>
            ${nombresNodos.map(nombre => `
  <th style="border: 1px solid #fff; padding: 8px; background: #6366f1">
    ${nombre}
  </th>
`).join('')}
            <th style="border: 1px solid #fff; padding: 8px; background: #b2b3ef; color: #fff;">Σ Filas</th>
          </tr>
        </thead>
        <tbody>
          ${matricita.map((fila, i) => {
            const sumaFila = fila.reduce((a, b) => a + b, 0);
            return `
              <tr>
                <td style="border: 1px solid #fff; padding: 8px; font-weight: bold; background: #6366f1;">${nombresNodos[i]}</td>
                ${fila.map(valor => `
                  <td style="border: 1px solid #fff; padding: 8px; text-align: center;">
                    ${Number.isInteger(valor) ? valor : valor.toFixed(2)}
                  </td>`).join('')}
                <td style="border: 1px solid #fff; padding: 8px; text-align: center; font-weight: bold; background: #b2b3ef;">
                  ${Number.isInteger(sumaFila) ? sumaFila : sumaFila.toFixed(2)}
                </td>
              </tr>
            `;
          }).join('')}
          <tr>
            <td style="border: 1px solid #fff; padding: 8px; font-weight: bold; background: #b2b3ef; color: #fff;">Σ Col.</td>
            ${sumasColumnas.map(suma => `
              <td style="border: 1px solid #fff; padding: 8px; text-align: center; font-weight: bold; background: #b2b3ef;">
                ${Number.isInteger(suma) ? suma : suma.toFixed(2)}
              </td>`).join('')}
            <td style="border: 1px solid #fff; background: #b2b3ef;"></td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  Swal.fire({
    title: 'Matriz de Adyacencia (Pesos Decimales)',
    html: tablaHTML,
    width: '750px', 
    showCloseButton: true,
    backdrop: false,
    background: 'rgba(22, 31, 75, 0.95)',
    color: '#fff',
    customClass: { popup: 'draggable-swal' },
    didOpen: () => {
      interact('.draggable-swal').draggable({
        allowFrom: '.swal2-title, .swal2-header',
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
}


const exportarGrafo = async () =>{
  const data = cy.json()
  const jsonStr = JSON.stringify(data, null, 2)

  const blob = new Blob([jsonStr], { type: "application/json" })
  const url = URL.createObjectURL(blob)


const result = await Swal.fire({
  title: "Nombre del grafo",
  input: "text",
  showCancelButton: true,
   preConfirm: (valor) => {
    if (!valor) {
      Swal.showValidationMessage("El nombre no puede estar vacío")
      return false
    }
    return valor
}}
)
if (!result.isConfirmed) return

  const nombre = result.value

  const a = document.createElement("a")
  a.href = url
  a.download = nombre+".json"
  a.click()

  URL.revokeObjectURL(url)

}

const fileInput = ref(null)

const abrirExplorador = () => {
  fileInput.value.click() 
}

const importarGrafo =(event) =>{
const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()

  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)

      
      cy.elements().remove()

      cy.json(data)

      cy.layout({ name: "cose" }).run()

      Swal.fire("Éxito", "Grafo importado correctamente", "success")

    } catch (err) {
      Swal.fire("Error", "El archivo no es válido", "error")
    }
  }

  reader.readAsText(file)

  event.target.value = ""
}
</script>

<template>
  <div class="editor-wrapper">
    <div class="toolbar">
      <div class="status-dot"></div>
      <span
        ><strong>Doble clic:</strong> Crear Nodo |
        <strong>Un clic en 2 nodos:</strong> Conectar |
        <strong>Supr:</strong> Borrar</span
      >
      <br> </br>
      <div class="color-panel">
        <span>Nodos:</span>
        <div class="color blue" @click="changeNodeColor('#4f46e5')"></div>
        <div class="color green" @click="changeNodeColor('#10b981')"></div>
        <div class="color red" @click="changeNodeColor('#efa544')"></div>

        <span style="margin-left: 15px">Aristas:</span>
        <div class="color blue" @click="changeEdgeColor('#4f46e5')"></div>
        <div class="color green" @click="changeEdgeColor('#10b981')"></div>
        <div class="color red" @click="changeEdgeColor('#efa544')"></div>
      </div>

     <div class="button-group">
  <button @click="generarMatriz" class="matrix-btn">
    Ver Matriz generada
  </button>

  <button @click="clearGraph" class="clear-btn">
    Limpiar Grafo
  </button>
</div>
    </div>
    <div ref="cyContainer" class="cy-container"></div>
    
  </div>

  <div> 
    <input 
  type="file"
  ref="fileInput"
  accept=".json"
  style="display:none"
  @change="importarGrafo"
/><panel @importar="abrirExplorador" @exportar="exportarGrafo"/></div>
 
</template>

<style scoped>
.editor-wrapper {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
  border: 1px solid #334155;
}

.toolbar {
  background: #1e293b;
  color: #f8fafc;
  padding: 12px 20px;
  font-family: "Inter", system-ui, sans-serif;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 12px;
   justify-content: flex-start;
}



.status-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 8px #10b981;
}

.cy-container {
  width: 100%;
  height: 650px;
  background: #0f172a; 
}

:deep(.swal2-input) {
  background: #334155 !important;
  color: white !important;
  border: 1px solid #475569 !important;
}

.clear-btn {

  background: #ef4444;
  border: none;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.clear-btn:hover {
  background: #eb6161;
}

.color-panel {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-right: auto;
}

.color {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid white;
  transition: transform 0.2s;
}

.color:hover {
  transform: scale(1.2);
}

.color.blue {
  background: #4f46e5;
}

.color.green {
  background: #10b981;
}

.color.red {
  background: #efa544;
}

:deep(.draggable-swal) {
  cursor: default;
  touch-action: none; 
  user-select: none;
  box-shadow: 0 20px 25px -5px rgb(255, 255, 255) !important;
}

:deep(.swal2-title) {
  cursor: move !important;
}

.button-group {
  display: flex;
  gap: 8px; 

}

.matrix-btn {
  background: #4f46e5;
  border: none;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}
.matrix-btn:hover{
   background: #7771e7;
}
</style>
