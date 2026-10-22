<script setup lang="ts">
import { speedLabel, type Speed } from "../domain/controls"

defineProps<{ speed: Speed }>()
const emit = defineEmits<{ select: [] }>()

function barClass(speed: Speed, level: number): string {
  if (speed === "4") return "bg-purple-400"
  if (Number(speed) >= level) {
    if (speed === "1") return "bg-emerald-400"
    if (speed === "2") return "bg-yellow-400"
    if (speed === "3") return "bg-orange-500"
  }
  return "bg-slate-600 opacity-25"
}

function labelClass(speed: Speed): string {
  if (speed === "1") return "text-emerald-400"
  if (speed === "2") return "text-yellow-400"
  if (speed === "3") return "text-orange-500"
  return "text-purple-400"
}
</script>

<template>
  <button type="button" class="flex items-center gap-2 rounded-full bg-slate-700/50 px-3 py-1.5" @click="emit('select')">
    <span class="text-xs font-semibold uppercase tracking-wide text-slate-400">Speed</span>
    <span class="flex items-center gap-1" aria-hidden="true">
      <span v-for="level in [1, 2, 3]" :key="level" class="h-3.5 w-1.5 rounded" :class="barClass(speed, level)" />
    </span>
    <span class="text-sm font-semibold" :class="labelClass(speed)">{{ speedLabel(speed) }}</span>
  </button>
</template>
