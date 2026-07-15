"use client"

import { use } from "react"

import { EditProposalForm } from "@/modules/proposal"
import { usePageTitle } from "@/shared/components/sections/app-header"

export default function Page({
  params,
}: {
  params: Promise<{ proposalId: string }>
}) {
  usePageTitle("Proposal")
  const { proposalId } = use(params)

  return (
    <div className="mx-auto w-full max-w-4xl py-6">
      <EditProposalForm proposalId={proposalId} />
    </div>
  )
}
