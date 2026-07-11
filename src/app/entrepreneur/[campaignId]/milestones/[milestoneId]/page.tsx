"use client"

import { use } from "react"
import { usePageTitle } from "@/shared/components/sections/app-header"
import {
  EntrepreneurMilestoneDetailPage,
  MilestoneDetailSkeleton,
  mockMilestoneDetail,
} from "@/modules/milestones"

export default function Page({
  params,
}: {
  params: Promise<{ campaignId: string; milestoneId: string }>
}) {
  const resolvedParams = use(params)
  
  usePageTitle("Milestone Detail")

  // TODO: replace with API hook when ready
  // const { data: milestone, isLoading } = useGetMilestoneDetail({ milestoneId: resolvedParams.milestoneId })

  const milestone = mockMilestoneDetail
  const isLoading = false

  if (isLoading) return <MilestoneDetailSkeleton />

  if (!milestone) return <div>Milestone not found</div>

  return (
    <EntrepreneurMilestoneDetailPage
      milestone={milestone}
      campaignId={resolvedParams.campaignId}
      tokenSymbol="USDT"
    />
  )
}
