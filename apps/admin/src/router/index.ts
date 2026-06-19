import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/store/auth";
import AdminLayout from "@/views/AdminLayout.vue";
import DashboardView from "@/views/DashboardView.vue";
import LoginView from "@/views/LoginView.vue";
import NavigationView from "@/views/NavigationView.vue";
import RelationsView from "@/views/RelationsView.vue";
import SearchConfigView from "@/views/SearchConfigView.vue";
import TaxonomyView from "@/views/TaxonomyView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginView
    },
    {
      path: "/",
      component: AdminLayout,
      meta: { requiresAuth: true },
      children: [
        { path: "", redirect: "/overview" },
        { path: "overview", name: "overview", component: DashboardView },
        { path: "navigation", name: "navigation", component: NavigationView },
        { path: "taxonomy", name: "taxonomy", component: TaxonomyView },
        { path: "relations", name: "relations", component: RelationsView },
        { path: "search", name: "search", component: SearchConfigView }
      ]
    }
  ]
});

router.beforeEach((to) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: "login" };
  }
  if (to.name === "login" && authStore.isAuthenticated) {
    return { name: "overview" };
  }
  return true;
});

export default router;
