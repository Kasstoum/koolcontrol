import { afterEach, describe, expect, it, vi } from "vitest"
import { setTokenGetter } from "./client"
import { changeProjectMode, getProjects } from "./projects"

afterEach(() => {
  vi.unstubAllGlobals()
  setTokenGetter(() => null)
})

describe("projects", () => {
  it("returns the data list for the first page", async () => {
    setTokenGetter(() => "token")
    vi.stubGlobal("fetch", async (url: string) => {
      expect(url).toBe("https://api.koolnova.com/projects/?page=1&page_size=50")
      return new Response(JSON.stringify({ data: [{ id: 4, name: "House" }] }), { status: 200 })
    })

    await expect(getProjects()).resolves.toEqual([{ id: 4, name: "House" }])
  })

  it("patches the topic mode", async () => {
    const calls: Array<{ url: string; init?: RequestInit }> = []
    vi.stubGlobal("fetch", async (url: string, init?: RequestInit) => {
      calls.push({ url, init })
      return new Response("", { status: 200 })
    })

    await changeProjectMode(9, "2")
    expect(calls[0]?.url).toBe("https://api.koolnova.com/topics/9/")
    expect(calls[0]?.init?.method).toBe("PATCH")
    expect(calls[0]?.init?.body).toBe(JSON.stringify({ mode: "2" }))
  })
})
