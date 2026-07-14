"use client"

import Link from "next/link"

import { format } from "date-fns"
import { CheckCircleIcon, ClockIcon, WarningIcon } from "@phosphor-icons/react"
import { Button } from "@shadcn-ui/button"
import { Card, CardContent, CardFooter } from "@shadcn-ui/card"
import { Progress } from "@shadcn-ui/progress"

import { formatUsd } from "@/shared/utils/format-usd"
import { H5, Text } from "@/shared/components/primitives/typography"

import type { Milestone } from "../types"
import { MilestoneStatusBadge } from "./milestone-status-badge"

type MilestoneCardProps = {
  milestone: Milestone
  tokenSymbol?: string
  onSubmitProgress?: (milestoneId: string) => void
  isSubmitting?: boolean
}

export function MilestoneCard({
  milestone,
  tokenSymbol = "USDT",
  onSubmitProgress,
  isSubmitting = false,
}: MilestoneCardProps) {
  const amountNum = parseFloat(milestone.amount)

  return (
    <Card className="relative flex flex-col overflow-hidden transition-colors hover:border-border hover:shadow-xs">
      <CardContent className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-muted text-sm font-bold text-muted-foreground">
              {milestone.order}
            </div>
            <H5 className="line-clamp-1">{milestone.title}</H5>
          </div>
          <MilestoneStatusBadge status={milestone.status} />
        </div>

        <Text
          variant="body-small"
          className="line-clamp-3 flex-1 text-muted-foreground"
        >
          {milestone.description}
        </Text>

        <div className="flex flex-col gap-1.5 border bg-muted/30 p-3">
          <Text
            variant="caption-sm"
            className="font-medium tracking-wide uppercase"
          >
            Fund Amount
          </Text>
          <div className="font-mono text-lg font-semibold tracking-tight text-foreground">
            {formatUsd(amountNum, { showSymbol: false })} {tokenSymbol}
          </div>
        </div>

        {milestone.status === "VOTING" && milestone.votingEndsAt && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-info-foreground">
            <ClockIcon weight="fill" className="size-4" />
            <span>
              Voting ends: {format(new Date(milestone.votingEndsAt), "PPp")}
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col items-stretch gap-3 border-t bg-muted/10 p-4">
        {milestone.status === "PENDING" && (
          <Button
            className="w-full"
            disabled={isSubmitting}
            onClick={() => onSubmitProgress?.(milestone.id)}
          >
            Submit Progress
          </Button>
        )}

        {milestone.status === "VOTING" && (
          <div className="flex flex-col gap-1.5 text-center">
            <Text variant="caption-sm">Awaiting investor approval</Text>
            <Progress value={45} className="h-1.5" />
          </div>
        )}

        {milestone.status === "RELEASED" && (
          <div className="flex items-center justify-center gap-1.5 text-sm font-medium text-success-foreground">
            <CheckCircleIcon weight="fill" className="size-5" />
            Funds Released
          </div>
        )}

        {milestone.status === "REJECTED" && (
          <div className="flex items-center justify-center gap-1.5 text-sm font-medium text-destructive">
            <WarningIcon weight="fill" className="size-5" />
            Voting Rejected
          </div>
        )}

        <Button variant="outline" className="w-full" asChild>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Link
            href={
              `/entrepreneur/${milestone.campaignId}/milestones/${milestone.id}` as any
            }
          >
            Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
