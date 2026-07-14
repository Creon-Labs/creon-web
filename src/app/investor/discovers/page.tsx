"use client"

import { CampaignList } from "@/modules/campaign"
import { usePageTitle } from "@/shared/components/sections/app-header"

export default function DiscoverPage() {
  usePageTitle("Discover")

  return <CampaignList />
}
