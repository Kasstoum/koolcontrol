// src/api/weather.ts
// Open-Meteo API - Free, no API key required

// Saint-Didier-de-Formans, Ain, France
const LATITUDE = 45.97;
const LONGITUDE = 4.78;
const LOCATION_NAME = "St-Didier-de-Formans";

export type WeatherData = {
  location: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  temperatureMax: number;
  temperatureMin: number;
  isDay: boolean;
};

// Weather code to condition mapping (WMO codes)
export const getWeatherCondition = (code: number): string => {
  const conditions: Record<number, string> = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };
  return conditions[code] || "Unknown";
};

// Weather code to emoji mapping
export const getWeatherEmoji = (code: number, isDay: boolean): string => {
  if (code === 0) return isDay ? "☀️" : "🌙";
  if (code === 1) return isDay ? "🌤️" : "🌙";
  if (code === 2) return "⛅";
  if (code === 3) return "☁️";
  if (code === 45 || code === 48) return "🌫️";
  if (code >= 51 && code <= 57) return "🌧️";
  if (code >= 61 && code <= 67) return "🌧️";
  if (code >= 71 && code <= 77) return "🌨️";
  if (code >= 80 && code <= 82) return "🌦️";
  if (code >= 85 && code <= 86) return "🌨️";
  if (code >= 95) return "⛈️";
  return "🌡️";
};

export async function getWeather(): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: LATITUDE.toString(),
    longitude: LONGITUDE.toString(),
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day",
    daily: "temperature_2m_max,temperature_2m_min",
    timezone: "Europe/Paris",
    forecast_days: "1",
  });

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }

  const data = await response.json();

  return {
    location: LOCATION_NAME,
    temperature: data.current.temperature_2m,
    feelsLike: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    weatherCode: data.current.weather_code,
    temperatureMax: data.daily.temperature_2m_max[0],
    temperatureMin: data.daily.temperature_2m_min[0],
    isDay: data.current.is_day === 1,
  };
}

