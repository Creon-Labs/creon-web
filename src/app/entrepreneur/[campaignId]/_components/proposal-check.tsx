"use client"

import { useGetProposalById } from "@/modules/proposal"
import { ArrowLeftIcon } from "@phosphor-icons/react"
import { Button } from "@shadcn-ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@shadcn-ui/empty"
import { Spinner } from "@shadcn-ui/spinner"
import { useRouter } from "next/navigation"

export function ProposalCheckProvider({
  campaignId,
  children,
}: {
  campaignId: string
  children: React.ReactNode
}) {
  const { data, isLoading } = useGetProposalById({
    id: campaignId,
    config: { enabled: !!campaignId },
  })

  const router = useRouter()

  if (isLoading) {
    return (
      <div className="flex h-dvh w-full items-center justify-center">
        <Spinner className="size-5" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex h-dvh w-full items-center justify-center">
        <Empty>
          <EmptyHeader>
            <EmptyMedia>
              <div className="text-3xl font-bold">404</div>
            </EmptyMedia>
            <EmptyTitle>Campaign Proposal Not Found</EmptyTitle>
            <EmptyDescription className="w-full">
              The campaign proposal you are looking for does not exist
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              variant={"outline"}
              onClick={() => router.push("/entrepreneur")}
            >
              <ArrowLeftIcon />
              Back to Campaigns
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    )
  }

  return <>{children}</>
}
