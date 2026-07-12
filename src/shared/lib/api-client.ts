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
}

export type ApiResponse<TData = any> = {
  statusCode: number
  message: string
  data?: TData
  error?: string
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string
  ) {
    super(message)
    this.name = "ApiError"
  }
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
  } = options

  // Get cookies from the request when running on server
  let cookieHeader = cookie
  if (typeof window === "undefined" && !cookie) {
    cookieHeader = await getServerCookies()
  }

  const fullUrl = buildUrlWithParams(
    `${env.NEXT_PUBLIC_BASE_API_URL}${url}`,
    params
  )

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
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    credentials: "include",
    cache,
    next,
  })

  if (!response.ok) {
    const body: ApiResponse<any> = await response.json()
    throw new ApiError(body.message, body.statusCode, response.statusText)
  }

  return response.json()
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
