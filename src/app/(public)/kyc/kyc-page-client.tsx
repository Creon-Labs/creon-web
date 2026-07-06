"use client"

import { useCallback } from "react"

import { KycForm, type KycFormValues } from "@/modules/kyc"

export function KycPageClient() {
  const handleSubmit = useCallback(async (values: KycFormValues) => {
    // TODO: wire up with API mutation once the backend integration is ready.
    // Ensure that idCard and selfie (base64) are converted to File objects 
    // to be sent via multipart/form-data.
    console.log("[KycPageClient] form submitted:", values)
  }, [])

  return (
    <KycForm
      onSubmit={handleSubmit}
      isPending={false}
    />
  )
}
