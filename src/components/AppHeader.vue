<script setup lang="ts">
import Logo from "./Logo.vue"
import ModeIcon from "./ModeIcon.vue"
import SpeedIndicator from "./SpeedIndicator.vue"
import { modeLabel, type Mode, type Speed } from "../domain/controls"

defineProps<{
  projectName: string
  projectMode: Mode | null
  globalSpeed: Speed | null
  canChangeMode: boolean
  canChangeSpeed: boolean
  refreshing: boolean
}>()

const emit = defineEmits<{ refresh: []; logout: []; openMode: []; openSpeed: [] }>()
</script>

<template>
  <header class="border-b border-slate-700/50 bg-slate-800 shadow-lg">
    <div class="mx-auto w-full max-w-[1400px] px-5 py-4">
      <div class="mb-3 flex items-center justify-between gap-3">
        <div class="flex items-center gap-2.5">
          <Logo :size="32" />
          <div>
            <h1 class="text-[28px] font-extrabold tracking-tight text-slate-50">KoolControl</h1>
            <p v-if="projectName" class="text-[15px] font-medium text-slate-400">{{ projectName }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button type="button" class="grid h-9 min-w-10 place-items-center rounded-xl border border-slate-600 bg-slate-700 text-xl text-slate-50 disabled:opacity-70" :disabled="refreshing" @click="emit('refresh')">
            <span v-if="refreshing" class="text-sm">...</span>
            <span v-else aria-label="Refresh">↻</span>
          </button>
          <button type="button" class="rounded-xl border border-slate-600 bg-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-50" @click="emit('logout')">Logout</button>
        </div>
      </div>
      <div v-if="canChangeMode || canChangeSpeed" class="flex items-center justify-between gap-3">
        <button v-if="canChangeMode && projectMode" type="button" class="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold" :class="projectMode === '1' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'" @click="emit('openMode')">
          <ModeIcon :mode="projectMode" :size="18" />
          {{ modeLabel(projectMode) }}
        </button>
        <SpeedIndicator v-if="canChangeSpeed && globalSpeed" :speed="globalSpeed" @select="emit('openSpeed')" />
      </div>
    </div>
  </header>
</template>
