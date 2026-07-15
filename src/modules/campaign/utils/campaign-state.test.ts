import { describe, expect, it } from "vitest"

import {
  assertCampaignCanAcceptInvestments,
  canInvestInCampaign,
  CampaignInvestmentUnavailableError,
  getCampaignDeploymentProgress,
  getCampaignPollingInterval,
  getUnlockStatusCopy,
} from "./campaign-state"

describe("campaign state helpers", () => {
  it("polls frequently during deployment, then less frequently until unlock", () => {
    expect(
      getCampaignPollingInterval({
        deployStatus: "WIRING",
        unlockStatus: "PENDING",
      })
    ).toBe(10_000)
    expect(
      getCampaignPollingInterval({
        deployStatus: "LIVE",
        unlockStatus: "UNLOCKING",
      })
    ).toBe(30_000)
    expect(
      getCampaignPollingInterval({
        deployStatus: "LIVE",
        unlockStatus: "UNLOCKED",
      })
    ).toBe(false)
    expect(
      getCampaignPollingInterval({
        deployStatus: "FAILED",
        unlockStatus: "PENDING",
      })
    ).toBe(false)
  })

  it("maps deployment statuses to progress while keeping failures at zero", () => {
    expect(getCampaignDeploymentProgress("PENDING")).toBe(20)
    expect(getCampaignDeploymentProgress("WIRING")).toBe(80)
    expect(getCampaignDeploymentProgress("LIVE")).toBe(100)
    expect(getCampaignDeploymentProgress("FAILED")).toBe(0)
  })

  it("only permits investments for a live active campaign", () => {
    expect(
      canInvestInCampaign({ deployStatus: "LIVE", status: "ACTIVE" })
    ).toBe(true)
    expect(
      canInvestInCampaign({ deployStatus: "LIVE", status: "LOCKED" })
    ).toBe(false)
    expect(
      canInvestInCampaign({ deployStatus: "WIRING", status: "ACTIVE" })
    ).toBe(false)

    expect(() =>
      assertCampaignCanAcceptInvestments({
        deployStatus: "DEPLOYING_CAMPAIGN",
        status: "PENDING_DEPLOYMENT",
      })
    ).toThrow(CampaignInvestmentUnavailableError)
  })

  it("explains that unlocked shares are transferable only peer-to-peer", () => {
    expect(getUnlockStatusCopy("UNLOCKED", null)).toEqual({
      title: "Shares are unlocked",
      description:
        "Shares can now be transferred peer-to-peer to another whitelisted wallet.",
    })
    expect(
      getUnlockStatusCopy("PENDING", "2026-08-01T00:00:00.000Z").title
    ).toBe("Shares are locked")
  })
})
