<script setup>

import Swal from "sweetalert2";

const props = defineProps({
  cy: { type: Object, default: null }
});

const emit = defineEmits(['generarMatriz', 'clearGraph']);

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  background: "#1e293b",
  color: "#fff",
});

// --- Lógica de Colores ---
const changeNodeColor = (color) => {
  if (!props.cy) return;
  const selected = props.cy.$("node:selected");
  if (selected.length === 0) return Toast.fire({ icon: "warning", title: "Selecciona un nodo" });
  selected.style("background-color", color);
};

const changeEdgeColor = (color) => {
  if (!props.cy) return;
  const selected = props.cy.$("edge:selected");
  if (selected.length === 0) return Toast.fire({ icon: "warning", title: "Selecciona una arista" });
  selected.style({ "line-color": color, "target-arrow-color": color });
};

// --- Acción de Borrar Selección ---
const deleteSelected = () => {
  if (!props.cy) return;
  const selectedEles = props.cy.$(":selected");
  if (selectedEles.length > 0) {
    props.cy.remove(selectedEles);
    Toast.fire({ icon: "info", title: "Eliminado" });
  } else {
    Toast.fire({ icon: "warning", title: "Nada seleccionado" });
  }
};
</script>

<template>
  <div class="toolbar">
    <div class="status-dot"></div>
    
    <div class="control-group">
      <span>Nodos</span>
      <div class="color-dots">
        <div class="dot blue" @click="changeNodeColor('#4f46e5')"></div>
        <div class="dot green" @click="changeNodeColor('#10b981')"></div>
        <div class="dot orange" @click="changeNodeColor('#efa544')"></div>
      </div>
    </div>

    <div class="control-group">
      <span>Aristas</span>
      <div class="color-dots">
        <div class="dot blue" @click="changeEdgeColor('#4f46e5')"></div>
        <div class="dot green" @click="changeEdgeColor('#10b981')"></div>
        <div class="dot orange" @click="changeEdgeColor('#efa544')"></div>
      </div>
    </div>

    <div class="button-group">
      <button @click="deleteSelected" class="delete-selection-btn" title="Borrar seleccionado">
        Borrar
      </button>
      
      <button @click="emit('generarMatriz')" class="matrix-btn">
        Ver Matriz
      </button>

      <button @click="emit('clearGraph')" class="clear-btn">
        Limpiar Todo
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Tus estilos anteriores + estos nuevos */
.color-dots {
  display: flex;
  gap: 4px;
}

.button-group {
  display: flex;
  gap: 8px;
  margin-left: auto; /* Empuja los botones a la derecha */
}

.delete-selection-btn {
  background: #475569;
  border: none;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.delete-selection-btn:hover {
  background: #64748b;
}

.control-group {

  display: flex;

  align-items: center;

  gap: 8px;

  padding: 0 10px;

  border-right: 1px solid #334155;

}

.dot {

  width: 18px;

  height: 18px;

  border-radius: 50%;

  cursor: pointer;

  border: 2px solid white;

}

.blue { background: #4f46e5; }

.green { background: #10b981; }

.orange { background: #efa544; }

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