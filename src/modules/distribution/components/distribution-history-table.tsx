import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shadcn-ui/table"
import { Badge } from "@shadcn-ui/badge"
import { Empty, EmptyTitle, EmptyDescription } from "@shadcn-ui/empty"
import { ProfitDistribution, DistributionStatus } from "../types"

interface DistributionHistoryTableProps {
  distributions: ProfitDistribution[]
}

const getStatusBadgeVariant = (
  status: DistributionStatus
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "COMPLETED":
      return "default"
    case "PENDING":
      return "secondary"
    case "FAILED":
      return "destructive"
    default:
      return "outline"
  }
}

export function DistributionHistoryTable({
  distributions,
}: DistributionHistoryTableProps) {
  if (distributions.length === 0) {
    return (
      <Empty className="min-h-[300px] border">
        <EmptyTitle>No Distributions Yet</EmptyTitle>
        <EmptyDescription>
          There are no profit distributions recorded for this campaign.
        </EmptyDescription>
      </Empty>
    )
  }

  return (
    <div className="border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Reward Per Share</TableHead>
            <TableHead>Claimed Progress</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {distributions.map((dist) => {
            const date = new Date(dist.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })

            // Calculate claimed percentage safely
            const totalAmount = parseFloat(dist.totalAmount)
            const totalClaimed = parseFloat(dist.totalClaimed)
            const claimedPercentage =
              totalAmount > 0 ? (totalClaimed / totalAmount) * 100 : 0

            return (
              <TableRow key={dist.id}>
                <TableCell className="font-medium">{date}</TableCell>
                <TableCell>
                  $
                  {totalAmount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  USDC
                </TableCell>
                <TableCell>
                  {dist.rewardPerShare
                    ? `$${parseFloat(dist.rewardPerShare).toLocaleString(
                        "en-US",
                        {
                          minimumFractionDigits: 4,
                          maximumFractionDigits: 6,
                        }
                      )}`
                    : "-"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      {claimedPercentage.toFixed(1)}%
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ($
                      {totalClaimed.toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                      })}
                      )
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant={getStatusBadgeVariant(dist.status)}>
                    {dist.status}
                  </Badge>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
