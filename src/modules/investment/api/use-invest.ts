"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useStellarWallet } from "@/shared/lib/stellar-wallet"
import type { MutationConfig } from "@/shared/lib/react-query"
import {
  assertCampaignCanAcceptInvestments,
  getCampaignById,
} from "@/modules/campaign"
import {
  assertKycApproved,
  getMyKycStatus,
  isWhitelistSyncError,
  WHITELIST_SYNC_MESSAGE,
} from "@/modules/kyc"
import { prepareInvestment } from "./prepare-investment"
import { submitInvestment } from "./submit-investment"
import { PrepareInvestmentInput, Investment } from "../types"

type InvestMutationFn = (input: PrepareInvestmentInput) => Promise<Investment>

export type UseInvestOptions = {
  config?: MutationConfig<InvestMutationFn>
}

export const useInvest = ({ config }: UseInvestOptions = {}) => {
  const { signTransaction } = useStellarWallet()
  const queryClient = useQueryClient()
  const [step, setStep] = useState<
    "IDLE" | "PREPARING" | "SIGNING" | "SUBMITTING"
  >("IDLE")

  const mutation = useMutation<Investment, Error, PrepareInvestmentInput>({
    ...config,
    mutationFn: async ({ campaignId, amount }) => {
      try {
        setStep("PREPARING")
        const [kycProfile, campaign] = await Promise.all([
          getMyKycStatus(),
          getCampaignById({ id: campaignId }),
        ])
        assertKycApproved(kycProfile)
        assertCampaignCanAcceptInvestments(campaign)
        const prepareRes = await prepareInvestment({ campaignId, amount })

        setStep("SIGNING")
        // Sign the exact XDR returned by the backend without modifying it.
        const { signedTxXdr } = await signTransaction(prepareRes.xdr)

        setStep("SUBMITTING")
        const submitRes = await submitInvestment({
          campaignId,
          signedXdr: signedTxXdr,
        })

        if (submitRes.status === "CONFIRMED") {
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: ["campaigns"] }),
            queryClient.invalidateQueries({
              queryKey: ["investments", "mine"],
            }),
            queryClient.invalidateQueries({ queryKey: ["holdings", "mine"] }),
          ])
        }

        return submitRes
      } catch (error) {
        if (isWhitelistSyncError(error)) {
          const syncError = new Error(WHITELIST_SYNC_MESSAGE, { cause: error })
          syncError.name = "InvestmentWhitelistSyncError"
          throw syncError
        }
        throw error
      } finally {
        setStep("IDLE")
      }
    },
  })

  return {
    ...mutation,
    step,
  }
}
