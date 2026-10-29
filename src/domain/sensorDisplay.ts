export function temperatureGap(measured: number | null, setpoint: number | null): "up" | "down" | "ok" | null {
  if (typeof measured !== "number" || typeof setpoint !== "number") return null
  const difference = measured - setpoint
  if (difference > 0.5) return "up"
  if (difference < -0.5) return "down"
  return "ok"
}
