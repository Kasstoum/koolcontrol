import { apiRequest } from "./client"

export function login(username: string, password: string): Promise<{ access_token: string }> {
  return apiRequest({
    method: "POST",
    path: "/auth/v2/login/",
    body: { username, password },
    auth: false,
  })
}
