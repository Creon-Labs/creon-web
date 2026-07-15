import { afterEach, describe, expect, it, vi } from "vitest"

describe("api client", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("treats a 201 response as a successful API response", async () => {
    process.env.SECRET_KEY = "test-secret"
    process.env.IMAGE_REMOTE_URL = "https://images.example.test"
    process.env.NEXT_PUBLIC_BASE_API_URL = "https://api.example.test"
    process.env.NEXT_PUBLIC_BASE_URL = "https://app.example.test"
    process.env.NEXT_PUBLIC_REOWN_PROJECT_ID = "test-project"

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
})
