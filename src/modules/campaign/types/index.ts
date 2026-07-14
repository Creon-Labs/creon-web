export type CampaignStatus =
  | "PENDING_DEPLOYMENT"
  | "ACTIVE"
  | "LOCKED"
  | "GOAL_REACHED"
  | "COMPLETED"
  | "CANCELLED"

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
  contractAddress: string | null
  goalAmount: string
  raisedAmount: string
  status: CampaignStatus
  lockEndAt: string | null
  unlockStatus: UnlockStatus | null
  unlockTxHash: string | null
  startAt: string | null
  endAt: string | null
  projectToken: ProjectToken | null
  media: ProposalMedia[]
}
