import { useQuery, queryOptions } from "@tanstack/react-query"
import { api, type ApiResponse } from "@/shared/lib/api-client"
import { QueryConfig } from "@/shared/lib/react-query/query-config"
import { Holding } from "../types"

export const getMyHoldings = (): Promise<Holding[]> => {
  return api
    .get<ApiResponse<Holding[]>>("/holdings/mine")
    .then((res) => res.data!)
}

export const getMyHoldingsQueryOptions = () =>
  queryOptions({
    queryKey: ["holdings", "mine"],
    queryFn: () => getMyHoldings(),
  })

type UseGetMyHoldingsOptions = {
  config?: QueryConfig<typeof getMyHoldingsQueryOptions>
}

export const useGetMyHoldings = ({ config }: UseGetMyHoldingsOptions = {}) => {
  return useQuery({
    ...getMyHoldingsQueryOptions(),
    ...config,
  })
}
