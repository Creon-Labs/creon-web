import { cva, VariantProps } from "class-variance-authority"
import Link from "next/link"

import { OutlineUSDC } from "@/shared/assets/usdc-outline"
import ImageWithFallback from "@/shared/components/primitives/image-with-fallback"
import { cn } from "@/shared/utils/cn"
import { formatUsd } from "@/shared/utils/format-usd"
import {
  DotsThreeOutlineVerticalIcon,
  TimerIcon,
  UsersIcon,
} from "@phosphor-icons/react"
import { Badge } from "@shadcn-ui/badge"
import { Button } from "@shadcn-ui/button"
import { Card, CardContent, CardFooter } from "@shadcn-ui/card"
import { Progress } from "@shadcn-ui/progress"

import { CampaignStatus } from "../types"
import { CampaignStatusBadge } from "./status-badge"
import { H5, Text } from "@/shared/components/primitives/typography"

type CardVariant = {
  public: string
  "entr.submitted": string
  "entr.under_review": string
  "entr.live": string
  "entr.active": string
  "entr.rejected": string
}

const campaignCardVariants = cva<{
  variant: CardVariant
}>(
  "group/campaign-card relative w-full bg-transparent ring-neutral-100 [--card-spacing:--spacing(0)] hover:shadow-xs hover:ring-4! dark:ring-neutral-900/60",
  {
    variants: {
      variant: {
        public: "",
        "entr.submitted":
          "bg-linear-to-b from-subtle/5 to-transparent ring-subtle/10 dark:ring-subtle/5",
        "entr.under_review":
          "bg-linear-to-b from-warning/5 to-transparent ring-warning/10 dark:ring-warning/5",
        "entr.live":
          "bg-linear-to-b from-info/5 to-transparent ring-info/10 dark:ring-info/5",
        "entr.active":
          "bg-linear-to-b from-success/5 to-transparent ring-success/10 dark:ring-success/5",
        "entr.rejected":
          "bg-linear-to-b from-destructive/5 to-transparent ring-destructive/10 dark:ring-destructive/5",
      },
    },
    defaultVariants: {
      variant: "public",
    },
  }
)

const campaignCardFooterVariants = cva<{
  variant: CardVariant
}>("block border-neutral-100 p-2 dark:border-neutral-900/60", {
  variants: {
    variant: {
      public: "",
      "entr.submitted": "border-subtle/10 dark:border-subtle/5",
      "entr.under_review": "border-warning/10 dark:border-warning/5",
      "entr.live": "border-info/10 dark:border-info/5",
      "entr.active": "border-success/10 dark:border-success/5",
      "entr.rejected": "border-destructive/10 dark:border-destructive/5",
    },
  },
  defaultVariants: {
    variant: "public",
  },
})

type CampaignCardProps = VariantProps<typeof campaignCardVariants> & {
  imageUrl: string
  title: string
  description: string
  goalAmount?: number
  investorsCount?: number
  raisedAmount?: number
  endAt?: string
  className?: string
  renderFooter?: () => React.ReactNode
}

function CampaignCard({
  imageUrl,
  title,
  description,
  goalAmount = 0,
  raisedAmount = 0,
  investorsCount = 0,
  variant = "public",
  className,
  renderFooter,
}: CampaignCardProps) {
  const percentageRaised =
    goalAmount > 0 ? (raisedAmount / goalAmount) * 100 : 0

  const isEntrepreneurCard = variant?.startsWith("entr.")

  return (
    <Card
      data-variant={variant}
      className={cn(campaignCardVariants({ variant, className }))}
    >
      {/* Card Content */}
      <Link href={"/entrepreneur/campaigns/1"}>
        <CardContent className="group flex flex-col gap-0 overflow-clip sm:flex-row sm:gap-4">
          {/* Status Badge */}
          {isEntrepreneurCard && (
            <CampaignStatusBadge
              status={variant?.split(".")[1] as CampaignStatus}
              className="absolute top-2 right-auto left-2 z-10 before:absolute before:inset-0 before:-z-10 before:bg-background/20 before:backdrop-blur-sm before:content-[''] lg:right-2 lg:left-auto dark:before:bg-background/60"
            />
          )}

          {/* Campaign Image */}
          <div className="aspect-video w-full shrink-0 overflow-hidden sm:max-w-88">
            <ImageWithFallback
              src={imageUrl}
              alt={title}
              width={400}
              height={225}
              className="aspect-video h-full w-full bg-muted object-cover transition-transform duration-200 group-hover:scale-105 group-hover:brightness-90"
            />
          </div>

          <div className="w-full space-y-2.5 p-2 pb-4 sm:relative sm:py-2 sm:pl-0">
            {isEntrepreneurCard && (
              <Button
                onClick={(e) => e.preventDefault()}
                variant={"ghost"}
                size={"icon"}
                className="absolute top-2 right-2 border-none bg-background/50 backdrop-blur-xs sm:top-auto sm:-bottom-1"
              >
                <DotsThreeOutlineVerticalIcon weight="fill" />
              </Button>
            )}

            {/* Campaign Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Goal Badge */}
              <Badge
                size={"md"}
                variant={"outline"}
                className="pl-2 font-semibold"
              >
                <OutlineUSDC strokeWidth={0.5} />
                {formatUsd(goalAmount, { showSymbol: false })} Goal
              </Badge>
              {/* Investor Count Badge */}
              <Badge size={"md"} variant={"outline"} className="font-semibold">
                <UsersIcon weight="bold" />
                {investorsCount} Investors
              </Badge>
              {/* End Date Badge */}
              <Badge size={"md"} variant={"outline"} className="font-semibold">
                <TimerIcon weight="bold" />
                {"Not started yet"}
              </Badge>
            </div>

            {/* Campaign Title and Description */}
            <div className="space-y-1">
              <H5 className="line-clamp-2 group-hover:underline">{title}</H5>
              <Text variant={"caption"} className="line-clamp-2">
                {description}
              </Text>
            </div>

            {/* Campaign Raised */}
            <div className="flex items-center text-sm">
              <OutlineUSDC strokeWidth={0.5} className="size-4" />
              <span className="font-bold">
                {formatUsd(raisedAmount, { showSymbol: false })}
              </span>
              <span className="ml-1 font-medium text-muted-foreground">
                Raised
              </span>
            </div>

            {/* Campaign Raised Progress */}
            <div className="flex w-full items-center gap-2">
              <Progress
                value={percentageRaised}
                className="h-2 w-[90%] sm:w-[60%]"
              />
              <span className="text-xs font-medium text-muted-foreground">
                {Math.round(percentageRaised)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Link>

      {/* Footer, if provided */}
      {renderFooter && (
        <CampaignCardFooter variant={variant}>
          {renderFooter()}
        </CampaignCardFooter>
      )}
    </Card>
  )
}

function CampaignCardFooter({
  variant = "public",
  className,
  children,
}: React.PropsWithChildren<VariantProps<typeof campaignCardFooterVariants>> & {
  className?: string
}) {
  return (
    <CardFooter
      className={cn(campaignCardFooterVariants({ variant, className }))}
    >
      {children}
    </CardFooter>
  )
}

export { CampaignCard }
