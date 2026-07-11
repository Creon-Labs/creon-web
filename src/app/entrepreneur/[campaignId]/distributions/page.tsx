"use client"

import { usePageTitle } from "@/shared/components/sections/app-header"
import { DistributionView } from "@/modules/distribution"

export default function Page() {
  usePageTitle("Distributions")
  return <DistributionView />
}
