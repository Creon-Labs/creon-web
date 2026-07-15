import { api, type ApiResponse } from "@/shared/lib/api-client"
import type { DistributionClaim, SubmitDistributionClaimInput } from "../types"

export const submitDistributionClaim = ({
  distributionId,
  signedXdr,
}: SubmitDistributionClaimInput): Promise<DistributionClaim> => {
  return api
    .post<ApiResponse<DistributionClaim>>(
      `/distributions/${distributionId}/claim`,
      { signedXdr }
    )
    .then((res) => res.data)
}
