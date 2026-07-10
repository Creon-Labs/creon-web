"use client"

import { EntrepreneurCampaignListPage } from "@/modules/campaign"
import { usePageTitle } from "@/shared/components/sections/app-header"

export default function Page() {
  usePageTitle("Campaigns")

  return <EntrepreneurCampaignListPage />
}
