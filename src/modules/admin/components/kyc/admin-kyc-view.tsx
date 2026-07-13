"use client"

import * as React from "react"
import {
  AdminKycItem,
  KycStatus,
  useGetAdminKycList,
} from "@/modules/admin"

import { AdminKycTable } from "./admin-kyc-table"
import {
  ApproveKycDialog,
  RejectKycDialog,
  RevokeKycDialog,
  ViewDocsDialog,
} from "./admin-kyc-action-dialogs"

import { Tabs, TabsList, TabsTrigger } from "@/shared/components/shadcn-ui/tabs"
import { Spinner } from "@/shared/components/shadcn-ui/spinner"

export function AdminKycView() {
  // We use nuqs to store status in URL, but for simplicity, React state is fine too if nuqs is not set up properly.
  // Assuming standard React state for now to avoid dependency issues if nuqs is not installed, though it's standard in some modern stacks.
  // I will use React.useState for safety.
  const [status, setStatus] = React.useState<KycStatus>("PENDING")

  const { data, isLoading, isError, error } = useGetAdminKycList({ status })

  // Dialog states
  const [approveUser, setApproveUser] = React.useState<AdminKycItem | null>(null)
  const [rejectUser, setRejectUser] = React.useState<AdminKycItem | null>(null)
  const [revokeUser, setRevokeUser] = React.useState<AdminKycItem | null>(null)
  const [viewDocsUser, setViewDocsUser] = React.useState<AdminKycItem | null>(null)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">KYC Review</h2>
          <p className="text-muted-foreground">Manage user Identity Verification (KYC) submissions.</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Tabs value={status} onValueChange={(v) => setStatus(v as KycStatus)}>
          <TabsList>
            <TabsTrigger value="PENDING">Pending</TabsTrigger>
            <TabsTrigger value="APPROVED">Approved</TabsTrigger>
            <TabsTrigger value="REJECTED">Rejected</TabsTrigger>
            <TabsTrigger value="REVOKED">Revoked</TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="flex items-center justify-center p-12 border border-dashed text-muted-foreground">
            <Spinner className="mr-2" />
            <span>Loading data...</span>
          </div>
        ) : isError ? (
          <div className="border border-destructive/50 bg-destructive/10 p-4 text-destructive rounded-md text-sm">
            Failed to load data: {error.message}
          </div>
        ) : (
          <AdminKycTable
            data={data ?? []}
            onApprove={setApproveUser}
            onReject={setRejectUser}
            onRevoke={setRevokeUser}
            onViewDocs={setViewDocsUser}
          />
        )}
      </div>

      {/* Dialogs */}
      <ApproveKycDialog
        userId={approveUser?.userId ?? null}
        userName={approveUser?.fullName ?? null}
        onOpenChange={(open) => !open && setApproveUser(null)}
      />
      <RejectKycDialog
        userId={rejectUser?.userId ?? null}
        userName={rejectUser?.fullName ?? null}
        onOpenChange={(open) => !open && setRejectUser(null)}
      />
      <RevokeKycDialog
        userId={revokeUser?.userId ?? null}
        userName={revokeUser?.fullName ?? null}
        onOpenChange={(open) => !open && setRevokeUser(null)}
      />
      <ViewDocsDialog
        idCardUrl={viewDocsUser?.idCardUrl ?? null}
        selfieUrl={viewDocsUser?.selfieUrl ?? null}
        userName={viewDocsUser?.fullName ?? null}
        onOpenChange={(open) => !open && setViewDocsUser(null)}
      />
    </div>
  )
}
