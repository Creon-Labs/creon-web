"use client"

import { useRouter } from "next/navigation"
import { useCallback } from "react"
import { toast } from "sonner"

import {
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
  const { connectedAddress, signMessage, disconnect } = useStellarWallet()
  const stubWallet = {
    address: connectedAddress ?? "",
    maskedAddress: maskAddress(connectedAddress ?? ""),
  }

  const registerMutation = useRegister()

  const handleSubmit = useCallback(
    async (values: RegisterFormValues) => {
      // Get Nonce from Backend
      // TODO: implement Single Responsibility later for this function
      const nonce = await (async () => {
        try {
          return await createAuthNonce(stubWallet.address)
        } catch {
          toast.error("Failed to login", {
            description: "Failed to create auth nonce, please try again!",
          })
          await disconnect()
          return null
        }
      })()

      if (!nonce) return

      // Sign Message
      // TODO: implement Single Responsibility later for this function
      const signature = await (async () => {
        try {
          return (await signMessage(nonce)).signedMessage
        } catch {
          toast.error("Failed to sign message", {
            description: "User rejected the signature request",
          })
          await disconnect()
          return null
        }
      })()

      if (!signature) return

      try {
        const data = await registerMutation.mutateAsync({
          ...values,
          walletAddress: stubWallet.address,
          signature,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [connectedAddress, registerMutation, router]
  )

  return (
    <RegisterForm
      wallet={stubWallet}
      onSubmit={handleSubmit}
      isPending={registerMutation.isPending}
    />
  )
}
