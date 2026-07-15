import { describe, expect, it } from "vitest"

import type { Campaign } from "@/modules/campaign"

import type { Milestone } from "../types"
import { getMilestoneSubmitState } from "./milestone-submit-state"

const campaign: Pick<Campaign, "goalAmount" | "raisedAmount" | "status"> = {
  goalAmount: "1000.0000000",
  raisedAmount: "1000.0000000",
  status: "GOAL_REACHED",
}

function createMilestone(
  order: number,
  status: Milestone["status"] = "PENDING"
): Milestone {
  return {
    id: `milestone-${order}`,
    campaignId: "campaign-1",
    order,
    onchainIndex: order - 1,
    title: `Milestone ${order}`,
    description: `Description ${order}`,
    amount: "500.0000000",
    status,
    votingStartedAt: null,
    votingEndsAt: null,
    releaseTxHash: null,
  }
}

describe("milestone submit state", () => {
  it("allows only the next pending milestone after all previous releases", () => {
    const milestones = [
      createMilestone(1, "RELEASED"),
      createMilestone(2),
      createMilestone(3),
    ]

    expect(
      getMilestoneSubmitState({
        campaign,
        milestone: milestones[1],
        milestones,
      }).canSubmit
    ).toBe(true)

    expect(
      getMilestoneSubmitState({
        campaign,
        milestone: milestones[2],
        milestones,
      })
    ).toMatchObject({
      canSubmit: false,
      reason: "PREVIOUS_MILESTONE_NOT_RELEASED",
      title: "A previous milestone has not been released",
    })
  })

  it("blocks submission until the campaign is fully funded", () => {
    const milestone = createMilestone(1)

    expect(
      getMilestoneSubmitState({
        campaign: { ...campaign, raisedAmount: "999.9999999" },
        milestone,
        milestones: [milestone],
      })
    ).toMatchObject({
      canSubmit: false,
      reason: "CAMPAIGN_NOT_FUNDED",
      title: "Funding goal has not been reached",
    })
  })

  it("freezes submission for a cancelled campaign", () => {
    const milestone = createMilestone(1)

    expect(
      getMilestoneSubmitState({
        campaign: { ...campaign, status: "CANCELLED" },
        milestone,
        milestones: [milestone],
      })
    ).toMatchObject({
      canSubmit: false,
      reason: "CAMPAIGN_CANCELLED",
      title: "Campaign has been cancelled",
    })
  })

  it("rejects milestones that are no longer pending", () => {
    const milestone = createMilestone(1, "VOTING")

    expect(
      getMilestoneSubmitState({
        campaign,
        milestone,
        milestones: [milestone],
      })
    ).toMatchObject({
      canSubmit: false,
      reason: "MILESTONE_NOT_PENDING",
    })
  })
})
