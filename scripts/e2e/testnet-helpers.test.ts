import {
  Account,
  Keypair,
  Networks,
  Operation,
  TransactionBuilder,
} from "@stellar/stellar-sdk"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  ApiSession,
  E2eApiError,
  pollUntil,
  sep53Digest,
  signSep53Message,
  signTransactionXdr,
} from "./testnet-helpers.mjs"

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe("testnet E2E signing helpers", () => {
  it("produces a verifiable SEP-53 base64 signature", () => {
    const keypair = Keypair.random()
    const message = "Creon authentication\nNonce: e2e"
    const signature = Buffer.from(signSep53Message(keypair, message), "base64")

    expect(keypair.verify(sep53Digest(message), signature)).toBe(true)
    expect(keypair.verify(sep53Digest(`${message}!`), signature)).toBe(false)
  })

  it("signs the exact transaction envelope without replacing its operation", () => {
    const keypair = Keypair.random()
    const transaction = new TransactionBuilder(
      new Account(keypair.publicKey(), "1"),
      { fee: "100", networkPassphrase: Networks.TESTNET }
    )
      .addOperation(
        Operation.manageData({ name: "creon-e2e", value: "happy-path" })
      )
      .setTimeout(60)
      .build()

    const signedXdr = signTransactionXdr(
      keypair,
      transaction.toXDR(),
      Networks.TESTNET
    )
    const signed = TransactionBuilder.fromXDR(signedXdr, Networks.TESTNET)

    expect(signed.operations).toEqual(transaction.operations)
    expect(signed.signatures).toHaveLength(1)
  })
})

describe("testnet E2E API session", () => {
  it("unwraps responses and carries the httpOnly auth cookie", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            statusCode: 200,
            message: "Logged in",
            data: { userId: "admin", roles: ["ADMIN"] },
          }),
          {
            headers: {
              "Content-Type": "application/json",
              "Set-Cookie": "creon_access_token=test-token; HttpOnly; Path=/",
            },
          }
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            statusCode: 200,
            message: "Current user",
            data: { id: "admin", roles: ["ADMIN"] },
          }),
          { headers: { "Content-Type": "application/json" } }
        )
      )
    vi.stubGlobal("fetch", fetchMock)

    const session = new ApiSession("http://127.0.0.1:3001/")
    await session.post(
      "/auth/login",
      { walletAddress: "GADMIN", signature: "signature" },
      { captureCookie: true }
    )
    await session.get("/auth/me")

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "http://127.0.0.1:3001/auth/me",
      expect.objectContaining({
        headers: expect.objectContaining({
          Cookie: "creon_access_token=test-token",
        }),
      })
    )
  })

  it("preserves status and data from standardized API errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockResolvedValue(
        new Response(
          JSON.stringify({
            statusCode: 409,
            message: "Voting is not open",
            error: "Conflict",
            data: { milestoneId: "m1" },
          }),
          {
            status: 409,
            headers: { "Content-Type": "application/json" },
          }
        )
      )
    )

    const session = new ApiSession("http://127.0.0.1:3001")
    const error = await session
      .post("/milestones/m1/vote", { choice: "APPROVE" })
      .catch((reason: unknown) => reason)

    expect(error).toBeInstanceOf(E2eApiError)
    expect(error).toMatchObject({
      statusCode: 409,
      data: { milestoneId: "m1" },
    })
  })
})

describe("testnet E2E polling", () => {
  it("waits through asynchronous deployment states", async () => {
    vi.useFakeTimers()
    const states = ["PENDING", "WIRING", "LIVE"]
    const polling = pollUntil({
      label: "campaign deployment",
      read: async () => states.shift(),
      accept: (status: string | undefined) => status === "LIVE",
      intervalMs: 100,
      timeoutMs: 1_000,
    })

    await vi.advanceTimersByTimeAsync(200)

    await expect(polling).resolves.toBe("LIVE")
  })
})
