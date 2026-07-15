export type CampaignStatus =
  | "PENDING_DEPLOYMENT"
  | "ACTIVE"
  | "LOCKED"
  | "GOAL_REACHED"
  | "COMPLETED"
  | "CANCELLED"

export type CampaignDeployStatus =
  | "PENDING"
  | "DEPLOYING_TOKEN"
  | "DEPLOYING_CAMPAIGN"
  | "WIRING"
  | "LIVE"
  | "FAILED"

export type UnlockStatus = "PENDING" | "UNLOCKING" | "UNLOCKED" | "FAILED"

export type ProposalMediaKind = "IMAGE" | "DOCUMENT"

export interface ProposalMedia {
  id: string
  kind: ProposalMediaKind
  mimeType: string
  originalName: string | null
  sizeBytes: number
  sortOrder: number
  url: string
  createdAt: string
}

export interface ProjectToken {
  assetCode: string
  contractAddress: string | null
}

export interface Campaign {
  id: string
  businessName: string
  businessDescription: string
  contractAddress: string | null
  goalAmount: string
  raisedAmount: string
  status: CampaignStatus
  deployStatus: CampaignDeployStatus
  lockEndAt: string | null
  unlockStatus: UnlockStatus
  unlockTxHash: string | null
  startAt: string | null
  endAt: string | null
  projectToken: ProjectToken | null
  media: ProposalMedia[]
}
