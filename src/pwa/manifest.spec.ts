import { describe, expect, it } from "vitest"
import { pwaManifest } from "./manifest"

describe("pwaManifest", () => {
  it("describes an installable standalone application", () => {
    expect(pwaManifest).toMatchObject({
      name: "KoolControl",
      short_name: "KoolControl",
      start_url: ".",
      display: "standalone",
      theme_color: "#3B82F6",
      background_color: "#3B82F6",
    })
    expect(pwaManifest.icons).toEqual([
      { src: "/logo.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/logo192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/logo512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ])
  })
})
