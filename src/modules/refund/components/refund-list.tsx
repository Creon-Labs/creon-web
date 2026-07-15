"use client"

import { useGetMyRefundClaims } from "../api/get-my-refund-claims"
import { useClaimRefund } from "../api/use-claim-refund"
import { RefundClaim } from "../types"
import { getRefundClaimState } from "../utils/refund-claim-state"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@shadcn-ui/card"
import { Badge } from "@shadcn-ui/badge"
import { Button } from "@shadcn-ui/button"
import { Skeleton } from "@shadcn-ui/skeleton"
import { toast } from "sonner"
import { Spinner } from "@shadcn-ui/spinner"
import {
  Empty,
  EmptyTitle,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@shadcn-ui/empty"
import { CheckCircle, XCircle, Clock, Tray } from "@phosphor-icons/react"

// A sub-component to handle the claim action for a single refund claim
function RefundClaimCard({ claim }: { claim: RefundClaim }) {
  const {
    mutate: claimRefund,
    step,
    isPending,
  } = useClaimRefund({
    onSuccess: (updatedClaim) => {
      toast.success("Refund successfully claimed", {
        description: updatedClaim.claimTxHash
          ? `Status: ${updatedClaim.status}. Tx: ${updatedClaim.claimTxHash}`
          : `Status: ${updatedClaim.status}. Your USDC was sent to your wallet.`,
      })
    },
    onError: (error) => {
      toast.error(error.message || "Failed to claim refund.")
    },
  })

  const claimState = getRefundClaimState(claim)
  const isClaimed = claim.status === "CLAIMED"
  const isFailed = claim.status === "FAILED"

  const handleClaim = () => {
    claimRefund({ refundId: claim.refundId })
  }

  let statusBadge = (
    <Badge variant="secondary" className="flex w-fit items-center gap-1">
      <Clock weight="bold" className="size-3" />
      Pending
    </Badge>
  )

  if (isClaimed) {
    statusBadge = (
      <Badge
        variant="default"
        className="flex w-fit items-center gap-1 bg-success hover:bg-success/90"
      >
        <CheckCircle weight="fill" className="size-3" />
        Claimed
      </Badge>
    )
  } else if (isFailed) {
    statusBadge = (
      <Badge variant="destructive" className="flex w-fit items-center gap-1">
        <XCircle weight="fill" className="size-3" />
        Failed
      </Badge>
    )
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="truncate text-lg font-semibold">
          Campaign ID: {claim.refund?.campaignId || "Unknown"}
        </CardTitle>
        {statusBadge}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Share Amount</span>
          <span className="font-medium">{claim.shareAmount}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Refund Entitlement</span>
          <span className="font-medium">{claim.amount} USDC</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Refund is calculated pro-rata from the campaign funds still held after
          milestone disbursements; it may be less than your original investment.
        </p>
        {claimState.description ? (
          <p className="text-sm text-muted-foreground">
            {claimState.description}
          </p>
        ) : null}
        {claim.claimTxHash ? (
          <div className="flex flex-col gap-1 text-sm">
            <span className="text-muted-foreground">Claim transaction</span>
            <span className="font-mono text-xs break-all">
              {claim.claimTxHash}
            </span>
          </div>
        ) : null}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          disabled={!claimState.canClaim || isPending}
          onClick={handleClaim}
          variant={isClaimed ? "secondary" : "default"}
        >
          {isPending && <Spinner className="mr-2" />}
          {isPending
            ? step === "PREPARING"
              ? "Preparing..."
              : step === "SIGNING"
                ? "Awaiting Wallet..."
                : "Submitting..."
            : claimState.label}
        </Button>
      </CardFooter>
    </Card>
  )
}

function RefundListSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="flex h-full flex-col">
          <CardHeader className="gap-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-5 w-24" />
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export function RefundList() {
  const { data: claims, isLoading, isError, error } = useGetMyRefundClaims()

  if (isLoading) {
    return <RefundListSkeleton />
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center p-8 text-center text-destructive">
        <p>Failed to load refunds. {error?.message}</p>
      </div>
    )
  }

  if (!claims || claims.length === 0) {
    return (
      <Empty className="border-border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Tray className="size-4" />
          </EmptyMedia>
          <EmptyTitle>No Refunds Available</EmptyTitle>
          <EmptyDescription>
            You do not have any pending or claimed refunds from cancelled
            campaigns at this time.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {claims.map((claim) => (
        <RefundClaimCard key={claim.id} claim={claim} />
      ))}
    </div>
  )
}
