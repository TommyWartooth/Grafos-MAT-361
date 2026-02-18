import { createRouter, createWebHistory } from "vue-router";

import Inicio from "@/views/Inicio.vue";
import Informacion from "@/views/info.vue";
import Grafos from "@/views/Grafos.vue";

const routes = [
  {
    path: "/",
    redirect: "/inicio",
  },
  {
    path: "/inicio",
    name: "Inicio",
    component: Inicio,
  },
  {
    path: "/informacion",
    name: "Informacion",
    component: Informacion,
  },

  {
    path: "/grafos",
    name: "Grafos",
    component: Grafos,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
