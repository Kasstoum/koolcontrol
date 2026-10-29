export type Mode = "1" | "2"
export type Speed = "1" | "2" | "3" | "4"
export type SensorStatus = "02" | "03"

export function modeLabel(mode: Mode): "Cooling" | "Heating" {
  return mode === "1" ? "Cooling" : "Heating"
}

export function speedLabel(speed: string): "Low" | "Medium" | "Fast" | "Auto" | null {
  if (speed === "1") return "Low"
  if (speed === "2") return "Medium"
  if (speed === "3") return "Fast"
  if (speed === "4") return "Auto"
  return null
}

export function isMode(value: string | null | undefined): value is Mode {
  return value === "1" || value === "2"
}

export function isSpeed(value: string | null | undefined): value is Speed {
  return value === "1" || value === "2" || value === "3" || value === "4"
}
