import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import NotFound from "./components/NotFound.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: App,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
