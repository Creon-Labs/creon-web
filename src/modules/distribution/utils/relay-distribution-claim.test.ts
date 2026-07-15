import { describe, expect, it, vi } from "vitest"
import type { DistributionClaim } from "../types"
import { relayDistributionClaim } from "./relay-distribution-claim"

const claimedDistribution: DistributionClaim = {
  id: "claim-1",
  distributionId: "distribution-1",
  shareAmount: "10.0000000",
  amount: "5.0000000",
  leafIndex: 0,
  merkleProof: [],
  claimTxHash: "a".repeat(64),
  status: "CLAIMED",
  claimedAt: "2026-07-15T00:00:00.000Z",
  createdAt: "2026-07-15T00:00:00.000Z",
}

describe("relayDistributionClaim", () => {
  it("prepares, signs the exact XDR, and submits the signed result in order", async () => {
    const xdr = "backend-prepared-xdr"
    const signedXdr = "wallet-signed-xdr"
    const steps: string[] = []
    const prepare = vi
      .fn()
      .mockResolvedValue({ distributionId: "distribution-1", xdr })
    const sign = vi.fn().mockResolvedValue({ signedTxXdr: signedXdr })
    const submit = vi.fn().mockResolvedValue(claimedDistribution)

    await expect(
      relayDistributionClaim(
        { distributionId: "distribution-1" },
        { prepare, sign, submit, onStep: (step) => steps.push(step) }
      )
    ).resolves.toEqual(claimedDistribution)

    expect(prepare).toHaveBeenCalledWith({ distributionId: "distribution-1" })
    expect(sign).toHaveBeenCalledWith(xdr)
    expect(submit).toHaveBeenCalledWith({
      distributionId: "distribution-1",
      signedXdr,
    })
    expect(steps).toEqual(["PREPARING", "SIGNING", "SUBMITTING"])
  })

  it("does not sign or submit when prepare fails, so the relay can be retried", async () => {
    const prepare = vi
      .fn()
      .mockRejectedValue(new Error("Distribution not ready"))
    const sign = vi.fn()
    const submit = vi.fn()

    await expect(
      relayDistributionClaim(
        { distributionId: "distribution-1" },
        { prepare, sign, submit }
      )
    ).rejects.toThrow("Distribution not ready")

    expect(sign).not.toHaveBeenCalled()
    expect(submit).not.toHaveBeenCalled()
  })
})
