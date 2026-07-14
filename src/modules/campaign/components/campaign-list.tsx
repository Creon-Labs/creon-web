"use client"

import { useGetCampaigns } from "../api/get-campaigns"
import { CampaignCard } from "./campaign-card"
import { StackedCardsIllustration } from "@/shared/assets/stacked-card"
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
} from "@/shared/components/shadcn-ui/empty"
import { Skeleton } from "@/shared/components/shadcn-ui/skeleton"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/shadcn-ui/alert"

export function CampaignList() {
  const { data: campaigns, isLoading, isError, error } = useGetCampaigns()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex h-80 flex-col space-y-3">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="mt-auto space-y-2 pt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-2 w-full" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error loading campaigns</AlertTitle>
        <AlertDescription>
          {error?.message ||
            "Failed to fetch campaigns. Please try again later."}
        </AlertDescription>
      </Alert>
    )
  }

  if (!campaigns || campaigns.length === 0) {
    return (
      <Empty className="border py-20">
        <EmptyHeader>
          <EmptyMedia>
            <StackedCardsIllustration />
          </EmptyMedia>
          <EmptyTitle>No Campaigns Found</EmptyTitle>
          <EmptyDescription>
            There are currently no active campaigns available for investment.
            Check back later!
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {campaigns.map((campaign) => (
        <CampaignCard
          key={campaign.id}
          campaign={campaign}
          href={`/investor/campaign/${campaign.id}`}
        />
      ))}
    </div>
  )
}
