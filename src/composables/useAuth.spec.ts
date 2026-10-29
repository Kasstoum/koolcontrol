import { describe, expect, it, vi } from "vitest"
import { createAuth, type TokenStorage } from "./useAuth"

function memoryStorage(): TokenStorage {
  const values = new Map<string, string>()
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  }
}

describe("createAuth", () => {
  it("restores, stores, and removes the token", async () => {
    const storage = memoryStorage()
    storage.setItem("koolcontrol_token", "saved-token")
    const requestLogin = vi.fn(async () => ({ access_token: "new-token" }))
    const session = createAuth({ storage, requestLogin })

    await session.restore()
    expect(session.token.value).toBe("saved-token")
    expect(session.isLoading.value).toBe(false)

    await session.login("mia", "secret")
    expect(requestLogin).toHaveBeenCalledWith("mia", "secret")
    expect(session.token.value).toBe("new-token")
    expect(storage.getItem("koolcontrol_token")).toBe("new-token")

    session.logout()
    expect(session.token.value).toBeNull()
    expect(storage.getItem("koolcontrol_token")).toBeNull()
  })

  it("restores only once", async () => {
    const storage = memoryStorage()
    const session = createAuth({ storage, requestLogin: vi.fn() })
    await session.restore()
    storage.setItem("koolcontrol_token", "late-token")
    await session.restore()
    expect(session.token.value).toBeNull()
  })
})
