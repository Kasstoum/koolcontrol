<script setup lang="ts">
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import type { Sensor } from "../api/sensors"
import AppFooter from "../components/AppFooter.vue"
import AppHeader from "../components/AppHeader.vue"
import ModeDialog from "../components/ModeDialog.vue"
import SensorCard from "../components/SensorCard.vue"
import SpeedDialog from "../components/SpeedDialog.vue"
import StatusDialog from "../components/StatusDialog.vue"
import TemperatureDialog from "../components/TemperatureDialog.vue"
import WeatherCard from "../components/WeatherCard.vue"
import { useAuth } from "../composables/useAuth"
import { useDashboard } from "../composables/useDashboard"
import type { Mode, SensorStatus, Speed } from "../domain/controls"

const auth = useAuth()
const router = useRouter()
const dashboard = useDashboard()
const activeDialog = ref<"mode" | "speed" | "temperature" | "status" | null>(null)
const selectedSensor = ref<Sensor | null>(null)

function closeDialog(): void {
  activeDialog.value = null
  selectedSensor.value = null
}

async function logout(): Promise<void> {
  auth.logout()
  await router.replace("/login")
}

async function confirmMode(mode: Mode): Promise<void> {
  await dashboard.changeMode(mode)
  closeDialog()
}

async function confirmSpeed(speed: Speed): Promise<void> {
  await dashboard.changeSpeed(speed)
  closeDialog()
}

async function confirmTemperature(temperature: number): Promise<void> {
  if (!selectedSensor.value) return
  await dashboard.changeTemperature(selectedSensor.value.id, temperature)
  closeDialog()
}

async function confirmStatus(status: SensorStatus): Promise<void> {
  if (!selectedSensor.value) return
  await dashboard.changeStatus(selectedSensor.value.id, status)
  closeDialog()
}

onMounted(() => {
  void dashboard.load()
})
</script>

<template>
  <div class="flex min-h-screen flex-col bg-slate-900">
    <AppHeader
      :project-name="dashboard.projectName.value"
      :project-mode="dashboard.projectMode.value"
      :global-speed="dashboard.globalSpeed.value"
      :can-change-mode="dashboard.canChangeMode.value"
      :can-change-speed="dashboard.canChangeSpeed.value"
      :refreshing="dashboard.refreshing.value"
      @refresh="dashboard.load(true)"
      @logout="logout"
      @open-mode="activeDialog = 'mode'"
      @open-speed="activeDialog = 'speed'"
    />
    <main class="mx-auto w-full max-w-[1400px] flex-1 px-5 py-4">
      <p v-if="dashboard.status.value === 'loading'" class="py-16 text-center text-[17px] font-medium text-slate-400">Loading...</p>
      <p v-else-if="dashboard.status.value === 'empty'" class="py-16 text-center text-slate-300">No project available</p>
      <div v-else-if="dashboard.status.value === 'error'" class="py-16 text-center">
        <p class="mb-4 text-slate-300">{{ dashboard.error.value }}</p>
        <button type="button" class="rounded-xl bg-blue-500 px-4 py-2 font-semibold text-slate-50" @click="dashboard.load()">Retry</button>
      </div>
      <template v-else>
        <WeatherCard :weather="dashboard.weather.value" :loading="dashboard.weatherLoading.value" :error="dashboard.weatherError.value" />
        <div v-if="dashboard.actionError.value" class="mb-4 flex items-center justify-between gap-4 rounded-xl border border-orange-500/30 bg-orange-500/10 p-3">
          <p class="font-medium text-orange-500">{{ dashboard.actionError.value }}</p>
          <button type="button" class="text-sm font-semibold text-slate-300" @click="dashboard.dismissActionError()">Dismiss</button>
        </div>
        <div class="grid grid-cols-1 gap-2 md:grid-cols-2 min-[1200px]:grid-cols-3">
          <SensorCard
            v-for="sensor in dashboard.sensors.value"
            :key="sensor.id"
            :sensor="sensor"
            @temperature="selectedSensor = $event; activeDialog = 'temperature'"
            @status="selectedSensor = $event; activeDialog = 'status'"
          />
        </div>
      </template>
    </main>
    <AppFooter :last-sync="dashboard.lastSync.value" />
    <ModeDialog v-if="activeDialog === 'mode'" :mode="dashboard.projectMode.value" @close="closeDialog" @select="confirmMode" />
    <SpeedDialog v-if="activeDialog === 'speed'" :speed="dashboard.globalSpeed.value" @close="closeDialog" @select="confirmSpeed" />
    <TemperatureDialog v-if="activeDialog === 'temperature' && selectedSensor" :sensor-name="selectedSensor.name ?? ''" :initial="selectedSensor.setpoint_temperature" @close="closeDialog" @confirm="confirmTemperature" />
    <StatusDialog v-if="activeDialog === 'status' && selectedSensor" :sensor-name="selectedSensor.name ?? ''" :status="selectedSensor.status" @close="closeDialog" @select="confirmStatus" />
  </div>
</template>
