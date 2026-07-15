import { api, type ApiResponse } from "@/shared/lib/api-client"
import { Investment, SubmitInvestmentInput } from "../types"

export const submitInvestment = ({
  campaignId,
  signedXdr,
}: SubmitInvestmentInput): Promise<Investment> => {
  return api
    .post<ApiResponse<Investment>>(`/campaigns/${campaignId}/investments`, {
      signedXdr,
    })
    .then((res) => res.data)
}
