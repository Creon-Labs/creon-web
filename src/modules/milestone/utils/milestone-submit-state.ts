import type { Campaign } from "@/modules/campaign"

import type { Milestone } from "../types"

export type MilestoneSubmitBlockReason =
  | "CAMPAIGN_CANCELLED"
  | "CAMPAIGN_NOT_FUNDED"
  | "MILESTONE_NOT_PENDING"
  | "PREVIOUS_MILESTONE_NOT_RELEASED"

export type MilestoneSubmitState =
  | {
      canSubmit: true
      reason: null
      title: null
      description: null
    }
  | {
      canSubmit: false
      reason: MilestoneSubmitBlockReason
      title: string
      description: string
    }

type CampaignSubmitContext = Pick<
  Campaign,
  "goalAmount" | "raisedAmount" | "status"
>

type GetMilestoneSubmitStateInput = {
  campaign: CampaignSubmitContext
  milestone: Milestone
  milestones: Milestone[]
}

function decimalToStroops(value: string): bigint | null {
  if (!/^\d+(?:\.\d{1,7})?$/.test(value)) return null

  const [integerPart, fractionPart = ""] = value.split(".")
  return (
    BigInt(integerPart) * BigInt(10_000_000) +
    BigInt(fractionPart.padEnd(7, "0"))
  )
}

function hasReachedFundingGoal(campaign: CampaignSubmitContext): boolean {
  const raisedAmount = decimalToStroops(campaign.raisedAmount)
  const goalAmount = decimalToStroops(campaign.goalAmount)

  return (
    raisedAmount !== null &&
    goalAmount !== null &&
    goalAmount > BigInt(0) &&
    raisedAmount >= goalAmount
  )
}

function getFirstUnreleasedPreviousMilestone(
  milestone: Milestone,
  milestones: Milestone[]
): Milestone | undefined {
  return milestones.reduce<Milestone | undefined>((firstBlocked, candidate) => {
    if (candidate.order >= milestone.order || candidate.status === "RELEASED") {
      return firstBlocked
    }

    if (!firstBlocked || candidate.order < firstBlocked.order) {
      return candidate
    }

    return firstBlocked
  }, undefined)
}

export function getMilestoneSubmitState({
  campaign,
  milestone,
  milestones,
}: GetMilestoneSubmitStateInput): MilestoneSubmitState {
  if (campaign.status === "CANCELLED") {
    return {
      canSubmit: false,
      reason: "CAMPAIGN_CANCELLED",
      title: "Campaign has been cancelled",
      description:
        "Progress cannot be submitted because milestone disbursements are frozen for a cancelled campaign.",
    }
  }

  if (!hasReachedFundingGoal(campaign)) {
    return {
      canSubmit: false,
      reason: "CAMPAIGN_NOT_FUNDED",
      title: "Funding goal has not been reached",
      description:
        "Wait until the campaign reaches its full funding goal before submitting milestone progress.",
    }
  }

  if (milestone.status !== "PENDING") {
    return {
      canSubmit: false,
      reason: "MILESTONE_NOT_PENDING",
      title: "Milestone is not ready for submission",
      description: `Only a pending milestone can be submitted. This milestone is currently ${milestone.status.toLowerCase()}.`,
    }
  }

  const previousMilestone = getFirstUnreleasedPreviousMilestone(
    milestone,
    milestones
  )

  if (previousMilestone) {
    return {
      canSubmit: false,
      reason: "PREVIOUS_MILESTONE_NOT_RELEASED",
      title: "A previous milestone has not been released",
      description: `Milestone ${previousMilestone.order} must reach Released status before this milestone can be submitted.`,
    }
  }

  return {
    canSubmit: true,
    reason: null,
    title: null,
    description: null,
  }
}
