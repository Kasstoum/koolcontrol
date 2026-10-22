<script setup lang="ts">
import DialogShell from "./DialogShell.vue"
import { speedLabel, type Speed } from "../domain/controls"

defineProps<{ speed: Speed | null }>()
const emit = defineEmits<{ close: []; select: [speed: Speed] }>()
const choices = ["1", "2", "3", "4"] as const

function barClass(speed: Speed, level: number): string {
  if (speed === "4") return "bg-purple-400"
  if (Number(speed) >= level) {
    if (speed === "1") return "bg-emerald-400"
    if (speed === "2") return "bg-yellow-400"
    return "bg-orange-500"
  }
  return "bg-slate-600 opacity-25"
}

function activeClass(speed: Speed): string {
  if (speed === "1") return "border-emerald-500/50 bg-emerald-500/20 text-emerald-400"
  if (speed === "2") return "border-yellow-500/50 bg-yellow-500/20 text-yellow-400"
  if (speed === "3") return "border-orange-500/50 bg-orange-500/20 text-orange-400"
  return "border-purple-500/50 bg-purple-500/20 text-purple-400"
}
</script>

<template>
  <DialogShell labelled-by="speed-title" @close="emit('close')">
    <h2 id="speed-title" class="mb-4 text-center text-lg font-bold text-slate-50">Choose speed</h2>
    <button v-for="choice in choices" :key="choice" type="button" class="mb-3 flex w-full items-center gap-3 rounded-xl border px-4 py-3" :class="speed === choice ? activeClass(choice) : 'border-slate-600 bg-slate-700/50 text-slate-300'" @click="emit('select', choice)">
      <span class="flex gap-1" aria-hidden="true">
        <span v-for="level in [1, 2, 3]" :key="level" class="h-4 w-1.5 rounded" :class="barClass(choice, level)"></span>
      </span>
      <span class="flex-1 text-left font-semibold">{{ speedLabel(choice) }}</span>
      <span v-if="speed === choice" class="h-2 w-2 rounded-full bg-current"></span>
    </button>
    <button type="button" class="mt-4 w-full border-t border-slate-700 pt-4 text-sm font-medium text-slate-400" @click="emit('close')">Cancel</button>
  </DialogShell>
</template>
