import type { DistributionStatus, ProfitDistribution } from "../types"

const PENDING_DISTRIBUTION_REFETCH_INTERVAL = 10_000

export function getDistributionPollingInterval(
  distributions: ProfitDistribution[] | undefined
): number | false {
  if (
    distributions?.some((distribution) => distribution.status === "PENDING")
  ) {
    return PENDING_DISTRIBUTION_REFETCH_INTERVAL
  }

  return false
}

export function isDistributionSnapshotReady(
  distribution: Pick<
    ProfitDistribution,
    "status" | "totalShares" | "rewardPerShare" | "merkleRoot"
  >
): boolean {
  return (
    distribution.status === "COMPLETED" &&
    distribution.totalShares !== null &&
    distribution.rewardPerShare !== null &&
    distribution.merkleRoot !== null
  )
}

export function getDistributionStatusCopy(status: DistributionStatus): {
  title: string
  description: string
} {
  if (status === "PENDING") {
    return {
      title: "Processing distribution",
      description:
        "The shareholder snapshot and claim records are being prepared. Dividends cannot be claimed yet.",
    }
  }

  if (status === "FAILED") {
    return {
      title: "Distribution processing needs attention",
      description:
        "The on-chain snapshot could not be completed yet. Please contact the platform team if this status persists.",
    }
  }

  return {
    title: "Distribution ready",
    description:
      "The shareholder snapshot is complete and investors can claim their dividends.",
  }
}
