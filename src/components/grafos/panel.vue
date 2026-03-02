<script setup>
import { ref } from "vue";
defineEmits(['importar', 'exportar'])
</script>

<template>
<div class="botones">
    <button @click="$emit('importar')" class="bt">
        Importar Grafo
    </button>
    <button @click="$emit('exportar')" class="bt">
        Exportar Grafo
    </button>

</div>
</template>

<style scoped>

.botones{
  
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 52px;
  font-weight: bold;
  text-align: center;
  gap: 15px; /* Espacio entre botones */
  padding: 20px;
  background: #1e293b; /* Color opcional para que combine */
}

.bt{
    padding: 20px;
    background: #4f46e5;
  border: none;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 20px;

}

.bt:hover{
    background: #7771e7;
 
}
</style>