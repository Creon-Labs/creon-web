"use client"

import { DistributeProfitDialog } from "./distribute-profit-dialog"
import { DistributionStats } from "./distribution-stats"
import { DistributionHistoryTable } from "./distribution-history-table"
import { ProfitDistribution } from "../types"

// Temporary mock data for UI testing
const mockDistributions: ProfitDistribution[] = [
  {
    id: "dist-1",
    campaignId: "camp-123",
    onchainId: 1,
    totalAmount: "5000.0000000",
    totalShares: "10000.0000000",
    rewardPerShare: "0.500000000000000000",
    totalClaimed: "4250.0000000",
    merkleRoot: "0x123abc...",
    snapshotLedger: 1234567,
    status: "COMPLETED",
    distributedAt: new Date("2025-10-15T10:00:00Z").toISOString(),
    createdAt: new Date("2025-10-15T09:00:00Z").toISOString(),
  },
  {
    id: "dist-2",
    campaignId: "camp-123",
    onchainId: 2,
    totalAmount: "2500.0000000",
    totalShares: "10000.0000000",
    rewardPerShare: "0.250000000000000000",
    totalClaimed: "2500.0000000",
    merkleRoot: "0x456def...",
    snapshotLedger: 2345678,
    status: "COMPLETED",
    distributedAt: new Date("2026-01-15T10:00:00Z").toISOString(),
    createdAt: new Date("2026-01-15T09:00:00Z").toISOString(),
  },
  {
    id: "dist-3",
    campaignId: "camp-123",
    onchainId: 3,
    totalAmount: "3000.0000000",
    totalShares: null,
    rewardPerShare: null,
    totalClaimed: "0.0000000",
    merkleRoot: null,
    snapshotLedger: null,
    status: "PENDING",
    distributedAt: new Date("2026-04-15T10:00:00Z").toISOString(),
    createdAt: new Date("2026-04-15T09:00:00Z").toISOString(),
  },
]

export function DistributionView() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dividends & Returns</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage profit distribution to your campaign investors.
          </p>
        </div>
        <DistributeProfitDialog />
      </div>

      <DistributionStats distributions={mockDistributions} />

      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold tracking-tight">
          Distribution History
        </h3>
        <DistributionHistoryTable distributions={mockDistributions} />
      </div>
    </div>
  )
}
