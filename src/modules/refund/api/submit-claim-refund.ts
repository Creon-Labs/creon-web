import { api, type ApiResponse } from "@/shared/lib/api-client"
import { RefundClaim, SubmitRefundClaimInput } from "../types"

export const submitClaimRefund = ({
  refundId,
  signedXdr,
}: SubmitRefundClaimInput): Promise<RefundClaim> => {
  return api
    .post<ApiResponse<RefundClaim>>(`/refunds/${refundId}/claim`, {
      signedXdr,
    })
    .then((res) => res.data!)
}
