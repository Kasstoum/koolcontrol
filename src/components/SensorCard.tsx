import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Sensor } from "../api/sensors";

interface SensorCardProps {
  sensor: Sensor;
  onTemperaturePress?: (sensor: Sensor) => void;
  onStatusPress?: (sensor: Sensor) => void;
}

const SensorCard = ({ sensor, onTemperaturePress, onStatusPress }: SensorCardProps) => {
  const name = sensor.name;
  const temp = sensor.temperature;
  const setpoint = sensor.setpoint_temperature;
  const isOnline = sensor.topic_info?.is_online ?? true;

  const diff =
    typeof temp === "number" && typeof setpoint === "number"
      ? temp - setpoint
      : null;

  return (
    <View className="bg-slate-800 rounded-xl p-3 mb-2 border border-slate-700 shadow-md flex-1 mx-1.5">
      <View className="flex-row justify-between items-center mb-3 pb-3 border-b border-slate-700">
        <View className="flex-row items-center gap-1.5 flex-1">
          <Text className="text-lg font-bold text-slate-50 tracking-tight">{name}</Text>
          {isOnline !== undefined && (
            <View className={`w-2 h-2 rounded-full ${
              isOnline ? "bg-emerald-500" : "bg-slate-500"
            }`} />
          )}
        </View>
        <View className="flex-row items-center gap-2">
          {typeof temp === "number" && (
            <View className="flex-row items-baseline gap-0.5">
              <Text className="text-xl font-extrabold text-blue-400 tracking-tight">{temp.toFixed(1)}</Text>
              <Text className="text-sm font-semibold text-slate-400">°C</Text>
            </View>
          )}
          {typeof temp === "number" && typeof setpoint === "number" && (
            <View className={`w-6 h-6 rounded-full justify-center items-center ${
              diff !== null && diff > 0.5 ? "bg-orange-500" : 
              diff !== null && diff < -0.5 ? "bg-blue-400" : 
              "bg-emerald-500"
            }`}>
              <Text className="text-xs font-bold">
                {diff !== null && diff > 0.5 ? "↑" : diff !== null && diff < -0.5 ? "↓" : "✓"}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View className="flex-row justify-between items-center">
        <TouchableOpacity
          onPress={() => onTemperaturePress?.(sensor)}
          disabled={!onTemperaturePress || setpoint === null || setpoint === undefined}
          className={`flex-1 items-center gap-1.5 justify-center ${onTemperaturePress && setpoint !== null && setpoint !== undefined ? "active:opacity-80" : ""}`}
        >
          <Text className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Consigne</Text>
          <Text className={`text-sm font-semibold ${onTemperaturePress && setpoint !== null && setpoint !== undefined ? "text-blue-400" : "text-slate-50"}`}>
            {setpoint !== null && setpoint !== undefined
              ? `${setpoint.toFixed(1)}°C`
              : "-"}
          </Text>
        </TouchableOpacity>

        <View className="w-px h-7 bg-slate-700 mx-1.5" />

        <TouchableOpacity
          onPress={() => onStatusPress?.(sensor)}
          disabled={!onStatusPress || sensor.status === null || sensor.status === undefined}
          className={`flex-1 items-center gap-1.5 justify-center ${onStatusPress && sensor.status !== null && sensor.status !== undefined ? "active:opacity-80" : ""}`}
        >
          <Text className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Status</Text>
          {sensor.status !== null && sensor.status !== undefined ? (
            (() => {
              const isOn = sensor.status === "03";
              const isOff = sensor.status === "02";
              if (!isOn && !isOff) {
                return <Text className="text-sm text-slate-50 font-semibold">-</Text>;
              }
              return (
                <>
                  <View className={`w-3 h-3 rounded-full ${
                    isOn 
                      ? "bg-emerald-500 shadow-md shadow-emerald-500/80" 
                      : "bg-slate-500 opacity-40"
                  }`} />
                  <Text className={`text-xs font-bold text-center ${
                    isOn ? "text-emerald-500" : "text-slate-500"
                  }`}>
                    {isOn ? "Allumé" : "Eteint"}
                  </Text>
                </>
              );
            })()
          ) : (
            <Text className="text-sm text-slate-50 font-semibold">-</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SensorCard;

