<script setup lang="ts">
import DialogShell from "./DialogShell.vue"
import type { SensorStatus } from "../domain/controls"

defineProps<{ sensorName: string; status: string | null }>()
const emit = defineEmits<{ close: []; select: [status: SensorStatus] }>()
</script>

<template>
  <DialogShell labelled-by="status-title" @close="emit('close')">
    <h2 id="status-title" class="text-center text-lg font-bold text-slate-50">Change status</h2>
    <p class="mb-6 text-center text-sm text-slate-400">{{ sensorName }}</p>
    <button type="button" class="mb-3 flex w-full items-center gap-3 rounded-xl border px-4 py-4" :class="status === '03' ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-400' : 'border-slate-600 bg-slate-700/50 text-slate-300'" @click="emit('select', '03')">
      <span class="h-4 w-4 rounded-full bg-emerald-500"></span>
      <span class="flex-1 text-left font-semibold">Turn on</span>
    </button>
    <button type="button" class="flex w-full items-center gap-3 rounded-xl border px-4 py-4" :class="status === '02' ? 'border-red-500/50 bg-red-500/20 text-red-400' : 'border-red-500/30 bg-red-500/10 text-red-300'" @click="emit('select', '02')">
      <span class="h-4 w-4 rounded-full bg-red-500"></span>
      <span class="flex-1 text-left font-semibold">Turn off</span>
    </button>
    <button type="button" class="mt-4 w-full border-t border-slate-700 pt-4 text-sm font-medium text-slate-400" @click="emit('close')">Cancel</button>
  </DialogShell>
</template>
