import { describe, expect, it } from "vitest"
import { resolveAuthRedirect } from "./guard"

describe("resolveAuthRedirect", () => {
  it("sends guests to login and authenticated users away from login", () => {
    expect(resolveAuthRedirect({ isAuthenticated: false, path: "/", isKnown: true })).toBe("/login")
    expect(resolveAuthRedirect({ isAuthenticated: false, path: "/missing", isKnown: false })).toBe("/login")
    expect(resolveAuthRedirect({ isAuthenticated: true, path: "/login", isKnown: true })).toBe("/")
    expect(resolveAuthRedirect({ isAuthenticated: true, path: "/missing", isKnown: false })).toBe("/")
    expect(resolveAuthRedirect({ isAuthenticated: true, path: "/", isKnown: true })).toBeNull()
    expect(resolveAuthRedirect({ isAuthenticated: false, path: "/login", isKnown: true })).toBeNull()
  })
})
