"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { assertKycApproved, getMyKycStatus } from "@/modules/kyc"
import type { MutationConfig } from "@/shared/lib/react-query"
import { useStellarWallet } from "@/shared/lib/stellar-wallet"
import type { DistributionClaim, PrepareDistributionClaimInput } from "../types"
import {
  relayDistributionClaim,
  type DistributionClaimStep,
} from "../utils/relay-distribution-claim"
import { prepareDistributionClaim } from "./prepare-distribution-claim"
import { submitDistributionClaim } from "./submit-distribution-claim"

type ClaimDistributionMutationFn = (
  input: PrepareDistributionClaimInput
) => Promise<DistributionClaim>

type UseClaimDistributionOptions = {
  config?: MutationConfig<ClaimDistributionMutationFn>
}

export const useClaimDistribution = ({
  config,
}: UseClaimDistributionOptions = {}) => {
  const { signTransaction } = useStellarWallet()
  const queryClient = useQueryClient()
  const [step, setStep] = useState<DistributionClaimStep>("IDLE")

  return {
    ...useMutation({
      ...config,
      mutationFn: async ({ distributionId }: PrepareDistributionClaimInput) => {
        try {
          const kycProfile = await getMyKycStatus()
          assertKycApproved(kycProfile)

          return await relayDistributionClaim(
            { distributionId },
            {
              prepare: prepareDistributionClaim,
              sign: signTransaction,
              submit: submitDistributionClaim,
              onStep: setStep,
            }
          )
        } finally {
          setStep("IDLE")
        }
      },
      onSuccess: async (...args) => {
        const [claim] = args

        queryClient.setQueryData<DistributionClaim[]>(
          ["distributions", "mine"],
          (currentClaims) =>
            currentClaims?.map((currentClaim) =>
              currentClaim.distributionId === claim.distributionId
                ? claim
                : currentClaim
            )
        )
        await queryClient.invalidateQueries({
          queryKey: ["distributions", "mine"],
        })
        await config?.onSuccess?.(...args)
      },
    }),
    step,
  }
}
