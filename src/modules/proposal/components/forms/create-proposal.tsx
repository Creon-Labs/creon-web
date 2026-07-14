"use client"

import { useState } from "react"
import { FormProvider } from "react-hook-form"
import { useRouter } from "next/navigation"
import {
  BuildingsIcon,
  CurrencyCircleDollarIcon,
  ClockIcon,
  ListChecksIcon,
  FloppyDiskIcon,
  PaperPlaneTiltIcon,
  WarningCircleIcon,
  FileArrowUpIcon,
} from "@phosphor-icons/react"
import { toast } from "sonner"

import { useHookForm } from "@/shared/lib/hook-form"
import { ApiError } from "@/shared/lib/api-client"
import { cn } from "@/shared/utils/cn"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@shadcn-ui/field"
import { Input } from "@shadcn-ui/input"
import { Textarea } from "@shadcn-ui/textarea"
import { Button } from "@shadcn-ui/button"
import { Separator } from "@shadcn-ui/separator"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shadcn-ui/select"
import { Spinner } from "@shadcn-ui/spinner"

import { createProposalSchema } from "../../schema/proposal-schema"
import type { CreateProposalFormValues } from "../../schema/proposal-schema"
import { MilestonesField } from "./milestones-field"
import { useCreateProposal } from "../../api/create-proposal"
import { useSubmitProposal } from "../../api/submit-proposal"
import { useUploadProposalMedia } from "../../api/upload-proposal-media"

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BUSINESS_CATEGORIES = [
  "Food & Beverage",
  "Fashion & Apparel",
  "Agriculture",
  "Technology",
  "Health & Beauty",
  "Education",
  "Crafts & Handicrafts",
  "Retail & Trading",
  "Transportation",
  "Tourism & Hospitality",
  "Construction",
  "Manufacturing",
  "Services",
  "Other",
] as const

// ---------------------------------------------------------------------------
// Section header helper
// ---------------------------------------------------------------------------

interface FormSectionProps {
  icon: React.ElementType
  title: string
  description: string
  children: React.ReactNode
  className?: string
}

function FormSection({
  icon: Icon,
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <section className={cn("flex flex-col gap-5", className)}>
      <div className="flex items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-none border border-border bg-muted">
          <Icon className="size-4 text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-0.5">
          <h2 className="text-sm font-semibold">{title}</h2>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>

      {children}
    </section>
  )
}

// ---------------------------------------------------------------------------
// CreateProposalForm
// ---------------------------------------------------------------------------

