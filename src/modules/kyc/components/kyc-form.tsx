"use client"

import { useCallback } from "react"
import { Controller } from "react-hook-form"
import {
  IdentificationCardIcon,
  UserIcon,
  CalendarIcon,
  SpinnerGapIcon,
  WarningCircleIcon,
  CheckCircleIcon,
} from "@phosphor-icons/react"

import { useHookForm } from "@/shared/lib/hook-form"
import { Button } from "@shadcn-ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@shadcn-ui/field"
import { Input } from "@shadcn-ui/input"
import { Separator } from "@shadcn-ui/separator"

import { kycSchema, type KycFormValues } from "../schemas/kyc.schema"
import { useSubmitKyc } from "../api/submit-kyc"
import { getKycSubmissionErrorMessage } from "../utils/kyc-action"
import { PhotoField } from "./webcam-capture"
import { toast } from "sonner"

// ---------------------------------------------------------------------------
// Prop types
// ---------------------------------------------------------------------------

export type KycFormProps = {
  /**
   * Optional callback invoked after a successful submission.
   * Use this to redirect the user or show a success screen at the page level.
   */
  onSuccess?: () => void
}

// ---------------------------------------------------------------------------
// Sub-components (hoisted to avoid inline component definition anti-pattern,
// per Vercel rule: rerender-no-inline-components)
// ---------------------------------------------------------------------------

function SubmitSpinner() {
  return (
    <SpinnerGapIcon
      className="mr-2 inline-block size-4 animate-spin"
      aria-hidden
    />
  )
}

type StatusBannerProps = { status: "error" | "success"; message: string }

function StatusBanner({ status, message }: StatusBannerProps) {
  const isError = status === "error"
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`flex items-start gap-2 rounded-none border px-3 py-2.5 text-sm ${
        isError
          ? "border-destructive/30 bg-destructive/10 text-destructive"
          : "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400"
      }`}
    >
      {isError ? (
        <WarningCircleIcon weight="fill" className="mt-0.5 size-4 shrink-0" />
      ) : (
        <CheckCircleIcon weight="fill" className="mt-0.5 size-4 shrink-0" />
      )}
      <span>{message}</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// KycForm
// ---------------------------------------------------------------------------

