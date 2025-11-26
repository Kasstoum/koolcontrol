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
 * Change la vitesse d'un sensor (1 = Low, 2 = Medium, 3 = Fast, 4 = Auto)
 * La vitesse est appliquée globalement à tous les sensors
 * @param sensorId - ID du sensor
 * @param speed - Vitesse à définir ("1" pour Low, "2" pour Medium, "3" pour Fast, "4" pour Auto)
 * @returns Promise<void>
 */
export async function changeSensorSpeed(sensorId: number, speed: "1" | "2" | "3" | "4"): Promise<void> {
  await api.patch(`/topics/sensors/${sensorId}/`, {
    speed: speed,
  });
}

/**
 * Change la température de consigne d'un sensor
 * @param sensorId - ID du sensor
 * @param temperature - Température de consigne à définir
 * @returns Promise<void>
 */
export async function changeSensorTemperature(sensorId: number, temperature: number): Promise<void> {
  await api.patch(`/topics/sensors/${sensorId}/`, {
    setpoint_temperature: temperature,
  });
}

/**
 * Change le status d'un sensor (02 = Eteint, 03 = Allumé)
 * @param sensorId - ID du sensor
 * @param status - Status à définir ("02" pour Eteint, "03" pour Allumé)
 * @returns Promise<void>
 */
export async function changeSensorStatus(sensorId: number, status: "02" | "03"): Promise<void> {
  await api.patch(`/topics/sensors/${sensorId}/`, {
    status: status,
  });
}