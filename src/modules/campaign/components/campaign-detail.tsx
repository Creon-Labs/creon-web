"use client"

import { useGetCampaignById } from "../api/get-campaign-by-id"
import { formatUsd } from "@/shared/utils/format-usd"
import { Skeleton } from "@/shared/components/shadcn-ui/skeleton"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/shadcn-ui/alert"
import { Badge } from "@/shared/components/shadcn-ui/badge"
import { Progress } from "@/shared/components/shadcn-ui/progress"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/shadcn-ui/card"
import Image from "next/image"

interface CampaignDetailProps {
  campaignId: string
}

export function CampaignDetail({ campaignId }: CampaignDetailProps) {
  const {
    data: campaign,
    isLoading,
    isError,
    error,
  } = useGetCampaignById({
    id: campaignId,
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 w-full" />
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-4 md:col-span-2">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error loading campaign details</AlertTitle>
        <AlertDescription>
          {error?.message ||
            "Failed to fetch campaign details. Please try again later."}
        </AlertDescription>
      </Alert>
    )
  }

  if (!campaign) {
    return (
      <Alert>
        <AlertTitle>Not Found</AlertTitle>
        <AlertDescription>
          The requested campaign could not be found.
        </AlertDescription>
      </Alert>
    )
  }

  const title = campaign.projectToken?.assetCode || "Unknown Campaign"
  const coverMedia = campaign.media.find((m) => m.kind === "IMAGE")

  const goal = parseFloat(campaign.goalAmount)
  const raised = parseFloat(campaign.raisedAmount)
  const progressPercent = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0

  return (
    <div className="space-y-8">
      {/* Hero Image */}
      <div className="relative aspect-[21/9] w-full overflow-hidden border bg-muted">
        {coverMedia ? (
          <Image
            src={coverMedia.url}
            alt={title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No cover image available
          </div>
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 md:col-span-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="secondary">
                {campaign.status.replace("_", " ")}
              </Badge>
              {campaign.unlockStatus && (
                <Badge variant="outline">Unlock: {campaign.unlockStatus}</Badge>
              )}
            </div>
          </div>

          <Card className="rounded-none">
            <CardHeader>
              <CardTitle className="text-lg">About This Campaign</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                <strong>Contract Address:</strong>{" "}
                {campaign.contractAddress ? (
                  <span className="font-mono break-all text-foreground">
                    {campaign.contractAddress}
                  </span>
                ) : (
                  "Pending deployment"
                )}
              </p>
              {campaign.startAt && (
                <p>
                  <strong>Start Date:</strong>{" "}
                  {new Date(campaign.startAt).toLocaleDateString()}
                </p>
              )}
              {campaign.endAt && (
                <p>
                  <strong>End Date:</strong>{" "}
                  {new Date(campaign.endAt).toLocaleDateString()}
                </p>
              )}
              {campaign.lockEndAt && (
                <p>
                  <strong>Lock End Date:</strong>{" "}
                  {new Date(campaign.lockEndAt).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          <Card className="rounded-none border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">Funding Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="text-3xl font-bold text-primary">
                  {formatUsd(raised)}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  raised of {formatUsd(goal)} goal
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span>{progressPercent.toFixed(1)}%</span>
                  <span>Funded</span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
