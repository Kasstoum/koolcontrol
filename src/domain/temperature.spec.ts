import { describe, expect, it } from "vitest"
import { TEMPERATURE_PRESETS, adjustTemperature, clampTemperature, initialTemperature } from "./temperature"

describe("temperature", () => {
  it("clamps and rounds to half degrees", () => {
    expect(clampTemperature(14)).toBe(15)
    expect(clampTemperature(31)).toBe(30)
    expect(clampTemperature(20.24)).toBe(20)
    expect(adjustTemperature(30, 0.5)).toBe(30)
    expect(adjustTemperature(15, -0.5)).toBe(15)
    expect(initialTemperature(null)).toBe(20)
    expect(TEMPERATURE_PRESETS).toEqual([18, 20, 22, 24, 26])
  })
})
