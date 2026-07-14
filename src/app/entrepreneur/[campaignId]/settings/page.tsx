"use client"

import { usePageTitle } from "@/shared/components/sections/app-header"
import { EditProposalForm } from "@/modules/proposal"
import { use } from "react"

export default function Page({
  params,
}: {
  params: Promise<{ campaignId: string }>
}) {
  usePageTitle("Settings")
  const { campaignId } = use(params)

  return (
    <div className="mx-auto w-full max-w-4xl py-6">
      <EditProposalForm proposalId={campaignId} />
    </div>
  )
}
