import type {
  Campaign,
  CampaignDeployStatus,
  CampaignStatus,
  UnlockStatus,
} from "../types"

export const CAMPAIGN_DEPLOYMENT_STEPS: ReadonlyArray<{
  status: Exclude<CampaignDeployStatus, "FAILED">
  label: string
  description: string
}> = [
  {
    status: "PENDING",
    label: "Queued",
    description: "Waiting for the deployment worker.",
  },
  {
    status: "DEPLOYING_TOKEN",
    label: "Deploying token",
    description: "Creating the restricted project share token.",
  },
  {
    status: "DEPLOYING_CAMPAIGN",
    label: "Deploying campaign",
    description: "Creating the Stellar campaign contract.",
  },
  {
    status: "WIRING",
    label: "Activating campaign",
    description: "Connecting the token and campaign contracts.",
  },
  {
    status: "LIVE",
    label: "Live",
    description: "The campaign contracts are ready.",
  },
]

export function getCampaignDeploymentStep(
  deployStatus: CampaignDeployStatus
): number {
  if (deployStatus === "FAILED") return -1

  return CAMPAIGN_DEPLOYMENT_STEPS.findIndex(
    (step) => step.status === deployStatus
  )
}

export function getCampaignDeploymentProgress(
  deployStatus: CampaignDeployStatus
): number {
  const step = getCampaignDeploymentStep(deployStatus)

  if (step < 0) return 0

  return Math.round(((step + 1) / CAMPAIGN_DEPLOYMENT_STEPS.length) * 100)
}

export function getCampaignPollingInterval(
  campaign: Pick<Campaign, "deployStatus" | "unlockStatus"> | undefined
): number | false {
  if (!campaign) return 10_000

  if (
    campaign.deployStatus === "PENDING" ||
    campaign.deployStatus === "DEPLOYING_TOKEN" ||
    campaign.deployStatus === "DEPLOYING_CAMPAIGN" ||
    campaign.deployStatus === "WIRING"
  ) {
    return 10_000
  }

  if (
    campaign.deployStatus === "LIVE" &&
    campaign.unlockStatus !== "UNLOCKED"
  ) {
    return 30_000
  }

  return false
}

export function canInvestInCampaign(
  campaign: Pick<Campaign, "deployStatus" | "status">
): boolean {
  return campaign.deployStatus === "LIVE" && campaign.status === "ACTIVE"
}

export function getCampaignInvestmentBlockReason(
  campaign: Pick<Campaign, "deployStatus" | "status">
): string | null {
  if (campaign.deployStatus !== "LIVE") {
    return "Investment opens after the campaign deployment is live."
  }

  if (campaign.status !== "ACTIVE") {
    return "This campaign is not accepting new investments."
  }

  return null
}

export class CampaignInvestmentUnavailableError extends Error {
  constructor(
    public readonly deployStatus: CampaignDeployStatus,
    public readonly campaignStatus: CampaignStatus
  ) {
    super(
      getCampaignInvestmentBlockReason({
        deployStatus,
        status: campaignStatus,
      }) ?? "This campaign is not accepting new investments."
    )
    this.name = "CampaignInvestmentUnavailableError"
  }
}

export function assertCampaignCanAcceptInvestments(
  campaign: Pick<Campaign, "deployStatus" | "status">
): void {
  if (!canInvestInCampaign(campaign)) {
    throw new CampaignInvestmentUnavailableError(
      campaign.deployStatus,
      campaign.status
    )
  }
}

export function getUnlockStatusCopy(
  unlockStatus: UnlockStatus,
  lockEndAt: string | null
): { title: string; description: string } {
  if (unlockStatus === "UNLOCKED") {
    return {
      title: "Shares are unlocked",
      description:
        "Shares can now be transferred peer-to-peer to another whitelisted wallet.",
    }
  }

  if (unlockStatus === "UNLOCKING") {
    return {
      title: "Unlocking shares",
      description:
        "The automatic on-chain unlock transaction is being confirmed.",
    }
  }

  if (unlockStatus === "FAILED") {
    return {
      title: "Unlock retry in progress",
      description:
        "The automatic unlock could not finish yet and will be retried by the system.",
    }
  }

  return {
    title: "Shares are locked",
    description: lockEndAt
      ? "Shares remain locked until the scheduled lock period ends."
      : "Shares remain locked until the campaign lock period is scheduled.",
  }
}
