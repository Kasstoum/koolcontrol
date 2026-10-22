import { describe, expect, it, vi } from "vitest"
import { ApiError } from "../api/client"
import type { Project } from "../api/projects"
import type { Sensor } from "../api/sensors"
import type { WeatherData } from "../api/weather"
import { createDashboard } from "./useDashboard"

const weather: WeatherData = {
  location: "St-Didier-de-Formans",
  temperature: 18,
  feelsLike: 17,
  humidity: 50,
  windSpeed: 10,
  weatherCode: 0,
  temperatureMax: 22,
  temperatureMin: 12,
  isDay: true,
}

const sensor: Sensor = {
  id: 11,
  name: "Living room",
  temperature: 21,
  setpoint_temperature: 20,
  speed: "2",
  status: "03",
}

function controller(overrides: Partial<Parameters<typeof createDashboard>[0]> = {}) {
  const dependencies = {
    getToken: (): string | null => "token",
    getProjects: vi.fn(async (): Promise<Project[]> => [{ id: 7, name: "House", topic: { id: 3, mode: "1", last_sync: "2026-10-21T10:00:00Z" } }]),
    getSensors: vi.fn(async () => [sensor, { ...sensor, id: 12, setpoint_temperature: 19 }]),
    getWeather: vi.fn(async () => weather),
    changeProjectMode: vi.fn(async () => undefined),
    changeSensorSpeed: vi.fn(async () => undefined),
    changeSensorTemperature: vi.fn(async () => undefined),
    changeSensorStatus: vi.fn(async () => undefined),
  }
  return { dashboard: createDashboard({ ...dependencies, ...overrides }), dependencies }
}

describe("createDashboard", () => {
  it("loads the first project, sensors, and weather", async () => {
    const { dashboard, dependencies } = controller()
    await dashboard.load()

    expect(dependencies.getSensors).toHaveBeenCalledWith(7)
    expect(dashboard.status.value).toBe("ready")
    expect(dashboard.projectName.value).toBe("House")
    expect(dashboard.projectMode.value).toBe("1")
    expect(dashboard.globalSpeed.value).toBe("2")
    expect(dashboard.canChangeMode.value).toBe(true)
    expect(dashboard.canChangeSpeed.value).toBe(true)
    expect(dashboard.weather.value?.location).toBe("St-Didier-de-Formans")
  })

  it("does not request data without a token", async () => {
    const { dashboard, dependencies } = controller({ getToken: () => null })
    await dashboard.load()
    expect(dependencies.getProjects).not.toHaveBeenCalled()
  })

  it("distinguishes an empty project list from a project without an id", async () => {
    const empty = controller({ getProjects: vi.fn(async () => []) })
    await empty.dashboard.load()
    expect(empty.dashboard.status.value).toBe("empty")
    expect(empty.dashboard.error.value).toBeNull()

    const invalid = controller({ getProjects: vi.fn(async () => [{ name: "House" } as Project]) })
    await invalid.dashboard.load()
    expect(invalid.dashboard.status.value).toBe("error")
    expect(invalid.dashboard.error.value).toBe("Unable to load data")
    expect(invalid.dependencies.getSensors).not.toHaveBeenCalled()
  })

  it("keeps sensors visible to the state when weather fails", async () => {
    const { dashboard } = controller({ getWeather: vi.fn(async () => { throw new Error("down") }) })
    await dashboard.load()
    expect(dashboard.status.value).toBe("ready")
    expect(dashboard.sensors.value).toHaveLength(2)
    expect(dashboard.weatherError.value).toBe("Unable to load weather")
    expect(dashboard.weather.value).toBeNull()
  })

  it("skips unchanged changes and retains values after a failure", async () => {
    const { dashboard, dependencies } = controller()
    await dashboard.load()

    await dashboard.changeMode("1")
    await dashboard.changeSpeed("2")
    await dashboard.changeTemperature(11, 20)
    await dashboard.changeStatus(11, "03")
    expect(dependencies.changeProjectMode).not.toHaveBeenCalled()
    expect(dependencies.changeSensorSpeed).not.toHaveBeenCalled()
    expect(dependencies.changeSensorTemperature).not.toHaveBeenCalled()
    expect(dependencies.changeSensorStatus).not.toHaveBeenCalled()

    dependencies.changeProjectMode.mockRejectedValueOnce(new ApiError(500, "Rejected"))
    await dashboard.changeMode("2")
    expect(dashboard.projectMode.value).toBe("1")
    expect(dashboard.actionError.value).toBe("Rejected")

    dependencies.changeSensorTemperature.mockRejectedValueOnce(new ApiError(500, null))
    await dashboard.changeTemperature(11, 22)
    expect(dashboard.sensors.value[0]?.setpoint_temperature).toBe(20)
    expect(dashboard.actionError.value).toBe("Unable to save the change")

    await dashboard.changeTemperature(11, 22)
    expect(dashboard.sensors.value[0]?.setpoint_temperature).toBe(22)
    expect(dashboard.sensors.value[1]?.setpoint_temperature).toBe(19)
    expect(dashboard.actionError.value).toBeNull()
  })

  it("dismisses an action error", async () => {
    const { dashboard, dependencies } = controller()
    await dashboard.load()
    dependencies.changeSensorStatus.mockRejectedValueOnce(new ApiError(500, null))
    await dashboard.changeStatus(11, "02")
    dashboard.dismissActionError()
    expect(dashboard.actionError.value).toBeNull()
    expect(dashboard.sensors.value[0]?.status).toBe("03")
  })
})
