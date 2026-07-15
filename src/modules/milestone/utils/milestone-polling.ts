import type { MilestoneStatus } from "../types"

const ACTIVE_MILESTONE_REFETCH_INTERVAL = 10_000

export function getMilestonePollingInterval(
  status: MilestoneStatus | undefined
): number | false {
  if (status === "VOTING" || status === "APPROVED" || status === "RELEASING") {
    return ACTIVE_MILESTONE_REFETCH_INTERVAL
  }

  return false
}
