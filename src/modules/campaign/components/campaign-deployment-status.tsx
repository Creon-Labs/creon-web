"use client"

import {
  ArrowsClockwiseIcon,
  CheckCircleIcon,
  CircleNotchIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react"

import { useGetCampaignById } from "../api/get-campaign-by-id"
import type { Campaign } from "../types"
import {
  CAMPAIGN_DEPLOYMENT_STEPS,
  getCampaignDeploymentProgress,
  getCampaignDeploymentStep,
  getCampaignPollingInterval,
} from "../utils/campaign-state"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@shadcn-ui/alert"
import { Badge } from "@shadcn-ui/badge"
import { Button } from "@shadcn-ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shadcn-ui/card"
import { Progress } from "@shadcn-ui/progress"
import { Skeleton } from "@shadcn-ui/skeleton"

type CampaignDeploymentStatusProps = {
  campaign: Campaign
  isRefreshing?: boolean
  onRefreshAction: () => void
}

export function CampaignDeploymentStatus({
  campaign,
  isRefreshing = false,
  onRefreshAction,
}: CampaignDeploymentStatusProps) {
  const step = getCampaignDeploymentStep(campaign.deployStatus)
  const isFailed = campaign.deployStatus === "FAILED"
  const isLive = campaign.deployStatus === "LIVE"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign deployment</CardTitle>
        <CardDescription>
          {isFailed
            ? "The deployment did not complete. Refresh to check for an updated status."
            : isLive
              ? "The campaign contracts are live on Stellar."
              : "The system is creating and connecting the campaign contracts."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {isFailed ? (
          <Alert variant="destructive">
            <WarningCircleIcon weight="fill" />
            <AlertTitle>Deployment needs attention</AlertTitle>
            <AlertDescription>
              The campaign cannot accept investments until deployment succeeds.
            </AlertDescription>
            <AlertAction>
              <Button
                size="xs"
                variant="outline"
                disabled={isRefreshing}
                onClick={onRefreshAction}
              >
                <ArrowsClockwiseIcon data-icon="inline-start" />
                Refresh
              </Button>
            </AlertAction>
          </Alert>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium">Deployment progress</span>
              <Badge variant={isLive ? "default" : "secondary"}>
                {isLive ? (
                  <CheckCircleIcon data-icon="inline-start" weight="fill" />
                ) : (
                  <CircleNotchIcon
                    data-icon="inline-start"
                    className="animate-spin"
                  />
                )}
                {campaign.deployStatus.replaceAll("_", " ")}
              </Badge>
            </div>
            <Progress
              aria-label="Campaign deployment progress"
              value={getCampaignDeploymentProgress(campaign.deployStatus)}
            />
          </div>
        )}

        <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {CAMPAIGN_DEPLOYMENT_STEPS.map((deploymentStep, index) => {
            const isComplete = step > index
            const isCurrent = step === index

            return (
              <li
                key={deploymentStep.status}
                className="flex flex-col gap-1 border p-3"
                data-current={isCurrent || undefined}
              >
                <span className="text-xs font-medium text-muted-foreground">
                  Step {index + 1}
                </span>
                <span className="text-sm font-medium">
                  {isComplete ? "Complete: " : isCurrent ? "Current: " : ""}
                  {deploymentStep.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {deploymentStep.description}
                </span>
              </li>
            )
          })}
        </ol>

        {!isLive && !isFailed ? (
          <p className="text-xs text-muted-foreground">
            This status refreshes automatically every 10 seconds.
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}

export function CampaignDeploymentPanel({
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

  if (!campaign) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Campaign deployment</CardTitle>
          <CardDescription>
            Checking the current campaign deployment status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <Alert variant="destructive">
              <WarningCircleIcon weight="fill" />
              <AlertTitle>Campaign status is unavailable</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
              <AlertAction>
                <Button
                  size="xs"
                  variant="outline"
                  disabled={isFetching}
                  onClick={() => {
                    void refetch()
                  }}
                >
                  <ArrowsClockwiseIcon data-icon="inline-start" />
                  Refresh
                </Button>
              </AlertAction>
            </Alert>
          ) : (
            <Skeleton className="h-20 w-full" />
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <CampaignDeploymentStatus
      campaign={campaign}
      isRefreshing={isFetching}
      onRefreshAction={() => {
        void refetch()
      }}
    />
  )
}
