import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

function configureEnvironment() {
  process.env.SECRET_KEY = "test-secret"
  process.env.IMAGE_REMOTE_URL = "https://images.example.test"
  process.env.NEXT_PUBLIC_BASE_API_URL = "https://api.example.test"
  process.env.NEXT_PUBLIC_BASE_URL = "https://app.example.test"
  process.env.NEXT_PUBLIC_REOWN_PROJECT_ID = "test-project"
}

describe("api client", () => {
  beforeEach(() => {
    configureEnvironment()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("preserves a successful response envelope, including 201", async () => {
    const { api } = await import("./api-client")
    const payload = {
      statusCode: 201,
      message: "Refund claim recorded",
      data: { status: "CLAIMED", claimTxHash: "tx-hash" },
    }
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(payload), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      })
    )
    vi.stubGlobal("fetch", fetchMock)

    await expect(
      api.post("/refunds/refund-1/claim", { signedXdr: "xdr" })
    ).resolves.toEqual(payload)
  })

  it("returns undefined for a 204 response without trying to parse JSON", async () => {
    const { api } = await import("./api-client")
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 204 }))
    vi.stubGlobal("fetch", fetchMock)

    await expect(api.post("/auth/logout")).resolves.toBeUndefined()
  })

  it.each([
    [400, "Bad Request", "Validation failed"],
    [401, "Unauthorized", "Invalid or expired token"],
    [403, "Forbidden", "KYC not approved"],
    [409, "Conflict", "Already claimed"],
  ])(
    "preserves the backend's %i error envelope",
    async (statusCode, error, message) => {
      const { api } = await import("./api-client")
      vi.stubGlobal(
        "fetch",
        vi
          .fn()
          .mockResolvedValue(
            new Response(
              JSON.stringify({ statusCode, error, message, data: null }),
              { status: statusCode, statusText: error }
            )
          )
      )

      await expect(api.post("/guarded-resource")).rejects.toMatchObject({
        name: "ApiError",
        status: statusCode,
        statusCode,
        code: error,
        message,
      })
    }
  )

  it("serializes only defined query parameters and request JSON", async () => {
    const { api } = await import("./api-client")
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(
          JSON.stringify({ statusCode: 200, message: "OK", data: [] }),
          { status: 200 }
        )
      )
    vi.stubGlobal("fetch", fetchMock)

    await api.post(
      "/campaigns",
      { requestedAmount: "10.0000000" },
      { params: { status: "DRAFT", page: 1, omitted: undefined, none: null } }
    )

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.test/campaigns?status=DRAFT&page=1",
      expect.objectContaining({
        body: JSON.stringify({ requestedAmount: "10.0000000" }),
        credentials: "include",
      })
    )
  })

  it("omits credentials for explicitly public requests", async () => {
    const walletAddress = `G${"A".repeat(55)}`
    const { api } = await import("./api-client")
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          statusCode: 200,
          message: "Prepared",
          data: { xdr: "xdr" },
        }),
        { status: 200 }
      )
    )
    vi.stubGlobal("fetch", fetchMock)

    await api.post(
      "/faucet/usdc/trustline/prepare",
      { walletAddress },
      { credentials: "omit" }
    )

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.test/faucet/usdc/trustline/prepare",
      expect.objectContaining({ credentials: "omit" })
    )
    const request = fetchMock.mock.calls[0][1] as RequestInit
    expect(request.headers).not.toHaveProperty("Cookie")
  })
})
