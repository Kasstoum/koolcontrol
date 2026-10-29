import { afterEach, describe, expect, it, vi } from "vitest"
import { ApiError, apiRequest, messageFrom, setTokenGetter, setUnauthorizedHandler } from "./client"

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
  setTokenGetter(() => null)
  setUnauthorizedHandler(() => {})
})

describe("apiRequest", () => {
  it("sends the bearer token and query", async () => {
    const calls: Array<{ url: string; init?: RequestInit }> = []
    setTokenGetter(() => "secret-token")
    vi.stubGlobal("fetch", async (url: string, init?: RequestInit) => {
      calls.push({ url, init })
      return jsonResponse(200, { data: [] })
    })

    const result = await apiRequest<{ data: unknown[] }>({
      path: "/projects/",
      query: { page: 1, page_size: 50 },
    })

    expect(result).toEqual({ data: [] })
    expect(calls[0]?.url).toBe("https://api.koolnova.com/projects/?page=1&page_size=50")
    expect(new Headers(calls[0]?.init?.headers).get("Authorization")).toBe("Bearer secret-token")
  })

  it("does not attach a token or end the session for login", async () => {
    const onUnauthorized = vi.fn()
    setTokenGetter(() => "secret-token")
    setUnauthorizedHandler(onUnauthorized)
    vi.stubGlobal("fetch", async () => jsonResponse(401, { detail: "Invalid credentials" }))

    await expect(apiRequest({
      method: "POST",
      path: "/auth/v2/login/",
      body: { username: "mia", password: "secret" },
      auth: false,
    })).rejects.toMatchObject({ status: 401, detail: "Invalid credentials" })
    expect(onUnauthorized).not.toHaveBeenCalled()
  })

  it("ends the session when an authenticated request returns 401", async () => {
    const onUnauthorized = vi.fn()
    setTokenGetter(() => "secret-token")
    setUnauthorizedHandler(onUnauthorized)
    vi.stubGlobal("fetch", async () => jsonResponse(401, { detail: "Expired" }))

    await expect(apiRequest({ path: "/projects/" })).rejects.toBeInstanceOf(ApiError)
    expect(onUnauthorized).toHaveBeenCalledOnce()
  })

  it("uses the supplied fallback when no detail exists", async () => {
    vi.stubGlobal("fetch", async () => new Response("nope", { status: 500 }))

    const error = await apiRequest({ path: "/projects/", auth: false }).catch((caught: unknown) => caught)

    expect(messageFrom(error, "Unable to load data")).toBe("Unable to load data")
    expect(messageFrom(error, "Unable to connect.")).toBe("Unable to connect.")
  })

  it("aborts after the requested timeout", async () => {
    vi.useFakeTimers()
    vi.stubGlobal("fetch", (_url: string, init?: RequestInit) => new Promise((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => {
        reject(Object.assign(new Error("Aborted"), { name: "AbortError" }))
      })
    }))

    const pending = apiRequest({ path: "/projects/", auth: false, timeoutMs: 10000 })
    const assertion = expect(pending).rejects.toMatchObject({ status: 0, detail: null })
    await vi.advanceTimersByTimeAsync(10000)
    await assertion
  })
})
