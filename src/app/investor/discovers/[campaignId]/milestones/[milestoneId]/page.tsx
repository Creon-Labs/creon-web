"use client"

import { use } from "react"

import { InvestorMilestoneVotingPage } from "@/modules/milestone"
import { usePageTitle } from "@/shared/components/sections/app-header"

export default function Page({
  params,
}: {
  params: Promise<{ campaignId: string; milestoneId: string }>
}) {
  const { campaignId, milestoneId } = use(params)
  usePageTitle("Milestone voting")

  return (
    <InvestorMilestoneVotingPage
      campaignId={campaignId}
      milestoneId={milestoneId}
    />
  )
}
