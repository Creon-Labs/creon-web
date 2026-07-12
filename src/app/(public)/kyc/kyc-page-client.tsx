"use client"

import { useRouter } from "next/navigation"
import { useCallback } from "react"

import { KycForm } from "@/modules/kyc"

export function KycPageClient() {
  const router = useRouter()

  // Called by KycForm after a successful submission.
  // Redirect the user to the dashboard so they can see their PENDING status.
  const handleSuccess = useCallback(() => {
    router.refresh()
  }, [router])

  return <KycForm onSuccess={handleSuccess} />
}
