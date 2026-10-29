export const MIN_TEMPERATURE = 15
export const MAX_TEMPERATURE = 30
export const TEMPERATURE_STEP = 0.5
export const TEMPERATURE_PRESETS = [18, 20, 22, 24, 26] as const

export function clampTemperature(value: number): number {
  const bounded = Math.min(MAX_TEMPERATURE, Math.max(MIN_TEMPERATURE, value))
  const steps = Math.round(bounded / TEMPERATURE_STEP)
  return steps * TEMPERATURE_STEP
}

export function adjustTemperature(value: number, delta: number): number {
  return clampTemperature(value + delta)
}

export function initialTemperature(value: number | null): number {
  return value === null ? 20 : clampTemperature(value)
}
