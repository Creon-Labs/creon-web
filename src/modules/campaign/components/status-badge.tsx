import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/shared/utils/cn"
import { Badge } from "@shadcn-ui/badge"
import { CampaignStatus } from "../types"

// ─── Variants ─────────────────────────────────────────────────────────────────

const campaignStatusBadgeVariants = cva(
  // Base — override shadcn badge defaults to match our border-based visual style
  "inline-flex w-fit shrink-0 items-center justify-center gap-1.5 border font-medium whitespace-nowrap transition-colors",
  {
    variants: {
      /**
       * Maps each CampaignStatus to the appropriate semantic color palette.
       *
       * Pattern: border uses /30 opacity, bg uses /10 opacity, text uses
       * the -foreground token at full opacity — consistent with how other
       * consumers should use these semantic tokens.
       */
      status: {
        submitted:
          "border-subtle/40 bg-subtle/10 text-subtle-foreground dark:border-subtle/30 dark:bg-subtle/10 dark:text-subtle",
        under_review:
          "border-warning/50 bg-warning/10 text-warning-foreground dark:border-warning/40 dark:text-warning-foreground",
        live: "border-info/40 bg-info/10 text-info-foreground dark:border-info/30 dark:text-info-foreground",
        active:
          "border-success/40 bg-success/10 text-success-foreground dark:border-success/30 dark:text-success-foreground",
        rejected:
          "border-destructive/30 bg-destructive/10 text-destructive dark:border-destructive/30 dark:bg-destructive/10",
      },
      /** Controls the overall badge size. */
      size: {
        sm: "h-5 px-2 py-0.5 text-xs",
        md: "h-6 px-2.5 py-1 text-xs",
        lg: "h-7 px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
)

// ─── Dot Pulse (for "live" status) ────────────────────────────────────────────

const pulseDotVariants = cva(
  // Base dot — color inherited from parent text color via currentColor
  "shrink-0 rounded-full bg-current",
  {
    variants: {
      size: {
        sm: "size-1",
        md: "size-1.5",
        lg: "size-2",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
)

// ─── Labels ───────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<CampaignStatus, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  live: "Live",
  active: "Active",
  rejected: "Rejected",
}

// ─── Component ────────────────────────────────────────────────────────────────

export interface CampaignStatusBadgeProps
  extends VariantProps<typeof campaignStatusBadgeVariants> {
  status: CampaignStatus
  className?: string
}

export function CampaignStatusBadge({
  status,
  size = "md",
  className,
}: CampaignStatusBadgeProps) {
  return (
    <Badge
      asChild={false}
      // We intentionally bypass the badgeVariants to use our own full styling.
      // `variant` is omitted so shadcn applies no conflicting color classes.
      variant="outline"
      className={cn(
        campaignStatusBadgeVariants({ status, size }),
        className,
      )}
    >
      {/* Animated pulse dot — only for the "live" status */}
      {status === "live" && (
        <span className="relative flex items-center justify-center">
          {/* Ripple ring */}
          <span
            className={cn(
              "absolute animate-ping rounded-full bg-current opacity-60",
              pulseDotVariants({ size }),
            )}
          />
          {/* Solid core */}
          <span className={pulseDotVariants({ size })} />
        </span>
      )}

      {STATUS_LABELS[status]}
    </Badge>
  )
}
