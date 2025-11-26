// src/api/sensors.ts
import { api } from "./http";

export type TopicInfo = {
  is_online?: boolean;
};

export type Sensor = {
  id: number;
  name?: string;
  temperature: number | null;
  setpoint_temperature: number | null;
  speed: string | null;
  status: string | null;
  topic_info?: TopicInfo;
};

export type SensorsResponse = {
  data: Sensor[];
};

export async function getSensors(projectId: number): Promise<Sensor[]> {
  const res = await api.get<SensorsResponse>("/topics/sensors/", {
    params: {
      project: projectId,
      page: 1,
      page_size: 50,
    },
  });
  return res.data.data;
}

/**
 * Change the speed of a sensor (1 = Low, 2 = Medium, 3 = Fast, 4 = Auto)
 * Speed is applied globally to all sensors
 * @param sensorId - Sensor ID
 * @param speed - Speed to set ("1" for Low, "2" for Medium, "3" for Fast, "4" for Auto)
 * @returns Promise<void>
 */
export async function changeSensorSpeed(sensorId: number, speed: "1" | "2" | "3" | "4"): Promise<void> {
  await api.patch(`/topics/sensors/${sensorId}/`, {
    speed: speed,
  });
}

/**
 * Change the setpoint temperature of a sensor
 * @param sensorId - Sensor ID
 * @param temperature - Setpoint temperature to set
 * @returns Promise<void>
 */
export async function changeSensorTemperature(sensorId: number, temperature: number): Promise<void> {
  await api.patch(`/topics/sensors/${sensorId}/`, {
    setpoint_temperature: temperature,
  });
}

/**
 * Change the status of a sensor (02 = Off, 03 = On)
 * @param sensorId - Sensor ID
 * @param status - Status to set ("02" for Off, "03" for On)
 * @returns Promise<void>
 */
export async function changeSensorStatus(sensorId: number, status: "02" | "03"): Promise<void> {
  await api.patch(`/topics/sensors/${sensorId}/`, {
    status: status,
  });
}