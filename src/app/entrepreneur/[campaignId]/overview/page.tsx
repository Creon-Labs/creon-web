"use client"

import { useParams } from "next/navigation"

import { CampaignDetails } from "@/modules/campaign"
import { usePageTitle } from "@/shared/components/sections/app-header"

export default function Page() {
  usePageTitle("Campaign overview")

  const { campaignId } = useParams<{ campaignId: string }>()

  return <CampaignDetails campaignId={campaignId} />
}
