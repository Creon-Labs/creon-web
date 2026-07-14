export type DistributionStatus = "PENDING" | "COMPLETED" | "FAILED"

export type ClaimStatus = "PENDING" | "CLAIMED" | "FAILED"

export interface ProfitDistribution {
  id: string
  campaignId: string
  onchainId: number
  totalAmount: string
  totalShares: string | null
  rewardPerShare: string | null
  totalClaimed: string
  merkleRoot: string | null
  snapshotLedger: number | null
  status: DistributionStatus
  distributedAt: string
  createdAt: string
}

export type DistributionClaim = {
  id: string
  distributionId: string
  shareAmount: string
  amount: string
  leafIndex: number | null
  merkleProof: string[]
  claimTxHash: string | null
  status: ClaimStatus
  claimedAt: string | null
  createdAt: string
  distribution?: {
    onchainId: number
    campaignId: string
    status: DistributionStatus
  }
}

export type DepositProfitRequest = {
  amount: string
}

export type PrepareDepositResponse = {
  campaignId: string
  xdr: string
}

export type SubmitSignedTxRequest = {
  signedXdr: string
}
