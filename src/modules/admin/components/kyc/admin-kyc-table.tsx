"use client"

import * as React from "react"
import { format } from "date-fns"
import { DotsThree, Eye, Check, X, Prohibit, Copy } from "@phosphor-icons/react"
import { toast } from "sonner"

import { AdminKycItem } from "@/modules/admin"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/shadcn-ui/table"
import { Badge } from "@/shared/components/shadcn-ui/badge"
import { Button } from "@/shared/components/shadcn-ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/shadcn-ui/dropdown-menu"

type AdminKycTableProps = {
  data: AdminKycItem[]
  onApprove: (item: AdminKycItem) => void
  onReject: (item: AdminKycItem) => void
  onRevoke: (item: AdminKycItem) => void
  onViewDocs: (item: AdminKycItem) => void
}

export function AdminKycTable({
  data,
  onApprove,
  onReject,
  onRevoke,
  onViewDocs,
}: AdminKycTableProps) {
  if (data.length === 0) {
    return (
      <div className="border border-dashed p-8 text-center text-sm text-muted-foreground">
        No KYC submissions at this time.
      </div>
    )
  }

  return (
    <div className="border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User Name</TableHead>
            <TableHead>Wallet</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>NIK</TableHead>
            <TableHead>Submitted At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.userId}>
              <TableCell className="font-medium">
                <div>{item.fullName}</div>
                <div className="text-xs text-muted-foreground">{item.email}</div>
              </TableCell>
              <TableCell className="font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span>{item.walletAddress.slice(0, 6)}...{item.walletAddress.slice(-4)}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 hover:bg-muted"
                    onClick={() => {
                      navigator.clipboard.writeText(item.walletAddress)
                      toast.success("Wallet address copied")
                    }}
                    title="Copy Wallet Address"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-1 flex-wrap">
                  {item.roles.map((r) => (
                    <Badge key={r} variant="secondary" className="text-[10px] px-1.5 py-0 font-normal">
                      {r}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>{item.nationalId}</TableCell>
              <TableCell>
                {item.submittedAt ? format(new Date(item.submittedAt), "dd MMM yyyy, HH:mm") : "-"}
              </TableCell>
              <TableCell>
                <KycStatusBadge status={item.status} />
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
                    <DropdownMenuItem onClick={() => onViewDocs(item)}>
                      <Eye className="mr-2 size-4" />
                      View Documents
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    
                    {item.status === "PENDING" && (
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

                    {item.status === "APPROVED" && (
                      <DropdownMenuItem onClick={() => onRevoke(item)}>
                        <Prohibit className="mr-2 size-4 text-red-600" />
                        Revoke
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

function KycStatusBadge({ status }: { status: AdminKycItem["status"] }) {
  switch (status) {
    case "PENDING":
      return <Badge variant="outline" className="text-amber-600 border-amber-600/30 bg-amber-50 dark:bg-amber-950/20">Pending</Badge>
    case "APPROVED":
      return <Badge variant="outline" className="text-emerald-600 border-emerald-600/30 bg-emerald-50 dark:bg-emerald-950/20">Approved</Badge>
    case "REJECTED":
      return <Badge variant="outline" className="text-red-600 border-red-600/30 bg-red-50 dark:bg-red-950/20">Rejected</Badge>
    case "REVOKED":
      return <Badge variant="destructive">Revoked</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}
