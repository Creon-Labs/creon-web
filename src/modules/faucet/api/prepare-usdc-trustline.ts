"use client"

import { useMutation } from "@tanstack/react-query"

import { api, type ApiResponse } from "@/shared/lib/api-client"
import type { MutationConfig } from "@/shared/lib/react-query"
import type {
  PrepareUsdcTrustlineInput,
  PrepareUsdcTrustlineResponse,
} from "../types"

export const prepareUsdcTrustline = (
  input: PrepareUsdcTrustlineInput
): Promise<PrepareUsdcTrustlineResponse> => {
  return api
    .post<ApiResponse<PrepareUsdcTrustlineResponse>>(
      "/faucet/usdc/trustline/prepare",
      input,
      { credentials: "omit" }
    )
    .then((response) => response.data)
}

type UsePrepareUsdcTrustlineOptions = {
  config?: MutationConfig<typeof prepareUsdcTrustline>
}

export const usePrepareUsdcTrustline = ({
  config,
}: UsePrepareUsdcTrustlineOptions = {}) => {
  return useMutation({
    mutationFn: prepareUsdcTrustline,
    ...config,
  })
}
