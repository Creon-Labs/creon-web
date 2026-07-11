export type DistributionStatus = "PENDING" | "COMPLETED" | "FAILED"

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
