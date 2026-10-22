<script setup lang="ts">
import { ref } from "vue"
import DialogShell from "./DialogShell.vue"
import { MAX_TEMPERATURE, MIN_TEMPERATURE, TEMPERATURE_PRESETS, TEMPERATURE_STEP, adjustTemperature, initialTemperature } from "../domain/temperature"

const props = defineProps<{ sensorName: string; initial: number | null }>()
const emit = defineEmits<{ close: []; confirm: [temperature: number] }>()
const temperature = ref(initialTemperature(props.initial))
</script>

<template>
  <DialogShell labelled-by="temperature-title" @close="emit('close')">
    <h2 id="temperature-title" class="text-center text-lg font-bold text-slate-50">Modify temperature</h2>
    <p class="mb-4 text-center text-sm text-slate-400">{{ sensorName }}</p>
    <p class="mb-2 text-center text-5xl font-extrabold text-blue-400">{{ temperature.toFixed(1) }}<span class="text-2xl text-slate-400">°C</span></p>
    <p class="mb-6 text-center text-xs text-slate-500">{{ MIN_TEMPERATURE }}°C - {{ MAX_TEMPERATURE }}°C</p>
    <div class="mb-6 flex items-center justify-center gap-4">
      <button type="button" class="h-12 w-12 rounded-full border-2 border-blue-500 text-2xl font-bold text-blue-400 disabled:border-slate-600 disabled:text-slate-600" :disabled="temperature <= MIN_TEMPERATURE" @click="temperature = adjustTemperature(temperature, -TEMPERATURE_STEP)">−</button>
      <button type="button" class="h-12 w-12 rounded-full border-2 border-blue-500 text-2xl font-bold text-blue-400 disabled:border-slate-600 disabled:text-slate-600" :disabled="temperature >= MAX_TEMPERATURE" @click="temperature = adjustTemperature(temperature, TEMPERATURE_STEP)">+</button>
    </div>
    <div class="mb-6 flex gap-2">
      <button v-for="preset in TEMPERATURE_PRESETS" :key="preset" type="button" class="flex-1 rounded-lg border py-2 text-xs font-semibold" :class="Math.abs(temperature - preset) < 0.1 ? 'border-blue-500/50 bg-blue-500/20 text-blue-400' : 'border-slate-600 bg-slate-700/50 text-slate-300'" @click="temperature = preset">{{ preset }}°</button>
    </div>
    <div class="flex gap-3">
      <button type="button" class="flex-1 rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-3 font-semibold text-slate-300" @click="emit('close')">Cancel</button>
      <button type="button" class="flex-1 rounded-xl bg-blue-500 px-4 py-3 font-semibold text-slate-50" @click="emit('confirm', temperature)">Confirm</button>
    </div>
  </DialogShell>
</template>
