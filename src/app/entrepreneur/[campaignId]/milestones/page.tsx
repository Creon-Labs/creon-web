"use client"

import { use } from "react"
import { useState } from "react"
import { usePageTitle } from "@/shared/components/sections/app-header"
import {
  EntrepreneurMilestonesPage,
  MilestonesSkeleton,
  useGetCampaignMilestones,
  SubmitDisbursementDialog,
} from "@/modules/milestone"

export default function Page({
  params,
}: {
  params: Promise<{ campaignId: string }>
}) {
  const resolvedParams = use(params)
  usePageTitle("Milestones")

  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(
    null
  )

  const {
    data: milestones,
    isLoading,
    refetch,
    isFetching,
  } = useGetCampaignMilestones({ campaignId: resolvedParams.campaignId })

  console.log({ milestones })

  if (isLoading) return <MilestonesSkeleton />

  return (
    <>
      <EntrepreneurMilestonesPage
        milestones={milestones || []}
        tokenSymbol="USDT"
        lastUpdatedAt="Just now"
        onRefresh={refetch}
        isRefreshing={isFetching}
        onSubmitProgress={(milestoneId) => setSelectedMilestoneId(milestoneId)}
      />

      <SubmitDisbursementDialog
        milestoneId={selectedMilestoneId}
        onOpenChange={(open) => !open && setSelectedMilestoneId(null)}
      />
    </>
  )
}
