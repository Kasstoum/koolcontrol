import { createApp } from "vue"
import { setTokenGetter, setUnauthorizedHandler } from "./api/client"
import App from "./App.vue"
import { auth } from "./composables/useAuth"
import { router } from "./router"
import "./assets/main.css"

setTokenGetter(() => auth.token.value)
setUnauthorizedHandler(() => {
  auth.logout()
  if (router.currentRoute.value.path !== "/login") void router.replace("/login")
})

void auth.restore().then(() => {
  createApp(App).use(router).mount("#app")
})
