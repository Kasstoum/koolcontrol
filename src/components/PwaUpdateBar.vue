<script setup lang="ts">
import { useRegisterSW } from "virtual:pwa-register/vue"

const { needRefresh, updateServiceWorker } = useRegisterSW()
</script>

<template>
  <div v-if="needRefresh" class="fixed inset-x-0 bottom-0 z-50 border-t border-slate-700 bg-slate-800 p-4">
    <div class="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-4">
      <p class="text-sm text-slate-50">A new version is available</p>
      <button type="button" class="rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-slate-50" @click="updateServiceWorker(true)">
        Reload
      </button>
    </div>
  </div>
</template>
