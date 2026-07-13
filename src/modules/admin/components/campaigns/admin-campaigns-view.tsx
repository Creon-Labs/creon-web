"use client"

import * as React from "react"

import {
  AdminProposalItem,
  ProposalStatus,
  useGetAdminProposalList,
} from "@/modules/admin"

import { AdminCampaignsTable } from "./admin-campaigns-table"
import {
  ApproveProposalDialog,
  RejectProposalDialog,
  CancelCampaignDialog,
} from "./admin-campaign-action-dialogs"

import { Tabs, TabsList, TabsTrigger } from "@/shared/components/shadcn-ui/tabs"
import { Spinner } from "@/shared/components/shadcn-ui/spinner"

export function AdminCampaignsView() {
  const [status, setStatus] = React.useState<ProposalStatus>("SUBMITTED")

  const { data, isLoading, isError, error } = useGetAdminProposalList({ status })

  // Dialog states
  const [approveProposal, setApproveProposal] = React.useState<AdminProposalItem | null>(null)
  const [rejectProposal, setRejectProposal] = React.useState<AdminProposalItem | null>(null)
  const [cancelCampaign, setCancelCampaign] = React.useState<AdminProposalItem | null>(null)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Campaign Proposals Review</h2>
          <p className="text-muted-foreground">Manage funding proposals from entrepreneurs and monitor active campaigns.</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Tabs value={status} onValueChange={(v) => setStatus(v as ProposalStatus)}>
          <TabsList>
            <TabsTrigger value="SUBMITTED">Submitted</TabsTrigger>
            <TabsTrigger value="UNDER_REVIEW">Under Review</TabsTrigger>
            <TabsTrigger value="APPROVED">Approved (Live)</TabsTrigger>
            <TabsTrigger value="REJECTED">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="flex items-center justify-center p-12 border border-dashed text-muted-foreground">
            <Spinner className="mr-2" />
            <span>Loading data...</span>
          </div>
        ) : isError ? (
          <div className="border border-destructive/50 bg-destructive/10 p-4 text-destructive rounded-md text-sm">
            Failed to load data: {error.message}
          </div>
        ) : (
          <AdminCampaignsTable
            data={data ?? []}
            onApprove={setApproveProposal}
            onReject={setRejectProposal}
            onCancel={setCancelCampaign}
          />
        )}
      </div>

      {/* Dialogs */}
      <ApproveProposalDialog
        proposalId={approveProposal?.id ?? null}
        businessName={approveProposal?.businessName ?? null}
        onOpenChange={(open) => !open && setApproveProposal(null)}
      />
      <RejectProposalDialog
        proposalId={rejectProposal?.id ?? null}
        businessName={rejectProposal?.businessName ?? null}
        onOpenChange={(open) => !open && setRejectProposal(null)}
      />
      <CancelCampaignDialog
        campaignId={cancelCampaign?.id ?? null}
        businessName={cancelCampaign?.businessName ?? null}
        onOpenChange={(open) => !open && setCancelCampaign(null)}
      />
    </div>
  )
}
