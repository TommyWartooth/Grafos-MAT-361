<script setup>
import { onMounted, ref} from "vue";
import cytoscape from "cytoscape";
import Swal from "sweetalert2";

const emit = defineEmits(["init"]);
const cyContainer = ref(null);
let cy;
let selectedNode = null;
let nodeCount = 1;

// Configuración del Toast (reutilizado de tu código original)
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

  // Notificar al padre que la instancia está lista
  emit("init", cy);

  // --- EVENTO: CREAR NODO (DOBLE CLIC EN FONDO) ---
  cy.on("dbltap", async (event) => {
    if (event.target === cy) {
      const { value: nombreNodo } = await Swal.fire({
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
            return false;
          }
          return value;
        },
      });

      if (nombreNodo) {
        cy.add({
          group: "nodes",
          data: { id: `n${nodeCount}`, label: nombreNodo },
          position: event.position,
        });
        nodeCount++;
      }
    }
  });

  // --- EVENTO: CONECTAR NODOS (CLIC EN NODO) ---
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
            <input id="swal-weight" class="swal2-input" type="number" step="any" value="1" style="width: 80%; margin: 0 auto 20px auto; display: block;">
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

  // --- EVENTO: EDITAR ARISTA (DOBLE CLIC EN ARISTA) ---
  cy.on("dbltap", "edge", async (event) => {
    const edge = event.target;
    const esDirigida = edge.style("target-arrow-shape") !== "none";

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
            <input type="checkbox" id="swal-directed" ${esDirigida ? "checked" : ""}
              style="width: 20px; height: 20px;">
            <label for="swal-directed">¿Es una arista dirigida?</label>
          </div>
        </div>
      `,
      preConfirm: () => {
        const weight = document.getElementById("swal-weight").value;
        const isDirected = document.getElementById("swal-directed").checked;
        if (weight === "") {
          Toast.fire({ icon: "error", title: "El peso no puede estar vacío" });
          return false;
        }
        return { weight, isDirected };
      },
    });

    if (formValues) {
      edge.data("weight", formValues.weight);
      edge.style("target-arrow-shape", formValues.isDirected ? "triangle" : "none");
      Toast.fire({ icon: "success", title: "Arista actualizada" });
    }
  });

  // --- BORRAR CON TECLADO ---
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
</script>

<template>
  <div ref="cyContainer" class="cy-container"></div>
</template>

<style scoped>
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
</style>