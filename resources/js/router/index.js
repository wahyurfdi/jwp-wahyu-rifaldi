import { createRouter, createWebHistory } from "vue-router";

const routes = [
  { path: "/", redirect: "/todo" },
  {
    path: "/todo",
    name: "todo",
    component: () => import("@/pages/todo/Index.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  next();
});

export default router;
