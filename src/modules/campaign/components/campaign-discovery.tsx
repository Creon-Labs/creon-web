"use client"

import {
  ArrowsClockwiseIcon,
  StorefrontIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react"

import { Alert, AlertDescription, AlertTitle } from "@shadcn-ui/alert"
import { Button } from "@shadcn-ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@shadcn-ui/empty"
import { Skeleton } from "@shadcn-ui/skeleton"

import { useGetCampaigns } from "../api/get-campaigns"
import { CampaignCard } from "./campaign-card"

export function CampaignDiscovery() {
  const {
    data: campaigns,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetCampaigns()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Discover campaigns</h1>
        <p className="text-sm text-muted-foreground">
          Explore live Indonesian businesses raising capital through Stellar.
        </p>
      </div>

      {error ? (
        <Alert variant="destructive">
          <WarningCircleIcon weight="fill" />
          <AlertTitle>Unable to load campaigns</AlertTitle>
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
      ) : isLoading ? (
        <CampaignDiscoverySkeleton />
      ) : campaigns?.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <StorefrontIcon />
            </EmptyMedia>
            <EmptyTitle>No live campaigns yet</EmptyTitle>
            <EmptyDescription>
              Approved campaigns will appear here after their Stellar deployment
              is live.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  )
}

function CampaignDiscoverySkeleton() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="flex flex-col gap-4 border p-4">
          <Skeleton className="aspect-video w-full" />
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      ))}
    </div>
  )
}
