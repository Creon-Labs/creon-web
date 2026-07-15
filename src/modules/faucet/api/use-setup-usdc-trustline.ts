"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"

import type { MutationConfig } from "@/shared/lib/react-query"
import { useStellarWallet } from "@/shared/lib/stellar-wallet"
import type {
  FaucetTrustlineResult,
  FaucetTrustlineStep,
  PrepareUsdcTrustlineInput,
} from "../types"
import { relayFaucetTrustline } from "../utils/relay-faucet-trustline"
import { prepareUsdcTrustline } from "./prepare-usdc-trustline"
import { submitUsdcTrustline } from "./submit-usdc-trustline"

type SetupUsdcTrustlineMutation = (
  input: PrepareUsdcTrustlineInput
) => Promise<FaucetTrustlineResult>

type UseSetupUsdcTrustlineOptions = {
  config?: MutationConfig<SetupUsdcTrustlineMutation>
}

export const useSetupUsdcTrustline = ({
  config,
}: UseSetupUsdcTrustlineOptions = {}) => {
  const { signTransaction } = useStellarWallet()
  const [step, setStep] = useState<FaucetTrustlineStep>("IDLE")

  const mutation = useMutation({
    mutationFn: (input: PrepareUsdcTrustlineInput) =>
      relayFaucetTrustline(input, {
        prepare: prepareUsdcTrustline,
        sign: signTransaction,
        submit: submitUsdcTrustline,
        onStep: setStep,
      }),
    ...config,
    onSettled: async (...args) => {
      setStep("IDLE")
      await config?.onSettled?.(...args)
    },
  })

  return { ...mutation, step }
}
