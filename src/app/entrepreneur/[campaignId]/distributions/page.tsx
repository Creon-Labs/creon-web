"use client"

import { usePageTitle } from "@/shared/components/sections/app-header"
import { DistributionView } from "@/modules/distribution"
import { Spinner } from "@shadcn-ui/spinner"
import { useGetCampaignById } from "@/modules/campaign"
import { useParams } from "next/navigation"
import { LockIcon } from "@phosphor-icons/react"

export default function Page() {
  usePageTitle("Distributions")

  const { campaignId } = useParams<{ campaignId: string }>()

  const { data: campaign, isLoading } = useGetCampaignById({ id: campaignId })

  if (isLoading)
    return (
      <div className="flex h-dvh w-full items-center justify-center">
        <Spinner className="size-5" />
      </div>
    )

  if (campaign?.deployStatus !== "LIVE") {
    return (
      <>
        <DistributionView campaignId={null} />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/10 backdrop-blur-xs">
          <LockIcon size={24} />
          <span className="ml-2 text-sm font-medium text-muted-foreground">
            This feature is not available until the campaign is live.
          </span>
        </div>
      </>
    )
  }

  return <DistributionView campaignId={campaignId} />
}
