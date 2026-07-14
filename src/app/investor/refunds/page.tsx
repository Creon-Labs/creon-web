"use client"
import { RefundList } from "@/modules/refund"
import { usePageTitle } from "@/shared/components/sections/app-header"

export default function InvestorRefundPage() {
  usePageTitle("My Refunds")
  return (
    <>
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground">
          View your refund entitlements from cancelled campaigns and claim them
          to your wallet.
        </p>
      </div>
      <RefundList />
    </>
  )
}
