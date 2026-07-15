"use client"

import * as React from "react"
import { format } from "date-fns"
import { DotsThree, Check, X, WarningCircle } from "@phosphor-icons/react"

import { AdminProposalItem } from "@/modules/admin"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/shadcn-ui/table"
import { Badge } from "@/shared/components/shadcn-ui/badge"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@shadcn-ui/empty"
import { Button } from "@/shared/components/shadcn-ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/shadcn-ui/dropdown-menu"

type AdminCampaignsTableProps = {
  data: AdminProposalItem[]
  onApprove: (item: AdminProposalItem) => void
  onReject: (item: AdminProposalItem) => void
  onCancel: (item: AdminProposalItem) => void
}

export function AdminCampaignsTable({
  data,
  onApprove,
  onReject,
  onCancel,
}: AdminCampaignsTableProps) {
  if (data.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyTitle>No campaign proposals</EmptyTitle>
          <EmptyDescription>
            There are no proposals for this status right now.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Business Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Required Funding (USDC)</TableHead>
            <TableHead>Lock Period</TableHead>
            <TableHead>Submitted At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                <div>{item.businessName}</div>
                <div className="font-mono text-xs text-muted-foreground">
                  {item.entrepreneur.walletAddress.slice(0, 6)}...
                  {item.entrepreneur.walletAddress.slice(-4)}
                </div>
              </TableCell>
              <TableCell>
                {item.category}
                {item.location && (
                  <div className="text-xs text-muted-foreground">
                    {item.location}
                  </div>
                )}
              </TableCell>
              <TableCell>{item.requestedAmount}</TableCell>
              <TableCell>{item.lockPeriodDays} Days</TableCell>
              <TableCell>
                {item.submittedAt
                  ? format(new Date(item.submittedAt), "dd MMM yyyy")
                  : "-"}
              </TableCell>
              <TableCell>
                <ProposalStatusBadge status={item.status} />
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <DotsThree className="size-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>

                    {(item.status === "SUBMITTED" ||
                      item.status === "UNDER_REVIEW") && (
                      <>
                        <DropdownMenuItem onClick={() => onApprove(item)}>
                          <Check className="mr-2 size-4 text-emerald-600" />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onReject(item)}>
                          <X className="mr-2 size-4 text-red-600" />
                          Reject
                        </DropdownMenuItem>
                      </>
                    )}

                    {item.status === "APPROVED" && item.campaignId && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onCancel(item)}>
                          <WarningCircle className="mr-2 size-4 text-destructive" />
                          <span className="font-medium text-destructive">
                            Cancel (Refund)
                          </span>
                        </DropdownMenuItem>
                      </>
                    )}
                    {item.status === "APPROVED" && !item.campaignId && (
                      <DropdownMenuItem disabled>
                        Campaign ID unavailable
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function ProposalStatusBadge({
  status,
}: {
  status: AdminProposalItem["status"]
}) {
  switch (status) {
    case "DRAFT":
      return <Badge variant="secondary">Draft</Badge>
    case "SUBMITTED":
      return (
        <Badge
          variant="outline"
          className="border-blue-600/30 bg-blue-50 text-blue-600 dark:bg-blue-950/20"
        >
          Submitted
        </Badge>
      )
    case "UNDER_REVIEW":
      return (
        <Badge
          variant="outline"
          className="border-amber-600/30 bg-amber-50 text-amber-600 dark:bg-amber-950/20"
        >
          Under Review
        </Badge>
      )
    case "APPROVED":
      return (
        <Badge
          variant="outline"
          className="border-emerald-600/30 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20"
        >
          Approved (Live)
        </Badge>
      )
    case "REJECTED":
      return <Badge variant="destructive">Rejected</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}
