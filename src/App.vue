<script setup lang="ts">
import { RouterView } from "vue-router"
import { useAuth } from "./composables/useAuth"

const auth = useAuth()
</script>

<template>
  <div v-if="auth.isLoading.value" class="grid min-h-screen place-items-center bg-slate-900">
    <p class="text-[17px] font-medium text-slate-400">Loading...</p>
  </div>
  <RouterView v-else />
</template>
