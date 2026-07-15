"use client"

import {
  CheckCircle,
  Clock,
  HandCoins,
  WarningCircle,
  XCircle,
} from "@phosphor-icons/react"
import { toast } from "sonner"
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
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@shadcn-ui/empty"
import { Skeleton } from "@shadcn-ui/skeleton"
import { Spinner } from "@shadcn-ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shadcn-ui/table"
import { formatUsd } from "@/shared/utils/format-usd"
import { useGetMyDistributionClaims } from "../api/get-my-distribution-claims"
import { useClaimDistribution } from "../api/use-claim-distribution"
import type { DistributionClaim } from "../types"
import {
  getDistributionClaimActionState,
  getDistributionClaimErrorMessage,
} from "../utils/distribution-claim-state"

function formatClaimDate(date: string | null): string {
  if (!date) return "Belum diklaim"

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date))
}

function ClaimAction({ claim }: { claim: DistributionClaim }) {
  const {
    mutate: claimDistribution,
    isPending,
    step,
  } = useClaimDistribution({
    config: {
      onSuccess: () => {
        toast.success("Dividen berhasil diklaim", {
          description: "USDC telah langsung dikirim ke wallet Anda.",
        })
      },
      onError: (error) => {
        toast.error("Klaim dividen gagal", {
          description: getDistributionClaimErrorMessage(error),
        })
      },
    },
  })
  const actionState = getDistributionClaimActionState(claim)

  if (actionState === "CLAIMABLE") {
    return (
      <Button
        disabled={isPending}
        onClick={() =>
          claimDistribution({ distributionId: claim.distributionId })
        }
        size="sm"
      >
        {isPending ? (
          <>
            <Spinner data-icon="inline-start" />
            {step === "PREPARING"
              ? "Menyiapkan..."
              : step === "SIGNING"
                ? "Menunggu wallet..."
                : "Mengirim..."}
          </>
        ) : (
          <>
            <HandCoins data-icon="inline-start" />
            Claim USDC
          </>
        )}
      </Button>
    )
  }

  if (actionState === "PROCESSING_DISTRIBUTION") {
    return <Badge variant="secondary">Distribusi sedang diproses</Badge>
  }

  if (actionState === "CLAIMED") {
    return <Badge>Sudah diklaim</Badge>
  }

  if (actionState === "FAILED") {
    return <Badge variant="destructive">Klaim gagal</Badge>
  }

  return <Badge variant="secondary">Tidak tersedia</Badge>
}

function ClaimStatus({ claim }: { claim: DistributionClaim }) {
  const actionState = getDistributionClaimActionState(claim)

  if (actionState === "CLAIMED") {
    return (
      <Badge variant="secondary">
        <CheckCircle data-icon="inline-start" />
        CLAIMED
      </Badge>
    )
  }

  if (actionState === "PROCESSING_DISTRIBUTION") {
    return (
      <Badge variant="secondary">
        <Clock data-icon="inline-start" />
        PROCESSING
      </Badge>
    )
  }

  if (actionState === "FAILED") {
    return (
      <Badge variant="destructive">
        <XCircle data-icon="inline-start" />
        FAILED
      </Badge>
    )
  }

  return <Badge variant="outline">PENDING</Badge>
}

function DistributionClaimsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-96" />
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-14 w-full" />
        ))}
      </CardContent>
    </Card>
  )
}

export function DistributionClaims() {
  const {
    data: claims,
    isLoading,
    isError,
    error,
  } = useGetMyDistributionClaims()

  if (isLoading) return <DistributionClaimsSkeleton />

  if (isError) {
    return (
      <Alert variant="destructive">
        <WarningCircle />
        <AlertTitle>Riwayat dividen tidak dapat dimuat</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dividen Saya</CardTitle>
        <CardDescription>
          Klaim dividen yang sudah siap. USDC akan langsung masuk ke wallet Anda
          tanpa langkah withdraw tambahan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!claims || claims.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <HandCoins />
              </EmptyMedia>
              <EmptyTitle>Belum ada dividen</EmptyTitle>
              <EmptyDescription>
                Entitlement akan muncul setelah distribusi profit selesai
                diproses.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="overflow-x-auto rounded-none border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Entitlement</TableHead>
                  <TableHead>Shares</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal klaim</TableHead>
                  <TableHead>Tx hash</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {claims.map((claim) => (
                  <TableRow key={claim.id}>
                    <TableCell className="font-mono text-xs">
                      {claim.distribution?.campaignId || "-"}
                    </TableCell>
                    <TableCell>
                      {formatUsd(Number(claim.amount), { showSymbol: false })}{" "}
                      USDC
                    </TableCell>
                    <TableCell>{claim.shareAmount}</TableCell>
                    <TableCell>
                      <ClaimStatus claim={claim} />
                    </TableCell>
                    <TableCell>{formatClaimDate(claim.claimedAt)}</TableCell>
                    <TableCell className="max-w-40 truncate font-mono text-xs">
                      {claim.claimTxHash || "-"}
                    </TableCell>
                    <TableCell>
                      <ClaimAction claim={claim} />
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
