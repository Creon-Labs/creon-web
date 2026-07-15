import { describe, expect, it } from "vitest"
import type { ProfitDistribution } from "../types"
import {
  getDistributionPollingInterval,
  isDistributionSnapshotReady,
} from "./distribution-state"

const pendingDistribution: ProfitDistribution = {
  id: "distribution-1",
  campaignId: "campaign-1",
  onchainId: 0,
  totalAmount: "100",
  totalShares: null,
  rewardPerShare: null,
  totalClaimed: "0",
  merkleRoot: null,
  snapshotLedger: 123,
  status: "PENDING",
  distributedAt: "2026-07-15T00:00:00.000Z",
  createdAt: "2026-07-15T00:00:00.000Z",
}

describe("distribution state", () => {
  it("polls while at least one distribution is pending", () => {
    expect(getDistributionPollingInterval([pendingDistribution])).toBe(10_000)
  })

  it("stops polling after every distribution reaches a terminal status", () => {
    expect(
      getDistributionPollingInterval([
        { ...pendingDistribution, status: "COMPLETED" },
        { ...pendingDistribution, id: "distribution-2", status: "FAILED" },
      ])
    ).toBe(false)
  })

  it("does not treat missing snapshot fields as zero values", () => {
    expect(isDistributionSnapshotReady(pendingDistribution)).toBe(false)
    expect(
      isDistributionSnapshotReady({
        ...pendingDistribution,
        status: "COMPLETED",
        totalShares: "100",
        rewardPerShare: "1",
        merkleRoot: "a".repeat(64),
      })
    ).toBe(true)
  })
})
