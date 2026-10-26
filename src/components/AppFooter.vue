<script setup lang="ts">
import { computed } from "vue"
import { formatLastSync } from "../domain/formatLastSync"

const props = defineProps<{ lastSync: string | null }>()
const label = computed(() => props.lastSync ? `Last sync: ${formatLastSync(props.lastSync)}` : "No sync available")
</script>

<template>
  <footer class="shrink-0 border-t border-slate-700/50 bg-slate-800 pb-[env(safe-area-inset-bottom)]">
    <p class="mx-auto w-full max-w-[1400px] px-5 py-2 text-center text-xs text-slate-400">{{ label }}</p>
  </footer>
</template>
