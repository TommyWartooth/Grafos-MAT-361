<template>
  <section class="catologo">
    <div class="logo">
      <a href="https://www.ucb.edu.bo">
        <img src="/imagenes/ucb.png" alt="logo" />
      </a>
    </div>
  </section>
</template>
<style scoped>
@keyframes myAnimation {
  from {
    background-color: rgba(173, 168, 221, 0);
  }
  to {
    background-color: rgba(173, 168, 221, 0.562);
  }
}

@keyframes logoculiao {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.logo {
  display: flex;

  align-items: center;
  width: 100%;
  justify-content: center;
  padding: 20px;
}
.logo img {
  width: 150;
  height: auto;
  display: block;
  justify-content: center;
  background-color: rgba(173, 168, 221, 0.562);
  border-radius: 60px;

  animation-name: myAnimation;
  animation-duration: 2s;
  animation-name: logoculiao;
  animation-duration: 2s;
}

.logo img:hover {
  background-color: rgb(173, 168, 221);
  transform: scale(1.05); /* Agranda el elemento un 10% */
  transition: 0.3s;
}
</style>
<script></script>
