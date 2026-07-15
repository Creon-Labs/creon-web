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
import {
  getCampaignCancellationPollingInterval,
  useGetCampaignById,
} from "@/modules/campaign"

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

  const {
    data: campaign,
    isLoading: isCampaignLoading,
    isFetching: isCampaignFetching,
    refetch: refetchCampaign,
  } = useGetCampaignById({
    id: resolvedParams.campaignId,
    config: {
      refetchInterval: (query) =>
        getCampaignCancellationPollingInterval(query.state.data?.status),
    },
  })

  if (isLoading || isCampaignLoading) return <MilestonesSkeleton />

  if (!campaign) {
    return (
      <div className="py-10 text-center font-medium text-muted-foreground">
        Campaign not found
      </div>
    )
  }

  return (
    <>
      <EntrepreneurMilestonesPage
        milestones={milestones || []}
        campaign={campaign}
        tokenSymbol="USDC"
        lastUpdatedAt="Just now"
        onRefresh={() => void Promise.all([refetch(), refetchCampaign()])}
        isRefreshing={isFetching || isCampaignFetching}
        onSubmitProgress={(milestoneId) => setSelectedMilestoneId(milestoneId)}
      />

      <SubmitDisbursementDialog
        milestoneId={
          campaign.status === "CANCELLED" ? null : selectedMilestoneId
        }
        onOpenChange={(open) => !open && setSelectedMilestoneId(null)}
      />
    </>
  )
}
