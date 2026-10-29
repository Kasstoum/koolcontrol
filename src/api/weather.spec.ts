import { afterEach, describe, expect, it, vi } from "vitest"
import { getWeather, getWeatherCondition, getWeatherEmoji } from "./weather"

afterEach(() => vi.unstubAllGlobals())

describe("weather", () => {
  it("maps representative conditions and the unknown fallback", () => {
    expect(getWeatherCondition(0)).toBe("Clear sky")
    expect(getWeatherCondition(63)).toBe("Moderate rain")
    expect(getWeatherCondition(95)).toBe("Thunderstorm")
    expect(getWeatherCondition(123)).toBe("Unknown")
    expect(getWeatherEmoji(0, true)).toBe("☀️")
    expect(getWeatherEmoji(0, false)).toBe("🌙")
    expect(getWeatherEmoji(82, true)).toBe("🌦️")
    expect(getWeatherEmoji(123, true)).toBe("⛈️")
    expect(getWeatherEmoji(4, true)).toBe("🌡️")
  })

  it("requests Saint-Didier-de-Formans and maps the forecast", async () => {
    const calls: string[] = []
    vi.stubGlobal("fetch", async (url: string) => {
      calls.push(url)
      return new Response(JSON.stringify({
        current: {
          temperature_2m: 18.2,
          apparent_temperature: 17.4,
          relative_humidity_2m: 60,
          wind_speed_10m: 12.6,
          weather_code: 2,
          is_day: 1,
        },
        daily: {
          temperature_2m_max: [22.2],
          temperature_2m_min: [11.1],
        },
      }), { status: 200 })
    })

    await expect(getWeather()).resolves.toEqual({
      location: "St-Didier-de-Formans",
      temperature: 18.2,
      feelsLike: 17.4,
      humidity: 60,
      windSpeed: 12.6,
      weatherCode: 2,
      temperatureMax: 22.2,
      temperatureMin: 11.1,
      isDay: true,
    })
    const url = new URL(calls[0] ?? "")
    expect(url.origin).toBe("https://api.open-meteo.com")
    expect(url.searchParams.get("latitude")).toBe("45.97")
    expect(url.searchParams.get("longitude")).toBe("4.78")
    expect(url.searchParams.get("timezone")).toBe("Europe/Paris")
  })

  it("rejects an unsuccessful weather response", async () => {
    vi.stubGlobal("fetch", async () => new Response("down", { status: 503 }))
    await expect(getWeather()).rejects.toThrow("Weather API error: 503")
  })
})
