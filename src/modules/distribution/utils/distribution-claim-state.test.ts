import { describe, expect, it } from "vitest"
import type { DistributionClaim } from "../types"
import {
  getDistributionClaimActionState,
  getDistributionClaimErrorMessage,
} from "./distribution-claim-state"

const pendingClaim: DistributionClaim = {
  id: "claim-1",
  distributionId: "distribution-1",
  shareAmount: "10.0000000",
  amount: "5.0000000",
  leafIndex: 0,
  merkleProof: [],
  claimTxHash: null,
  status: "PENDING",
  claimedAt: null,
  createdAt: "2026-07-15T00:00:00.000Z",
  distribution: {
    onchainId: 1,
    campaignId: "campaign-1",
    status: "COMPLETED",
  },
}

describe("distribution claim state", () => {
  it("only enables a pending claim after its distribution is completed", () => {
    expect(getDistributionClaimActionState(pendingClaim)).toBe("CLAIMABLE")
    expect(
      getDistributionClaimActionState({
        ...pendingClaim,
        distribution: { ...pendingClaim.distribution!, status: "PENDING" },
      })
    ).toBe("PROCESSING_DISTRIBUTION")
  })

  it("does not offer a completed claim a second time", () => {
    expect(
      getDistributionClaimActionState({ ...pendingClaim, status: "CLAIMED" })
    ).toBe("CLAIMED")
  })

  it("maps a backend claim conflict to an actionable refresh message", () => {
    expect(
      getDistributionClaimErrorMessage(
        Object.assign(new Error("Conflict"), { statusCode: 409 })
      )
    ).toContain("Muat ulang")
  })
})
