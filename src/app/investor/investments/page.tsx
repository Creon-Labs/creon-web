"use client"

import { AppContainer } from "@/shared/components/layouts/app-container"
import { usePageTitle } from "@/shared/components/sections/app-header"

export default function InvestorInvestmentsPage() {
  usePageTitle("Investments")

  return (
    <>
      <h1 className="text-2xl font-semibold">Investments</h1>
    </>
  )
}