export function KycForm({ onSuccess }: KycFormProps) {
  const {
    mutate: submitKyc,
    isPending,
    isSuccess,
    error,
    reset: resetMutation,
  } = useSubmitKyc()

  const form = useHookForm({
    schema: kycSchema,
    defaultValues: {
      fullName: "",
      nationalId: "",
      dateOfBirth: "",
      idCard: null,
      selfie: null,
    },
  })

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form

  // Derive a human-readable error message from the thrown ApiError or generic
  // Error. Per Vercel rule: rerender-derived-state-no-effect — derive during
  // render, not via a separate effect + state.
  const errorMessage =
    error !== null ? getKycSubmissionErrorMessage(error) : null

  // Put interaction logic in the event handler (Vercel: rerender-move-effect-to-event)
  const handleFormSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      // Reset any previous mutation result so the banner disappears on retry.
      resetMutation()

      await handleSubmit((values: KycFormValues) => {
        // At this point Zod has already validated that idCard/selfie are
        // non-null strings (the schema uses .refine). The non-null assertion
        // is safe; we guard anyway for clarity.
        if (!values.idCard || !values.selfie) return

        submitKyc(
          {
            fullName: values.fullName,
            nationalId: values.nationalId,
            dateOfBirth: values.dateOfBirth || undefined,
            idCard: values.idCard,
            selfie: values.selfie,
          },
          {
            onSuccess: () => {
              onSuccess?.()
            },
            onError: (submissionError) => {
              toast.error("Failed to submit KYC data", {
                description: getKycSubmissionErrorMessage(submissionError),
              })
            },
          }
        )
      })(e)
    },
    [resetMutation, handleSubmit, submitKyc, onSuccess]
  )

  return (
    <form onSubmit={handleFormSubmit} noValidate>
      <FieldGroup>
        {/* ── Status banners ── */}
        {isSuccess ? (
          <StatusBanner
            status="success"
            message="Your KYC data has been submitted successfully. We'll review it shortly."
          />
        ) : errorMessage !== null ? (
          <StatusBanner status="error" message={errorMessage} />
        ) : null}

        {/* ── Full Name ── */}
        <Field data-invalid={!!errors.fullName}>
          <FieldLabel htmlFor="fullName">
            Full Name{" "}
            <span className="text-destructive" aria-hidden>
              *
            </span>
          </FieldLabel>
          <div className="relative">
            <UserIcon
              weight="duotone"
              aria-hidden
              className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name as shown on ID"
              autoComplete="name"
              aria-invalid={!!errors.fullName}
              disabled={isPending || isSuccess}
              className="pl-8"
              {...register("fullName")}
            />
          </div>
          {errors.fullName ? (
            <FieldError errors={[errors.fullName]} aria-live="polite" />
          ) : (
            <FieldDescription>
              Must exactly match your National ID (KTP).
            </FieldDescription>
          )}
        </Field>

        {/* ── National ID ── */}
        <Field data-invalid={!!errors.nationalId}>
          <FieldLabel htmlFor="nationalId">
            National ID (NIK){" "}
            <span className="text-destructive" aria-hidden>
              *
            </span>
          </FieldLabel>
          <div className="relative">
            <IdentificationCardIcon
              weight="duotone"
              aria-hidden
              className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="nationalId"
              type="text"
              placeholder="16-digit NIK"
              maxLength={16}
              aria-invalid={!!errors.nationalId}
              disabled={isPending || isSuccess}
              className="pl-8"
              {...register("nationalId")}
            />
          </div>
          {errors.nationalId ? (
            <FieldError errors={[errors.nationalId]} aria-live="polite" />
          ) : (
            <FieldDescription>
              Your 16-digit Indonesian National ID Number.
            </FieldDescription>
          )}
        </Field>

        {/* ── Date of Birth ── */}
        <Field data-invalid={!!errors.dateOfBirth}>
          <FieldLabel htmlFor="dateOfBirth">
            Date of Birth{" "}
            <span className="text-xs font-normal text-muted-foreground">
              (optional)
            </span>
          </FieldLabel>
          <div className="relative">
            <CalendarIcon
              weight="duotone"
              aria-hidden
              className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="dateOfBirth"
              type="date"
              aria-invalid={!!errors.dateOfBirth}
              disabled={isPending || isSuccess}
              className="pl-8"
              {...register("dateOfBirth")}
            />
          </div>
          {errors.dateOfBirth ? (
            <FieldError errors={[errors.dateOfBirth]} aria-live="polite" />
          ) : (
            <FieldDescription>
              Your date of birth as written on the ID.
            </FieldDescription>
          )}
        </Field>

        <Separator />

        {/* ── ID Card Photo ── */}
        <Field data-invalid={!!errors.idCard}>
          <FieldLabel htmlFor="idCardCapture">
            ID Card Photo (KTP){" "}
            <span className="text-destructive" aria-hidden>
              *
            </span>
          </FieldLabel>

          <Controller
            name="idCard"
            control={control}
            render={({ field }) => (
              <PhotoField
                id="idCardCapture"
                triggerLabel="Take ID Card Photo"
                dialogTitle="Capture ID Card"
                capturedImage={field.value}
                onCapture={field.onChange}
                onRetake={() => field.onChange(null)}
              />
            )}
          />

          {errors.idCard ? (
            <FieldError errors={[errors.idCard]} aria-live="polite" />
          ) : (
            <FieldDescription>
              Take a clear picture of your ID card. Ensure text is readable and
              there is no glare.
            </FieldDescription>
          )}
        </Field>

        <Separator />

        {/* ── Selfie Photo ── */}
        <Field data-invalid={!!errors.selfie}>
          <FieldLabel htmlFor="selfieCapture">
            Selfie Photo{" "}
            <span className="text-destructive" aria-hidden>
              *
            </span>
          </FieldLabel>

          <Controller
            name="selfie"
            control={control}
            render={({ field }) => (
              <PhotoField
                id="selfieCapture"
                triggerLabel="Take Selfie Photo"
                dialogTitle="Take Selfie"
                capturedImage={field.value}
                onCapture={field.onChange}
                onRetake={() => field.onChange(null)}
              />
            )}
          />

          {errors.selfie ? (
            <FieldError errors={[errors.selfie]} aria-live="polite" />
          ) : (
            <FieldDescription>
              Take a clear selfie showing your full face in good lighting.
            </FieldDescription>
          )}
        </Field>

        {/* ── Submit ── */}
        <Button
          type="submit"
          className="mt-4 w-full"
          disabled={isPending || isSuccess}
          aria-busy={isPending}
        >
          {isPending ? (
            <>
              <SubmitSpinner />
              Submitting…
            </>
          ) : isSuccess ? (
            <>
              <CheckCircleIcon
                weight="fill"
                className="mr-2 inline-block size-4"
                aria-hidden
              />
              Submitted
            </>
          ) : (
            "Submit KYC Data"
          )}
        </Button>
      </FieldGroup>
    </form>
  )
}
