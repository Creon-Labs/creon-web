"use client"

import {
  BuildingsIcon,
  ClockIcon,
  CurrencyCircleDollarIcon,
  FileArrowUpIcon,
  FloppyDiskIcon,
  ListChecksIcon,
  PaperPlaneTiltIcon,
  PencilSimpleIcon,
  TrashIcon,
  WarningCircleIcon,
  XIcon,
} from "@phosphor-icons/react"
import { useEffect, useState } from "react"
import { Controller, FormProvider } from "react-hook-form"
import { toast } from "sonner"

import { ApiError } from "@/shared/lib/api-client"
import { useHookForm } from "@/shared/lib/hook-form"
import { cn } from "@/shared/utils/cn"
import { Button } from "@shadcn-ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@shadcn-ui/field"
import { Input } from "@shadcn-ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shadcn-ui/select"
import { Separator } from "@shadcn-ui/separator"
import { Skeleton } from "@shadcn-ui/skeleton"
import { Spinner } from "@shadcn-ui/spinner"
import { Textarea } from "@shadcn-ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shadcn-ui/card"

import { useGetProposalById } from "../../api/get-proposal-by-id"
import { useRemoveProposalMedia } from "../../api/remove-proposal-media"
import { useSubmitProposal } from "../../api/submit-proposal"
import { useUpdateProposal } from "../../api/update-proposal"
import { useUploadProposalMedia } from "../../api/upload-proposal-media"
import type { CreateProposalFormValues } from "../../schema/proposal-schema"
import {
  createProposalSchema,
  formatDecimalAmount,
} from "../../schema/proposal-schema"
import { ProposalStatusAlert } from "../proposal-status-alert"
import { MilestonesField } from "./milestones-field"

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
// EditProposalForm
// ---------------------------------------------------------------------------

export interface EditProposalFormProps {
  proposalId: string
}

function ProposalFundingStats({
  investorCount,
  raisedAmount,
}: {
  investorCount: number
  raisedAmount: string
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardDescription>Funds raised</CardDescription>
          <CardTitle>{formatDecimalAmount(raisedAmount)} USDC</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          Recorded from confirmed investments.
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Historical investors</CardDescription>
          <CardTitle>{investorCount}</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          Unique investors with a confirmed investment.
        </CardContent>
      </Card>
    </div>
  )
}

