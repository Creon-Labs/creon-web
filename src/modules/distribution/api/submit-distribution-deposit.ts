import { useMutation } from "@tanstack/react-query"
import { api, type ApiResponse } from "@/shared/lib/api-client"
import { MutationConfig } from "@/shared/lib/react-query"
import { SubmitSignedTxRequest, ProfitDistribution } from "../types"

export type SubmitDistributionDepositInput = {
  campaignId: string
  data: SubmitSignedTxRequest
}

export const submitDistributionDeposit = ({
  campaignId,
  data,
}: SubmitDistributionDepositInput): Promise<ProfitDistribution> => {
  return api
    .post<ApiResponse<ProfitDistribution>>(
      `/campaigns/${campaignId}/distributions/deposit`,
      data
    )
    .then((res) => res.data as ProfitDistribution)
}

type UseSubmitDistributionDepositOptions = {
  config?: MutationConfig<typeof submitDistributionDeposit>
}

export const useSubmitDistributionDeposit = ({
  config,
}: UseSubmitDistributionDepositOptions = {}) => {
  return useMutation({
    mutationFn: submitDistributionDeposit,
    ...config,
  })
}
