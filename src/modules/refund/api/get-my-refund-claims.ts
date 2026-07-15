import { useQuery, queryOptions } from "@tanstack/react-query"
import { api, type ApiResponse } from "@/shared/lib/api-client"
import { QueryConfig } from "@/shared/lib/react-query/query-config"
import { RefundClaim } from "../types"

export const getMyRefundClaims = (): Promise<RefundClaim[]> => {
  return api
    .get<ApiResponse<RefundClaim[]>>("/refunds/mine")
    .then((res) => res.data)
}

export const getMyRefundClaimsQueryOptions = () =>
  queryOptions({
    queryKey: ["refunds", "mine"],
    queryFn: () => getMyRefundClaims(),
  })

type UseGetMyRefundClaimsOptions = {
  config?: QueryConfig<typeof getMyRefundClaimsQueryOptions>
}

export const useGetMyRefundClaims = ({
  config,
}: UseGetMyRefundClaimsOptions = {}) => {
  return useQuery({
    ...getMyRefundClaimsQueryOptions(),
    ...config,
  })
}
