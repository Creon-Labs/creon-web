"use client"

import { InvestmentHistoryPage } from "@/modules/investment"
import { usePageTitle } from "@/shared/components/sections/app-header"

export default function InvestorInvestmentsPage() {
  usePageTitle("Investments")

  return <InvestmentHistoryPage />
}
