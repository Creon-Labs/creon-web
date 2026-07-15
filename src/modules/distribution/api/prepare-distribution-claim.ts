import { api, type ApiResponse } from "@/shared/lib/api-client"
import type {
  PrepareDistributionClaimInput,
  PrepareDistributionClaimResponse,
} from "../types"

export const prepareDistributionClaim = ({
  distributionId,
}: PrepareDistributionClaimInput): Promise<PrepareDistributionClaimResponse> => {
  return api
    .post<ApiResponse<PrepareDistributionClaimResponse>>(
      `/distributions/${distributionId}/claim/prepare`
    )
    .then((res) => res.data)
}
