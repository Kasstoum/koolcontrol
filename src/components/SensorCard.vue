<script setup lang="ts">
import type { Sensor } from "../api/sensors"
import { temperatureGap } from "../domain/sensorDisplay"

const props = defineProps<{ sensor: Sensor }>()
const emit = defineEmits<{ temperature: [sensor: Sensor]; status: [sensor: Sensor] }>()

const gap = () => temperatureGap(props.sensor.temperature, props.sensor.setpoint_temperature)
const hasSetpoint = () => typeof props.sensor.setpoint_temperature === "number"
const hasStatus = () => props.sensor.status !== null && props.sensor.status !== undefined
</script>

<template>
  <article class="rounded-xl border border-slate-700 bg-slate-800 p-3 shadow-md">
    <div class="mb-3 flex items-center justify-between border-b border-slate-700 pb-3">
      <div class="flex items-center gap-1.5">
        <h2 class="text-lg font-bold tracking-tight text-slate-50">{{ sensor.name }}</h2>
        <span class="h-2 w-2 rounded-full" :class="sensor.topic_info?.is_online === false ? 'bg-slate-500' : 'bg-emerald-500'" />
      </div>
      <div class="flex items-center gap-2">
        <p v-if="typeof sensor.temperature === 'number'" class="text-xl font-extrabold text-blue-400">
          {{ sensor.temperature.toFixed(1) }}<span class="text-sm font-semibold text-slate-400">°C</span>
        </p>
        <span v-if="gap() === 'up'" class="grid h-6 w-6 place-items-center rounded-full bg-orange-500 text-xs font-bold">↑</span>
        <span v-else-if="gap() === 'down'" class="grid h-6 w-6 place-items-center rounded-full bg-blue-400 text-xs font-bold">↓</span>
        <span v-else-if="gap() === 'ok'" class="grid h-6 w-6 place-items-center rounded-full bg-emerald-500 text-xs font-bold">✓</span>
      </div>
    </div>
    <div class="flex items-center justify-between">
      <button type="button" class="flex-1 text-center disabled:cursor-default" :disabled="!hasSetpoint()" @click="emit('temperature', sensor)">
        <span class="block text-xs font-semibold uppercase tracking-wide text-slate-400">Setpoint</span>
        <span class="text-sm font-semibold" :class="hasSetpoint() ? 'text-blue-400' : 'text-slate-50'">
          {{ hasSetpoint() ? `${sensor.setpoint_temperature?.toFixed(1)}°C` : "-" }}
        </span>
      </button>
      <span class="mx-1.5 h-7 w-px bg-slate-700" />
      <button type="button" class="flex-1 text-center disabled:cursor-default" :disabled="!hasStatus()" @click="emit('status', sensor)">
        <span class="block text-xs font-semibold uppercase tracking-wide text-slate-400">Status</span>
        <span v-if="sensor.status === '03'" class="mt-1 flex flex-col items-center gap-1 text-xs font-bold text-emerald-500">
          <span class="h-3 w-3 rounded-full bg-emerald-500"></span>On
        </span>
        <span v-else-if="sensor.status === '02'" class="mt-1 flex flex-col items-center gap-1 text-xs font-bold text-slate-500">
          <span class="h-3 w-3 rounded-full bg-slate-500 opacity-40"></span>Off
        </span>
        <span v-else class="text-sm font-semibold text-slate-50">-</span>
      </button>
    </div>
  </article>
</template>
