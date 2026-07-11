"use client"

import { usePageTitle } from "@/shared/components/sections/app-header"
import {
  EntrepreneurMilestonesPage,
  MilestonesSkeleton,
  mockMilestones,
} from "@/modules/milestones"

export default function Page() {
  usePageTitle("Milestones")

  // TODO: replace with useGetCampaignMilestones({ campaignId }) when API is ready.
  // Example:
  //   const { data: milestones, isLoading, refetch, isFetching } =
  //     useGetCampaignMilestones({ campaignId })
  //   if (isLoading) return <MilestonesSkeleton />

  const milestones = mockMilestones
  const isLoading = false

  if (isLoading) return <MilestonesSkeleton />

  return (
    <EntrepreneurMilestonesPage
      milestones={milestones}
      tokenSymbol="USDT"
      lastUpdatedAt="Just now"
      // onRefresh={refetch}
      // isRefreshing={isFetching}
    />
  )
}
