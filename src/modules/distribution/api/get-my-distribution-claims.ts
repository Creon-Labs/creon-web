import { useQuery, queryOptions } from "@tanstack/react-query"
import { api, type ApiResponse } from "@/shared/lib/api-client"
import { QueryConfig } from "@/shared/lib/react-query/query-config"
import { DistributionClaim } from "../types"

export const getMyDistributionClaims = (): Promise<DistributionClaim[]> => {
  return api
    .get<ApiResponse<DistributionClaim[]>>("/distributions/mine")
    .then((res) => res.data!)
}

export const getMyDistributionClaimsQueryOptions = () =>
  queryOptions({
    queryKey: ["distributions", "mine"],
    queryFn: () => getMyDistributionClaims(),
  })

type UseGetMyDistributionClaimsOptions = {
  config?: QueryConfig<typeof getMyDistributionClaimsQueryOptions>
}

export const useGetMyDistributionClaims = ({
  config,
}: UseGetMyDistributionClaimsOptions = {}) => {
  return useQuery({
    ...getMyDistributionClaimsQueryOptions(),
    ...config,
  })
}
