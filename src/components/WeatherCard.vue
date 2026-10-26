<script setup lang="ts">
import { computed } from "vue"
import { getWeatherCondition, getWeatherEmoji, type WeatherData } from "../api/weather"

const props = defineProps<{ weather: WeatherData | null; loading: boolean; error: string | null }>()

const gradient = computed(() => {
  const weather = props.weather
  if (!weather) return "#451a03,#78350f,#451a03"
  if (!weather.isDay) return "#1e1b4b,#312e81,#1e1b4b"
  if (weather.weatherCode === 0 || weather.weatherCode === 1) return "#451a03,#78350f,#451a03"
  if (weather.weatherCode >= 2 && weather.weatherCode <= 3) return "#292524,#44403c,#292524"
  if (weather.weatherCode >= 51 && weather.weatherCode <= 82) return "#1e293b,#334155,#1e293b"
  if (weather.weatherCode >= 95) return "#1e1b4b,#3730a3,#1e1b4b"
  return "#451a03,#78350f,#451a03"
})

function temperatureClass(temperature: number): string {
  if (temperature >= 30) return "text-orange-300"
  if (temperature >= 25) return "text-amber-300"
  if (temperature >= 15) return "text-yellow-200"
  if (temperature >= 5) return "text-sky-300"
  return "text-cyan-300"
}
</script>

<template>
  <section v-if="loading" class="mb-4 rounded-xl border border-amber-500/30 bg-amber-950/30 p-4 text-center text-sm text-amber-200/70">
    Loading weather...
  </section>
  <section v-else-if="error || !weather" class="mb-4 rounded-xl border border-red-500/30 bg-red-950/20 p-4 text-center text-sm text-red-400">
    {{ error || "Weather unavailable" }}
  </section>
  <section v-else class="mb-4 overflow-hidden rounded-xl border border-amber-500/20 p-4" :style="{ backgroundImage: `linear-gradient(135deg, ${gradient})` }">
    <div class="mb-3 flex items-center justify-between gap-2">
      <p class="text-xs font-bold uppercase tracking-widest text-amber-400/80">Outdoor Weather</p>
      <p class="flex items-center gap-1 text-sm font-medium text-amber-200/80"><span aria-hidden="true">📍</span>{{ weather.location }}</p>
    </div>
    <div class="mb-3 flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <span class="shrink-0 text-4xl">{{ getWeatherEmoji(weather.weatherCode, weather.isDay) }}</span>
        <p class="text-4xl font-extrabold tracking-tight sm:text-5xl" :class="temperatureClass(weather.temperature)">
          {{ weather.temperature.toFixed(1) }}<span class="text-2xl font-semibold text-amber-200/60">°C</span>
        </p>
      </div>
      <div class="text-right">
        <p class="font-semibold text-amber-100/90">{{ getWeatherCondition(weather.weatherCode) }}</p>
        <p class="text-sm text-amber-200/50">Feels like {{ weather.feelsLike.toFixed(0) }}°</p>
      </div>
    </div>
    <div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-amber-500/20 pt-3 text-sm font-semibold">
      <span class="flex items-center gap-1.5 text-amber-100/80"><span class="shrink-0" aria-hidden="true">💧</span>{{ weather.humidity }}%</span>
      <span class="flex items-center gap-1.5 text-amber-100/80"><span class="shrink-0" aria-hidden="true">💨</span>{{ weather.windSpeed.toFixed(0) }} km/h</span>
      <span class="flex items-center gap-1 text-orange-300"><span class="shrink-0" aria-hidden="true">↗️</span>{{ weather.temperatureMax.toFixed(0) }}°</span>
      <span class="flex items-center gap-1 text-sky-300"><span class="shrink-0" aria-hidden="true">↘️</span>{{ weather.temperatureMin.toFixed(0) }}°</span>
    </div>
  </section>
</template>
