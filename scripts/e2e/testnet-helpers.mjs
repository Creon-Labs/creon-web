import { createHash } from "node:crypto"

import { TransactionBuilder } from "@stellar/stellar-sdk"

const SEP53_PREFIX = Buffer.from("Stellar Signed Message:\n", "utf8")

export class E2eApiError extends Error {
  constructor(method, path, statusCode, message, data) {
    super(`${method} ${path} -> ${statusCode}: ${message}`)
    this.name = "E2eApiError"
    this.method = method
    this.path = path
    this.statusCode = statusCode
    this.data = data
  }
}

export function sep53Digest(message) {
  return createHash("sha256")
    .update(Buffer.concat([SEP53_PREFIX, Buffer.from(message, "utf8")]))
    .digest()
}

export function signSep53Message(keypair, message) {
  return keypair.sign(sep53Digest(message)).toString("base64")
}

export function signTransactionXdr(keypair, xdr, networkPassphrase) {
  const transaction = TransactionBuilder.fromXDR(xdr, networkPassphrase)
  transaction.sign(keypair)
  return transaction.toXDR()
}

export async function pollUntil({
  label,
  read,
  accept,
  intervalMs = 5_000,
  timeoutMs = 180_000,
  retryErrors = false,
}) {
  const startedAt = Date.now()
  let lastValue
  let lastError

  while (Date.now() - startedAt <= timeoutMs) {
    try {
      lastValue = await read()
      lastError = undefined
      if (accept(lastValue)) return lastValue
    } catch (error) {
      if (!retryErrors) throw error
      lastError = error
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs))
  }

  const lastResult = lastError
    ? lastError instanceof Error
      ? lastError.message
      : String(lastError)
    : JSON.stringify(lastValue)
  throw new Error(`Timeout waiting for ${label}. Last result: ${lastResult}`)
}

function responseMessage(body, fallback) {
  if (typeof body?.message === "string") return body.message
  if (Array.isArray(body?.message)) return body.message.join(". ")
  return fallback
}

function getSetCookies(headers) {
  if (typeof headers.getSetCookie === "function") return headers.getSetCookie()
  const header = headers.get("set-cookie")
  return header ? [header] : []
}

export class ApiSession {
  constructor(baseUrl) {
    this.baseUrl = baseUrl.replace(/\/$/, "")
    this.cookie = undefined
  }

  async request(method, path, options = {}) {
    const headers = { Accept: "application/json" }
    let body

    if (this.cookie) headers.Cookie = this.cookie
    if (options.form) {
      body = options.form
    } else if (options.body !== undefined) {
      headers["Content-Type"] = "application/json"
      body = JSON.stringify(options.body)
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      body,
    })
    const text = await response.text()
    const parsed = text ? JSON.parse(text) : undefined

    if (!response.ok) {
      throw new E2eApiError(
        method,
        path,
        typeof parsed?.statusCode === "number"
          ? parsed.statusCode
          : response.status,
        responseMessage(parsed, response.statusText || "Request failed"),
        parsed?.data ?? null
      )
    }

    if (options.captureCookie) {
      const authCookie = getSetCookies(response.headers)
        .map((value) => value.split(";", 1)[0])
        .find((value) => value.startsWith("creon_access_token="))
      if (!authCookie) {
        throw new Error(`No creon_access_token cookie returned by ${path}`)
      }
      this.cookie = authCookie
    }

    if (response.status === 204) return undefined
    if (!parsed || typeof parsed !== "object" || !("data" in parsed)) {
      throw new Error(`${method} ${path} did not return the Creon API envelope`)
    }
    return parsed.data
  }

  get(path) {
    return this.request("GET", path)
  }

  post(path, body, options = {}) {
    return this.request("POST", path, { ...options, body })
  }

  postForm(path, form) {
    return this.request("POST", path, { form })
  }
}
