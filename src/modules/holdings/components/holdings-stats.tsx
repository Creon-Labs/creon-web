"use client"

import { useMemo } from "react"
import {
  ChartPieSliceIcon,
  CubeIcon,
  TrendUpIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react"
import { Card, CardContent, CardHeader, CardTitle } from "@shadcn-ui/card"

import { cn } from "@/shared/utils/cn"
import { Text } from "@/shared/components/primitives/typography"

import type { CampaignHolding } from "../types"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseBalance(raw: string): number {
  return parseFloat(raw)
}

function formatBalance(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(2)}K`
  return n.toLocaleString("id-ID", { maximumFractionDigits: 2 })
}

// ─── Stat card ───────────────────────────────────────────────────────────────

type StatCardProps = {
  icon: React.ReactNode
  label: string
  value: string
  subvalue?: string
  iconColorClass?: string
  className?: string
}

function StatCard({
  icon,
  label,
  value,
  subvalue,
  iconColorClass = "text-primary",
  className,
}: StatCardProps) {
  return (
    <Card className={cn("gap-3", className)}>
      <CardHeader className="pb-1">
        <div className="flex items-center gap-2">
          <span className={cn("size-4 shrink-0", iconColorClass)}>{icon}</span>
          <CardTitle className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            {label}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        {subvalue && (
          <Text variant="caption-sm" className="mt-0.5">
            {subvalue}
          </Text>
        )}
      </CardContent>
    </Card>
  )
}

// ─── Props ───────────────────────────────────────────────────────────────────

type HoldingsStatsProps = {
  holdings: CampaignHolding[]
  tokenSymbol?: string
}

// ─── Component ───────────────────────────────────────────────────────────────

export function HoldingsStats({
  holdings,
  tokenSymbol = "USDT",
}: HoldingsStatsProps) {
  const stats = useMemo(() => {
    if (holdings.length === 0)
      return {
        totalHolders: 0,
        totalSupply: 0,
        topHolderBalance: 0,
        topHolderPct: 0,
        registeredCount: 0,
        anonymousCount: 0,
      }

    const balances = holdings.map((h) => parseBalance(h.balance))
    const totalSupply = balances.reduce((a, b) => a + b, 0)
    const topHolderBalance = Math.max(...balances)
    const topHolderPct =
      totalSupply > 0 ? (topHolderBalance / totalSupply) * 100 : 0
    const registeredCount = holdings.filter((h) => h.holder !== null).length
    const anonymousCount = holdings.length - registeredCount

    return {
      totalHolders: holdings.length,
      totalSupply,
      topHolderBalance,
      topHolderPct,
      registeredCount,
      anonymousCount,
    }
  }, [holdings])

  const concentration =
    stats.topHolderPct >= 50
      ? "Concentrated"
      : stats.topHolderPct >= 20
        ? "Moderate"
        : "Distributed"

  const concentrationColor =
    stats.topHolderPct >= 50
      ? "text-destructive"
      : stats.topHolderPct >= 20
        ? "text-warning-foreground"
        : "text-success-foreground"

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatCard
        icon={<UsersThreeIcon weight="duotone" />}
        label="Total Holders"
        value={stats.totalHolders.toLocaleString("id-ID")}
        subvalue={`${stats.registeredCount} registered · ${stats.anonymousCount} anonymous`}
        iconColorClass="text-info-foreground"
      />

      <StatCard
        icon={<CubeIcon weight="duotone" />}
        label={`Total Supply (${tokenSymbol})`}
        value={formatBalance(stats.totalSupply)}
        subvalue="Circulating on the Stellar network"
        iconColorClass="text-primary"
      />

      <StatCard
        icon={<TrendUpIcon weight="duotone" />}
        label="Largest Holder"
        value={formatBalance(stats.topHolderBalance)}
        subvalue={`${stats.topHolderPct.toFixed(1)}% of total supply`}
        iconColorClass="text-warning-foreground"
      />

      <StatCard
        icon={<ChartPieSliceIcon weight="duotone" />}
        label="Concentration"
        value={concentration}
        subvalue={`Top holder: ${stats.topHolderPct.toFixed(1)}%`}
        iconColorClass={concentrationColor}
      />
    </div>
  )
}
