"use client"

import { useMemo, useState } from "react"
import {
  ArrowsClockwiseIcon,
  InfoIcon,
} from "@phosphor-icons/react"
import { Alert, AlertDescription } from "@shadcn-ui/alert"
import { Button } from "@shadcn-ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@shadcn-ui/tooltip"

import { Text } from "@/shared/components/primitives/typography"

import type { CampaignHolding } from "../types"
import { HoldingsStats } from "../components/holdings-stats"
import { HoldingsTable } from "../components/holdings-table"

// ─── Sort helpers ─────────────────────────────────────────────────────────────

type SortKey = "rank" | "holder" | "balance"
type SortDir = "asc" | "desc"

function sortHoldings(
  holdings: CampaignHolding[],
  key: SortKey,
  dir: SortDir,
): CampaignHolding[] {
  // "rank" is determined by balance descending, so we sort by balance
  const effectiveKey = key === "rank" ? "balance" : key
  const effectiveDir = key === "rank" ? (dir === "asc" ? "desc" : "asc") : dir

  return [...holdings].sort((a, b) => {
    let cmp = 0

    if (effectiveKey === "balance") {
      cmp = parseFloat(a.balance) - parseFloat(b.balance)
    } else {
      // holder (nulls last)
      const aVal = a.holder ?? ""
      const bVal = b.holder ?? ""
      cmp = aVal.localeCompare(bVal, "id")
    }

    return effectiveDir === "asc" ? cmp : -cmp
  })
}

// ─── Props ────────────────────────────────────────────────────────────────────

type EntrepreneurHoldingsPageProps = {
  /**
   * Holdings data from the API — `GET /campaigns/{id}/holdings`.
   * When `undefined`, the caller should render `<HoldingsSkeleton />` instead.
   */
  holdings: CampaignHolding[]
  tokenSymbol?: string
  /** Last updated timestamp (ISO string or formatted string) */
  lastUpdatedAt?: string
  /** Called when user requests a data refresh */
  onRefresh?: () => void
  isRefreshing?: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export function EntrepreneurHoldingsPage({
  holdings,
  tokenSymbol = "USDT",
  lastUpdatedAt,
  onRefresh,
  isRefreshing = false,
}: EntrepreneurHoldingsPageProps) {
  const [sortKey, setSortKey] = useState<SortKey>("rank")
  const [sortDir, setSortDir] = useState<SortDir>("desc")

  const sortedHoldings = useMemo(
    () => sortHoldings(holdings, sortKey, sortDir),
    [holdings, sortKey, sortDir],
  )

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir(key === "holder" ? "asc" : "desc")
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold leading-snug">
            Cap Table
          </h2>
          <div className="flex items-center gap-1.5">
            <Text variant="caption">
              List of shareholders for token{" "}
              <span className="font-mono font-medium text-foreground">
                {tokenSymbol}
              </span>{" "}
              indexed from the Stellar network.
            </Text>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="size-3.5 shrink-0 cursor-help text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">
                  This data is automatically updated by the ownership indexer
                  which monitors ShareToken events on the Stellar/Soroban blockchain.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {lastUpdatedAt && (
            <Text variant="caption-sm" className="hidden sm:block">
              Last updated: {lastUpdatedAt}
            </Text>
          )}
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
            >
              <ArrowsClockwiseIcon
                data-icon="inline-start"
                className={isRefreshing ? "animate-spin" : ""}
              />
              Refresh
            </Button>
          )}
        </div>
      </div>

      {/* Privacy notice */}
      <Alert className="border-info/20 bg-info/5">
        <InfoIcon className="size-4 text-info-foreground" />
        <AlertDescription className="text-xs text-info-foreground/80">
          Investor identities are masked according to Creon's privacy policy — names
          are displayed as initials (e.g. <span className="font-mono">A*** S***</span>
          ) and wallet addresses are truncated (e.g.{" "}
          <span className="font-mono">GBXU…DOEK</span>).
        </AlertDescription>
      </Alert>

      {/* Stats overview */}
      <HoldingsStats holdings={holdings} tokenSymbol={tokenSymbol} />

      {/* Cap table */}
      <HoldingsTable
        holdings={sortedHoldings}
        tokenSymbol={tokenSymbol}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={handleSort}
      />
    </div>
  )
}
