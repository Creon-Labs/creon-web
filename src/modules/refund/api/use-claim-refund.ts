"use client"

import { useState } from "react"
import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import { useStellarWallet } from "@/shared/lib/stellar-wallet"
import { prepareClaimRefund } from "./prepare-claim-refund"
import { submitClaimRefund } from "./submit-claim-refund"
import { PrepareRefundClaimInput, RefundClaim } from "../types"

export type UseClaimRefundOptions = Omit<
  UseMutationOptions<RefundClaim, Error, PrepareRefundClaimInput>,
  "mutationFn"
>

export const useClaimRefund = (options?: UseClaimRefundOptions) => {
  const { signTransaction } = useStellarWallet()
  const [step, setStep] = useState<"IDLE" | "PREPARING" | "SIGNING" | "SUBMITTING">("IDLE")

  const mutation = useMutation<RefundClaim, Error, PrepareRefundClaimInput>({
    mutationFn: async ({ refundId }) => {
      try {
        setStep("PREPARING")
        const prepareRes = await prepareClaimRefund({ refundId })

        setStep("SIGNING")
        const { signedTxXdr } = await signTransaction(prepareRes.xdr)

        setStep("SUBMITTING")
        const submitRes = await submitClaimRefund({
          refundId,
          signedXdr: signedTxXdr,
        })

        return submitRes
      } catch (error) {
        throw error
      } finally {
        setStep("IDLE")
      }
    },
    ...options,
  })

  return {
    ...mutation,
    step,
  }
}
