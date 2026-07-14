import Link from "next/link"
import { CaretLeftIcon } from "@phosphor-icons/react"
import { Button } from "@shadcn-ui/button"

import type { MilestoneDetail } from "../types"
import { MilestoneDetailHeader } from "../components/milestone-detail-header"
import { MilestoneProofCard } from "../components/milestone-proof-card"
import { MilestoneTallyCard } from "../components/milestone-tally-card"

type EntrepreneurMilestoneDetailPageProps = {
  milestone: MilestoneDetail
  campaignId: string
  tokenSymbol?: string
}

export function EntrepreneurMilestoneDetailPage({
  milestone,
  campaignId,
  tokenSymbol = "USDT",
}: EntrepreneurMilestoneDetailPageProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Back navigation */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="-ml-3 text-muted-foreground"
        >
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Link href={`/entrepreneur/${campaignId}/milestones` as any}>
            <CaretLeftIcon className="mr-2 size-4" />
            Back to Milestones
          </Link>
        </Button>
      </div>

      <MilestoneDetailHeader milestone={milestone} tokenSymbol={tokenSymbol} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MilestoneTallyCard milestone={milestone} />
        <MilestoneProofCard milestone={milestone} />
      </div>
    </div>
  )
}
