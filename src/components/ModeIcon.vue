<script setup lang="ts">
import type { Mode } from "../domain/controls"

withDefaults(defineProps<{ mode: Mode; size?: number }>(), { size: 16 })
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" aria-hidden="true">
    <template v-if="mode === '1'">
      <path d="M12 2v20M2 12h20M5 5l14 14M19 5 5 19" fill="none" stroke="#60A5FA" stroke-width="2" stroke-linecap="round" />
    </template>
    <path v-else d="M12 22c4-3 6-6 6-10a6 6 0 0 0-12 0c0 4 2 7 6 10Z" fill="#F97316" />
  </svg>
</template>
