import { useMutation } from "@tanstack/react-query"
import { api, type ApiResponse } from "@/shared/lib/api-client"
import { MutationConfig } from "@/shared/lib/react-query"
import { DepositProfitRequest, PrepareDepositResponse } from "../types"

export type PrepareDistributionDepositInput = {
  campaignId: string
  data: DepositProfitRequest
}

export const prepareDistributionDeposit = ({
  campaignId,
  data,
}: PrepareDistributionDepositInput): Promise<PrepareDepositResponse> => {
  return api
    .post<ApiResponse<PrepareDepositResponse>>(
      `/campaigns/${campaignId}/distributions/deposit/prepare`,
      data
    )
    .then((res) => res.data as PrepareDepositResponse)
}

type UsePrepareDistributionDepositOptions = {
  config?: MutationConfig<typeof prepareDistributionDeposit>
}

export const usePrepareDistributionDeposit = ({
  config,
}: UsePrepareDistributionDepositOptions = {}) => {
  return useMutation({
    mutationFn: prepareDistributionDeposit,
    ...config,
  })
}
