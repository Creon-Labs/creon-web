import {
  CheckCircleIcon,
  UsersThreeIcon,
  XCircleIcon,
} from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@shadcn-ui/card"
import { Progress } from "@shadcn-ui/progress"

import { formatUsd } from "@/shared/utils/format-usd"
import { Text } from "@/shared/components/primitives/typography"

import type { MilestoneDetail } from "../types"

type MilestoneTallyCardProps = {
  milestone: MilestoneDetail
}

export function MilestoneTallyCard({ milestone }: MilestoneTallyCardProps) {
  const { tally } = milestone
  const participationNum = parseFloat(tally.participation)
  const approveNum = parseFloat(tally.approve)
  const rejectNum = parseFloat(tally.reject)
  const totalSupplyNum = tally.totalSupply ? parseFloat(tally.totalSupply) : 0

  // Calculate percentages
  const participationPct =
    totalSupplyNum > 0 ? (participationNum / totalSupplyNum) * 100 : 0
  const approvePct =
    participationNum > 0 ? (approveNum / participationNum) * 100 : 0
  const rejectPct =
    participationNum > 0 ? (rejectNum / participationNum) * 100 : 0

  const quorumPct = tally.quorumBps / 100
  const approvalThresholdPct = tally.approvalBps / 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <UsersThreeIcon weight="duotone" className="size-5" />
          Voting Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Participation / Quorum */}
        <div className="flex flex-col gap-2">
          <div className="flex items-end justify-between">
            <div className="flex flex-col">
              <Text
                variant="caption-sm"
                className="text-muted-foreground uppercase"
              >
                Participation
              </Text>
              <span className="font-mono font-medium">
                {formatUsd(participationNum, { showSymbol: false })} shares
              </span>
            </div>
            <div className="flex flex-col items-end">
              <Text
                variant="caption-sm"
                className="text-muted-foreground uppercase"
              >
                Quorum ({quorumPct}%)
              </Text>
              <span className="text-sm font-medium">
                {participationPct.toFixed(1)}% / {quorumPct}%
              </span>
            </div>
          </div>
          <Progress value={participationPct} className="h-2" />
        </div>

        <div className="grid grid-cols-1 gap-6 border-t pt-4 md:grid-cols-2">
          {/* Approve */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-success">
                <CheckCircleIcon weight="fill" className="size-4" />
                <span className="text-sm font-medium">Approve</span>
              </div>
              <span className="font-mono text-sm font-medium">
                {approvePct.toFixed(1)}%
              </span>
            </div>
            <Progress
              value={approvePct}
              className="h-2 bg-success/20 [&>div]:bg-success"
            />
            <Text variant="caption-sm" className="text-muted-foreground">
              {formatUsd(approveNum, { showSymbol: false })} shares
            </Text>
          </div>

          {/* Reject */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-destructive">
                <XCircleIcon weight="fill" className="size-4" />
                <span className="text-sm font-medium">Reject</span>
              </div>
              <span className="font-mono text-sm font-medium">
                {rejectPct.toFixed(1)}%
              </span>
            </div>
            <Progress
              value={rejectPct}
              className="h-2 bg-destructive/20 [&>div]:bg-destructive"
            />
            <Text variant="caption-sm" className="text-muted-foreground">
              {formatUsd(rejectNum, { showSymbol: false })} shares
            </Text>
          </div>
        </div>

        <div className="flex items-center justify-between bg-muted/40 p-3 text-sm">
          <span className="text-muted-foreground">Required Approval</span>
          <span className="font-medium">
            {approvalThresholdPct}% of participating shares
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
