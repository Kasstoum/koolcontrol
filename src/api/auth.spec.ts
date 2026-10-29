import { afterEach, describe, expect, it, vi } from "vitest"
import { login } from "./auth"

afterEach(() => vi.unstubAllGlobals())

describe("login", () => {
  it("posts credentials without a bearer token", async () => {
    const calls: Array<{ url: string; init?: RequestInit }> = []
    vi.stubGlobal("fetch", async (url: string, init?: RequestInit) => {
      calls.push({ url, init })
      return new Response(JSON.stringify({ access_token: "abc" }), { status: 200 })
    })

    await expect(login("mia", "secret")).resolves.toEqual({ access_token: "abc" })
    expect(calls[0]?.url).toBe("https://api.koolnova.com/auth/v2/login/")
    expect(calls[0]?.init?.method).toBe("POST")
    expect(calls[0]?.init?.body).toBe(JSON.stringify({ username: "mia", password: "secret" }))
    expect(new Headers(calls[0]?.init?.headers).get("Authorization")).toBeNull()
  })
})
