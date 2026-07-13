import { queryOptions, useQuery } from "@tanstack/react-query"
import { api, ApiResponse } from "@/shared/lib/api-client"
import { QueryConfig } from "@/shared/lib/react-query/query-config"
import { KycProfile } from "../types"

// ---------------------------------------------------------------------------
// API function
// ---------------------------------------------------------------------------

/**
 * `GET /kyc/me`
 *
 * Returns the KYC profile (status + submitted data) of the currently
 * authenticated user.
 *
 * Throws a 404 error when the user has not submitted any KYC data yet —
 * callers should handle this case (e.g. redirect to the KYC form).
 *
 * If the status is `REJECTED`, the `rejectionReason` field will be populated
 * so the UI can display the admin's feedback.
 */
export const getMyKycStatus = async () => {
  const res = await api.get<ApiResponse<KycProfile>>("/kyc/me")
  return res.data
}

// ---------------------------------------------------------------------------
// Query options factory
// ---------------------------------------------------------------------------

export const getMyKycStatusQueryOptions = () =>
  queryOptions({
    queryKey: ["kyc", "me"] as const,
    queryFn: () => getMyKycStatus(),
  })

// ---------------------------------------------------------------------------
// Query hook
// ---------------------------------------------------------------------------

type UseGetMyKycStatusOptions = {
  config?: QueryConfig<typeof getMyKycStatusQueryOptions>
}

export const useGetMyKycStatus = ({
  config,
}: UseGetMyKycStatusOptions = {}) => {
  return useQuery({
    ...getMyKycStatusQueryOptions(),
    ...config,
  })
}
