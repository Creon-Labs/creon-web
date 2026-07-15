"use client"

import { useState } from "react"
import {
  useMutation,
  useQueryClient,
  UseMutationOptions,
} from "@tanstack/react-query"
import { useStellarWallet } from "@/shared/lib/stellar-wallet"
import { assertKycApproved, getMyKycStatus } from "@/modules/kyc"
import { prepareClaimRefund } from "./prepare-claim-refund"
import { submitClaimRefund } from "./submit-claim-refund"
import { PrepareRefundClaimInput, RefundClaim } from "../types"

export type UseClaimRefundOptions = Omit<
  UseMutationOptions<RefundClaim, Error, PrepareRefundClaimInput>,
  "mutationFn"
>

export const useClaimRefund = (options?: UseClaimRefundOptions) => {
  const { signTransaction } = useStellarWallet()
  const queryClient = useQueryClient()
  const [step, setStep] = useState<
    "IDLE" | "PREPARING" | "SIGNING" | "SUBMITTING"
  >("IDLE")

  const mutation = useMutation<RefundClaim, Error, PrepareRefundClaimInput>({
    mutationFn: async ({ refundId }) => {
      try {
        const kycProfile = await getMyKycStatus()
        assertKycApproved(kycProfile)

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
    onSuccess: async (...args) => {
      const [claim] = args

      queryClient.setQueryData<RefundClaim[]>(
        ["refunds", "mine"],
        (currentClaims) =>
          currentClaims?.map((currentClaim) =>
            currentClaim.refundId === claim.refundId ? claim : currentClaim
          )
      )

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["refunds", "mine"] }),
        queryClient.invalidateQueries({
          queryKey: ["campaigns", claim.refund?.campaignId, "refund"],
        }),
        queryClient.invalidateQueries({ queryKey: ["holdings", "mine"] }),
      ])

      await options?.onSuccess?.(...args)
    },
  })

  return {
    ...mutation,
    step,
  }
}
