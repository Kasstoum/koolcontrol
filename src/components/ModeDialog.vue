<script setup lang="ts">
import DialogShell from "./DialogShell.vue"
import ModeIcon from "./ModeIcon.vue"
import { modeLabel, type Mode } from "../domain/controls"

defineProps<{ mode: Mode | null }>()
const emit = defineEmits<{ close: []; select: [mode: Mode] }>()
</script>

<template>
  <DialogShell labelled-by="mode-title" @close="emit('close')">
    <h2 id="mode-title" class="mb-4 text-center text-lg font-bold text-slate-50">Choose mode</h2>
    <button v-for="choice in (['1', '2'] as const)" :key="choice" type="button" class="mb-3 flex w-full items-center gap-3 rounded-xl border px-4 py-3" :class="mode === choice ? (choice === '1' ? 'border-blue-500/50 bg-blue-500/20' : 'border-orange-500/50 bg-orange-500/20') : 'border-slate-600 bg-slate-700/50'" @click="emit('select', choice)">
      <ModeIcon :mode="choice" :size="24" />
      <span class="flex-1 text-left font-semibold" :class="mode === choice ? (choice === '1' ? 'text-blue-400' : 'text-orange-400') : 'text-slate-300'">{{ modeLabel(choice) }}</span>
      <span v-if="mode === choice" class="h-2 w-2 rounded-full" :class="choice === '1' ? 'bg-blue-400' : 'bg-orange-400'"></span>
    </button>
    <button type="button" class="mt-4 w-full border-t border-slate-700 pt-4 text-sm font-medium text-slate-400" @click="emit('close')">Cancel</button>
  </DialogShell>
</template>
