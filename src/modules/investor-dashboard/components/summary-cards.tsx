"use client"

import { useGetMyInvestments } from "@/modules/investment"
import { useGetMyDistributionClaims } from "@/modules/distribution"
import { useGetMyRefundClaims } from "@/modules/refund"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/shadcn-ui/card"
import { Skeleton } from "@/shared/components/shadcn-ui/skeleton"
import {
  CurrencyCircleDollar,
  Money,
  ArrowUUpLeft,
} from "@phosphor-icons/react/dist/ssr"
import { formatUsd } from "@/shared/utils/format-usd"

export function SummaryCards() {
  const { data: investments, isLoading: isInvestmentsLoading } =
    useGetMyInvestments()
  const { data: distributions, isLoading: isDistributionsLoading } =
    useGetMyDistributionClaims()
  const { data: refunds, isLoading: isRefundsLoading } = useGetMyRefundClaims()

  const totalInvestment =
    investments?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0
  const totalRevenue =
    distributions
      ?.filter((d) => d.status === "CLAIMED")
      .reduce((acc, curr) => acc + Number(curr.amount), 0) || 0
  const totalRefund =
    refunds
      ?.filter((r) => r.status === "CLAIMED")
      .reduce((acc, curr) => acc + Number(curr.amount), 0) || 0

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Investment
          </CardTitle>
          <Money className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isInvestmentsLoading ? (
            <Skeleton className="h-7 w-24" />
          ) : (
            <div className="text-2xl font-bold">
              {formatUsd(totalInvestment, { showSymbol: false })}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                USDC
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Revenue
          </CardTitle>
          <CurrencyCircleDollar className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isDistributionsLoading ? (
            <Skeleton className="h-7 w-24" />
          ) : (
            <div className="text-2xl font-bold">
              {formatUsd(totalRevenue, { showSymbol: false })}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                USDC
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Refund
          </CardTitle>
          <ArrowUUpLeft className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isRefundsLoading ? (
            <Skeleton className="h-7 w-24" />
          ) : (
            <div className="text-2xl font-bold">
              {formatUsd(totalRefund, { showSymbol: false })}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                USDC
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
