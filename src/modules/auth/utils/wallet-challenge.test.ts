import { describe, expect, it, vi } from "vitest"

import { completeWalletChallenge } from "./wallet-challenge"

const expiredChallengeError = { statusCode: 401 }

describe("completeWalletChallenge", () => {
  it("requests and signs one fresh challenge after a 401", async () => {
    const getChallenge = vi
      .fn<(walletAddress: string) => Promise<string>>()
      .mockResolvedValueOnce("first challenge")
      .mockResolvedValueOnce("fresh challenge")
    const signMessage = vi
      .fn<(message: string) => Promise<{ signedMessage: string }>>()
      .mockResolvedValueOnce({ signedMessage: "first signature" })
      .mockResolvedValueOnce({ signedMessage: "fresh signature" })
    const submit = vi
      .fn<(signature: string) => Promise<{ userId: string }>>()
      .mockRejectedValueOnce(expiredChallengeError)
      .mockResolvedValueOnce({ userId: "user-1" })
    const onChallengeRetry = vi.fn()

    await expect(
      completeWalletChallenge({
        walletAddress: "GABC",
        getChallenge,
        signMessage,
        submit,
        onChallengeRetry,
      })
    ).resolves.toEqual({ userId: "user-1" })

    expect(getChallenge).toHaveBeenNthCalledWith(1, "GABC")
    expect(getChallenge).toHaveBeenCalledTimes(2)
    expect(signMessage).toHaveBeenNthCalledWith(2, "fresh challenge")
    expect(submit).toHaveBeenNthCalledWith(2, "fresh signature")
    expect(onChallengeRetry).toHaveBeenCalledOnce()
  })

  it("preserves challenge and auth errors for the caller", async () => {
    const challengeError = { statusCode: 400 }
    const getChallenge = vi.fn().mockRejectedValue(challengeError)
    const signMessage = vi.fn()
    const submit = vi.fn()

    await expect(
      completeWalletChallenge({
        walletAddress: "invalid",
        getChallenge,
        signMessage,
        submit,
      })
    ).rejects.toBe(challengeError)

    expect(signMessage).not.toHaveBeenCalled()
    expect(submit).not.toHaveBeenCalled()
  })

  it("does not retry non-401 authentication failures", async () => {
    const invalidSignatureError = { statusCode: 400 }
    const getChallenge = vi.fn().mockResolvedValue("challenge")
    const signMessage = vi
      .fn()
      .mockResolvedValue({ signedMessage: "signature" })
    const submit = vi.fn().mockRejectedValue(invalidSignatureError)

    await expect(
      completeWalletChallenge({
        walletAddress: "GABC",
        getChallenge,
        signMessage,
        submit,
      })
    ).rejects.toBe(invalidSignatureError)

    expect(getChallenge).toHaveBeenCalledOnce()
    expect(submit).toHaveBeenCalledOnce()
  })
})
