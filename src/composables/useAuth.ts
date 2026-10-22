import { ref, type Ref } from "vue"
import { login as requestKoolNovaLogin } from "../api/auth"

const TOKEN_KEY = "koolcontrol_token"

export type TokenStorage = {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

type AuthController = {
  token: Ref<string | null>
  isLoading: Ref<boolean>
  restore: () => Promise<void>
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

export function createAuth(dependencies: {
  storage: TokenStorage
  requestLogin: (username: string, password: string) => Promise<{ access_token: string }>
}): AuthController {
  const token = ref<string | null>(null)
  const isLoading = ref(true)
  let restorePromise: Promise<void> | null = null

  function restore(): Promise<void> {
    restorePromise ??= Promise.resolve().then(() => {
      token.value = dependencies.storage.getItem(TOKEN_KEY)
      isLoading.value = false
    })
    return restorePromise
  }

  async function login(username: string, password: string): Promise<void> {
    const response = await dependencies.requestLogin(username, password)
    token.value = response.access_token
    dependencies.storage.setItem(TOKEN_KEY, response.access_token)
  }

  function logout(): void {
    token.value = null
    dependencies.storage.removeItem(TOKEN_KEY)
  }

  return { token, isLoading, restore, login, logout }
}

const browserStorage = (globalThis as { localStorage?: TokenStorage }).localStorage

export const auth = browserStorage
  ? createAuth({
      storage: browserStorage,
      requestLogin: requestKoolNovaLogin,
    })
  : undefined

export function useAuth(): AuthController {
  if (!auth) {
    throw new Error("localStorage is unavailable")
  }
  return auth
}
