import { api, type ApiResponse } from "@/shared/lib/api-client"
import { PrepareRefundClaimInput, PrepareRefundClaimResponse } from "../types"

export const prepareClaimRefund = ({
  refundId,
}: PrepareRefundClaimInput): Promise<PrepareRefundClaimResponse> => {
  return api
    .post<ApiResponse<PrepareRefundClaimResponse>>(
      `/refunds/${refundId}/claim/prepare`
    )
    .then((res) => res.data!)
}
