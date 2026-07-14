"use client"

import { SummaryCards } from "./summary-cards"
import { InvestmentHistory } from "./investment-history"
import { DistributionHistory } from "./distribution-history"
import { HoldingsList } from "./holdings-list"

export function InvestorOverview() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-muted-foreground">
          Welcome back! Here is a summary of your portfolio and activities.
        </p>
      </div>

      <SummaryCards />

      <div className="grid gap-6">
        <HoldingsList />
        <DistributionHistory />
        <InvestmentHistory />
      </div>
    </div>
  )
}
