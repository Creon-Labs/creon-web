"use client"

import { useCallback } from "react"

import { RegisterForm, type RegisterFormValues } from "@/modules/auth"

/**
 * Client wrapper for the register page.
 *
 * This component:
 * - Provides the stub wallet info (to be replaced with real useStellarWallet data)
 * - Handles form submission (to be wired to the register API mutation)
 *
 * Keeps the parent page.tsx a Server Component for optimal performance.
 */
export function RegisterPageClient() {
  // TODO: Replace with real wallet data from useStellarWallet()
  // const { connectedAddress } = useStellarWallet()
  const stubWallet = {
    address: "GAHJJJKMOKYE4RVPZEWZTKH5FVI4PA3VL7GK2LFNUBSGBV3MV72CSOFA",
    maskedAddress: "GAHJJ…SOFA",
  }

  const handleSubmit = useCallback(async (values: RegisterFormValues) => {
    // TODO: wire up with useRegister mutation once API layer is ready.
    // Example:
    //   const { signature } = useWalletSignatureStore()
    //   await registerMutation.mutateAsync({
    //     ...values,
    //     walletAddress: connectedAddress,
    //     signature,
    //   })
    console.log("[RegisterPageClient] form submitted:", values)
  }, [])

  return (
    <RegisterForm
      wallet={stubWallet}
      onSubmit={handleSubmit}
      isPending={false}
    />
  )
}
