/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useNotifications } from '@/components/ui/notifications';
import { env } from "./env"

type RequestOptions = {
  method?: string
  headers?: Record<string, string>
  body?: any
  cookie?: string
  params?: Record<string, string | number | boolean | undefined | null>
  cache?: RequestCache
  next?: NextFetchRequestConfig
  signal?: AbortSignal
  keepalive?: boolean
  redirect?: RequestRedirect
  referrer?: string
  integrity?: string
  mode?: RequestMode
  priority?: RequestPriority
  credentials?: RequestCredentials
}

export type ApiResponse<TData = unknown> = {
  statusCode: number
  message: string
  data: TData
}

export type ApiErrorResponse<TData = unknown> = {
  statusCode: number
  message: string | string[]
  error?: string
  data: TData | null
}

export class ApiError<TData = unknown> extends Error {
  public readonly status: number
  public readonly code: string

  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly error: string,
    public readonly data: TData | null
  ) {
    super(message)
    this.name = "ApiError"
    this.status = statusCode
    this.code = error
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text) as unknown
  } catch {
    return undefined
  }
}

function getErrorMessage(message: unknown, fallback: string): string {
  if (typeof message === "string") return message
  if (Array.isArray(message)) {
    const messages = message.filter(
      (item): item is string => typeof item === "string"
    )
    if (messages.length > 0) return messages.join(". ")
  }
  return fallback
}

function buildUrlWithParams(
  url: string,
  params?: RequestOptions["params"]
): string {
  if (!params) return url
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null
    )
  )
  if (Object.keys(filteredParams).length === 0) return url
  const queryString = new URLSearchParams(
    filteredParams as Record<string, string>
  ).toString()
  return `${url}?${queryString}`
}

// Create a separate function for getting server-side cookies that can be imported where needed
export function getServerCookies() {
  if (typeof window !== "undefined") return ""

  // Dynamic import next/headers only on server-side
  return import("next/headers").then(async ({ cookies }) => {
    try {
      const cookieStore = await cookies()
      return cookieStore
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join("; ")
    } catch (error) {
      console.error("Failed to access cookies:", error)
      return ""
    }
  })
}

async function fetchApi<TResponse>(
  url: string,
  options: RequestOptions = {}
): Promise<TResponse> {
  const {
    method = "GET",
    headers = {},
    body,
    cookie,
    params,
    cache = "no-store",
    next,
    credentials = "include",
  } = options

  // Get cookies from the request when running on server
  let cookieHeader = cookie
  if (credentials !== "omit" && typeof window === "undefined" && !cookie) {
    cookieHeader = await getServerCookies()
  }

  // Requests made in the browser are routed through Next.js, so the httpOnly
  // session cookie is first-party to the Vercel app. This avoids relying on a
  // third-party cookie between the Vercel frontend and Railway API, which can
  // still be blocked even when it uses SameSite=None.
  const baseUrl =
    typeof window === "undefined"
      ? env.NEXT_PUBLIC_BASE_API_URL
      : "/api/backend"
  const fullUrl = buildUrlWithParams(`${baseUrl}${url}`, params)

  // When the body is a FormData instance we must NOT set Content-Type —
  // the browser sets it automatically with the correct multipart boundary —
  // and we must NOT JSON.stringify it.
  const isFormData = body instanceof FormData
  const response = await fetch(fullUrl, {
    ...options,
    method,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      Accept: "application/json",
      ...headers,
      ...(credentials !== "omit" && cookieHeader
        ? { Cookie: cookieHeader }
        : {}),
    },
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    credentials,
    cache,
    next,
  })

  const responseText = await response.text()
  const parsedBody = responseText ? parseJson(responseText) : undefined

  if (!response.ok) {
    const body = isRecord(parsedBody) ? parsedBody : undefined
    const statusCode =
      typeof body?.statusCode === "number" ? body.statusCode : response.status
    const error =
      typeof body?.error === "string" ? body.error : response.statusText
    const data = body && "data" in body ? body.data : null

    throw new ApiError(
      getErrorMessage(body?.message, error || "Request failed"),
      statusCode,
      error,
      data
    )
  }

  // A 204 response (notably logout) has no JSON body by definition. Returning
  // undefined keeps it on the normal success path instead of throwing a
  // SyntaxError while attempting to parse an empty response.
  return parsedBody as TResponse
}

export const api = {
  get<TResponse>(url: string, options?: RequestOptions): Promise<TResponse> {
    return fetchApi<TResponse>(url, { ...options, method: "GET" })
  },
  post<TResponse>(
    url: string,
    body?: any,
    options?: RequestOptions
  ): Promise<TResponse> {
    return fetchApi<TResponse>(url, { ...options, method: "POST", body })
  },
  put<TResponse>(
    url: string,
    body?: any,
    options?: RequestOptions
  ): Promise<TResponse> {
    return fetchApi<TResponse>(url, { ...options, method: "PUT", body })
  },
  patch<TResponse>(
    url: string,
    body?: any,
    options?: RequestOptions
  ): Promise<TResponse> {
    return fetchApi<TResponse>(url, { ...options, method: "PATCH", body })
  },
  delete<TResponse>(url: string, options?: RequestOptions): Promise<TResponse> {
    return fetchApi<TResponse>(url, { ...options, method: "DELETE" })
  },
}
