"use client"

import { useGetMyDistributionClaims } from "@/modules/distribution"
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
import { ChartLineUp } from "@phosphor-icons/react/dist/ssr"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/shadcn-ui/alert"
import { formatUsd } from "@/shared/utils/format-usd"

export function DistributionHistory() {
  const {
    data: distributions,
    isLoading,
    isError,
    error,
  } = useGetMyDistributionClaims()

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load distribution history: {error.message}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribution History</CardTitle>
        <CardDescription>
          Your revenue and dividend claims from successful campaigns.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : !distributions || distributions.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ChartLineUp />
              </EmptyMedia>
              <EmptyTitle>No Distributions</EmptyTitle>
              <EmptyDescription>
                You have no distribution claims yet.
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
                  <TableHead>Shares</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {distributions.map((claim) => (
                  <TableRow key={claim.id}>
                    <TableCell>
                      {new Date(claim.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {claim.distribution?.campaignId || "-"}
                    </TableCell>
                    <TableCell>
                      {formatUsd(Number(claim.amount), { showSymbol: false })}{" "}
                      <span className="text-xs text-muted-foreground">
                        USDT
                      </span>
                    </TableCell>
                    <TableCell>{claim.shareAmount}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          claim.status === "CLAIMED"
                            ? "default"
                            : claim.status === "FAILED"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {claim.status}
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
