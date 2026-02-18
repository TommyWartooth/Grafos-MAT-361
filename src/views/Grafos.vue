<script setup>
import { onMounted, ref } from "vue";
import cytoscape from "cytoscape";
import Swal from "sweetalert2";

const cyContainer = ref(null);
let cy;
let selectedNode = null;
let nodeCount = 1;

// Configuración de Toast para avisos rápidos
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
          "target-arrow-shape": "circle",
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

  cy.on("dbltap", (event) => {
    if (event.target === cy) {
      cy.add({
        group: "nodes",
        data: { id: `n${nodeCount}`, label: `${nodeCount}` },
        position: event.position,
      });
      nodeCount++;
    }
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
            <input id="swal-weight" class="swal2-input" type="number" value="1" style="width: 80%; margin: 0 auto 20px auto; display: block;">
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
      <button @click="clearGraph" class="clear-btn">Limpiar Grafo</button>
    </div>
    <div ref="cyContainer" class="cy-container"></div>
  </div>
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
  background: #0f172a; /* Fondo ultra oscuro */
}

/* Estilos para que los inputs de Swal se vean bien */
:deep(.swal2-input) {
  background: #334155 !important;
  color: white !important;
  border: 1px solid #475569 !important;
}

.clear-btn {
  margin-left: auto;
  background: #ef4444;
  border: none;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.clear-btn:hover {
  background: #dc2626;
}
</style>
