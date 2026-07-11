"use client"

import { useFieldArray, useFormContext } from "react-hook-form"
import {
  PlusIcon,
  TrashIcon,
  DotsSixVerticalIcon,
  InfoIcon,
} from "@phosphor-icons/react"

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
import { Badge } from "@shadcn-ui/badge"
import { Separator } from "@shadcn-ui/separator"
import { Alert } from "@shadcn-ui/alert"

import type { CreateProposalFormValues } from "../../utils/proposal-schema"

// ---------------------------------------------------------------------------
// MilestoneAmountSummary
// Shows realtime sum vs requested amount and whether they balance
// ---------------------------------------------------------------------------

interface MilestoneAmountSummaryProps {
  requestedAmount: string
  milestones: CreateProposalFormValues["milestones"]
}

function MilestoneAmountSummary({
  requestedAmount,
  milestones,
}: MilestoneAmountSummaryProps) {
  const target = parseFloat(requestedAmount || "0")
  const total = milestones.reduce((sum, m) => {
    const v = parseFloat(m.amount || "0")
    return sum + (isNaN(v) ? 0 : v)
  }, 0)

  const isBalanced = !isNaN(target) && target > 0 && Math.abs(total - target) < 0.0000001
  const diff = total - target

  if (!target || isNaN(target)) return null

  return (
    <Alert
      data-slot="alert"
      className={cn(
        "flex items-start gap-2 rounded-none px-3 py-2 text-xs",
        isBalanced
          ? "border-success/30 bg-success/5 text-success"
          : "border-warning/30 bg-warning/5 text-warning"
      )}
    >
      <InfoIcon className="mt-0.5 shrink-0" />
      <span>
        {isBalanced ? (
          <>Milestone amounts sum correctly to {requestedAmount} USDC</>
        ) : (
          <>
            Milestone amounts sum to{" "}
            <strong>{total.toFixed(7)}</strong> USDC — must equal{" "}
            <strong>{requestedAmount}</strong> USDC (
            {diff > 0 ? "+" : ""}
            {diff.toFixed(7)} USDC remaining)
          </>
        )}
      </span>
    </Alert>
  )
}

// ---------------------------------------------------------------------------
// MilestonesField
// ---------------------------------------------------------------------------

interface MilestonesFieldProps {
  requestedAmount: string
}

export function MilestonesField({ requestedAmount }: MilestonesFieldProps) {
  const {
    register,
    control,
    formState: { errors },
    watch,
  } = useFormContext<CreateProposalFormValues>()

  const { fields, append, remove } = useFieldArray({
    control,
    name: "milestones",
  })

  const milestones = watch("milestones")

  function addMilestone() {
    append({
      order: fields.length + 1,
      title: "",
      description: "",
      amount: "",
    })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">Milestones</span>
          <span className="text-xs text-muted-foreground">
            Define staged fund releases. Amounts must sum exactly to the
            requested amount.
          </span>
        </div>
        <Badge variant="outline" size="md">
          {fields.length} {fields.length === 1 ? "milestone" : "milestones"}
        </Badge>
      </div>

      {/* Root-level milestones error (e.g. "at least one required") */}
      {errors.milestones?.root && (
        <FieldError>{errors.milestones.root.message}</FieldError>
      )}
      {errors.milestones?.message && (
        <FieldError>{errors.milestones.message}</FieldError>
      )}

      {/* Milestone cards */}
      <div className="flex flex-col gap-3">
        {fields.map((field, index) => {
          const milestoneErrors = errors.milestones?.[index]
          const hasError = !!milestoneErrors

          return (
            <div
              key={field.id}
              data-invalid={hasError || undefined}
              className={cn(
                "group/milestone relative flex flex-col gap-4 border bg-muted/20 p-4 transition-colors",
                hasError
                  ? "border-destructive/40 bg-destructive/5"
                  : "border-border hover:border-border/80"
              )}
            >
              {/* Milestone header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DotsSixVerticalIcon className="size-4 text-muted-foreground" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Milestone {index + 1}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 text-muted-foreground hover:text-destructive"
                  onClick={() => remove(index)}
                  disabled={fields.length === 1}
                  aria-label={`Remove milestone ${index + 1}`}
                >
                  <TrashIcon />
                </Button>
              </div>

              <Separator />

              {/* Hidden order field */}
              <input
                type="hidden"
                {...register(`milestones.${index}.order`, {
                  valueAsNumber: true,
                })}
                value={index + 1}
              />

              <FieldGroup>
                {/* Title */}
                <Field
                  data-invalid={!!milestoneErrors?.title || undefined}
                >
                  <FieldLabel htmlFor={`milestone-${index}-title`}>
                    Title
                  </FieldLabel>
                  <Input
                    id={`milestone-${index}-title`}
                    placeholder="e.g. Equipment Purchase"
                    aria-invalid={!!milestoneErrors?.title}
                    {...register(`milestones.${index}.title`)}
                  />
                  {milestoneErrors?.title && (
                    <FieldError>{milestoneErrors.title.message}</FieldError>
                  )}
                </Field>

                {/* Description */}
                <Field
                  data-invalid={!!milestoneErrors?.description || undefined}
                >
                  <FieldLabel htmlFor={`milestone-${index}-description`}>
                    Description
                  </FieldLabel>
                  <Textarea
                    id={`milestone-${index}-description`}
                    placeholder="Describe what funds will be used for in this milestone..."
                    rows={3}
                    aria-invalid={!!milestoneErrors?.description}
                    {...register(`milestones.${index}.description`)}
                  />
                  {milestoneErrors?.description && (
                    <FieldError>
                      {milestoneErrors.description.message}
                    </FieldError>
                  )}
                </Field>

                {/* Amount */}
                <Field
                  data-invalid={!!milestoneErrors?.amount || undefined}
                >
                  <FieldLabel htmlFor={`milestone-${index}-amount`}>
                    Amount (USDC)
                  </FieldLabel>
                  <Input
                    id={`milestone-${index}-amount`}
                    type="text"
                    inputMode="decimal"
                    placeholder="e.g. 5000.0000000"
                    aria-invalid={!!milestoneErrors?.amount}
                    {...register(`milestones.${index}.amount`)}
                  />
                  <FieldDescription>
                    Decimal string, up to 7 decimal places
                  </FieldDescription>
                  {milestoneErrors?.amount && (
                    <FieldError>{milestoneErrors.amount.message}</FieldError>
                  )}
                </Field>
              </FieldGroup>
            </div>
          )
        })}
      </div>

      {/* Add Milestone Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={addMilestone}
      >
        <PlusIcon data-icon="inline-start" />
        Add Milestone
      </Button>

      {/* Amount balance summary */}
      <MilestoneAmountSummary
        requestedAmount={requestedAmount}
        milestones={milestones}
      />
    </div>
  )
}
