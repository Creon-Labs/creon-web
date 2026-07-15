import { describe, expect, it, vi } from "vitest"

import { relayFaucetTrustline } from "./relay-faucet-trustline"

const walletAddress = `G${"A".repeat(55)}`

function apiError(message: string, statusCode: number) {
  return Object.assign(new Error(message), { statusCode })
}

describe("faucet trustline relay", () => {
  it("signs the exact prepared XDR and submits the wallet signature", async () => {
    const onStep = vi.fn()
    const prepare = vi.fn().mockResolvedValue({ xdr: "exact-backend-xdr" })
    const sign = vi.fn().mockResolvedValue({ signedTxXdr: "wallet-signed-xdr" })
    const submit = vi.fn().mockResolvedValue({ txHash: "trustline-tx" })

    await expect(
      relayFaucetTrustline({ walletAddress }, { prepare, sign, submit, onStep })
    ).resolves.toEqual({ status: "CREATED", txHash: "trustline-tx" })

    expect(sign).toHaveBeenCalledWith("exact-backend-xdr")
    expect(submit).toHaveBeenCalledWith({
      walletAddress,
      signedXdr: "wallet-signed-xdr",
    })
    expect(onStep.mock.calls.map(([step]) => step)).toEqual([
      "PREPARING",
      "SIGNING",
      "SUBMITTING",
    ])
  })

  it("treats prepare 409 as an existing trustline without signing", async () => {
    const prepare = vi
      .fn()
      .mockRejectedValue(apiError("Trustline already exists", 409))
    const sign = vi.fn()
    const submit = vi.fn()

    await expect(
      relayFaucetTrustline({ walletAddress }, { prepare, sign, submit })
    ).resolves.toEqual({ status: "EXISTS", txHash: null })

    expect(sign).not.toHaveBeenCalled()
    expect(submit).not.toHaveBeenCalled()
  })
})
