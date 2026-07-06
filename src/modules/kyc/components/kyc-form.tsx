"use client"

import { useCallback } from "react"
import { Controller } from "react-hook-form"
import { IdentificationCardIcon, UserIcon, CalendarIcon } from "@phosphor-icons/react"

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
import { WebcamCapture } from "./webcam-capture"

export type KycFormProps = {
  onSubmit: (values: KycFormValues) => void | Promise<void>
  isPending?: boolean
}

export function KycForm({ onSubmit, isPending = false }: KycFormProps) {
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

  const handleFormSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      await handleSubmit(async (values) => {
        await onSubmit(values)
      })(e)
    },
    [handleSubmit, onSubmit]
  )

  return (
    <form onSubmit={handleFormSubmit} noValidate>
      <FieldGroup>
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
              <WebcamCapture
                id="idCardCapture"
                label="Capture ID Card"
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
              Take a clear picture of your ID card. Ensure text is readable and there is no glare.
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
              <WebcamCapture
                id="selfieCapture"
                label="Take Selfie"
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
          className="w-full mt-4"
          disabled={isPending}
          aria-busy={isPending}
        >
          {isPending ? (
            <>
              <span
                className="mr-2 inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                aria-hidden
              />
              Submitting...
            </>
          ) : (
            "Submit KYC Data"
          )}
        </Button>
      </FieldGroup>
    </form>
  )
}
