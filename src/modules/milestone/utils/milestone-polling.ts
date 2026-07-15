import type { MilestoneStatus } from "../types"
import { getDomainStatusPollingInterval } from "@/shared/utils/domain-status"

export function getMilestonePollingInterval(
  status: MilestoneStatus | undefined
): number | false {
  return getDomainStatusPollingInterval("milestone", status)
}
