"use client"

import type { Route } from "next"
import Link from "next/link"
import {
  ArrowsClockwiseIcon,
  CaretLeftIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react"

import { useGetCampaignById } from "@/modules/campaign"
import { Alert, AlertDescription, AlertTitle } from "@shadcn-ui/alert"
import { Badge } from "@shadcn-ui/badge"
import { Button } from "@shadcn-ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shadcn-ui/card"

import { useGetMilestone } from "../api/get-milestone"
import { MilestoneDetailHeader } from "../components/milestone-detail-header"
import { MilestoneDetailSkeleton } from "../components/milestone-detail-skeleton"
import { MilestoneProofCard } from "../components/milestone-proof-card"
import { MilestoneQuorumAlert } from "../components/milestone-quorum-alert"
import { MilestoneTallyCard } from "../components/milestone-tally-card"
import { MilestoneVoteCard } from "../components/milestone-vote-card"

type InvestorMilestoneVotingPageProps = {
  campaignId: string
  milestoneId: string
}

export function InvestorMilestoneVotingPage({
  campaignId,
  milestoneId,
}: InvestorMilestoneVotingPageProps) {
  const milestoneQuery = useGetMilestone({ milestoneId })
  const campaignQuery = useGetCampaignById({ id: campaignId })

  if (milestoneQuery.isLoading || campaignQuery.isLoading) {
    return <MilestoneDetailSkeleton />
  }

  const loadError = milestoneQuery.error ?? campaignQuery.error
  if (loadError) {
    return (
      <Alert variant="destructive">
        <WarningCircleIcon weight="fill" />
        <AlertTitle>Unable to load milestone voting</AlertTitle>
        <AlertDescription className="flex flex-col items-start gap-3">
          <span>{loadError.message}</span>
          <Button
            size="sm"
            variant="outline"
            disabled={milestoneQuery.isFetching || campaignQuery.isFetching}
            onClick={() => {
              void Promise.all([
                milestoneQuery.refetch(),
                campaignQuery.refetch(),
              ])
            }}
          >
            <ArrowsClockwiseIcon data-icon="inline-start" />
            Try again
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  const milestone = milestoneQuery.data
  const campaign = campaignQuery.data
  if (!milestone || !campaign || milestone.campaignId !== campaign.id) {
    return (
      <Alert variant="destructive">
        <WarningCircleIcon weight="fill" />
        <AlertTitle>Milestone not found in this campaign</AlertTitle>
        <AlertDescription>
          Return to the campaign and choose a milestone from its published
          schedule.
        </AlertDescription>
      </Alert>
    )
  }

  const shareSymbol = campaign.projectToken?.assetCode ?? "shares"

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/investor/discovers/${campaignId}` as Route}>
            <CaretLeftIcon data-icon="inline-start" />
            Back to campaign
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{campaign.businessName}</CardTitle>
          <CardDescription>
            Campaign context for this milestone ballot.
          </CardDescription>
          <CardAction>
            <Badge
              variant={
                campaign.status === "GOAL_REACHED" ? "default" : "secondary"
              }
            >
              Campaign {campaign.status.replaceAll("_", " ")}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Voting weight is measured in {shareSymbol} project shares. Milestone
          releases are paid from the campaign principal in USDC.
        </CardContent>
      </Card>

      <MilestoneDetailHeader milestone={milestone} tokenSymbol="USDC" />

      <MilestoneQuorumAlert milestone={milestone} />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="flex min-w-0 flex-col gap-6">
          <MilestoneProofCard milestone={milestone} />
          <MilestoneTallyCard milestone={milestone} />
        </div>
        <div className="xl:sticky xl:top-6">
          <MilestoneVoteCard milestone={milestone} shareSymbol={shareSymbol} />
        </div>
      </div>
    </div>
  )
}
