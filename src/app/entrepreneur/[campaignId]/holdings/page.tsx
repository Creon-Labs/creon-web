"use client"

import { useParams } from "next/navigation"

import { usePageTitle } from "@/shared/components/sections/app-header"
import {
  EntrepreneurHoldingsPage,
  HoldingsSkeleton,
  useGetCampaignHoldings,
} from "@/modules/holdings"

export default function Page() {
  usePageTitle("Holdings")

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

