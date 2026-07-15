"use client"

import * as React from "react"

import {
  AdminProposalItem,
  ProposalStatus,
  useGetAdminProposalList,
} from "@/modules/admin"
import { useGetCampaignRefund } from "@/modules/refund"

import { AdminCampaignsTable } from "./admin-campaigns-table"
import {
  ApproveProposalDialog,
  RejectProposalDialog,
  CancelCampaignDialog,
} from "./admin-campaign-action-dialogs"

import { Tabs, TabsList, TabsTrigger } from "@/shared/components/shadcn-ui/tabs"
import { Spinner } from "@/shared/components/shadcn-ui/spinner"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/shadcn-ui/alert"
import { Button } from "@/shared/components/shadcn-ui/button"
import {
  CheckCircleIcon,
  InfoIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react"

type RefundProgressProps = {
  campaignId: string
  onDismiss: () => void
}

function RefundProgress({ campaignId, onDismiss }: RefundProgressProps) {
  const refundQuery = useGetCampaignRefund({ campaignId })
  const refund = refundQuery.data
  const isFailed = refund?.status === "FAILED"
  const isCompleted = refund?.status === "COMPLETED"

  return (
    <Alert variant={isFailed ? "destructive" : "default"}>
      {refundQuery.isLoading || refund?.status === "PENDING" ? (
        <Spinner />
      ) : isFailed ? (
        <WarningCircleIcon weight="fill" />
      ) : isCompleted ? (
        <CheckCircleIcon weight="fill" />
      ) : (
        <InfoIcon weight="fill" />
      )}
      <AlertTitle>
        {isFailed
          ? "Refund processing failed"
          : isCompleted
            ? "Refund is ready for investors"
            : "Refund sedang diproses"}
      </AlertTitle>
      <AlertDescription className="flex flex-col items-start gap-3">
        <span>
          {isFailed
            ? "The on-chain cancellation or Merkle tree setup did not finish. Check the backend job before retrying."
            : isCompleted
              ? "The on-chain cancellation and Merkle tree are complete. Eligible investors can now claim their pro-rata USDC refund."
              : "Waiting for the on-chain cancellation and Merkle tree generation to finish. This status refreshes automatically."}
        </span>
        {(isFailed || isCompleted) && (
          <Button size="sm" variant="outline" onClick={onDismiss}>
            Dismiss
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}

export function AdminCampaignsView() {
  const [status, setStatus] = React.useState<ProposalStatus>("SUBMITTED")

  const { data, isLoading, isError, error } = useGetAdminProposalList({
    status,
  })

  // Dialog states
  const [approveProposal, setApproveProposal] =
    React.useState<AdminProposalItem | null>(null)
  const [rejectProposal, setRejectProposal] =
    React.useState<AdminProposalItem | null>(null)
  const [cancelCampaign, setCancelCampaign] =
    React.useState<AdminProposalItem | null>(null)
  const [refundCampaignId, setRefundCampaignId] = React.useState<string | null>(
    null
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Campaign Proposals Review
          </h2>
          <p className="text-muted-foreground">
            Manage funding proposals from entrepreneurs and monitor active
            campaigns.
          </p>
        </div>
      </div>

      {refundCampaignId ? (
        <RefundProgress
          campaignId={refundCampaignId}
          onDismiss={() => setRefundCampaignId(null)}
        />
      ) : null}

      <div className="flex flex-col gap-4">
        <Tabs
          value={status}
          onValueChange={(v) => setStatus(v as ProposalStatus)}
        >
          <TabsList>
            <TabsTrigger value="SUBMITTED">Submitted</TabsTrigger>
            <TabsTrigger value="UNDER_REVIEW">Under Review</TabsTrigger>
            <TabsTrigger value="APPROVED">Approved (Live)</TabsTrigger>
            <TabsTrigger value="REJECTED">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="flex items-center justify-center border border-dashed p-12 text-muted-foreground">
            <Spinner className="mr-2" />
            <span>Loading data...</span>
          </div>
        ) : isError ? (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
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
        campaignId={cancelCampaign?.campaignId ?? null}
        businessName={cancelCampaign?.businessName ?? null}
        onRefundOpened={(refund) => setRefundCampaignId(refund.campaignId)}
        onOpenChange={(open) => !open && setCancelCampaign(null)}
      />
    </div>
  )
}
