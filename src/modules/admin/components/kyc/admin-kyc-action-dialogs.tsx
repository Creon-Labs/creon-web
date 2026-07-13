"use client"

import * as React from "react"
import { toast } from "sonner"
import { z } from "zod"

import Image from "next/image"

import { useApproveKyc, useRejectKyc, useRevokeKyc } from "@/modules/admin"
import { useHookForm } from "@/shared/lib/hook-form"

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
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/shadcn-ui/field"
import { Spinner } from "@/shared/components/shadcn-ui/spinner"
import { Textarea } from "@/shared/components/shadcn-ui/textarea"

// -------------------------
// APPROVE
// -------------------------

type ApproveKycDialogProps = {
  userId: string | null
  userName: string | null
  onOpenChange: (open: boolean) => void
}

export function ApproveKycDialog({
  userId,
  userName,
  onOpenChange,
}: ApproveKycDialogProps) {
  const { mutate: approve, isPending } = useApproveKyc()

  const handleApprove = () => {
    if (!userId) return
    approve(
      { userId },
      {
        onSuccess: () => {
          toast.success("KYC Approved", {
            description: `KYC for ${userName} has been successfully approved.`,
          })
          onOpenChange(false)
        },
        onError: (err) => {
          toast.error("Failed to approve KYC", {
            description: err.message,
          })
        },
      }
    )
  }

  return (
    <Dialog open={!!userId} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve KYC Submission</DialogTitle>
          <DialogDescription>
            You are about to approve the KYC submission for{" "}
            <strong>{userName}</strong>. This user&apos;s wallet will be
            automatically registered on-chain.
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
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// -------------------------
// REJECT
// -------------------------

const rejectSchema = z.object({
  reason: z.string().min(5, "Reason must be at least 5 characters"),
})

type RejectKycDialogProps = {
  userId: string | null
  userName: string | null
  onOpenChange: (open: boolean) => void
}

export function RejectKycDialog({
  userId,
  userName,
  onOpenChange,
}: RejectKycDialogProps) {
  const { mutate: reject, isPending } = useRejectKyc()
  const form = useHookForm({
    schema: rejectSchema,
    defaultValues: { reason: "" },
  })

  const onSubmit = form.handleSubmit((data) => {
    if (!userId) return
    reject(
      { userId, reason: data.reason },
      {
        onSuccess: () => {
          toast.success("KYC Rejected", {
            description: `KYC for ${userName} has been successfully rejected.`,
          })
          form.reset()
          onOpenChange(false)
        },
        onError: (err) => {
          toast.error("Failed to reject KYC", {
            description: err.message,
          })
        },
      }
    )
  })

  // Reset form when dialog closes/opens
  React.useEffect(() => {
    if (!userId) form.reset()
  }, [userId, form])

  return (
    <Dialog open={!!userId} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject KYC Submission</DialogTitle>
          <DialogDescription>
            Reject the KYC submission for <strong>{userName}</strong>. Provide a
            reason for rejection so the user can correct their data.
          </DialogDescription>
        </DialogHeader>
        <form id="reject-form" onSubmit={onSubmit}>
          <FieldGroup>
            <Field data-invalid={!!form.formState.errors.reason}>
              <FieldLabel htmlFor="reason">Reason for Rejection</FieldLabel>
              <Textarea
                id="reason"
                aria-invalid={!!form.formState.errors.reason}
                placeholder="e.g., ID Card photo is blurry and illegible."
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
            form="reject-form"
            variant="destructive"
            disabled={isPending}
          >
            {isPending ? <Spinner data-icon="inline-start" /> : null}
            Reject KYC
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// -------------------------
// REVOKE
// -------------------------

const revokeSchema = z.object({
  reason: z.string().min(5, "Reason must be at least 5 characters"),
})

type RevokeKycDialogProps = {
  userId: string | null
  userName: string | null
  onOpenChange: (open: boolean) => void
}

export function RevokeKycDialog({
  userId,
  userName,
  onOpenChange,
}: RevokeKycDialogProps) {
  const { mutate: revoke, isPending } = useRevokeKyc()
  const form = useHookForm({
    schema: revokeSchema,
    defaultValues: { reason: "" },
  })

  const onSubmit = form.handleSubmit((data) => {
    if (!userId) return
    revoke(
      { userId, reason: data.reason },
      {
        onSuccess: () => {
          toast.success("KYC Status Revoked", {
            description: `KYC status for ${userName} has been successfully revoked.`,
          })
          form.reset()
          onOpenChange(false)
        },
        onError: (err) => {
          toast.error("Failed to revoke KYC", {
            description: err.message,
          })
        },
      }
    )
  })

  React.useEffect(() => {
    if (!userId) form.reset()
  }, [userId, form])

  return (
    <Dialog open={!!userId} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Revoke KYC Status</DialogTitle>
          <DialogDescription>
            You are about to revoke the previously approved KYC status for{" "}
            <strong>{userName}</strong>. The user will no longer be able to
            transact.
          </DialogDescription>
        </DialogHeader>
        <form id="revoke-form" onSubmit={onSubmit}>
          <FieldGroup>
            <Field data-invalid={!!form.formState.errors.reason}>
              <FieldLabel htmlFor="revoke-reason">
                Reason for Revocation
              </FieldLabel>
              <Textarea
                id="revoke-reason"
                aria-invalid={!!form.formState.errors.reason}
                placeholder="e.g., Indication of fraud on the wallet."
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
            form="revoke-form"
            variant="destructive"
            disabled={isPending}
          >
            {isPending ? <Spinner data-icon="inline-start" /> : null}
            Revoke KYC
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// -------------------------
// VIEW DOCUMENTS
// -------------------------

type ViewDocsDialogProps = {
  idCardUrl: string | null
  selfieUrl: string | null
  userName: string | null
  onOpenChange: (open: boolean) => void
}

export function ViewDocsDialog({
  idCardUrl,
  selfieUrl,
  userName,
  onOpenChange,
}: ViewDocsDialogProps) {
  const isOpen = !!idCardUrl
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl!">
        <DialogHeader>
          <DialogTitle>KYC Documents: {userName}</DialogTitle>
          <DialogDescription>
            These images are loaded using a temporary presigned URL.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-medium">KTP / ID Card</h4>
            {idCardUrl ? (
              <div className="relative h-75 overflow-hidden border bg-muted">
                <Image
                  src={idCardUrl}
                  alt="KTP"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            ) : (
              <div className="flex h-75 items-center justify-center border bg-muted text-sm text-muted-foreground">
                No document
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-medium">Selfie</h4>
            {selfieUrl ? (
              <div className="relative h-75 overflow-hidden border bg-muted">
                <Image
                  src={selfieUrl}
                  alt="Selfie"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            ) : (
              <div className="flex h-75 items-center justify-center border bg-muted text-sm text-muted-foreground">
                No document
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
