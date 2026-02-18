<script setup>
import { ref } from "vue";
defineProps({
  titu: String,
  imgn: String,
});
</script>

<template>
  <section class="malditasea">
    <div class="imagen">
      <img :src="imgn" alt="imagen" />
      <div class="titulo">
        <h1>{{ titu }}</h1>
      </div>
    </div>
  </section>
</template>

<style scoped>
.imagen {
  position: relative;
  width: 100%;
}

.imagen img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  display: block;
  opacity: 0.45;
}

.titulo {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 52px;
  font-weight: bold;
  text-align: center;
}

.titulo h1 {
  margin: 0;
  background-color: rgba(44, 44, 73, 0.89);
  border-radius: 30px;
  padding: 20px;
}
</style>
