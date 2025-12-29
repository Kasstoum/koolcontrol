// src/components/WeatherCard.tsx
import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { WeatherData, getWeatherCondition, getWeatherEmoji } from "../api/weather";

interface WeatherCardProps {
  weather: WeatherData | null;
  loading?: boolean;
  error?: string | null;
}

const WeatherCard = ({ weather, loading, error }: WeatherCardProps) => {
  if (loading) {
    return (
      <View className="rounded-xl p-4 mb-4 border border-amber-500/30 bg-amber-950/30">
        <View className="flex-row items-center justify-center gap-2 py-3">
          <ActivityIndicator size="small" color="#F59E0B" />
          <Text className="text-amber-200/70 text-sm">Loading weather...</Text>
        </View>
      </View>
    );
  }

  if (error || !weather) {
    return (
      <View className="rounded-xl p-4 mb-4 border border-red-500/30 bg-red-950/20">
        <View className="flex-row items-center justify-center gap-2 py-2">
          <Text className="text-xl">⚠️</Text>
          <Text className="text-red-400 text-sm">{error || "Weather unavailable"}</Text>
        </View>
      </View>
    );
  }

  const emoji = getWeatherEmoji(weather.weatherCode, weather.isDay);
  const condition = getWeatherCondition(weather.weatherCode);
  
  // Dynamic gradient colors based on weather and time
  const getGradientColors = (): [string, string, string] => {
    if (!weather.isDay) {
      // Night: deep blue to purple
      return ["#1e1b4b", "#312e81", "#1e1b4b"];
    }
    if (weather.weatherCode === 0 || weather.weatherCode === 1) {
      // Clear/Sunny: warm amber gradient
      return ["#451a03", "#78350f", "#451a03"];
    }
    if (weather.weatherCode >= 2 && weather.weatherCode <= 3) {
      // Cloudy: muted warm gray
      return ["#292524", "#44403c", "#292524"];
    }
    if (weather.weatherCode >= 51 && weather.weatherCode <= 82) {
      // Rainy: cool blue-gray
      return ["#1e293b", "#334155", "#1e293b"];
    }
    if (weather.weatherCode >= 95) {
      // Storm: purple-gray
      return ["#1e1b4b", "#3730a3", "#1e1b4b"];
    }
    // Default: warm amber
    return ["#451a03", "#78350f", "#451a03"];
  };

  // Temperature color based on value
  const getTempColor = () => {
    if (weather.temperature >= 30) return "text-orange-300";
    if (weather.temperature >= 25) return "text-amber-300";
    if (weather.temperature >= 15) return "text-yellow-200";
    if (weather.temperature >= 5) return "text-sky-300";
    return "text-cyan-300";
  };

  return (
    <View className="rounded-xl mb-4 overflow-hidden border border-amber-500/20">
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 16 }}
      >
        {/* Header label */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-1.5">
            <Text className="text-amber-400/80 text-xs font-bold uppercase tracking-widest">
              Outdoor Weather
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Text className="text-amber-200/60 text-sm">📍</Text>
            <Text className="text-amber-200/80 font-medium text-sm">{weather.location}</Text>
          </View>
        </View>

        {/* Main content row */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-3">
            <Text className="text-4xl">{emoji}</Text>
            <View className="flex-row items-baseline">
              <Text className={`text-5xl font-extrabold ${getTempColor()} tracking-tight`}>
                {weather.temperature.toFixed(1)}
              </Text>
              <Text className="text-2xl font-semibold text-amber-200/60">°C</Text>
            </View>
          </View>
          <View className="items-end">
            <Text className="text-amber-100/90 font-semibold text-base">{condition}</Text>
            <Text className="text-amber-200/50 text-sm">
              Feels like {weather.feelsLike.toFixed(0)}°
            </Text>
          </View>
        </View>

        {/* Stats row */}
        <View className="flex-row justify-between items-center pt-3 border-t border-amber-500/20">
          {/* Humidity */}
          <View className="flex-row items-center gap-1.5">
            <Text className="text-base">💧</Text>
            <Text className="text-amber-100/80 font-semibold text-sm">{weather.humidity}%</Text>
          </View>

          {/* Wind */}
          <View className="flex-row items-center gap-1.5">
            <Text className="text-base">💨</Text>
            <Text className="text-amber-100/80 font-semibold text-sm">{weather.windSpeed.toFixed(0)} km/h</Text>
          </View>

          {/* High */}
          <View className="flex-row items-center gap-1">
            <Text className="text-base">↗️</Text>
            <Text className="text-orange-300 font-semibold text-sm">{weather.temperatureMax.toFixed(0)}°</Text>
          </View>

          {/* Low */}
          <View className="flex-row items-center gap-1">
            <Text className="text-base">↘️</Text>
            <Text className="text-sky-300 font-semibold text-sm">{weather.temperatureMin.toFixed(0)}°</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default WeatherCard;
