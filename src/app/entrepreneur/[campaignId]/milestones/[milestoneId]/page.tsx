"use client"

import { use } from "react"
import { usePageTitle } from "@/shared/components/sections/app-header"
import {
  EntrepreneurMilestoneDetailPage,
  MilestoneDetailSkeleton,
  useGetMilestone,
} from "@/modules/milestone"

export default function Page({
  params,
}: {
  params: Promise<{ campaignId: string; milestoneId: string }>
}) {
  const resolvedParams = use(params)

  usePageTitle("Milestone Detail")

  const { data: milestone, isLoading } = useGetMilestone({ 
    milestoneId: resolvedParams.milestoneId 
  })

  if (isLoading) return <MilestoneDetailSkeleton />

  if (!milestone) return <div className="text-center py-10 font-medium text-muted-foreground">Milestone not found</div>

  return (
    <EntrepreneurMilestoneDetailPage
      milestone={milestone}
      campaignId={resolvedParams.campaignId}
      tokenSymbol="USDT"
    />
  )
}
