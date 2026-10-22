<script setup lang="ts">
defineProps<{ labelledBy: string }>()
const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <div class="fixed inset-0 z-40 grid place-items-center bg-black/50 p-4">
    <button type="button" class="absolute inset-0" aria-label="Close" @click="emit('close')"></button>
    <div role="dialog" aria-modal="true" :aria-labelledby="labelledBy" class="relative w-[85%] max-w-sm rounded-2xl border border-slate-700 bg-slate-800 p-6">
      <slot />
    </div>
  </div>
</template>
