import { describe, expect, it } from "vitest"
import { temperatureGap } from "./sensorDisplay"

describe("temperatureGap", () => {
  it("classifies the difference around the setpoint", () => {
    expect(temperatureGap(21, 20)).toBe("up")
    expect(temperatureGap(19, 20)).toBe("down")
    expect(temperatureGap(20.5, 20)).toBe("ok")
    expect(temperatureGap(null, 20)).toBeNull()
  })
})
