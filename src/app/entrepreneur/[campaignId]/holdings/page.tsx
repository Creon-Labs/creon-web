"use client"

import { usePageTitle } from "@/shared/components/sections/app-header"
import {
  EntrepreneurHoldingsPage,
  HoldingsSkeleton,
  mockHoldings,
} from "@/modules/holdings"

export default function Page() {
  usePageTitle("Holdings")

  // TODO: replace with useGetCampaignHoldings({ campaignId }) when API is ready.
  // Example:
  //   const { data: holdings, isLoading, refetch, isFetching } =
  //     useGetCampaignHoldings({ campaignId })
  //   if (isLoading) return <HoldingsSkeleton />

  const holdings = mockHoldings
  const isLoading = false

  if (isLoading) return <HoldingsSkeleton />

  return (
    <EntrepreneurHoldingsPage
      holdings={holdings}
      tokenSymbol="USDT"
      lastUpdatedAt="Just now"
      // onRefresh={refetch}
      // isRefreshing={isFetching}
    />
  )
}
