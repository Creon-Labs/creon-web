export type ProposalStatus =
  "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED"

export type MilestoneStatus =
  | "DRAFT"
  | "PENDING"
  | "VOTING"
  | "APPROVED"
  | "RELEASING"
  | "RELEASED"
  | "REJECTED"
  | "FAILED"

// --- Request types (aligned with OpenAPI schema) ---

export type CreateMilestoneInput = {
  order: number
  title: string
  description: string
  amount: string
}

export type CreateProposalInput = {
  businessName: string
  businessDescription: string
  category: string
  location?: string
  requestedAmount: string
  lockPeriodDays: number
  milestones: CreateMilestoneInput[]
}

export type UpdateProposalInput = {
  businessName?: string
  businessDescription?: string
  category?: string
  location?: string
  requestedAmount?: string
  lockPeriodDays?: number
  milestones?: CreateMilestoneInput[]
}

// --- Response types ---

export type ProposalMilestone = {
  id: string
  order: number
  onchainIndex: number
  title: string
  description: string
  amount: string
  status: MilestoneStatus
  proofKey?: string | null
  votingStartedAt?: string | null
  votingEndsAt?: string | null
  votingExtended: boolean
  snapshotTotalSupply?: string | null
  releaseTxHash?: string | null
}

export type ProposalMedia = {
  id: string
  kind: "IMAGE" | "DOCUMENT"
  mimeType: string
  originalName?: string | null
  sizeBytes: number
  sortOrder: number
  url: string
  createdAt: string
}

export type Proposal = {
  id: string
  businessName: string
  businessDescription: string
  category: string
  location?: string | null
  requestedAmount: string
  lockPeriodDays: number
  status: ProposalStatus
  submittedAt?: string | null
  createdAt: string
  updatedAt: string
  milestones: ProposalMilestone[]
  media?: ProposalMedia[]
}

export type ProposalWithFundingStats = Proposal & {
  campaignId: string | null
  investorCount: number
  raisedAmount: string
  /** Available when the proposal API includes the admin's rejection feedback. */
  rejectionReason?: string | null
}
