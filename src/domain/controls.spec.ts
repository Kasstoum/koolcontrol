import { describe, expect, it } from "vitest"
import { isMode, isSpeed, modeLabel, speedLabel } from "./controls"

describe("controls", () => {
  it("labels the supported modes and speeds", () => {
    expect(modeLabel("1")).toBe("Cooling")
    expect(modeLabel("2")).toBe("Heating")
    expect(speedLabel("1")).toBe("Low")
    expect(speedLabel("2")).toBe("Medium")
    expect(speedLabel("3")).toBe("Fast")
    expect(speedLabel("4")).toBe("Auto")
    expect(speedLabel("9")).toBeNull()
  })

  it("recognizes only the supported values", () => {
    expect(isMode("1")).toBe(true)
    expect(isMode("3")).toBe(false)
    expect(isSpeed("4")).toBe(true)
    expect(isSpeed(null)).toBe(false)
  })
})
