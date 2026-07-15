"use client"

import { useMutation } from "@tanstack/react-query"

import { api, type ApiResponse } from "@/shared/lib/api-client"
import type { MutationConfig } from "@/shared/lib/react-query"
import type {
  SubmitUsdcTrustlineInput,
  SubmitUsdcTrustlineResponse,
} from "../types"

export const submitUsdcTrustline = (
  input: SubmitUsdcTrustlineInput
): Promise<SubmitUsdcTrustlineResponse> => {
  return api
    .post<ApiResponse<SubmitUsdcTrustlineResponse>>(
      "/faucet/usdc/trustline/submit",
      input,
      { credentials: "omit" }
    )
    .then((response) => response.data)
}

type UseSubmitUsdcTrustlineOptions = {
  config?: MutationConfig<typeof submitUsdcTrustline>
}

export const useSubmitUsdcTrustline = ({
  config,
}: UseSubmitUsdcTrustlineOptions = {}) => {
  return useMutation({
    mutationFn: submitUsdcTrustline,
    ...config,
  })
}
