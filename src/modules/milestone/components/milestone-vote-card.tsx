"use client"

import { useEffect, useState } from "react"
import {
  CheckCircleIcon,
  InfoIcon,
  WarningCircleIcon,
  XCircleIcon,
} from "@phosphor-icons/react"
import { toast } from "sonner"

import { useGetMyHoldings } from "@/modules/holdings"
import { useGetMyKycStatus } from "@/modules/kyc"
import { ApiError } from "@/shared/lib/api-client"
import { formatUsdcAmount } from "@/shared/utils/format-usdc"
import { Alert, AlertDescription, AlertTitle } from "@shadcn-ui/alert"
import { Badge } from "@shadcn-ui/badge"
import { Button } from "@shadcn-ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@shadcn-ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@shadcn-ui/field"
import { Spinner } from "@shadcn-ui/spinner"
import { ToggleGroup, ToggleGroupItem } from "@shadcn-ui/toggle-group"

import type { MilestoneDetail, VoteChoice } from "../types"
import { getVotingCountdown } from "../utils/voting-countdown"
import { useVoteMilestone } from "../api/vote-milestone"

type MilestoneVoteCardProps = {
  milestone: MilestoneDetail
  shareSymbol: string
}

export function MilestoneVoteCard({
  milestone,
  shareSymbol,
}: MilestoneVoteCardProps) {
  const [selectedChoice, setSelectedChoice] = useState<VoteChoice | "">(
    milestone.myVote?.choice ?? ""
  )
  const [now, setNow] = useState<number | null>(null)
  const holdingsQuery = useGetMyHoldings()
  const kycQuery = useGetMyKycStatus({ config: { retry: false } })
  const voteMutation = useVoteMilestone({
    config: {
      onSuccess: (vote) => {
        toast.success("Vote recorded", {
          description: `${vote.choice === "APPROVE" ? "Approval" : "Rejection"} submitted with ${formatUsdcAmount(vote.weight)} ${shareSymbol} voting weight.`,
        })
      },
    },
  })

  useEffect(() => {
    const initialTimer = window.setTimeout(() => setNow(Date.now()), 0)
    const timer = window.setInterval(() => setNow(Date.now()), 1000)

    return () => {
      window.clearTimeout(initialTimer)
      window.clearInterval(timer)
    }
  }, [])

  const countdown =
    now === null ? null : getVotingCountdown(milestone.votingEndsAt, now)
  const holding = holdingsQuery.data?.find(
    (item) => item.campaignId === milestone.campaignId
  )
  const shareBalance = holding?.balance ?? "0"
  const hasShares = Number(shareBalance) > 0
  const isKycApproved = kycQuery.data?.status === "APPROVED"
  const isVotingStatus = milestone.status === "VOTING"
  const isVotingUnavailable =
    !isVotingStatus ||
    !countdown?.isOpen ||
    !isKycApproved ||
    !holdingsQuery.isSuccess ||
    !hasShares
  const canSubmit =
    !isVotingUnavailable && selectedChoice !== "" && !voteMutation.isPending
  const isNoSharesError =
    voteMutation.error instanceof ApiError &&
    voteMutation.error.statusCode === 403

  function selectChoice(value: string) {
    if (value !== "APPROVE" && value !== "REJECT") return

    voteMutation.reset()
    setSelectedChoice(value)
  }

  function submitVote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit) return

    voteMutation.mutate({ milestoneId: milestone.id, choice: selectedChoice })
  }

  return (
    <form onSubmit={submitVote}>
      <Card>
        <CardHeader>
          <CardTitle>Cast your vote</CardTitle>
          <CardDescription>
            Your current share balance determines the weight of this ballot. You
            may submit a different choice while voting remains open.
          </CardDescription>
          <CardAction>
            <Badge variant={countdown?.isOpen ? "default" : "secondary"}>
              {countdown === null
                ? "Checking window"
                : countdown.isOpen
                  ? "Voting open"
                  : "Voting closed"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <VotingStat
              label="Your voting weight"
              value={
                holdingsQuery.isLoading
                  ? "Checking holdings..."
                  : `${formatUsdcAmount(shareBalance)} ${shareSymbol}`
              }
            />
            <VotingStat
              label="Your recorded vote"
              value={
                milestone.myVote
                  ? `${milestone.myVote.choice} · ${formatUsdcAmount(milestone.myVote.weight)} ${shareSymbol}`
                  : "Not submitted"
              }
            />
            <VotingStat
              label="Time remaining"
              value={countdown?.label ?? "Calculating..."}
            />
          </div>

          <FieldSet disabled={isVotingUnavailable || voteMutation.isPending}>
            <FieldLegend variant="label">Voting choice</FieldLegend>
            <FieldGroup>
              <Field data-disabled={isVotingUnavailable || undefined}>
                <ToggleGroup
                  type="single"
                  variant="outline"
                  value={selectedChoice}
                  onValueChange={selectChoice}
                  disabled={isVotingUnavailable || voteMutation.isPending}
                  className="grid w-full grid-cols-2"
                  aria-label="Milestone voting choice"
                >
                  <ToggleGroupItem value="APPROVE">
                    <CheckCircleIcon data-icon="inline-start" weight="fill" />
                    Approve
                  </ToggleGroupItem>
                  <ToggleGroupItem value="REJECT">
                    <XCircleIcon data-icon="inline-start" weight="fill" />
                    Reject
                  </ToggleGroupItem>
                </ToggleGroup>
                <FieldDescription>
                  The backend records your current balance as the ballot weight
                  when you submit.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldSet>

          {!kycQuery.isLoading && !isKycApproved ? (
            <Alert>
              <WarningCircleIcon weight="fill" />
              <AlertTitle>Approved investor KYC is required</AlertTitle>
              <AlertDescription>
                Voting is available only to investors whose identity
                verification has been approved.
              </AlertDescription>
            </Alert>
          ) : null}

          {holdingsQuery.isError ? (
            <Alert variant="destructive">
              <WarningCircleIcon weight="fill" />
              <AlertTitle>Unable to verify voting weight</AlertTitle>
              <AlertDescription>
                {holdingsQuery.error.message}. Refresh the page before voting.
              </AlertDescription>
            </Alert>
          ) : null}

          {holdingsQuery.isSuccess && !hasShares ? (
            <Alert>
              <InfoIcon weight="fill" />
              <AlertTitle>Voting unavailable: no campaign shares</AlertTitle>
              <AlertDescription>
                Only current shareholders can vote. This wallet has no voting
                weight in the campaign, so the voting endpoint rejects a ballot
                with 403 Forbidden.
              </AlertDescription>
            </Alert>
          ) : null}

          {!isVotingStatus ? (
            <Alert>
              <InfoIcon weight="fill" />
              <AlertTitle>Voting is not open</AlertTitle>
              <AlertDescription>
                This milestone is currently {milestone.status.toLowerCase()}.
                Its proof and final tally remain visible for review.
              </AlertDescription>
            </Alert>
          ) : null}

          {isVotingStatus && countdown && !countdown.isOpen ? (
            <Alert>
              <InfoIcon weight="fill" />
              <AlertTitle>The voting deadline has passed</AlertTitle>
              <AlertDescription>
                New or changed ballots can no longer be submitted.
              </AlertDescription>
            </Alert>
          ) : null}

          {voteMutation.error ? (
            <Alert variant="destructive">
              <WarningCircleIcon weight="fill" />
              <AlertTitle>
                {isNoSharesError
                  ? "Vote rejected: no eligible shares"
                  : "Unable to record vote"}
              </AlertTitle>
              <AlertDescription>
                {isNoSharesError
                  ? "The backend returned 403 because it could not verify a current share balance for this wallet. Refresh holdings before trying again."
                  : voteMutation.error.message}
              </AlertDescription>
            </Alert>
          ) : null}
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit" disabled={!canSubmit}>
            {voteMutation.isPending ? (
              <Spinner data-icon="inline-start" />
            ) : null}
            {milestone.myVote ? "Update vote" : "Submit vote"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

function VotingStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border p-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
