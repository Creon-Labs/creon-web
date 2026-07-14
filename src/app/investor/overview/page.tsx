"use client"

import { usePageTitle } from "@/shared/components/sections/app-header"
import { InvestorOverview } from "@/modules/investor-dashboard"

export default function InvestorOverviewPage() {
  usePageTitle("Overview")

  return <InvestorOverview />
}
