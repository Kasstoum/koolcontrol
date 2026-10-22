export class ApiError extends Error {
  readonly status: number
  readonly detail: string | null

  constructor(status: number, detail: string | null) {
    super(detail ?? "Unable to connect.")
    this.name = "ApiError"
    this.status = status
    this.detail = detail
  }
}

export function messageFrom(error: unknown, fallback: string): string {
  if (error instanceof ApiError && error.detail) return error.detail
  return fallback
}

const API_BASE_URL = "https://api.koolnova.com"
const DEFAULT_TIMEOUT_MS = 10000

let tokenGetter: () => string | null = () => null
let unauthorizedHandler: () => void = () => {}

export function setTokenGetter(getter: () => string | null): void {
  tokenGetter = getter
}

export function setUnauthorizedHandler(handler: () => void): void {
  unauthorizedHandler = handler
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH"
  path: string
  query?: Record<string, string | number>
  body?: unknown
  auth?: boolean
  timeoutMs?: number
}

async function readDetail(response: Response): Promise<string | null> {
  try {
    const data: unknown = await response.json()
    if (typeof data === "object" && data !== null && "detail" in data && typeof data.detail === "string" && data.detail.trim()) {
      return data.detail
    }
  } catch {
    return null
  }
  return null
}

export async function apiRequest<T>(options: RequestOptions): Promise<T> {
  const method = options.method ?? "GET"
  const auth = options.auth ?? true
  const url = new URL(options.path, API_BASE_URL)
  for (const [key, value] of Object.entries(options.query ?? {})) {
    url.searchParams.set(key, String(value))
  }

  const headers = new Headers({ Accept: "application/json" })
  if (options.body !== undefined) headers.set("Content-Type", "application/json")
  const token = auth ? tokenGetter() : null
  if (token) headers.set("Authorization", `Bearer ${token}`)

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? DEFAULT_TIMEOUT_MS)

  try {
    const response = await fetch(url.toString(), {
      method,
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: controller.signal,
    })

    if (!response.ok) {
      const detail = await readDetail(response)
      if (auth && response.status === 401) unauthorizedHandler()
      throw new ApiError(response.status, detail)
    }

    const text = await response.text()
    return (text ? JSON.parse(text) : undefined) as T
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(0, null)
  } finally {
    clearTimeout(timer)
  }
}
