import type { DistributionStatus, ProfitDistribution } from "../types"
import {
  getDomainStatusCopy,
  getDomainStatusPollingInterval,
} from "@/shared/utils/domain-status"

export function getDistributionPollingInterval(
  distributions: ProfitDistribution[] | undefined
): number | false {
  return distributions?.some((distribution) =>
    getDomainStatusPollingInterval("distribution", distribution.status)
  )
    ? 10_000
    : false
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
  const copy = getDomainStatusCopy("distribution", status)
  return { title: copy.label, description: copy.description }
}
