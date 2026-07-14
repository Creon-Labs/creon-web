export type KycStatus = "PENDING" | "APPROVED" | "REJECTED" | "REVOKED"

export type Role = "ENTREPRENEUR" | "INVESTOR" | "ADMIN"

export type AdminKycItem = {
  userId: string
  walletAddress: string
  email: string
  roles: Role[]
  fullName: string
  nationalId: string
  status: KycStatus
  submittedAt: string
  rejectionReason?: string | null
  idCardUrl: string
  selfieUrl?: string | null
}

// --- KYC action responses ---

export type AdminKycApproveResponse = {
  userId: string
  status: "APPROVED"
  reviewedAt: string
}

export type AdminKycRejectResponse = {
  userId: string
  status: "REJECTED"
  reviewedAt: string
  rejectionReason: string
}

export type AdminKycRevokeResponse = {
  userId: string
  status: "REVOKED"
  reviewedAt: string
  rejectionReason: string
}

// --- Proposals ---

export type ProposalStatus =
  "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED"

export type AdminProposalItem = {
  id: string
  businessName: string
  category: string
  location?: string | null
  requestedAmount: string
  lockPeriodDays: number
  status: ProposalStatus
  submittedAt?: string | null
  entrepreneur: {
    walletAddress: string
    email?: string | null
  }
}

export type AdminApproveProposalResponse = {
  proposalId: string
  status: "APPROVED"
  campaignId: string
}

export type AdminRejectProposalResponse = {
  proposalId: string
  status: "REJECTED"
}

// --- Campaign cancel ---

export type RefundStatus = "PENDING" | "COMPLETED" | "FAILED"

export type AdminCancelCampaignResponse = {
  id: string
  campaignId: string
  reason?: string | null
  status: RefundStatus
  createdAt: string
}
