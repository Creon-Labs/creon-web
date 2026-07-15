"use client"

import { useMemo } from "react"
import { ArrowsClockwiseIcon, InfoIcon } from "@phosphor-icons/react"
import { Button } from "@shadcn-ui/button"

import { Text } from "@/shared/components/primitives/typography"
import type { Campaign } from "@/modules/campaign"

import type { Milestone } from "../types"
import { MilestoneCard } from "../components/milestone-card"
import { getMilestoneSubmitState } from "../utils/milestone-submit-state"

type EntrepreneurMilestonesPageProps = {
  milestones: Milestone[]
  campaign: Pick<Campaign, "goalAmount" | "raisedAmount" | "status">
  tokenSymbol?: string
  lastUpdatedAt?: string
  onRefresh?: () => void
  isRefreshing?: boolean
  onSubmitProgress?: (milestoneId: string) => void
  isSubmitting?: boolean
}

export function EntrepreneurMilestonesPage({
  milestones,
  campaign,
  tokenSymbol = "USDC",
  lastUpdatedAt,
  onRefresh,
  isRefreshing = false,
  onSubmitProgress,
  isSubmitting = false,
}: EntrepreneurMilestonesPageProps) {
  // Sort by order ascending
  const sortedMilestones = useMemo(() => {
    if (milestones.length === 0) return []
    return [...milestones].sort((a, b) => a.order - b.order)
  }, [milestones])

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl leading-snug font-semibold">Milestones</h2>
          <Text variant="caption" className="flex items-center gap-1.5">
            List of fund disbursements based on defined milestones.
            <InfoIcon className="size-3.5 text-muted-foreground" />
          </Text>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {lastUpdatedAt && (
            <Text variant="caption-sm" className="hidden sm:block">
              Last updated: {lastUpdatedAt}
            </Text>
          )}
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
            >
              <ArrowsClockwiseIcon
                data-icon="inline-start"
                className={isRefreshing ? "animate-spin" : ""}
              />
              Refresh
            </Button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {sortedMilestones.length === 0 ? (
        <div className="flex min-h-75 flex-col items-center justify-center border border-dashed p-8 text-center">
          <Text variant="body" className="font-medium">
            No milestones
          </Text>
          <Text variant="caption" className="mt-1">
            This campaign does not have any milestones yet.
          </Text>
        </div>
      ) : (
        /* Milestones Grid */
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sortedMilestones.map((milestone) => {
            const submitState = getMilestoneSubmitState({
              campaign,
              milestone,
              milestones: sortedMilestones,
            })

            return (
              <MilestoneCard
                key={milestone.id}
                milestone={milestone}
                submitState={submitState}
                tokenSymbol={tokenSymbol}
                onSubmitProgress={onSubmitProgress}
                isSubmitting={isSubmitting}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
