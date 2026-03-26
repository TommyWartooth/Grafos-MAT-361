<script setup>
import { ref } from "vue";

import GraphCanvas from "../components/grafos/GraphCanvas.vue";
import GraphToolbar from "../components/grafos/GraphToolbar.vue";
import AdjacencyMatrix from "../components/grafos/AdjacencyMatrix.vue";
import GraphPanel from "../components/grafos/panel.vue"
import Swal from "sweetalert2";

// --- ESTADO ---
const cyInstance = ref(null);
const matrixRef = ref(null);
const fileInput = ref(null);
const modoActual = ref('normal');
// --- MÉTODOS ---

// 1. Capturar la instancia de Cytoscape cuando el Canvas se monta
const handleInit = (cy) => {
  cyInstance.value = cy;
};

// 2. Limpiar todo el grafo
const handleClearGraph = () => {
  if (!cyInstance.value) return;
  
  cyInstance.value.elements().remove();
  // Reiniciar contadores si es necesario (puedes mover nodeCount aquí si prefieres)
  
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "info",
    title: "Grafo eliminado",
    showConfirmButton: false,
    timer: 2000,
    background: "#1e293b",
    color: "#fff",
  });
};

// 3. Exportar Grafo (JSON)
const handleExport = async () => {
  if (!cyInstance.value) return;

  const data = cyInstance.value.json();
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const { value: nombre } = await Swal.fire({
    title: "Nombre del archivo",
    input: "text",
    inputPlaceholder: "mi-grafo",
    showCancelButton: true,
    background: "#1e293b",
    color: "#fff",
    preConfirm: (valor) => {
      if (!valor) {
        Swal.showValidationMessage("El nombre no puede estar vacío");
        return false;
      }
      return valor;
    }
  });

  if (nombre) {
    const a = document.createElement("a");
    a.href = url;
    a.download = `${nombre}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
};

// 4. Importar Grafo (JSON)
const triggerFileInput = () => {
  fileInput.value.click();
};

const handleImport = (event) => {
  const file = event.target.files[0];
  if (!file || !cyInstance.value) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      cyInstance.value.elements().remove();
      cyInstance.value.json(data);
      cyInstance.value.layout({ name: "cose" }).run(); // Re-acomodar nodos
      
      Swal.fire("Éxito", "Grafo importado correctamente", "success");
    } catch (err) {
      Swal.fire("Error", "El archivo no es válido", "error");
    }
  };
  reader.readAsText(file);
  event.target.value = ""; // Limpiar input
};

const handleEjecutarAlgoritmo = () => {
  if (modoActual.value === 'cpm') {
    console.log("Calculando CPM...");
    // Aquí llamas a tu función de CPM
  }
};
</script>

<template>
  <div class="main-editor">
    <div class="editor-wrapper">
      <GraphToolbar 
  :cy="cyInstance" 
  :modo="modoActual" 
  @cambiarModo="(m) => modoActual = m"
  @ejecutarAlgoritmo="handleEjecutarAlgoritmo"
  @generarMatriz="matrixRef.mostrarMatriz()" 
  @clearGraph="handleClearGraph" 
/>

      <GraphCanvas @init="handleInit" />
      
      <AdjacencyMatrix ref="matrixRef" :cy="cyInstance" />
    </div>

    <div class="footer-panel">
      <input 
        type="file" 
        ref="fileInput" 
        accept=".json" 
        style="display:none" 
        @change="handleImport"
      />
      <GraphPanel @importar="triggerFileInput" @exportar="handleExport" />
    </div>
  </div>
</template>

<style scoped>
.main-editor {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background-color: #020617;
  min-height: 100vh;
}

.editor-wrapper {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
  border: 1px solid #334155;
  background: #1e293b;
}

.footer-panel {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

/* Ajustes globales para que el editor se vea bien en pantallas grandes */
@media (min-width: 1200px) {
  .editor-wrapper {
    max-width: 1200px;
    margin: 0 auto;
  }
}
</style>