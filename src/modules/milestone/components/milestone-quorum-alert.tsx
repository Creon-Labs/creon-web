import { ClockCountdownIcon } from "@phosphor-icons/react"
import { Alert, AlertDescription, AlertTitle } from "@shadcn-ui/alert"

import type { MilestoneDetail } from "../types"
import { getQuorumSafeguardCopy } from "../utils/quorum-safeguard"

type MilestoneQuorumAlertProps = {
  milestone: MilestoneDetail
}

export function MilestoneQuorumAlert({ milestone }: MilestoneQuorumAlertProps) {
  const copy = getQuorumSafeguardCopy({
    quorumBps: milestone.tally.quorumBps,
    quorumMet: milestone.tally.quorumMet,
    votingExtended: milestone.votingExtended,
  })

  return (
    <Alert>
      <ClockCountdownIcon weight="fill" />
      <AlertTitle>{copy.title}</AlertTitle>
      <AlertDescription>{copy.description}</AlertDescription>
    </Alert>
  )
}
