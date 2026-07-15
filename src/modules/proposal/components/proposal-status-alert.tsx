"use client"

import Link from "next/link"
import { ArrowClockwiseIcon, WarningCircleIcon } from "@phosphor-icons/react"

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@shadcn-ui/alert"
import { Button } from "@shadcn-ui/button"

import type { ProposalWithFundingStats } from "../types"

type ProposalStatusAlertProps = {
  proposal: ProposalWithFundingStats
  isRefreshing: boolean
  onRefresh: () => void
}

export function ProposalStatusAlert({
  proposal,
  isRefreshing,
  onRefresh,
}: ProposalStatusAlertProps) {
  if (proposal.status === "DRAFT") return null

  if (proposal.status === "REJECTED") {
    return (
      <Alert variant="destructive">
        <WarningCircleIcon weight="fill" />
        <AlertTitle>Proposal was not approved</AlertTitle>
        <AlertDescription>
          {proposal.rejectionReason
            ? `Reviewer feedback: ${proposal.rejectionReason}`
            : "No detailed reviewer feedback was included with this decision."}{" "}
          This proposal is read-only. Address the feedback and create a new
          proposal to submit again.
        </AlertDescription>
        <AlertAction>
          <Button asChild size="xs" variant="outline">
            <Link href="/entrepreneur/campaign/new">Create new</Link>
          </Button>
        </AlertAction>
      </Alert>
    )
  }

  const isApproved = proposal.status === "APPROVED"

  return (
    <Alert>
      <WarningCircleIcon weight="fill" />
      <AlertTitle>
        {isApproved ? "Proposal approved" : "Proposal review in progress"}
      </AlertTitle>
      <AlertDescription>
        {isApproved
          ? "Your proposal is approved and is now read-only while the campaign is prepared."
          : "This proposal is read-only while our team reviews it. The status refreshes automatically every 10 seconds."}
      </AlertDescription>
      {!isApproved && (
        <AlertAction>
          <Button
            size="xs"
            variant="outline"
            disabled={isRefreshing}
            onClick={onRefresh}
          >
            <ArrowClockwiseIcon data-icon="inline-start" />
            Refresh
          </Button>
        </AlertAction>
      )}
    </Alert>
  )
}
