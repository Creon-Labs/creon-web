"use client"

import { usePageTitle } from "@/shared/components/sections/app-header"
import { EditProposalForm, useGetProposals } from "@/modules/proposal"
import { Spinner } from "@shadcn-ui/spinner"
import { use } from "react"

export default function Page({
  params,
}: {
  params: Promise<{ campaignId: string }>
}) {
  usePageTitle("Settings")
  const { campaignId } = use(params)
  const { data: proposals, isLoading } = useGetProposals()
  const proposal = proposals?.find((item) => item.campaignId === campaignId)

  if (isLoading) {
    return (
      <div className="flex h-dvh w-full items-center justify-center">
        <Spinner className="size-5" />
      </div>
    )
  }

  if (!proposal) return null

  return (
    <div className="mx-auto w-full max-w-4xl py-6">
      <EditProposalForm proposalId={proposal.id} />
    </div>
  )
}
