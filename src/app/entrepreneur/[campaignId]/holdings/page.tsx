"use client"

import { useParams } from "next/navigation"

import { usePageTitle } from "@/shared/components/sections/app-header"
import {
  EntrepreneurHoldingsPage,
  HoldingsSkeleton,
  useGetCampaignHoldings,
} from "@/modules/holdings"
import { useGetCampaignById } from "@/modules/campaign"
import { Spinner } from "@shadcn-ui/spinner"
import { LockIcon } from "@phosphor-icons/react"

export default function Page() {
  usePageTitle("Holdings")

  const { campaignId } = useParams<{ campaignId: string }>()

  const { data: campaign, isLoading } = useGetCampaignById({ id: campaignId })

  if (isLoading)
    return (
      <div className="flex h-dvh w-full items-center justify-center">
        <Spinner className="size-5" />
      </div>
    )

  if (campaign?.deployStatus !== "LIVE") {
    return (
      <>
        <EntrepreneurHoldingsPage
          holdings={[]}
          tokenSymbol="USDT"
          lastUpdatedAt="Just now banget"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/10 backdrop-blur-xs">
          <LockIcon size={24} />
          <span className="ml-2 text-sm font-medium text-muted-foreground">
            This feature is not available until the campaign is live.
          </span>
        </div>
      </>
    )
  }

  return <HoldingsPage />
}

export function HoldingsPage() {
  const { campaignId } = useParams<{ campaignId: string }>()

  const {
    data: holdings = [],
    isLoading,
    refetch,
    isFetching,
  } = useGetCampaignHoldings({ campaignId })

  if (isLoading) return <HoldingsSkeleton />

  return (
    <EntrepreneurHoldingsPage
      holdings={holdings}
      tokenSymbol="USDT"
      lastUpdatedAt="Just now"
      onRefresh={refetch}
      isRefreshing={isFetching}
    />
  )
}
