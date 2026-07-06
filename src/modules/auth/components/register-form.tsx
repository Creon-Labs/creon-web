"use client"

import { useCallback } from "react"
import { Controller } from "react-hook-form"
import {
  BriefcaseIcon,
  ChartLineUpIcon,
  EnvelopeIcon,
  UserIcon,
  WalletIcon,
  CheckCircleIcon,
} from "@phosphor-icons/react"

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
import { Separator } from "@shadcn-ui/separator"
import { Badge } from "@shadcn-ui/badge"

import {
  registerSchema,
  type RegisterFormValues,
} from "../schemas/register.schema"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type WalletInfo = {
  address: string
  /** Masked address shown in UI, e.g. "GAHJJ…SOFA" */
  maskedAddress: string
}

export type RegisterFormProps = {
  /** Wallet info injected from the connect-wallet flow */
  wallet: WalletInfo
  /**
   * Called when the user submits the form.
   * Receives the form values — caller is responsible for merging
   * walletAddress + signature before sending to the API.
   */
  onSubmit: (values: RegisterFormValues) => void | Promise<void>
  /** Whether a submission is in flight */
  isPending?: boolean
}

// ---------------------------------------------------------------------------
// Role card sub-component (hoisted to avoid defining inside render)
// ---------------------------------------------------------------------------

type RoleCardProps = {
  value: "ENTREPRENEUR" | "INVESTOR"
  isSelected: boolean
  onSelect: () => void
  icon: React.ReactNode
  label: string
  description: string
}

function RoleCard({
  value,
  isSelected,
  onSelect,
  icon,
  label,
  description,
}: RoleCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      data-value={value}
      onClick={onSelect}
      className={cn(
        "relative flex flex-1 cursor-pointer flex-col gap-2 rounded-none border p-4 text-left transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        isSelected
          ? "border-primary bg-primary/5 text-foreground"
          : "border-input bg-transparent text-muted-foreground hover:border-foreground/30 hover:text-foreground"
      )}
    >
      {isSelected && (
        <CheckCircleIcon
          weight="fill"
          className="absolute top-3 right-3 size-4 text-primary"
          aria-hidden
        />
      )}
      <span className="flex items-center gap-2">
        <span
          className={cn(
            "flex size-8 items-center justify-center rounded-none border",
            isSelected
              ? "border-primary/30 bg-primary/10 text-primary"
              : "border-input bg-muted text-muted-foreground"
          )}
        >
          {icon}
        </span>
      </span>
      <span className="text-sm font-medium leading-tight text-foreground">
        {label}
      </span>
      <span className="text-xs leading-relaxed text-muted-foreground">
        {description}
      </span>
    </button>
  )
}

// ---------------------------------------------------------------------------
// Main form
// ---------------------------------------------------------------------------

export function RegisterForm({
  wallet,
  onSubmit,
  isPending = false,
}: RegisterFormProps) {
  const form = useHookForm({
    schema: registerSchema,
    defaultValues: {
      role: undefined,
      displayName: "",
      email: "",
    },
  })

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = form

  const selectedRole = watch("role")

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
        {/* ── Wallet address (read-only, injected from flow) ── */}
        <Field>
          <FieldLabel htmlFor="wallet-address">Wallet Address</FieldLabel>
          <div
            id="wallet-address"
            aria-label={`Wallet address: ${wallet.address}`}
            className="flex items-center gap-2 rounded-none border border-input bg-muted/40 px-3 py-2"
          >
            <WalletIcon
              weight="duotone"
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden
            />
            <span className="font-mono text-xs text-muted-foreground">
              {wallet.maskedAddress}
            </span>
            <Badge variant="secondary" className="ml-auto text-[10px] bg-green-100 dark:bg-green-600/20 text-green-700 dark:text-green-100">
              Connected
            </Badge>
          </div>
          <FieldDescription>
            Your signed Stellar wallet address.
          </FieldDescription>
        </Field>

        <Separator />

        {/* ── Role selection ── */}
        <Field
          data-invalid={!!errors.role}
          aria-required="true"
          id="role-group"
        >
          <FieldLabel htmlFor="role-group">
            Role{" "}
            <span className="text-destructive" aria-hidden>
              *
            </span>
          </FieldLabel>
          <FieldDescription>
            Choose your role on the Creon platform.
          </FieldDescription>

          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <div
                role="radiogroup"
                aria-labelledby="role-group"
                aria-required="true"
                aria-invalid={!!errors.role}
                className="flex gap-3"
              >
                <RoleCard
                  value="ENTREPRENEUR"
                  isSelected={field.value === "ENTREPRENEUR"}
                  onSelect={() => field.onChange("ENTREPRENEUR")}
                  icon={<BriefcaseIcon weight="duotone" className="size-4" />}
                  label="Entrepreneur"
                  description="Raise funds for your business through crowdfunding on Stellar."
                />
                <RoleCard
                  value="INVESTOR"
                  isSelected={field.value === "INVESTOR"}
                  onSelect={() => field.onChange("INVESTOR")}
                  icon={<ChartLineUpIcon weight="duotone" className="size-4" />}
                  label="Investor"
                  description="Invest your assets and support the growth of Indonesian SMEs."
                />
              </div>
            )}
          />

          {errors.role && (
            <FieldError errors={[errors.role]} aria-live="polite" />
          )}
        </Field>

        {/* ── Display name ── */}
        <Field data-invalid={!!errors.displayName}>
          <FieldLabel htmlFor="displayName">
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
              id="displayName"
              type="text"
              placeholder="Enter your full name"
              autoComplete="name"
              aria-invalid={!!errors.displayName}
              className="pl-8"
              {...register("displayName")}
            />
          </div>
          {errors.displayName ? (
            <FieldError errors={[errors.displayName]} aria-live="polite" />
          ) : (
            <FieldDescription>
              The name that will be displayed on your profile.
            </FieldDescription>
          )}
        </Field>

        {/* ── Email ── */}
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">
            Email{" "}
            {selectedRole === "ENTREPRENEUR" ? (
              <span className="text-destructive" aria-hidden>
                *
              </span>
            ) : (
              <span className="text-xs font-normal text-muted-foreground">
                (optional)
              </span>
            )}
          </FieldLabel>
          <div className="relative">
            <EnvelopeIcon
              weight="duotone"
              aria-hidden
              className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="email"
              type="email"
              placeholder="name@email.com"
              autoComplete="email"
              aria-invalid={!!errors.email}
              className="pl-8"
              {...register("email")}
            />
          </div>
          {errors.email ? (
            <FieldError errors={[errors.email]} aria-live="polite" />
          ) : selectedRole === "ENTREPRENEUR" ? (
            <FieldDescription>
              Email is required for Entrepreneur accounts.
            </FieldDescription>
          ) : (
            <FieldDescription>
              Optional for Investor accounts, but strongly recommended.
            </FieldDescription>
          )}
        </Field>

        {/* ── Submit ── */}
        <Button
          type="submit"
          className="w-full"
          disabled={isPending}
          aria-busy={isPending}
        >
          {isPending ? (
            <>
              <span
                className="mr-2 inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                aria-hidden
              />
              Registering...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </FieldGroup>
    </form>
  )
}
