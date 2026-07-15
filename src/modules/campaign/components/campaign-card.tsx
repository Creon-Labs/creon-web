import { ArrowRightIcon } from "@phosphor-icons/react"
import type { Route } from "next"
import Link from "next/link"

import ImageWithFallback from "@/shared/components/primitives/image-with-fallback"
import { formatUsdcAmount } from "@/shared/utils/format-usdc"
import { Badge } from "@shadcn-ui/badge"
import { Button } from "@shadcn-ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@shadcn-ui/card"
import { Progress } from "@shadcn-ui/progress"

import type { Campaign } from "../types"
import { getCampaignFundingProgress } from "../utils/campaign-state"

function campaignStatusVariant(status: Campaign["status"]) {
  if (status === "ACTIVE") return "default" as const
  if (status === "CANCELLED") return "destructive" as const
  return "secondary" as const
}

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const thumbnail = campaign.media.find((item) => item.kind === "IMAGE")
  const progress = getCampaignFundingProgress(
    campaign.raisedAmount,
    campaign.goalAmount
  )
  const href = `/investor/discovers/${campaign.id}` as Route

  return (
    <Card className="h-full">
      <div className="aspect-video overflow-hidden">
        <ImageWithFallback
          src={thumbnail?.url ?? ""}
          alt={thumbnail?.originalName ?? campaign.businessName}
          width={800}
          height={450}
          className="aspect-video h-full w-full bg-muted object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-2">{campaign.businessName}</CardTitle>
        <CardDescription className="line-clamp-3">
          {campaign.businessDescription}
        </CardDescription>
        <CardAction>
          <Badge variant={campaignStatusVariant(campaign.status)}>
            {campaign.status.replaceAll("_", " ")}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4 text-xs">
          <span className="text-muted-foreground">Raised</span>
          <span className="font-medium">
            {formatUsdcAmount(campaign.raisedAmount)} USDC
          </span>
        </div>
        <Progress
          aria-label={`${campaign.businessName} funding progress`}
          value={progress}
        />
        <div className="flex items-center justify-between gap-4 text-xs">
          <span>{progress}% funded</span>
          <span className="text-muted-foreground">
            Target {formatUsdcAmount(campaign.goalAmount)} USDC
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" variant="outline">
          <Link href={href}>
            View campaign
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
