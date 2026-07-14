export type InvestmentStatus = "PENDING" | "CONFIRMED" | "FAILED"

export type Investment = {
  id: string
  campaignId: string
  amount: string
  lpTokens: string | null
  txHash: string | null
  status: InvestmentStatus
  investedAt: string | null
  createdAt: string
}

export type PrepareInvestmentInput = {
  campaignId: string
  amount: string
}

export type PrepareInvestmentResponse = {
  campaignId: string
  xdr: string
}

export type SubmitInvestmentInput = {
  campaignId: string
  signedXdr: string
}
