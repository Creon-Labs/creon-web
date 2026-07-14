"use client"

import { useGetMyInvestments } from "@/modules/investment"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/components/shadcn-ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/shadcn-ui/table"
import { Badge } from "@/shared/components/shadcn-ui/badge"
import { Skeleton } from "@/shared/components/shadcn-ui/skeleton"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/components/shadcn-ui/empty"
import { Clock } from "@phosphor-icons/react/dist/ssr"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/shadcn-ui/alert"
import { formatUsd } from "@/shared/utils/format-usd"

export function InvestmentHistory() {
  const { data: investments, isLoading, isError, error } = useGetMyInvestments()

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load investment history: {error.message}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment History</CardTitle>
        <CardDescription>
          A list of your recent investments in various campaigns.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : !investments || investments.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Clock />
              </EmptyMedia>
              <EmptyTitle>No Investments</EmptyTitle>
              <EmptyDescription>
                You have not made any investments yet.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Campaign ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {investments.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell>
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {inv.campaignId}
                    </TableCell>
                    <TableCell>
                      {formatUsd(Number(inv.amount), { showSymbol: false })} <span className="text-muted-foreground text-xs">USDT</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          inv.status === "CONFIRMED"
                            ? "default"
                            : inv.status === "FAILED"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {inv.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
