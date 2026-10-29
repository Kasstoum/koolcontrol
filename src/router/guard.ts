export function resolveAuthRedirect(input: {
  isAuthenticated: boolean
  path: string
  isKnown: boolean
}): "/login" | "/" | null {
  if (!input.isAuthenticated && input.path !== "/login") return "/login"
  if (input.isAuthenticated && (input.path === "/login" || !input.isKnown)) return "/"
  return null
}
