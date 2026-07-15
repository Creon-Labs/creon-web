export const DOMAIN_STATUS_POLLING_INTERVAL = 10_000

type DomainStatusDefinition = {
  terminal: readonly string[]
  polling: readonly string[]
  labels: Record<string, string>
  descriptions: Record<string, string>
  badgeClassName: Record<string, string>
}

const neutralBadge = "border-subtle/40 bg-subtle/10 text-subtle-foreground"
const infoBadge = "border-info/40 bg-info/10 text-info-foreground"
const successBadge = "border-success/40 bg-success/10 text-success-foreground"
const warningBadge = "border-warning/50 bg-warning/10 text-warning-foreground"
const destructiveBadge =
  "border-destructive/30 bg-destructive/10 text-destructive"

const DOMAIN_STATUSES = {
  campaignDeployment: {
    terminal: ["LIVE", "FAILED"],
    polling: ["PENDING", "DEPLOYING_TOKEN", "DEPLOYING_CAMPAIGN", "WIRING"],
    labels: {
      PENDING: "Queued",
      DEPLOYING_TOKEN: "Deploying token",
      DEPLOYING_CAMPAIGN: "Deploying campaign",
      WIRING: "Activating campaign",
      LIVE: "Live",
      FAILED: "Deployment failed",
    },
    descriptions: {
      PENDING: "Waiting for the deployment worker.",
      DEPLOYING_TOKEN: "Creating the restricted project share token.",
      DEPLOYING_CAMPAIGN: "Creating the Stellar campaign contract.",
      WIRING: "Connecting the token and campaign contracts.",
      LIVE: "The campaign contracts are ready.",
      FAILED: "The deployment could not complete and will need attention.",
    },
    badgeClassName: {
      PENDING: warningBadge,
      DEPLOYING_TOKEN: infoBadge,
      DEPLOYING_CAMPAIGN: infoBadge,
      WIRING: infoBadge,
      LIVE: successBadge,
      FAILED: destructiveBadge,
    },
  },
  distribution: {
    terminal: ["COMPLETED", "FAILED"],
    polling: ["PENDING"],
    labels: {
      PENDING: "Processing distribution",
      COMPLETED: "Distribution ready",
      FAILED: "Distribution failed",
    },
    descriptions: {
      PENDING:
        "The shareholder snapshot and claim records are being prepared. Dividends cannot be claimed yet.",
      COMPLETED:
        "The shareholder snapshot is complete and investors can claim their dividends.",
      FAILED:
        "The on-chain snapshot could not be completed yet. Please contact the platform team if this status persists.",
    },
    badgeClassName: {
      PENDING: warningBadge,
      COMPLETED: successBadge,
      FAILED: destructiveBadge,
    },
  },
  milestone: {
    terminal: ["RELEASED", "REJECTED", "FAILED"],
    polling: ["VOTING", "APPROVED", "RELEASING"],
    labels: {
      DRAFT: "Draft",
      PENDING: "Pending",
      VOTING: "Voting open",
      APPROVED: "Approved",
      RELEASING: "Releasing",
      RELEASED: "Released",
      REJECTED: "Rejected",
      FAILED: "Failed",
    },
    descriptions: {
      DRAFT: "The milestone is not live yet.",
      PENDING: "Waiting for the entrepreneur to submit progress proof.",
      VOTING: "Investor voting is open.",
      APPROVED: "Voting passed and on-chain release is being queued.",
      RELEASING:
        "The principal release transaction is being confirmed on-chain.",
      RELEASED: "The milestone principal has been released.",
      REJECTED: "This milestone did not pass investor voting.",
      FAILED: "The on-chain release could not be completed.",
    },
    badgeClassName: {
      DRAFT: neutralBadge,
      PENDING: neutralBadge,
      VOTING: infoBadge,
      APPROVED: successBadge,
      RELEASING: warningBadge,
      RELEASED: successBadge,
      REJECTED: destructiveBadge,
      FAILED: destructiveBadge,
    },
  },
  refund: {
    terminal: ["COMPLETED", "FAILED"],
    polling: ["PENDING"],
    labels: {
      PENDING: "Refund sedang diproses",
      COMPLETED: "Refund ready",
      FAILED: "Refund processing failed",
    },
    descriptions: {
      PENDING:
        "The on-chain cancellation and refund snapshot are being prepared. Claims are not available yet.",
      COMPLETED: "Eligible investors can claim their pro-rata USDC refund.",
      FAILED:
        "The refund setup did not complete. Contact support for the next update.",
    },
    badgeClassName: {
      PENDING: warningBadge,
      COMPLETED: successBadge,
      FAILED: destructiveBadge,
    },
  },
  kyc: {
    terminal: ["APPROVED", "REJECTED", "REVOKED"],
    polling: ["PENDING"],
    labels: {
      PENDING: "Pending review",
      APPROVED: "Approved",
      REJECTED: "Rejected",
      REVOKED: "Revoked",
    },
    descriptions: {
      PENDING: "Your identity verification is waiting for admin review.",
      APPROVED: "Your identity verification is approved.",
      REJECTED:
        "Your identity verification was rejected. Review the feedback and resubmit.",
      REVOKED:
        "Your identity verification has been revoked and must be resubmitted.",
    },
    badgeClassName: {
      PENDING: warningBadge,
      APPROVED: successBadge,
      REJECTED: destructiveBadge,
      REVOKED: destructiveBadge,
    },
  },
} satisfies Record<string, DomainStatusDefinition>

export type DomainStatusKind = keyof typeof DOMAIN_STATUSES

export function isDomainStatusTerminal(
  domain: DomainStatusKind,
  status: string | undefined
): boolean {
  return (
    status !== undefined && DOMAIN_STATUSES[domain].terminal.includes(status)
  )
}

export function getDomainStatusPollingInterval(
  domain: DomainStatusKind,
  status: string | undefined,
  interval = DOMAIN_STATUS_POLLING_INTERVAL
): number | false {
  return status && DOMAIN_STATUSES[domain].polling.includes(status)
    ? interval
    : false
}

export function getDomainStatusCopy(
  domain: DomainStatusKind,
  status: string
): { label: string; description: string; badgeClassName: string } {
  const definition: DomainStatusDefinition = DOMAIN_STATUSES[domain]
  const fallback = status.replaceAll("_", " ")

  return {
    label: definition.labels[status] ?? fallback,
    description: definition.descriptions[status] ?? fallback,
    badgeClassName: definition.badgeClassName[status] ?? neutralBadge,
  }
}
