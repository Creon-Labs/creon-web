"use client"
import { RefundList } from "@/modules/refund"
import { usePageTitle } from "@/shared/components/sections/app-header"

export default function InvestorRefundPage() {
  usePageTitle("My Refunds")
  return (
    <>
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground">
          View pro-rata USDC refund entitlements from cancelled campaigns. The
          amount is based on funds remaining after milestone disbursements and
          may be lower than your original investment.
        </p>
      </div>
      <RefundList />
    </>
  )
}
