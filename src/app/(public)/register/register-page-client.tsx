"use client"

import { useRouter } from "next/navigation"
import { useCallback } from "react"
import { toast } from "sonner"

import {
  completeWalletChallenge,
  createAuthNonce,
  RegisterForm,
  useRegister,
  type RegisterFormValues,
} from "@/modules/auth"
import { ApiError } from "@/shared/lib/api-client"
import { useStellarWallet } from "@/shared/lib/stellar-wallet"
import { maskAddress } from "@/shared/utils/mask-address"

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
  const router = useRouter()
  const { connectedAddress, signMessage } = useStellarWallet()
  const wallet = {
    address: connectedAddress ?? "",
    maskedAddress: maskAddress(connectedAddress ?? ""),
  }

  const registerMutation = useRegister()

  const handleSubmit = useCallback(
    async (values: RegisterFormValues) => {
      try {
        if (!wallet.address) {
          toast.error("Connect a wallet before registering")
          return
        }

        const data = await completeWalletChallenge({
          walletAddress: wallet.address,
          getChallenge: createAuthNonce,
          signMessage,
          submit: (signature) =>
            registerMutation.mutateAsync({
              ...values,
              walletAddress: wallet.address,
              signature,
            }),
          onChallengeRetry: () => {
            toast.info("Your signing challenge expired. Please sign again.")
          },
        })

        toast.success("Registration is successful")

        // Redirect based on role
        if (data?.roles.includes("ENTREPRENEUR")) {
          router.push("/entrepreneur")
        } else if (data?.roles.includes("INVESTOR")) {
          router.push("/investor")
        } else {
          router.push("/")
        }
      } catch (error) {
        if (error instanceof ApiError) {
          toast.error(
            Array.isArray(error.message)
              ? error.message.join(", ")
              : error.message
          )
          return
        }

        console.error("[RegisterPageClient] error:", error)
        toast.error("Something went wrong, please try again")
      }
    },
    [registerMutation, router, signMessage, wallet.address]
  )

  return (
    <RegisterForm
      wallet={wallet}
      onSubmit={handleSubmit}
      isPending={registerMutation.isPending}
    />
  )
}
