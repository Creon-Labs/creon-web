"use client"

import * as React from "react"
import { z } from "zod"
import { toast } from "sonner"

import { useHookForm } from "@/shared/lib/hook-form"
import type { AdminCancelCampaignResponse } from "../../types"
import {
  useApproveProposal,
  useRejectProposal,
  useCancelCampaign,
} from "@/modules/admin"

import { Button } from "@/shared/components/shadcn-ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/shadcn-ui/dialog"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/shared/components/shadcn-ui/field"
import { Textarea } from "@/shared/components/shadcn-ui/textarea"
import { Spinner } from "@/shared/components/shadcn-ui/spinner"

// -------------------------
// APPROVE PROPOSAL
// -------------------------

type ApproveProposalDialogProps = {
  proposalId: string | null
  businessName: string | null
  onOpenChange: (open: boolean) => void
}

export function ApproveProposalDialog({
  proposalId,
  businessName,
  onOpenChange,
}: ApproveProposalDialogProps) {
  const { mutate: approve, isPending } = useApproveProposal()

  const handleApprove = () => {
    if (!proposalId) return
    approve(
      { id: proposalId },
      {
        onSuccess: (data) => {
          toast.success("Proposal Approved", {
            description: `Campaign for ${businessName} is being created on the blockchain. ID: ${data.campaignId}`,
          })
          onOpenChange(false)
        },
        onError: (err) => {
          toast.error("Failed to approve proposal", {
            description: err.message,
          })
        },
      }
    )
  }

  return (
    <Dialog open={!!proposalId} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve Funding Proposal</DialogTitle>
          <DialogDescription>
            You are about to approve the proposal{" "}
            <strong>{businessName}</strong>. This action will automatically
            create a campaign smart contract on the blockchain (running in
            background).
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleApprove} disabled={isPending}>
            {isPending ? <Spinner data-icon="inline-start" /> : null}
            Approve & Deploy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// -------------------------
// REJECT PROPOSAL
// -------------------------

const rejectSchema = z.object({
  reason: z.string().min(10, "Reason must be at least 10 characters"),
})

type RejectProposalDialogProps = {
  proposalId: string | null
  businessName: string | null
  onOpenChange: (open: boolean) => void
}

export function RejectProposalDialog({
  proposalId,
  businessName,
  onOpenChange,
}: RejectProposalDialogProps) {
  const { mutate: reject, isPending } = useRejectProposal()
  const form = useHookForm({
    schema: rejectSchema,
    defaultValues: { reason: "" },
  })

  const onSubmit = form.handleSubmit((data) => {
    if (!proposalId) return
    reject(
      { id: proposalId, reason: data.reason },
      {
        onSuccess: () => {
          toast.success("Proposal Rejected", {
            description: `Proposal ${businessName} has been successfully rejected.`,
          })
          form.reset()
          onOpenChange(false)
        },
        onError: (err) => {
          toast.error("Failed to reject proposal", {
            description: err.message,
          })
        },
      }
    )
  })

  React.useEffect(() => {
    if (!proposalId) form.reset()
  }, [proposalId, form])

  return (
    <Dialog open={!!proposalId} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Proposal</DialogTitle>
          <DialogDescription>
            Reject funding proposal from <strong>{businessName}</strong>.
            Provide a reason for rejection to be sent to the entrepreneur.
          </DialogDescription>
        </DialogHeader>
        <form id="reject-proposal-form" onSubmit={onSubmit}>
          <FieldGroup>
            <Field data-invalid={!!form.formState.errors.reason}>
              <FieldLabel htmlFor="reject-proposal-reason">
                Reason for Rejection
              </FieldLabel>
              <Textarea
                id="reject-proposal-reason"
                aria-invalid={!!form.formState.errors.reason}
                placeholder="e.g., Financial statements are incomplete."
                {...form.register("reason")}
              />
              {form.formState.errors.reason && (
                <FieldDescription>
                  {form.formState.errors.reason.message}
                </FieldDescription>
              )}
            </Field>
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="reject-proposal-form"
            variant="destructive"
            disabled={isPending}
          >
            {isPending ? <Spinner data-icon="inline-start" /> : null}
            Reject Proposal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// -------------------------
// CANCEL CAMPAIGN
// -------------------------

const cancelSchema = z.object({
  reason: z.string().min(10, "Reason must be at least 10 characters"),
})

type CancelCampaignDialogProps = {
  campaignId: string | null
  businessName: string | null
  onRefundOpened: (refund: AdminCancelCampaignResponse) => void
  onOpenChange: (open: boolean) => void
}

export function CancelCampaignDialog({
  campaignId,
  businessName,
  onRefundOpened,
  onOpenChange,
}: CancelCampaignDialogProps) {
  const { mutate: cancel, isPending } = useCancelCampaign()
  const form = useHookForm({
    schema: cancelSchema,
    defaultValues: { reason: "" },
  })

  const onSubmit = form.handleSubmit((data) => {
    if (!campaignId) return
    cancel(
      { id: campaignId, reason: data.reason },
      {
        onSuccess: (refund) => {
          toast.success("Campaign Canceled", {
            description: `Campaign ${businessName} is canceled and refund process has started.`,
          })
          onRefundOpened(refund)
          form.reset()
          onOpenChange(false)
        },
        onError: (err) => {
          toast.error("Failed to cancel campaign", {
            description: err.message,
          })
        },
      }
    )
  })

  React.useEffect(() => {
    if (!campaignId) form.reset()
  }, [campaignId, form])

  return (
    <Dialog open={!!campaignId} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Campaign (Refund)</DialogTitle>
          <DialogDescription>
            This action will <strong>cancel the LIVE campaign</strong> for{" "}
            <strong>{businessName}</strong>, freeze the on-chain contract, and
            automatically initiate the refund process for investors. This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <form id="cancel-campaign-form" onSubmit={onSubmit}>
          <FieldGroup>
            <Field data-invalid={!!form.formState.errors.reason}>
              <FieldLabel htmlFor="cancel-reason">
                Reason for Cancellation
              </FieldLabel>
              <Textarea
                id="cancel-reason"
                aria-invalid={!!form.formState.errors.reason}
                placeholder="e.g., Business failed to meet milestones, funds are refunded."
                {...form.register("reason")}
              />
              {form.formState.errors.reason && (
                <FieldDescription>
                  {form.formState.errors.reason.message}
                </FieldDescription>
              )}
            </Field>
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Back
          </Button>
          <Button
            type="submit"
            form="cancel-campaign-form"
            variant="destructive"
            disabled={isPending}
          >
            {isPending ? <Spinner data-icon="inline-start" /> : null}
            Confirm Cancel & Refund
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
