"use client"

import type { Route } from "next"
import Link from "next/link"
import {
  ArrowsClockwiseIcon,
  CalendarBlankIcon,
  FlagCheckeredIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react"
import { format } from "date-fns"

import {
  CampaignDeploymentStatus,
  CampaignLockStatus,
  CampaignMediaGallery,
  getCampaignFundingProgress,
  getCampaignPollingInterval,
  useGetCampaignById,
} from "@/modules/campaign"
import { useGetCampaignMilestones, type Milestone } from "@/modules/milestone"
import { formatUsdcAmount } from "@/shared/utils/format-usdc"
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
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@shadcn-ui/empty"
import { Progress } from "@shadcn-ui/progress"
import { Skeleton } from "@shadcn-ui/skeleton"

import { InvestmentForm } from "./investment-form"

function formatCampaignDate(value: string | null): string {
  if (!value) return "Not scheduled"

  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? "Not scheduled"
    : format(date, "d MMM yyyy")
}

export function InvestorCampaignDetails({
  campaignId,
}: {
  campaignId: string
}) {
  const {
    data: campaign,
    error,
    isFetching,
    refetch,
  } = useGetCampaignById({
    id: campaignId,
    config: {
      refetchInterval: (query) => getCampaignPollingInterval(query.state.data),
    },
  })
  const milestonesQuery = useGetCampaignMilestones({ campaignId })

  if (!campaign) {
    if (error) {
      return (
        <Alert variant="destructive">
          <WarningCircleIcon weight="fill" />
          <AlertTitle>Unable to load campaign</AlertTitle>
          <AlertDescription className="flex flex-col items-start gap-3">
            <span>{error.message}</span>
            <Button
              size="sm"
              variant="outline"
              disabled={isFetching}
              onClick={() => {
                void refetch()
              }}
            >
              <ArrowsClockwiseIcon data-icon="inline-start" />
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      )
    }

    return <InvestorCampaignDetailsSkeleton />
  }

  const fundingProgress = getCampaignFundingProgress(
    campaign.raisedAmount,
    campaign.goalAmount
  )

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{campaign.businessName}</CardTitle>
          <CardDescription>{campaign.businessDescription}</CardDescription>
          <CardAction className="flex flex-wrap gap-2">
            <Badge
              variant={campaign.status === "ACTIVE" ? "default" : "secondary"}
            >
              {campaign.status.replaceAll("_", " ")}
            </Badge>
            <Badge variant="outline">
              {campaign.deployStatus.replaceAll("_", " ")}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <CampaignStat
              label="Raised"
              value={`${formatUsdcAmount(campaign.raisedAmount)} USDC`}
            />
            <CampaignStat
              label="Funding target"
              value={`${formatUsdcAmount(campaign.goalAmount)} USDC`}
            />
            <CampaignStat
              label="Project share"
              value={campaign.projectToken?.assetCode ?? "Pending deployment"}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-4 text-xs">
              <span className="font-medium">Funding progress</span>
              <span>{fundingProgress}%</span>
            </div>
            <Progress
              aria-label="Campaign funding progress"
              value={fundingProgress}
            />
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarBlankIcon />
              Started {formatCampaignDate(campaign.startAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarBlankIcon />
              Ends {formatCampaignDate(campaign.endAt)}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="flex min-w-0 flex-col gap-6">
          <CampaignMediaGallery media={campaign.media} />
          <CampaignMilestones
            campaignId={campaign.id}
            milestones={milestonesQuery.data}
            error={milestonesQuery.error}
            isLoading={milestonesQuery.isLoading}
            isFetching={milestonesQuery.isFetching}
            onRefresh={() => {
              void milestonesQuery.refetch()
            }}
          />
          <CampaignDeploymentStatus
            campaign={campaign}
            isRefreshing={isFetching}
            onRefreshAction={() => {
              void refetch()
            }}
          />
          <CampaignLockStatus campaign={campaign} />
        </div>
        <div className="xl:sticky xl:top-6">
          <InvestmentForm campaign={campaign} />
        </div>
      </div>
    </div>
  )
}

function CampaignStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border p-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

function CampaignMilestones({
  campaignId,
  milestones,
  error,
  isLoading,
  isFetching,
  onRefresh,
}: {
  campaignId: string
  milestones: Milestone[] | undefined
  error: Error | null
  isLoading: boolean
  isFetching: boolean
  onRefresh: () => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Funding milestones</CardTitle>
        <CardDescription>
          The staged principal-release schedule committed before campaign
          deployment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <Alert variant="destructive">
            <WarningCircleIcon weight="fill" />
            <AlertTitle>Unable to load milestones</AlertTitle>
            <AlertDescription className="flex flex-col items-start gap-3">
              <span>{error.message}</span>
              <Button
                size="sm"
                variant="outline"
                disabled={isFetching}
                onClick={onRefresh}
              >
                <ArrowsClockwiseIcon data-icon="inline-start" />
                Try again
              </Button>
            </AlertDescription>
          </Alert>
        ) : isLoading ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : milestones?.length ? (
          <ol className="flex flex-col gap-3">
            {milestones.map((milestone) => (
              <li key={milestone.id} className="flex flex-col gap-2 border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-medium">
                    {milestone.order}. {milestone.title}
                  </span>
                  <Badge variant="secondary">
                    {milestone.status.replaceAll("_", " ")}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {milestone.description}
                </p>
                <span className="text-xs font-medium">
                  {formatUsdcAmount(milestone.amount)} USDC
                </span>
                <div>
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={
                        `/investor/discovers/${campaignId}/milestones/${milestone.id}` as Route
                      }
                    >
                      {milestone.status === "VOTING"
                        ? "Review and vote"
                        : "View milestone"}
                    </Link>
                  </Button>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FlagCheckeredIcon />
              </EmptyMedia>
              <EmptyTitle>No milestones available</EmptyTitle>
              <EmptyDescription>
                This campaign does not expose a milestone schedule yet.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </CardContent>
    </Card>
  )
}

function InvestorCampaignDetailsSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-56 w-full" />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="flex flex-col gap-6">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  )
}
