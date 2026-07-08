export type CampaignStatus =
  "submitted" | "under_review" | "live" | "active" | "rejected"

export type CampaignItem = {
  id: string
  contractAddress?: string
  title: string
  description: string
  imageUrl: string
  goalAmount: number
  raisedAmount: number
  status: CampaignStatus
  lockEndAt?: string
  startAt?: string
  endAt: string
  projectToken?: {
    assetCode: string
    contractAddress: string
  }
  message?: string
}
