"use client"

import { use } from "react"

import { InvestorCampaignDetails } from "@/modules/investment"
import { usePageTitle } from "@/shared/components/sections/app-header"

export default function CampaignDetailPage({
  params,
}: {
  params: Promise<{ campaignId: string }>
}) {
  usePageTitle("Campaign details")
  const { campaignId } = use(params)

  return <InvestorCampaignDetails campaignId={campaignId} />
}
