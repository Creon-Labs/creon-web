"use client"

import { FormProvider } from "react-hook-form"
import { useRouter } from "next/navigation"
import {
  BuildingsIcon,
  CurrencyCircleDollarIcon,
  ClockIcon,
  ListChecksIcon,
  FloppyDiskIcon,
  PaperPlaneTiltIcon,
} from "@phosphor-icons/react"

import { useHookForm } from "@/shared/lib/hook-form"
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

import { createProposalSchema } from "../../utils/proposal-schema"
import type { CreateProposalFormValues } from "../../utils/proposal-schema"
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
// CreateProposalForm
// ---------------------------------------------------------------------------

export function CreateProposalForm() {
  const router = useRouter()

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
    },
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form

  const requestedAmount = watch("requestedAmount")

  function onSaveDraft(data: CreateProposalFormValues) {
    // TODO: call createProposal API (saves as DRAFT)
    console.log("[Draft]", data)
  }

  function onSubmit(data: CreateProposalFormValues) {
    // TODO: call createProposal API then submitProposal API
    console.log("[Submit]", data)
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
                Between 1 and 3,650 days (≈ 10 years). Recommended: 180 days
                (6 months).
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

        {/* ── Actions ────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            disabled={isSubmitting}
            onClick={() => router.back()}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-auto"
            disabled={isSubmitting}
            onClick={handleSubmit(onSaveDraft)}
          >
            {isSubmitting ? (
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
            disabled={isSubmitting}
          >
            {isSubmitting ? (
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
