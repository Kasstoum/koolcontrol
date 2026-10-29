import { computed, ref, type ComputedRef, type Ref } from "vue"
import { messageFrom } from "../api/client"
import { changeProjectMode, getProjects, type Project } from "../api/projects"
import { changeSensorSpeed, changeSensorStatus, changeSensorTemperature, getSensors, type Sensor } from "../api/sensors"
import { getWeather, type WeatherData } from "../api/weather"
import { isMode, isSpeed, type Mode, type SensorStatus, type Speed } from "../domain/controls"
import { auth } from "./useAuth"

type DashboardStatus = "loading" | "ready" | "empty" | "error"

export type DashboardController = {
  projectName: Ref<string>
  projectMode: Ref<Mode | null>
  globalSpeed: Ref<Speed | null>
  lastSync: Ref<string | null>
  sensors: Ref<Sensor[]>
  status: Ref<DashboardStatus>
  refreshing: Ref<boolean>
  error: Ref<string | null>
  actionError: Ref<string | null>
  weather: Ref<WeatherData | null>
  weatherLoading: Ref<boolean>
  weatherError: Ref<string | null>
  canChangeMode: ComputedRef<boolean>
  canChangeSpeed: ComputedRef<boolean>
  load: (isRefresh?: boolean) => Promise<void>
  dismissActionError: () => void
  changeMode: (mode: Mode) => Promise<void>
  changeSpeed: (speed: Speed) => Promise<void>
  changeTemperature: (sensorId: number, temperature: number) => Promise<void>
  changeStatus: (sensorId: number, status: SensorStatus) => Promise<void>
}

type DashboardDependencies = {
  getToken: () => string | null
  getProjects: () => Promise<Project[]>
  getSensors: (projectId: number) => Promise<Sensor[]>
  getWeather: () => Promise<WeatherData>
  changeProjectMode: (topicId: number, mode: Mode) => Promise<void>
  changeSensorSpeed: (sensorId: number, speed: Speed) => Promise<void>
  changeSensorTemperature: (sensorId: number, temperature: number) => Promise<void>
  changeSensorStatus: (sensorId: number, status: SensorStatus) => Promise<void>
}

export function createDashboard(dependencies: DashboardDependencies): DashboardController {
  const projectName = ref("")
  const projectMode = ref<Mode | null>(null)
  const globalSpeed = ref<Speed | null>(null)
  const lastSync = ref<string | null>(null)
  const topicId = ref<number | null>(null)
  const sensors = ref<Sensor[]>([])
  const status = ref<DashboardStatus>("loading")
  const refreshing = ref(false)
  const error = ref<string | null>(null)
  const actionError = ref<string | null>(null)
  const weather = ref<WeatherData | null>(null)
  const weatherLoading = ref(false)
  const weatherError = ref<string | null>(null)
  const canChangeMode = computed(() => projectMode.value !== null && topicId.value !== null)
  const canChangeSpeed = computed(() => globalSpeed.value !== null && sensors.value.length > 0)

  function clearProject(): void {
    projectName.value = ""
    projectMode.value = null
    globalSpeed.value = null
    lastSync.value = null
    topicId.value = null
    sensors.value = []
  }

  async function load(isRefresh = false): Promise<void> {
    if (!dependencies.getToken()) return
    if (isRefresh) refreshing.value = true
    else status.value = "loading"
    error.value = null
    weatherLoading.value = true
    weatherError.value = null

    const weatherPromise = dependencies.getWeather()
      .then((data) => {
        weather.value = data
      })
      .catch(() => {
        weather.value = null
        weatherError.value = "Unable to load weather"
      })
      .finally(() => {
        weatherLoading.value = false
      })

    try {
      const projects = await dependencies.getProjects()
      const first = projects[0]
      if (!first) {
        clearProject()
        status.value = "empty"
        return
      }
      if (typeof first.id !== "number") {
        status.value = "error"
        error.value = "Unable to load data"
        return
      }

      const nextSensors = await dependencies.getSensors(first.id)
      projectName.value = first.name || ""
      projectMode.value = isMode(first.topic?.mode) ? first.topic.mode : null
      lastSync.value = first.topic?.last_sync ?? null
      topicId.value = typeof first.topic?.id === "number" ? first.topic.id : null
      sensors.value = nextSensors
      globalSpeed.value = isSpeed(nextSensors[0]?.speed) ? nextSensors[0].speed : null
      status.value = "ready"
    } catch (caught) {
      status.value = "error"
      error.value = messageFrom(caught, "Unable to load data")
    } finally {
      refreshing.value = false
      await weatherPromise
    }
  }

  function dismissActionError(): void {
    actionError.value = null
  }

  async function changeMode(mode: Mode): Promise<void> {
    if (topicId.value === null || projectMode.value === mode) return
    try {
      await dependencies.changeProjectMode(topicId.value, mode)
      projectMode.value = mode
      actionError.value = null
    } catch (caught) {
      actionError.value = messageFrom(caught, "Unable to save the change")
    }
  }

  async function changeSpeed(speed: Speed): Promise<void> {
    const sensorId = sensors.value[0]?.id
    if (sensorId === undefined || globalSpeed.value === speed) return
    try {
      await dependencies.changeSensorSpeed(sensorId, speed)
      globalSpeed.value = speed
      actionError.value = null
    } catch (caught) {
      actionError.value = messageFrom(caught, "Unable to save the change")
    }
  }

  async function changeTemperature(sensorId: number, temperature: number): Promise<void> {
    const current = sensors.value.find((sensor) => sensor.id === sensorId)
    if (!current || current.setpoint_temperature === temperature) return
    try {
      await dependencies.changeSensorTemperature(sensorId, temperature)
      sensors.value = sensors.value.map((sensor) => sensor.id === sensorId ? { ...sensor, setpoint_temperature: temperature } : sensor)
      actionError.value = null
    } catch (caught) {
      actionError.value = messageFrom(caught, "Unable to save the change")
    }
  }

  async function changeStatus(sensorId: number, statusValue: SensorStatus): Promise<void> {
    const current = sensors.value.find((sensor) => sensor.id === sensorId)
    if (!current || current.status === statusValue) return
    try {
      await dependencies.changeSensorStatus(sensorId, statusValue)
      sensors.value = sensors.value.map((sensor) => sensor.id === sensorId ? { ...sensor, status: statusValue } : sensor)
      actionError.value = null
    } catch (caught) {
      actionError.value = messageFrom(caught, "Unable to save the change")
    }
  }

  return {
    projectName,
    projectMode,
    globalSpeed,
    lastSync,
    sensors,
    status,
    refreshing,
    error,
    actionError,
    weather,
    weatherLoading,
    weatherError,
    canChangeMode,
    canChangeSpeed,
    load,
    dismissActionError,
    changeMode,
    changeSpeed,
    changeTemperature,
    changeStatus,
  }
}

export const dashboard = createDashboard({
  getToken: () => auth.token.value,
  getProjects,
  getSensors,
  getWeather,
  changeProjectMode,
  changeSensorSpeed,
  changeSensorTemperature,
  changeSensorStatus,
})

export function useDashboard(): DashboardController {
  return dashboard
}
