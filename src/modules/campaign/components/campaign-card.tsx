import { Campaign } from "../types"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/shared/components/shadcn-ui/card"
import { Badge } from "@/shared/components/shadcn-ui/badge"
import { Progress } from "@/shared/components/shadcn-ui/progress"
import { formatUsdCompact } from "@/shared/utils/format-usd"
import Image from "next/image"
import Link from "next/link"
import { Route } from "next"

interface CampaignCardProps {
  campaign: Campaign
  href: string
}

export function CampaignCard({ campaign, href }: CampaignCardProps) {
  const title = campaign.projectToken?.assetCode || "Unknown Campaign"
  const coverMedia = campaign.media.find((m) => m.kind === "IMAGE")

  const goal = parseFloat(campaign.goalAmount)
  const raised = parseFloat(campaign.raisedAmount)
  const progressPercent = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0

  return (
    <Link href={href as Route} className="group block h-full">
      <Card className="flex h-full flex-col overflow-hidden rounded-none transition-colors hover:bg-muted/50">
        <div className="relative aspect-video w-full bg-muted">
          {coverMedia ? (
            <Image
              src={coverMedia.url}
              alt={title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
          <div className="absolute top-3 right-3">
            <Badge
              variant="secondary"
              className="rounded-none backdrop-blur-md"
            >
              {campaign.status.replace("_", " ")}
            </Badge>
          </div>
        </div>
        <CardHeader className="flex-none pb-2">
          <h3 className="line-clamp-2 text-lg font-semibold tracking-tight">
            {title}
          </h3>
        </CardHeader>
        <CardContent className="mt-auto flex-none space-y-4 pb-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-primary">
                {formatUsdCompact(raised)} raised
              </span>
              <span className="text-muted-foreground">
                of {formatUsdCompact(goal)}
              </span>
            </div>
            <Progress value={progressPercent} className="h-2 rounded-none" />
          </div>
        </CardContent>
        <CardFooter className="flex-none pt-0 text-xs text-muted-foreground">
          {campaign.contractAddress ? "On-chain" : "Pending deployment"}
        </CardFooter>
      </Card>
    </Link>
  )
}