export function EditProposalForm({ proposalId }: EditProposalFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [activeAction, setActiveAction] = useState<"draft" | "submit" | null>(
    null
  )
  const [formError, setFormError] = useState<string | null>(null)

  const {
    data: proposal,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetProposalById({
    id: proposalId,
    config: {
      refetchInterval: (query) => {
        const status = query.state.data?.status
        return status === "SUBMITTED" || status === "UNDER_REVIEW"
          ? 10_000
          : false
      },
    },
  })

  const { mutateAsync: updateProposal } = useUpdateProposal()
  const { mutateAsync: submitProposal } = useSubmitProposal()
  const { mutateAsync: uploadProposalMedia } = useUploadProposalMedia()
  const { mutateAsync: removeProposalMedia } = useRemoveProposalMedia()

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
      existingImageCount: 0,
      existingDocumentCount: 0,
    },
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = form

  // Reset form when data is loaded
  useEffect(() => {
    if (proposal) {
      reset({
        businessName: proposal.businessName,
        businessDescription: proposal.businessDescription,
        category: proposal.category,
        location: proposal.location || "",
        requestedAmount: proposal.requestedAmount,
        lockPeriodDays: proposal.lockPeriodDays,
        milestones: proposal.milestones.map((m) => ({
          order: m.order,
          title: m.title,
          description: m.description,
          amount: m.amount,
        })),
        images: [],
        documents: [],
        existingImageCount:
          proposal.media?.filter((media) => media.kind === "IMAGE").length ?? 0,
        existingDocumentCount:
          proposal.media?.filter((media) => media.kind === "DOCUMENT").length ??
          0,
      })
    }
  }, [proposal, reset])

  const requestedAmount = watch("requestedAmount")
  const isBusy = activeAction !== null || isLoading

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <Skeleton className="h-50 w-full" />
        <Skeleton className="h-50 w-full" />
        <Skeleton className="h-50 w-full" />
      </div>
    )
  }

  if (error || !proposal) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
        <WarningCircleIcon className="mb-2 size-8 opacity-50" />
        <p>Failed to load proposal details.</p>
      </div>
    )
  }

  const isDraft = proposal.status === "DRAFT"

  async function handleMediaUpload(data: CreateProposalFormValues) {
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

  async function handleDeleteMedia(mediaId: string) {
    if (!confirm("Are you sure you want to delete this media?")) return

    try {
      await removeProposalMedia({ id: proposalId, mediaId })
      toast.success("Media deleted")
    } catch {
      toast.error("Failed to delete media")
    }
  }

  async function onSaveDraft(data: CreateProposalFormValues) {
    setFormError(null)
    setActiveAction("draft")
    try {
      await updateProposal({
        id: proposalId,
        businessName: data.businessName,
        businessDescription: data.businessDescription,
        category: data.category,
        location: data.location || undefined,
        requestedAmount: data.requestedAmount,
        lockPeriodDays: Number(data.lockPeriodDays),
        milestones: data.milestones,
      })

      await handleMediaUpload(data)

      toast.success("Changes saved!", {
        description: "Your proposal has been updated.",
      })
      setIsEditing(false)
      // Reset file inputs so they are clear after successful upload
      setValue("images", [])
      setValue("documents", [])
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Failed to update proposal. Please try again."
      setFormError(message)
    } finally {
      setActiveAction(null)
    }
  }

  async function onSubmit(data: CreateProposalFormValues) {
    setFormError(null)
    setActiveAction("submit")
    try {
      // Always save edits first if form is dirty or we are in edit mode
      if (isEditing) {
        await updateProposal({
          id: proposalId,
          businessName: data.businessName,
          businessDescription: data.businessDescription,
          category: data.category,
          location: data.location || undefined,
          requestedAmount: data.requestedAmount,
          lockPeriodDays: Number(data.lockPeriodDays),
          milestones: data.milestones,
        })
        await handleMediaUpload(data)
      }

      await submitProposal({ id: proposalId })
      toast.success("Proposal submitted!", {
        description:
          "Your proposal has been submitted and is now under review.",
      })
      setIsEditing(false)
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
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Proposal Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your proposal details and media.
          </p>
        </div>
        {isDraft && !isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <PencilSimpleIcon data-icon="inline-start" />
            Edit Proposal
          </Button>
        )}
      </div>

      <ProposalStatusAlert
        proposal={proposal}
        isRefreshing={isFetching}
        onRefresh={() => {
          void refetch()
        }}
      />

      <ProposalFundingStats
        investorCount={proposal.investorCount}
        raisedAmount={proposal.raisedAmount}
      />

      <FormProvider {...form}>
        <form
          id="edit-proposal-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-8"
        >
          <fieldset
            disabled={!isEditing || !isDraft}
            className="group flex flex-col gap-8"
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
                <Controller
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <Field data-invalid={!!errors.category || undefined}>
                      <FieldLabel htmlFor="category">
                        Business Category
                      </FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!isEditing}
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
                            {field.value &&
                              !(
                                BUSINESS_CATEGORIES as readonly string[]
                              ).includes(field.value) && (
                                <SelectItem
                                  key={field.value}
                                  value={field.value}
                                >
                                  {field.value}
                                </SelectItem>
                              )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {errors.category && (
                        <FieldError>{errors.category.message}</FieldError>
                      )}
                    </Field>
                  )}
                />

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
                  {errors.businessDescription && (
                    <FieldError>
                      {errors.businessDescription.message}
                    </FieldError>
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
                {/* Display existing media */}
                {proposal.media && proposal.media.length > 0 && (
                  <div className="mb-4 flex flex-col gap-2">
                    <span className="text-sm font-medium">Uploaded Media</span>
                    <ul className="flex flex-col gap-2">
                      {proposal.media.map((media) => (
                        <li
                          key={media.id}
                          className="flex items-center justify-between rounded-md border bg-muted/20 p-3"
                        >
                          <div className="flex flex-col">
                            <a
                              href={media.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm font-medium text-primary hover:underline"
                            >
                              {media.originalName || media.id}
                            </a>
                            <span className="text-xs text-muted-foreground">
                              {media.kind} •{" "}
                              {(media.sizeBytes / 1024).toFixed(1)} KB
                            </span>
                          </div>
                          {isEditing && isDraft && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-destructive"
                              onClick={() => handleDeleteMedia(media.id)}
                            >
                              <TrashIcon />
                            </Button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Upload new media (only when editing) */}
                {isEditing && (
                  <>
                    <Field data-invalid={!!errors.images || undefined}>
                      <FieldLabel htmlFor="images">
                        Add More Images{" "}
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
                              shouldDirty: true,
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

                    <Field data-invalid={!!errors.documents || undefined}>
                      <FieldLabel htmlFor="documents">
                        Add More Documents{" "}
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
                              shouldDirty: true,
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
                  </>
                )}
              </FieldGroup>
            </FormSection>
          </fieldset>

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
            {isEditing && isDraft && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  disabled={isBusy}
                  onClick={() => {
                    setIsEditing(false)
                    // Reset to last saved state
                    if (proposal) {
                      reset({
                        businessName: proposal.businessName,
                        businessDescription: proposal.businessDescription,
                        category: proposal.category,
                        location: proposal.location || "",
                        requestedAmount: proposal.requestedAmount,
                        lockPeriodDays: proposal.lockPeriodDays,
                        milestones: proposal.milestones.map((m) => ({
                          order: m.order,
                          title: m.title,
                          description: m.description,
                          amount: m.amount,
                        })),
                        images: [],
                        documents: [],
                        existingImageCount:
                          proposal.media?.filter(
                            (media) => media.kind === "IMAGE"
                          ).length ?? 0,
                        existingDocumentCount:
                          proposal.media?.filter(
                            (media) => media.kind === "DOCUMENT"
                          ).length ?? 0,
                      })
                    }
                  }}
                >
                  <XIcon data-icon="inline-start" />
                  Cancel
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  className="w-full sm:w-auto"
                  disabled={
                    isBusy ||
                    (!isDirty &&
                      watch("images")?.length === 0 &&
                      watch("documents")?.length === 0)
                  }
                  onClick={handleSubmit(onSaveDraft)}
                >
                  {activeAction === "draft" ? (
                    <Spinner data-icon="inline-start" />
                  ) : (
                    <FloppyDiskIcon data-icon="inline-start" />
                  )}
                  Save Changes
                </Button>
              </>
            )}

            {isDraft && (
              <Button
                type="submit"
                form="edit-proposal-form"
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
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
