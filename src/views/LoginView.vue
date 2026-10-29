<script setup lang="ts">
import { ref } from "vue"
import { useRouter } from "vue-router"
import { messageFrom } from "../api/client"
import Logo from "../components/Logo.vue"
import { useAuth } from "../composables/useAuth"

const auth = useAuth()
const router = useRouter()
const username = ref("")
const password = ref("")
const loading = ref(false)
const error = ref<string | null>(null)

async function submit(): Promise<void> {
  if (!username.value.trim() || !password.value) {
    error.value = "Please enter username and password."
    return
  }
  loading.value = true
  error.value = null
  try {
    await auth.login(username.value.trim(), password.value)
    await router.replace("/")
  } catch (caught) {
    error.value = messageFrom(caught, "Unable to connect.")
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="grid min-h-screen place-items-center bg-slate-900 px-6">
    <div class="w-full max-w-md">
      <div class="mb-8 text-center">
        <Logo class="mx-auto mb-6" :size="80" />
        <h1 class="mb-2 text-[40px] font-extrabold tracking-tight text-slate-50">KoolControl</h1>
        <p class="text-lg text-slate-400">Control your comfort, simply</p>
      </div>
      <form class="rounded-2xl border border-slate-700 bg-slate-800 p-6" @submit.prevent="submit">
        <label class="mb-4 block">
          <span class="mb-2 block font-semibold text-slate-300">Username</span>
          <input v-model="username" class="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3.5 text-slate-50" placeholder="Email ou username" autocomplete="username">
        </label>
        <label class="mb-4 block">
          <span class="mb-2 block font-semibold text-slate-300">Password</span>
          <input v-model="password" class="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3.5 text-slate-50" type="password" placeholder="Password" autocomplete="current-password">
        </label>
        <p v-if="error" class="mb-4 rounded-xl border border-orange-500/30 bg-orange-500/10 p-3 font-medium text-orange-500">{{ error }}</p>
        <button type="submit" class="w-full rounded-full bg-blue-500 py-4 text-lg font-semibold text-slate-900 disabled:opacity-60" :disabled="loading">
          {{ loading ? "Connecting..." : "Sign in" }}
        </button>
      </form>
    </div>
  </main>
</template>