export function CreateProposalForm() {
  const router = useRouter()

  // Track which button triggered the async action so each shows its own spinner
  const [activeAction, setActiveAction] = useState<"draft" | "submit" | null>(
    null
  )
  const [formError, setFormError] = useState<string | null>(null)

  const { mutateAsync: createProposal } = useCreateProposal()
  const { mutateAsync: submitProposal } = useSubmitProposal()
  const { mutateAsync: uploadProposalMedia } = useUploadProposalMedia()

  const form = useHookForm<typeof createProposalSchema>({
    schema: createProposalSchema,
    defaultValues: {
      businessName: "",
      businessDescription: "",
      category: "",
      location: "",
      requestedAmount: "",
      lockPeriodDays: 180,
      milestones: [
        {
          order: 1,
          title: "",
          description: "",
          amount: "",
        },
      ],
      images: [],
      documents: [],
    },
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form

  const requestedAmount = watch("requestedAmount")

  const isBusy = activeAction !== null

  async function handleMediaUpload(proposalId: string, data: CreateProposalFormValues) {
    const hasImages = data.images && data.images.length > 0
    const hasDocuments = data.documents && data.documents.length > 0

    if (hasImages || hasDocuments) {
      await uploadProposalMedia({
        id: proposalId,
        images: data.images,
        documents: data.documents,
      })
    }
  }

  async function onSaveDraft(data: CreateProposalFormValues) {
    setFormError(null)
    setActiveAction("draft")
    try {
      const proposal = await createProposal({
        businessName: data.businessName,
        businessDescription: data.businessDescription,
        category: data.category,
        location: data.location || undefined,
        requestedAmount: data.requestedAmount,
        lockPeriodDays: Number(data.lockPeriodDays),
        milestones: data.milestones,
      })
      if (!proposal) throw new Error("Failed to create proposal.")
      
      await handleMediaUpload(proposal.id, data)

      toast.success("Draft saved!", {
        description: "Your proposal has been saved as a draft.",
      })
      router.replace("/entrepreneur")
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to save draft. Please try again."
      setFormError(message)
    } finally {
      setActiveAction(null)
    }
  }

  async function onSubmit(data: CreateProposalFormValues) {
    setFormError(null)
    setActiveAction("submit")
    try {
      const proposal = await createProposal({
        businessName: data.businessName,
        businessDescription: data.businessDescription,
        category: data.category,
        location: data.location || undefined,
        requestedAmount: data.requestedAmount,
        lockPeriodDays: Number(data.lockPeriodDays),
        milestones: data.milestones,
      })
      if (!proposal) throw new Error("Failed to create proposal.")

      await handleMediaUpload(proposal.id, data)

      await submitProposal({ id: proposal.id })
      toast.success("Proposal submitted!", {
        description:
          "Your proposal has been submitted and is now under review.",
      })
      router.replace("/entrepreneur")
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to submit proposal. Please try again."
      setFormError(message)
    } finally {
      setActiveAction(null)
    }
  }

  return (
    <FormProvider {...form}>
      <form
        id="create-proposal-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-8"
      >
        {/* ── 1. Business Information ─────────────────────────────────── */}
        <FormSection
          icon={BuildingsIcon}
          title="Business Information"
          description="Basic details about your business and what you do."
        >
          <FieldGroup>
            {/* Business Name */}
            <Field data-invalid={!!errors.businessName || undefined}>
              <FieldLabel htmlFor="businessName">Business Name</FieldLabel>
              <Input
                id="businessName"
                placeholder="e.g. Warung Kopi Nusantara"
                aria-invalid={!!errors.businessName}
                {...register("businessName")}
              />
              {errors.businessName && (
                <FieldError>{errors.businessName.message}</FieldError>
              )}
            </Field>

            {/* Category */}
            <Field data-invalid={!!errors.category || undefined}>
              <FieldLabel htmlFor="category">Business Category</FieldLabel>
              <Select
                onValueChange={(val) =>
                  setValue("category", val, { shouldValidate: true })
                }
              >
                <SelectTrigger
                  id="category"
                  aria-invalid={!!errors.category}
                  className="w-full"
                >
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {BUSINESS_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.category && (
                <FieldError>{errors.category.message}</FieldError>
              )}
            </Field>

            {/* Location */}
            <Field data-invalid={!!errors.location || undefined}>
              <FieldLabel htmlFor="location">
                Location{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </FieldLabel>
              <Input
                id="location"
                placeholder="e.g. Yogyakarta"
                aria-invalid={!!errors.location}
                {...register("location")}
              />
              <FieldDescription>
                City or region where your business operates
              </FieldDescription>
              {errors.location && (
                <FieldError>{errors.location.message}</FieldError>
              )}
            </Field>

            {/* Business Description */}
            <Field data-invalid={!!errors.businessDescription || undefined}>
              <FieldLabel htmlFor="businessDescription">
                Business Description
              </FieldLabel>
              <Textarea
                id="businessDescription"
                placeholder="Describe your business, its mission, and how the funding will be used..."
                rows={5}
                aria-invalid={!!errors.businessDescription}
                {...register("businessDescription")}
              />
              <FieldDescription>Max 5,000 characters</FieldDescription>
              {errors.businessDescription && (
                <FieldError>{errors.businessDescription.message}</FieldError>
              )}
            </Field>
          </FieldGroup>
        </FormSection>

        <Separator />

        {/* ── 2. Funding Details ─────────────────────────────────────── */}
        <FormSection
          icon={CurrencyCircleDollarIcon}
          title="Funding Details"
          description="Specify how much capital you need to raise."
        >
          <FieldGroup>
            {/* Requested Amount */}
            <Field data-invalid={!!errors.requestedAmount || undefined}>
              <FieldLabel htmlFor="requestedAmount">
                Requested Amount (USDC)
              </FieldLabel>
              <Input
                id="requestedAmount"
                type="text"
                inputMode="decimal"
                placeholder="e.g. 10000.0000000"
                aria-invalid={!!errors.requestedAmount}
                {...register("requestedAmount")}
              />
              <FieldDescription>
                Enter the total funding goal as a decimal string (up to 7
                decimal places). This must equal the sum of all milestone
                amounts.
              </FieldDescription>
              {errors.requestedAmount && (
                <FieldError>{errors.requestedAmount.message}</FieldError>
              )}
            </Field>
          </FieldGroup>
        </FormSection>

        <Separator />

        {/* ── 3. Lock Period ─────────────────────────────────────────── */}
        <FormSection
          icon={ClockIcon}
          title="Capital Lock Period"
          description="Investors' capital will be locked for this duration before they can withdraw."
        >
          <FieldGroup>
            <Field data-invalid={!!errors.lockPeriodDays || undefined}>
              <FieldLabel htmlFor="lockPeriodDays">
                Lock Period (days)
              </FieldLabel>
              <Input
                id="lockPeriodDays"
                type="number"
                inputMode="numeric"
                min={1}
                max={3650}
                placeholder="e.g. 180"
                aria-invalid={!!errors.lockPeriodDays}
                {...register("lockPeriodDays", { valueAsNumber: true })}
              />
              <FieldDescription>
                Between 1 and 3,650 days (≈ 10 years). Recommended: 180 days (6
                months).
              </FieldDescription>
              {errors.lockPeriodDays && (
                <FieldError>{errors.lockPeriodDays.message}</FieldError>
              )}
            </Field>
          </FieldGroup>
        </FormSection>

        <Separator />

        {/* ── 4. Milestones ──────────────────────────────────────────── */}
        <FormSection
          icon={ListChecksIcon}
          title="Milestones"
          description="Define the staged release schedule. Funds are only released after each milestone is approved by investors through a vote."
        >
          <MilestonesField requestedAmount={requestedAmount} />
        </FormSection>

        <Separator />

        {/* ── 5. Media (Optional) ─────────────────────────────────────────── */}
        <FormSection
          icon={FileArrowUpIcon}
          title="Media & Documents"
          description="Upload gallery images and PDF documents to support your proposal."
        >
          <FieldGroup>
            {/* Images */}
            <Field data-invalid={!!errors.images || undefined}>
              <FieldLabel htmlFor="images">
                Gallery Images{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </FieldLabel>
              <Input
                id="images"
                type="file"
                accept="image/jpeg, image/png, image/webp"
                multiple
                aria-invalid={!!errors.images}
                onChange={(e) => {
                  if (e.target.files) {
                    setValue("images", Array.from(e.target.files), {
                      shouldValidate: true,
                    })
                  } else {
                    setValue("images", [], { shouldValidate: true })
                  }
                }}
              />
              <FieldDescription>
                Max 5 images (JPEG, PNG, WebP). Max 5MB per file.
              </FieldDescription>
              {errors.images && (
                <FieldError>{errors.images.message}</FieldError>
              )}
            </Field>

            {/* Documents */}
            <Field data-invalid={!!errors.documents || undefined}>
              <FieldLabel htmlFor="documents">
                Supporting Documents{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </FieldLabel>
              <Input
                id="documents"
                type="file"
                accept="application/pdf"
                multiple
                aria-invalid={!!errors.documents}
                onChange={(e) => {
                  if (e.target.files) {
                    setValue("documents", Array.from(e.target.files), {
                      shouldValidate: true,
                    })
                  } else {
                    setValue("documents", [], { shouldValidate: true })
                  }
                }}
              />
              <FieldDescription>
                Max 3 PDF documents. Max 5MB per file.
              </FieldDescription>
              {errors.documents && (
                <FieldError>{errors.documents.message}</FieldError>
              )}
            </Field>
          </FieldGroup>
        </FormSection>

        <Separator />

        {/* ── Actions ────────────────────────────────────────────────── */}
        {formError && (
          <div
            role="alert"
            aria-live="assertive"
            className="flex items-start gap-2 rounded-none border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
          >
            <WarningCircleIcon
              weight="fill"
              className="mt-0.5 size-4 shrink-0"
            />
            <span>{formError}</span>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            disabled={isBusy}
            onClick={() => router.back()}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto"
            disabled={isBusy}
            onClick={handleSubmit(onSaveDraft)}
          >
            {activeAction === "draft" ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <FloppyDiskIcon data-icon="inline-start" />
            )}
            Save as Draft
          </Button>

          <Button
            type="submit"
            form="create-proposal-form"
            className="w-full sm:w-auto"
            disabled={isBusy}
          >
            {activeAction === "submit" ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <PaperPlaneTiltIcon data-icon="inline-start" />
            )}
            Submit Proposal
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
