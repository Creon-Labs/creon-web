"use client"

import { ArrowsClockwiseIcon, WarningCircleIcon } from "@phosphor-icons/react"

import { useGetCampaignById } from "../api/get-campaign-by-id"
import { getCampaignPollingInterval } from "../utils/campaign-state"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@shadcn-ui/alert"
import { Button } from "@shadcn-ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shadcn-ui/card"
import { Skeleton } from "@shadcn-ui/skeleton"
import { CampaignDeploymentStatus } from "./campaign-deployment-status"
import { CampaignLockStatus } from "./campaign-lock-status"
import { CampaignMediaGallery } from "./campaign-media-gallery"

export function CampaignDetails({ campaignId }: { campaignId: string }) {
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
    if (error) {
      return (
        <Alert variant="destructive">
          <WarningCircleIcon weight="fill" />
          <AlertTitle>Unable to load campaign</AlertTitle>
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
      )
    }

    return <CampaignDetailsSkeleton />
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{campaign.businessName}</CardTitle>
          <CardDescription>{campaign.businessDescription}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Funding goal</span>
            <span className="font-medium">{campaign.goalAmount} USDC</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Funds raised</span>
            <span className="font-medium">{campaign.raisedAmount} USDC</span>
          </div>
        </CardContent>
      </Card>

      <CampaignDeploymentStatus
        campaign={campaign}
        isRefreshing={isFetching}
        onRefreshAction={() => {
          void refetch()
        }}
      />
      <CampaignLockStatus campaign={campaign} />
      <CampaignMediaGallery media={campaign.media} />
    </div>
  )
}

function CampaignDetailsSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-36 w-full" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  )
}
