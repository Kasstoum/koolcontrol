import { describe, expect, it } from "vitest"
import { formatLastSync } from "./formatLastSync"

const now = new Date("2026-10-21T12:00:00.000Z")

describe("formatLastSync", () => {
  it("formats the relative ranges", () => {
    expect(formatLastSync("2026-10-21T11:59:30.000Z", now)).toBe("just now")
    expect(formatLastSync("2026-10-21T11:59:00.000Z", now)).toBe("1 min ago")
    expect(formatLastSync("2026-10-21T11:58:00.000Z", now)).toBe("2 mins ago")
    expect(formatLastSync("2026-10-21T11:00:00.000Z", now)).toBe("1 h ago")
    expect(formatLastSync("2026-10-21T10:00:00.000Z", now)).toBe("2 h ago")
    expect(formatLastSync("2026-10-20T12:00:00.000Z", now)).toBe("1 day ago")
    expect(formatLastSync("2026-10-19T12:00:00.000Z", now)).toBe("2 days ago")
  })

  it("uses the English locale after seven days and preserves invalid input", () => {
    const older = new Date("2026-10-01T15:30:00.000Z")
    expect(formatLastSync(older.toISOString(), now)).toBe(older.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }))
    expect(formatLastSync("not-a-date", now)).toBe("not-a-date")
  })
})
