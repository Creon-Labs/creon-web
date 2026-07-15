import type { RefundClaim } from "../types"

export type RefundClaimState = {
  canClaim: boolean
  description: string | null
  label: string
}

export function getRefundClaimState(claim: RefundClaim): RefundClaimState {
  if (claim.status === "CLAIMED") {
    return { canClaim: false, label: "Already Claimed", description: null }
  }

  if (claim.status === "FAILED") {
    return {
      canClaim: false,
      label: "Claim Failed",
      description:
        "This claim could not be completed. Refresh before trying again.",
    }
  }

  if (claim.refund?.status === "COMPLETED") {
    return { canClaim: true, label: "Claim Refund", description: null }
  }

  if (claim.refund?.status === "FAILED") {
    return {
      canClaim: false,
      label: "Refund Processing Failed",
      description:
        "The refund setup did not complete. Please contact support for the next update.",
    }
  }

  return {
    canClaim: false,
    label: "Refund sedang diproses",
    description:
      "Pembatalan on-chain dan pembuatan Merkle tree masih berlangsung. Claim akan tersedia setelah selesai.",
  }
}
