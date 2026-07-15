"use client"

import { useMemo } from "react"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretUpDownIcon,
  ChartPieSliceIcon,
  UsersThreeIcon,
  WalletIcon,
} from "@phosphor-icons/react"
import { Badge } from "@shadcn-ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shadcn-ui/card"
import { Separator } from "@shadcn-ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shadcn-ui/table"
import { Tooltip, TooltipContent, TooltipTrigger } from "@shadcn-ui/tooltip"

import { cn } from "@/shared/utils/cn"
import { Text } from "@/shared/components/primitives/typography"

import type { CampaignHolding } from "../types"

// ─── Constants ───────────────────────────────────────────────────────────────

/** Number of decimals returned by the token contract. */
const TOKEN_DECIMALS = 7

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseBalance(raw: string): number {
  return parseFloat(raw)
}

function formatBalance(raw: string): string {
  const n = parseBalance(raw)
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(2)}K`
  return n.toLocaleString("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: TOKEN_DECIMALS,
  })
}

function formatBalanceFull(raw: string): string {
  const n = parseBalance(raw)
  return n.toLocaleString("id-ID", {
    minimumFractionDigits: TOKEN_DECIMALS,
    maximumFractionDigits: TOKEN_DECIMALS,
  })
}

// ─── Sort types ──────────────────────────────────────────────────────────────

type SortKey = "rank" | "holder" | "balance"
type SortDir = "asc" | "desc"

// ─── Sub-components ──────────────────────────────────────────────────────────

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <Badge
        variant="outline"
        className="border-warning/40 bg-warning/10 font-mono text-warning-foreground"
      >
        #1
      </Badge>
    )
  if (rank === 2)
    return (
      <Badge
        variant="outline"
        className="border-subtle/40 bg-subtle/10 font-mono text-muted-foreground"
      >
        #2
      </Badge>
    )
  if (rank === 3)
    return (
      <Badge
        variant="outline"
        className="border-subtle/30 bg-subtle/5 font-mono text-muted-foreground"
      >
        #3
      </Badge>
    )

  return (
    <span className="font-mono text-sm text-muted-foreground">#{rank}</span>
  )
}

function SortButton({
  label,
  sortKey,
  currentKey,
  currentDir,
  onSort,
  className,
}: {
  label: string
  sortKey: SortKey
  currentKey: SortKey
  currentDir: SortDir
  onSort: (key: SortKey) => void
  className?: string
}) {
  const isActive = currentKey === sortKey

  return (
    <button
      onClick={() => onSort(sortKey)}
      className={cn(
        "inline-flex cursor-pointer items-center gap-1 transition-colors select-none hover:text-foreground",
        isActive ? "text-foreground" : "text-muted-foreground",
        className
      )}
    >
      {label}
      {isActive ? (
        currentDir === "asc" ? (
          <ArrowUpIcon className="size-3" />
        ) : (
          <ArrowDownIcon className="size-3" />
        )
      ) : (
        <CaretUpDownIcon className="size-3 opacity-40" />
      )}
    </button>
  )
}

// ─── Ownership bar ────────────────────────────────────────────────────────────

function OwnershipBar({
  percentage,
  rank,
}: {
  percentage: number
  rank: number
}) {
  const colorClass =
    rank === 1
      ? "bg-warning/70"
      : rank === 2
        ? "bg-subtle/60"
        : rank === 3
          ? "bg-subtle/40"
          : "bg-primary/30"

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-border">
        <div
          className={cn("h-full rounded-full transition-all", colorClass)}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <span className="w-10 text-right font-mono text-xs text-muted-foreground">
        {percentage.toFixed(1)}%
      </span>
    </div>
  )
}

// ─── Props ───────────────────────────────────────────────────────────────────

type HoldingsTableProps = {
  holdings: CampaignHolding[]
  /** Token symbol shown in table header, e.g. "USDC" */
  tokenSymbol?: string
  sortKey: SortKey
  sortDir: SortDir
  onSort: (key: SortKey) => void
}

// ─── Component ───────────────────────────────────────────────────────────────

export function HoldingsTable({
  holdings,
  tokenSymbol = "USDC",
  sortKey,
  sortDir,
  onSort,
}: HoldingsTableProps) {
  const totalBalance = useMemo(
    () => holdings.reduce((sum, h) => sum + parseBalance(h.balance), 0),
    [holdings]
  )

  // Pre-compute ownership percentages keyed by address for O(1) access
  const ownershipMap = useMemo(() => {
    const map = new Map<string, number>()
    for (const h of holdings) {
      map.set(
        h.address,
        totalBalance > 0 ? (parseBalance(h.balance) / totalBalance) * 100 : 0
      )
    }
    return map
  }, [holdings, totalBalance])

  if (holdings.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-3 py-16">
          <UsersThreeIcon className="size-10 text-muted-foreground/40" />
          <Text variant="caption" className="text-center">
            There are no shareholders for this campaign yet.
          </Text>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <CardTitle className="text-base">Cap Table</CardTitle>
            <CardDescription>
              Investor identities are masked for privacy.
            </CardDescription>
          </div>
          <Badge variant="secondary" className="font-mono text-xs">
            {holdings.length} holder{holdings.length !== 1 ? "s" : ""}
          </Badge>
        </div>
      </CardHeader>

      <Separator className="mt-4" />

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-16 text-center">
                <SortButton
                  label="Rank"
                  sortKey="rank"
                  currentKey={sortKey}
                  currentDir={sortDir}
                  onSort={onSort}
                  className="mx-auto"
                />
              </TableHead>
              <TableHead>
                <SortButton
                  label="Holder"
                  sortKey="holder"
                  currentKey={sortKey}
                  currentDir={sortDir}
                  onSort={onSort}
                />
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <WalletIcon className="size-3" />
                  Wallet Address
                </div>
              </TableHead>
              <TableHead className="text-right">
                <SortButton
                  label={`Balance (${tokenSymbol})`}
                  sortKey="balance"
                  currentKey={sortKey}
                  currentDir={sortDir}
                  onSort={onSort}
                  className="ml-auto"
                />
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <ChartPieSliceIcon className="size-3" />
                  Ownership
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {holdings.map((holding, index) => {
              const rank = index + 1
              const ownership = ownershipMap.get(holding.address) ?? 0

              return (
                <TableRow
                  key={holding.address}
                  className={cn(
                    "transition-colors",
                    rank <= 3 && "bg-muted/20 hover:bg-muted/30"
                  )}
                >
                  {/* Rank */}
                  <TableCell className="text-center">
                    <RankBadge rank={rank} />
                  </TableCell>

                  {/* Holder identity */}
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">
                        {holding.holder ?? (
                          <span className="text-muted-foreground italic">
                            Anonymous
                          </span>
                        )}
                      </span>
                      {/* Show wallet on mobile (hidden on md+) */}
                      <span className="font-mono text-xs text-muted-foreground md:hidden">
                        {holding.address}
                      </span>
                    </div>
                  </TableCell>

                  {/* Wallet address (desktop) */}
                  <TableCell className="hidden md:table-cell">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-default font-mono text-sm text-muted-foreground">
                          {holding.address}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">
                          Wallet address is masked for privacy
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>

                  {/* Balance */}
                  <TableCell className="text-right">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-default font-mono font-semibold">
                          {formatBalance(holding.balance)}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-mono text-xs">
                          {formatBalanceFull(holding.balance)} {tokenSymbol}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>

                  {/* Ownership bar (desktop) */}
                  <TableCell className="hidden lg:table-cell">
                    <OwnershipBar percentage={ownership} rank={rank} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Footer note */}
      <div className="border-t px-4 py-3">
        <Text variant="caption-sm" className="text-center">
          Data is automatically updated by the ownership indexer
        </Text>
      </div>
    </Card>
  )
}
