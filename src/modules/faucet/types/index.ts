export type PrepareUsdcTrustlineInput = {
  walletAddress: string
}

export type PrepareUsdcTrustlineResponse = {
  xdr: string
}

export type SubmitUsdcTrustlineInput = {
  walletAddress: string
  signedXdr: string
}

export type SubmitUsdcTrustlineResponse = {
  txHash: string
}

export type ClaimUsdcInput = {
  walletAddress: string
}

export type ClaimUsdcResponse = {
  txHash: string
  amount: string
  walletAddress: string
}

export type FaucetTrustlineStep =
  "IDLE" | "PREPARING" | "SIGNING" | "SUBMITTING"

export type FaucetTrustlineResult =
  | {
      status: "CREATED"
      txHash: string
    }
  | {
      status: "EXISTS"
      txHash: null
    }
