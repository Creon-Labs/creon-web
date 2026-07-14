import { format } from "date-fns"
import { CalendarBlankIcon } from "@phosphor-icons/react"

import { formatUsd } from "@/shared/utils/format-usd"
import { H4, Text } from "@/shared/components/primitives/typography"

import type { MilestoneDetail } from "../types"
import { MilestoneStatusBadge } from "./milestone-status-badge"

type MilestoneDetailHeaderProps = {
  milestone: MilestoneDetail
  tokenSymbol?: string
}

export function MilestoneDetailHeader({
  milestone,
  tokenSymbol = "USDT",
}: MilestoneDetailHeaderProps) {
  const amountNum = parseFloat(milestone.amount)

  return (
    <div className="flex flex-col gap-6 border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center bg-muted text-base font-bold text-muted-foreground">
              {milestone.order}
            </div>
            <H4>{milestone.title}</H4>
          </div>
          <Text variant="body" className="text-muted-foreground">
            {milestone.description}
          </Text>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-3">
          <MilestoneStatusBadge status={milestone.status} size="lg" />
          <div className="flex flex-col items-end">
            <Text
              variant="caption-sm"
              className="tracking-wide text-muted-foreground uppercase"
            >
              Amount to Release
            </Text>
            <div className="font-mono text-xl font-bold tracking-tight">
              {formatUsd(amountNum, { showSymbol: false })} {tokenSymbol}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6 bg-muted/40 p-4">
        {milestone.votingStartedAt && (
          <div className="flex items-center gap-2 text-sm">
            <CalendarBlankIcon className="size-4 text-muted-foreground" />
            <span className="text-muted-foreground">Voting Started:</span>
            <span className="font-medium">
              {format(new Date(milestone.votingStartedAt), "PPp")}
            </span>
          </div>
        )}
        {milestone.votingEndsAt && (
          <div className="flex items-center gap-2 text-sm">
            <CalendarBlankIcon className="size-4 text-muted-foreground" />
            <span className="text-muted-foreground">Voting Ends:</span>
            <span className="font-medium">
              {format(new Date(milestone.votingEndsAt), "PPp")}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
