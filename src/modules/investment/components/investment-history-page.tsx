"use client"

import {
  ArrowSquareOutIcon,
  ArrowsClockwiseIcon,
  ClockCounterClockwiseIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react"
import { format } from "date-fns"
import type { Route } from "next"
import Link from "next/link"

import { formatUsdcAmount } from "@/shared/utils/format-usdc"
import { Alert, AlertDescription, AlertTitle } from "@shadcn-ui/alert"
import { Badge } from "@shadcn-ui/badge"
import { Button } from "@shadcn-ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shadcn-ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@shadcn-ui/empty"
import { Skeleton } from "@shadcn-ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shadcn-ui/table"

import { useGetMyInvestments } from "../api/get-my-investments"
import type { InvestmentStatus } from "../types"

function statusVariant(status: InvestmentStatus) {
  if (status === "CONFIRMED") return "default" as const
  if (status === "FAILED") return "destructive" as const
  return "secondary" as const
}

function formatInvestmentDate(value: string): string {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? "Unknown"
    : format(date, "d MMM yyyy, HH:mm")
}

export function InvestmentHistoryPage() {
  const {
    data: investments,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetMyInvestments()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">Investment history</h1>
        <p className="text-sm text-muted-foreground">
          A transaction ledger of your campaign purchases. Current ownership is
          tracked separately in holdings.
        </p>
      </div>

      {error ? (
        <Alert variant="destructive">
          <WarningCircleIcon weight="fill" />
          <AlertTitle>Unable to load investment history</AlertTitle>
          <AlertDescription className="flex flex-col items-start gap-3">
            <span>{error.message}</span>
            <Button
              size="sm"
              variant="outline"
              disabled={isFetching}
              onClick={() => {
                void refetch()
              }}
            >
              <ArrowsClockwiseIcon data-icon="inline-start" />
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>
              Confirmed submissions include their Stellar transaction hash and
              minted shares.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <InvestmentTableSkeleton />
            ) : investments?.length ? (
              <div className="border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Shares</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Transaction hash</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {investments.map((investment) => {
                      const campaignHref =
                        `/investor/discovers/${investment.campaignId}` as Route

                      return (
                        <TableRow key={investment.id}>
                          <TableCell className="whitespace-nowrap">
                            {formatInvestmentDate(
                              investment.investedAt ?? investment.createdAt
                            )}
                          </TableCell>
                          <TableCell>
                            <Link
                              href={campaignHref}
                              className="font-mono text-xs underline underline-offset-4"
                            >
                              {investment.campaignId}
                            </Link>
                          </TableCell>
                          <TableCell className="font-medium whitespace-nowrap">
                            {formatUsdcAmount(investment.amount)} USDC
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {investment.lpTokens
                              ? formatUsdcAmount(investment.lpTokens)
                              : "Pending"}
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusVariant(investment.status)}>
                              {investment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {investment.txHash ? (
                              <a
                                href={`https://stellar.expert/explorer/testnet/tx/${investment.txHash}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex min-w-72 items-start gap-2 font-mono text-xs break-all underline underline-offset-4"
                              >
                                {investment.txHash}
                                <ArrowSquareOutIcon className="mt-0.5 shrink-0" />
                              </a>
                            ) : (
                              <span className="text-muted-foreground">
                                Not available
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <ClockCounterClockwiseIcon />
                  </EmptyMedia>
                  <EmptyTitle>No investments yet</EmptyTitle>
                  <EmptyDescription>
                    Discover a live campaign to make your first USDC investment.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button asChild variant="outline">
                    <Link href={"/investor/discovers" as Route}>
                      Discover campaigns
                    </Link>
                  </Button>
                </EmptyContent>
              </Empty>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function InvestmentTableSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 5 }, (_, index) => (
        <Skeleton key={index} className="h-12 w-full" />
      ))}
    </div>
  )
}
