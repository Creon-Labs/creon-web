import { useState } from "react"
import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import { useStellarWallet } from "@/shared/lib/stellar-wallet"
import { prepareInvestment } from "./prepare-investment"
import { submitInvestment } from "./submit-investment"
import { PrepareInvestmentInput, Investment } from "../types"

export type UseInvestOptions = Omit<
  UseMutationOptions<Investment, Error, PrepareInvestmentInput>,
  "mutationFn"
>

export const useInvest = (options?: UseInvestOptions) => {
  const { signTransaction } = useStellarWallet()
  const [step, setStep] = useState<
    "IDLE" | "PREPARING" | "SIGNING" | "SUBMITTING"
  >("IDLE")

  const mutation = useMutation<Investment, Error, PrepareInvestmentInput>({
    mutationFn: async ({ campaignId, amount }) => {
      try {
        setStep("PREPARING")
        const prepareRes = await prepareInvestment({ campaignId, amount })

        setStep("SIGNING")
        // signTransaction prompts the wallet and returns the signed XDR
        const { signedTxXdr } = await signTransaction(prepareRes.xdr)

        setStep("SUBMITTING")
        const submitRes = await submitInvestment({
          campaignId,
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
