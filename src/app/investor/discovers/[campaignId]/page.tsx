"use client"

import { use } from "react"

import { CampaignDetails } from "@/modules/campaign"
import { usePageTitle } from "@/shared/components/sections/app-header"

export default function CampaignDetailPage({
  params,
}: {
  params: Promise<{ campaignId: string }>
}) {
  usePageTitle("Campaign details")
  const { campaignId } = use(params)

  return <CampaignDetails campaignId={campaignId} />
}
