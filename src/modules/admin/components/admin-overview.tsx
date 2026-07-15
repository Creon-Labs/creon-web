"use client"

import Link from "next/link"
import { FileTextIcon, IdentificationCardIcon } from "@phosphor-icons/react"

import { useGetAdminKycList, useGetAdminProposalList } from "@/modules/admin"
import { Alert, AlertDescription, AlertTitle } from "@shadcn-ui/alert"
import { Button } from "@shadcn-ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@shadcn-ui/card"
import { Skeleton } from "@shadcn-ui/skeleton"

function PendingCount({
  count,
  isLoading,
}: {
  count?: number
  isLoading: boolean
}) {
  return isLoading ? (
    <Skeleton className="h-8 w-12" />
  ) : (
    <p className="text-3xl font-semibold">{count ?? 0}</p>
  )
}

export function AdminOverview() {
  const kycQuery = useGetAdminKycList({ status: "PENDING" })
  const proposalQuery = useGetAdminProposalList({ status: "SUBMITTED" })
  const error = kycQuery.error ?? proposalQuery.error

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin overview</h1>
        <p className="text-muted-foreground">
          Review pending identity checks and funding proposals.
        </p>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Some review data could not be loaded</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Pending KYC</CardTitle>
            <IdentificationCardIcon className="size-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <PendingCount
              count={kycQuery.data?.length}
              isLoading={kycQuery.isLoading}
            />
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/kyc">Review KYC</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Submitted proposals</CardTitle>
            <FileTextIcon className="size-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <PendingCount
              count={proposalQuery.data?.length}
              isLoading={proposalQuery.isLoading}
            />
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/campaigns">Review proposals</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
