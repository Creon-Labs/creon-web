import { describe, expect, it } from "vitest"
import type { RefundClaim } from "../types"
import { getRefundClaimState } from "./refund-claim-state"

const makeClaim = (overrides: Partial<RefundClaim> = {}): RefundClaim => ({
  id: "claim-1",
  refundId: "refund-1",
  shareAmount: "10.0000000",
  amount: "10.0000000",
  leafIndex: 0,
  merkleProof: [],
  claimTxHash: null,
  status: "PENDING",
  claimedAt: null,
  createdAt: "2026-07-15T00:00:00.000Z",
  refund: { campaignId: "campaign-1", status: "PENDING" },
  ...overrides,
})

describe("getRefundClaimState", () => {
  it("allows a pending claim only after its nested refund completes", () => {
    expect(
      getRefundClaimState(
        makeClaim({ refund: { campaignId: "campaign-1", status: "COMPLETED" } })
      )
    ).toMatchObject({ canClaim: true, label: "Claim Refund" })
  })

  it("keeps the action disabled while the nested refund is processing", () => {
    expect(getRefundClaimState(makeClaim())).toMatchObject({
      canClaim: false,
      label: "Refund sedang diproses",
    })
  })

  it("does not re-enable a claimed or failed claim", () => {
    expect(getRefundClaimState(makeClaim({ status: "CLAIMED" }))).toMatchObject(
      { canClaim: false, label: "Already Claimed" }
    )
    expect(getRefundClaimState(makeClaim({ status: "FAILED" }))).toMatchObject({
      canClaim: false,
      label: "Claim Failed",
    })
  })
})
