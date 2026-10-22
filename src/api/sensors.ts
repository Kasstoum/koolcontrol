import type { SensorStatus, Speed } from "../domain/controls"
import { apiRequest } from "./client"

export type Sensor = {
  id: number
  name?: string
  temperature: number | null
  setpoint_temperature: number | null
  speed: string | null
  status: string | null
  topic_info?: {
    is_online?: boolean
  }
}

export async function getSensors(projectId: number): Promise<Sensor[]> {
  const response = await apiRequest<{ data: Sensor[] }>({
    path: "/topics/sensors/",
    query: { project: projectId, page: 1, page_size: 50 },
  })
  return response.data
}

export function changeSensorSpeed(sensorId: number, speed: Speed): Promise<void> {
  return apiRequest({
    method: "PATCH",
    path: `/topics/sensors/${sensorId}/`,
    body: { speed },
  })
}

export function changeSensorTemperature(sensorId: number, temperature: number): Promise<void> {
  return apiRequest({
    method: "PATCH",
    path: `/topics/sensors/${sensorId}/`,
    body: { setpoint_temperature: temperature },
  })
}

export function changeSensorStatus(sensorId: number, status: SensorStatus): Promise<void> {
  return apiRequest({
    method: "PATCH",
    path: `/topics/sensors/${sensorId}/`,
    body: { status },
  })
}
