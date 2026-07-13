"use client"

import { useRouter } from "next/navigation"
import {
  WarningCircleIcon,
  ClockIcon,
  XCircleIcon,
  ProhibitIcon,
  ArrowRightIcon,
} from "@phosphor-icons/react"

import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertAction,
} from "@shadcn-ui/alert"
import { Button } from "@shadcn-ui/button"

import { useGetMyKycStatus } from "../api/get-kyc-status"
import type { KycStatus } from "../types"
import { ApiError } from "@/shared/lib/api-client"
import { useStellarWallet } from "@/shared/lib/stellar-wallet"

// ---------------------------------------------------------------------------
// Config per status
// ---------------------------------------------------------------------------

type AlertConfig = {
  icon: React.ElementType
  title: string
  description: string
  variant: "default" | "destructive"
  iconClass: string
  wrapperClass: string
  ctaLabel?: string
  ctaHref?: string
}

const ALERT_CONFIG: Record<
  "NOT_SUBMITTED" | Exclude<KycStatus, "APPROVED">,
  AlertConfig
> = {
  NOT_SUBMITTED: {
    icon: WarningCircleIcon,
    title: "Identity Verification Required",
    description:
      "You haven't submitted your KYC verification yet. Complete your identity verification to create and manage campaigns.",
    variant: "default",
    iconClass: "text-warning",
    wrapperClass:
      "border-warning/30 bg-warning/5 text-warning-foreground [&_[data-slot=alert-title]]:text-warning [&_[data-slot=alert-description]]:text-warning/80",
    ctaLabel: "Start Verification",
    ctaHref: "/kyc",
  },
  PENDING: {
    icon: ClockIcon,
    title: "KYC Under Review",
    description:
      "Your KYC submission is currently being reviewed by our team. This process usually takes 1–2 business days.",
    variant: "default",
    iconClass: "text-info",
    wrapperClass:
      "border-info/30 bg-info/5 [&_[data-slot=alert-title]]:text-info [&_[data-slot=alert-description]]:text-info/80",
  },
  REJECTED: {
    icon: XCircleIcon,
    title: "KYC Rejected",
    description:
      "Your KYC submission was rejected. Please review the reason and resubmit with the correct documents.",
    variant: "destructive",
    iconClass: "text-destructive",
    wrapperClass: "",
    ctaLabel: "Resubmit",
    ctaHref: "/kyc",
  },
  REVOKED: {
    icon: ProhibitIcon,
    title: "KYC Revoked",
    description:
      "Your KYC status has been revoked by an administrator. Please contact support or submit a new verification request.",
    variant: "destructive",
    iconClass: "text-destructive",
    wrapperClass: "",
    ctaLabel: "Resubmit",
    ctaHref: "/kyc",
  },
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Automatically renders a contextual KYC alert when:
 * - the user has never submitted KYC (404 from API)
 * - KYC status is PENDING, REJECTED, or REVOKED
 *
 * Renders nothing when KYC is APPROVED or data is loading.
 */
export function KycStatusAlert() {
  const { connectedAddress } = useStellarWallet()

  const router = useRouter()
  const {
    data: kycProfile,
    isLoading,
    isError,
    error,
  } = useGetMyKycStatus({
    config: { enabled: !!connectedAddress, retry: false },
  })

  // Determine which config to show
  let configKey: keyof typeof ALERT_CONFIG | null = null

  if (isLoading) return null

  if (isError) {
    // 404 → user has never submitted KYC
    const isNotFound = error instanceof ApiError && error.status === 404
    if (isNotFound) {
      configKey = "NOT_SUBMITTED"
    } else {
      // Unknown error — don't block the UI
      return null
    }
  } else if (kycProfile) {
    if (
      kycProfile.status === "PENDING" ||
      kycProfile.status === "REJECTED" ||
      kycProfile.status === "REVOKED"
    ) {
      configKey = kycProfile.status
    }
  }

  if (!configKey) return null

  const {
    icon: Icon,
    title,
    description,
    variant,
    iconClass,
    wrapperClass,
    ctaLabel,
    ctaHref,
  } = ALERT_CONFIG[configKey]

  return (
    <Alert variant={variant} className={wrapperClass}>
      <Icon className={iconClass} />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {description}
        {/* Show rejection reason if available */}
        {configKey === "REJECTED" && kycProfile?.rejectionReason && (
          <p className="mt-1 font-medium">
            Reason: {kycProfile.rejectionReason}
          </p>
        )}
      </AlertDescription>
      {ctaLabel && ctaHref && (
        <AlertAction>
          <Button
            size="sm"
            variant={variant === "destructive" ? "destructive" : "outline"}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onClick={() => router.push(ctaHref as any)}
          >
            {ctaLabel}
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
        </AlertAction>
      )}
    </Alert>
  )
}
