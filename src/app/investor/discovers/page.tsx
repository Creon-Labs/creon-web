"use client"

import { CampaignDiscovery } from "@/modules/campaign"
import { usePageTitle } from "@/shared/components/sections/app-header"

export default function DiscoverPage() {
  usePageTitle("Discover")

  return <CampaignDiscovery />
}
