"use client"

import { z } from "zod"
import { toast } from "sonner"
import { UploadIcon } from "@phosphor-icons/react"
import { Button } from "@shadcn-ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@shadcn-ui/dialog"
import { Input } from "@shadcn-ui/input"

import { useHookForm } from "@/shared/lib/hook-form"
import { useSubmitDisbursement } from "../api/submit-disbursement"

const submitDisbursementSchema = z.object({
  proof: z
    .any()
    .refine((file) => file instanceof File, "Proof file is required")
    .refine(
      (file) => file instanceof File && file.size <= 5 * 1024 * 1024,
      "File size must be less than 5MB"
    )
    .refine(
      (file) =>
        file instanceof File &&
        ["image/jpeg", "image/png", "application/pdf"].includes(file.type),
      "Only JPEG, PNG, or PDF files are allowed"
    ),
})

type SubmitDisbursementDialogProps = {
  milestoneId: string | null
  onOpenChange: (open: boolean) => void
}

export function SubmitDisbursementDialog({
  milestoneId,
  onOpenChange,
}: SubmitDisbursementDialogProps) {
  const { mutateAsync: submitDisbursement, isPending } = useSubmitDisbursement()

  const form = useHookForm({
    schema: submitDisbursementSchema,
  })

  const isOpen = !!milestoneId

  const handleClose = () => {
    form.reset()
    onOpenChange(false)
  }

  const onSubmit = async (data: z.infer<typeof submitDisbursementSchema>) => {
    if (!milestoneId) return

    try {
      await submitDisbursement({
        milestoneId,
        proof: data.proof as File,
      })
      toast.success("Progress submitted successfully")
      handleClose()
    } catch (error) {
      const apiError = error as { message?: string }
      toast.error(apiError.message || "Failed to submit progress")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Submit Progress</DialogTitle>
          <DialogDescription>
            Upload proof of work/progress to request the next fund disbursement. This will start a voting period for investors.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Proof Document
            </label>
            <Input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              {...form.register("proof")}
              disabled={isPending}
            />
            <p className="text-sm text-muted-foreground">
              JPEG, PNG, or PDF up to 5MB
            </p>
            {form.formState.errors.proof && (
              <p className="text-sm font-medium text-destructive">
                {form.formState.errors.proof.message as string}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <UploadIcon className="mr-2 h-4 w-4 animate-bounce" />}
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
