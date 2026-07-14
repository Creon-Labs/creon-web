import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/shared/utils/cn"
import { Badge } from "@shadcn-ui/badge"
import type { MilestoneStatus } from "../types"

const milestoneStatusBadgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1.5 border font-medium whitespace-nowrap transition-colors",
  {
    variants: {
      status: {
        DRAFT:
          "border-subtle/40 bg-subtle/10 text-subtle-foreground dark:border-subtle/30 dark:text-subtle",
        PENDING:
          "border-subtle/40 bg-subtle/10 text-subtle-foreground dark:border-subtle/30 dark:text-subtle",
        VOTING:
          "border-info/40 bg-info/10 text-info-foreground dark:border-info/30 dark:text-info-foreground",
        APPROVED:
          "border-success/40 bg-success/10 text-success-foreground dark:border-success/30 dark:text-success-foreground",
        RELEASING:
          "border-warning/50 bg-warning/10 text-warning-foreground dark:border-warning/40 dark:text-warning-foreground",
        RELEASED:
          "border-success/40 bg-success/10 text-success-foreground dark:border-success/30 dark:text-success-foreground",
        REJECTED:
          "border-destructive/30 bg-destructive/10 text-destructive dark:border-destructive/30 dark:bg-destructive/10",
        FAILED:
          "border-destructive/30 bg-destructive/10 text-destructive dark:border-destructive/30 dark:bg-destructive/10",
      },
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

const STATUS_LABELS: Record<MilestoneStatus, string> = {
  DRAFT: "Draft",
  PENDING: "Pending",
  VOTING: "Voting Open",
  APPROVED: "Approved",
  RELEASING: "Releasing",
  RELEASED: "Released",
  REJECTED: "Rejected",
  FAILED: "Failed",
}

export interface MilestoneStatusBadgeProps
  extends VariantProps<typeof milestoneStatusBadgeVariants> {
  status: MilestoneStatus
  className?: string
}

export function MilestoneStatusBadge({
  status,
  size = "md",
  className,
}: MilestoneStatusBadgeProps) {
  return (
    <Badge
      asChild={false}
      variant="outline"
      className={cn(milestoneStatusBadgeVariants({ status, size }), className)}
    >
      {STATUS_LABELS[status]}
    </Badge>
  )
}
