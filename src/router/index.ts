import { createRouter, createWebHistory } from "vue-router"
import { auth } from "../composables/useAuth"
import DashboardView from "../views/DashboardView.vue"
import LoginView from "../views/LoginView.vue"
import { resolveAuthRedirect } from "./guard"

const knownPaths = new Set(["/", "/login"])

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/login", name: "login", component: LoginView },
    { path: "/", name: "dashboard", component: DashboardView },
    { path: "/:pathMatch(.*)*", name: "not-found", redirect: "/" },
  ],
})

router.beforeEach(async (to) => {
  await auth.restore()
  return resolveAuthRedirect({
    isAuthenticated: auth.token.value !== null,
    path: to.path,
    isKnown: knownPaths.has(to.path),
  }) ?? undefined
})
