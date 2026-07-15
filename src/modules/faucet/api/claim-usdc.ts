"use client"

import { useMutation } from "@tanstack/react-query"

import { api, type ApiResponse } from "@/shared/lib/api-client"
import type { MutationConfig } from "@/shared/lib/react-query"
import type { ClaimUsdcInput, ClaimUsdcResponse } from "../types"

export const claimUsdc = (
  input: ClaimUsdcInput
): Promise<ClaimUsdcResponse> => {
  return api
    .post<ApiResponse<ClaimUsdcResponse>>("/faucet/usdc/claim", input, {
      credentials: "omit",
    })
    .then((response) => response.data)
}

type UseClaimUsdcOptions = {
  config?: MutationConfig<typeof claimUsdc>
}

export const useClaimUsdc = ({ config }: UseClaimUsdcOptions = {}) => {
  return useMutation({
    mutationFn: claimUsdc,
    ...config,
  })
}
