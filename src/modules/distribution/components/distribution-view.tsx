"use client"

import { Button } from "@shadcn-ui/button"
import { Skeleton } from "@shadcn-ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@shadcn-ui/alert"
import { useGetCampaignDistributions } from "../api/get-campaign-distributions"
import { DistributeProfitDialog } from "./distribute-profit-dialog"
import { DistributionHistoryTable } from "./distribution-history-table"
import { DistributionStats } from "./distribution-stats"

export function DistributionView({
  campaignId,
}: {
  campaignId: string | null
}) {
  const {
    data: distributions = [],
    isLoading,
    isError,
    refetch,
  } = useGetCampaignDistributions({
    campaignId: campaignId ?? "",
    config: {
      enabled: !!campaignId,
    },
  })
  const hasPendingDistribution = distributions.some(
    (distribution) => distribution.status === "PENDING"
  )

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Dividends & Returns
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage profit distribution to your campaign investors.
          </p>
        </div>
        <DistributeProfitDialog
          campaignId={campaignId ?? ""}
          onDistributeSuccess={() => refetch()}
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-8">
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col gap-2 border p-6">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="size-4" />
                </div>
                <Skeleton className="mt-2 h-8 w-32" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <Skeleton className="h-7 w-48" />
            <div className="border">
              <div className="flex gap-4 border-b px-4 py-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-5 flex-1" />
                ))}
              </div>
              {[1, 2, 3].map((row) => (
                <div
                  key={row}
                  className="flex gap-4 border-b px-4 py-4 last:border-0"
                >
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-4 flex-1" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : isError ? (
        <div className="flex min-h-75 animate-in flex-col items-center justify-center gap-2 border border-dashed border-destructive bg-destructive/5 p-8 text-center fade-in-50">
          <h3 className="text-lg font-semibold text-destructive">
            Failed to load distributions
          </h3>
          <p className="text-sm text-muted-foreground">
            There was an error fetching your distribution history.
          </p>
          <Button variant={"outline"} onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <>
          {hasPendingDistribution ? (
            <Alert>
              <AlertTitle>Processing a dividend distribution</AlertTitle>
              <AlertDescription>
                The shareholder snapshot is being prepared. This page refreshes
                automatically until the distribution is ready for investors to
                claim.
              </AlertDescription>
            </Alert>
          ) : null}
          <DistributionStats distributions={distributions} />

          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold tracking-tight">
              Distribution History
            </h3>
            <DistributionHistoryTable distributions={distributions} />
          </div>
        </>
      )}
    </div>
  )
}
