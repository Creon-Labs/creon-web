import { api, type ApiResponse } from "@/shared/lib/api-client"
import { PrepareInvestmentInput, PrepareInvestmentResponse } from "../types"

export const prepareInvestment = ({
  campaignId,
  amount,
}: PrepareInvestmentInput): Promise<PrepareInvestmentResponse> => {
  return api
    .post<ApiResponse<PrepareInvestmentResponse>>(
      `/campaigns/${campaignId}/investments/prepare`,
      { amount }
    )
    .then((res) => res.data!)
}
