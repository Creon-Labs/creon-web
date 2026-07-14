export type RefundStatus = "PENDING" | "COMPLETED" | "FAILED"

export type RefundClaimStatus = "PENDING" | "CLAIMED" | "FAILED"

export type Refund = {
  id: string
  campaignId: string
  reason: string | null
  totalAmount: string
  totalShares: string | null
  totalClaimed: string
  merkleRoot: string | null
  snapshotLedger: number | null
  status: RefundStatus
  createdAt: string
}

export type RefundClaim = {
  id: string
  refundId: string
  shareAmount: string
  amount: string
  leafIndex: number | null
  merkleProof: string[]
  claimTxHash: string | null
  status: RefundClaimStatus
  claimedAt: string | null
  createdAt: string
  refund?: {
    campaignId: string
    status: RefundStatus
  }
}

export type PrepareRefundClaimInput = {
  refundId: string
}

export type PrepareRefundClaimResponse = {
  refundId: string
  xdr: string
}

export type SubmitRefundClaimInput = {
  refundId: string
  signedXdr: string
}
