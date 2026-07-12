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
import { useStellarWallet } from "@/shared/lib/stellar-wallet"
import { deleteLocalStorage } from "@/shared/utils/localstorage"
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
      const nonce = await createAuthNonce(stubWallet.address)

      if (!nonce) throw new Error("Failed to create auth nonce")

      let signature

      if (!signature) {
        try {
          signature = (await signMessage(nonce)).signedMessage
        } catch {
          toast.error("Failed to sign message")
          await disconnect()
          return
        }
      }

      if (!connectedAddress) {
        toast.error("Wallet tidak terhubung")
        return
      }

      if (!signature) {
        toast.error("Signature tidak ditemukan, silakan hubungkan ulang wallet")
        return
      }

      try {
        const res = await registerMutation.mutateAsync({
          ...values,
          walletAddress: connectedAddress,
          signature,
        })

        if (res.statusCode >= 400 || res.error) {
          toast.error(
            Array.isArray(res.message)
              ? res.message.join(", ")
              : res.message || "Gagal melakukan registrasi"
          )
          return
        }

        toast.success("Registrasi berhasil")
        deleteLocalStorage("auth_signature")

        // Redirect based on role
        if (res.data?.roles.includes("ENTREPRENEUR")) {
          router.push("/entrepreneur")
        } else if (res.data?.roles.includes("INVESTOR")) {
          router.push("/investor")
        } else {
          router.push("/")
        }
      } catch (error) {
        console.error("[RegisterPageClient] error:", error)
        toast.error("Terjadi kesalahan, silakan coba lagi")
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
