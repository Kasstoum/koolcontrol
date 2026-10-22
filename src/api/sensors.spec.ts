import { afterEach, describe, expect, it, vi } from "vitest"
import { changeSensorSpeed, changeSensorStatus, changeSensorTemperature, getSensors } from "./sensors"

afterEach(() => vi.unstubAllGlobals())

describe("sensors", () => {
  it("loads sensors for one project", async () => {
    vi.stubGlobal("fetch", async (url: string) => {
      expect(url).toBe("https://api.koolnova.com/topics/sensors/?project=4&page=1&page_size=50")
      return new Response(JSON.stringify({ data: [{ id: 8, temperature: 21, setpoint_temperature: 20, speed: "1", status: "03" }] }), { status: 200 })
    })

    await expect(getSensors(4)).resolves.toEqual([{ id: 8, temperature: 21, setpoint_temperature: 20, speed: "1", status: "03" }])
  })

  it.each([
    ["speed", () => changeSensorSpeed(8, "4"), { speed: "4" }],
    ["temperature", () => changeSensorTemperature(8, 21.5), { setpoint_temperature: 21.5 }],
    ["status", () => changeSensorStatus(8, "02"), { status: "02" }],
  ] as const)("patches %s", async (_name, action, body) => {
    const calls: Array<RequestInit | undefined> = []
    vi.stubGlobal("fetch", async (_url: string, init?: RequestInit) => {
      calls.push(init)
      return new Response("", { status: 200 })
    })

    await action()
    expect(calls[0]?.method).toBe("PATCH")
    expect(calls[0]?.body).toBe(JSON.stringify(body))
  })
})
