import { useQuery, queryOptions } from "@tanstack/react-query"
import { api, type ApiResponse } from "@/shared/lib/api-client"
import { QueryConfig } from "@/shared/lib/react-query/query-config"
import { Investment } from "../types"

export const getMyInvestments = (): Promise<Investment[]> => {
  return api.get<ApiResponse<Investment[]>>("/investments/mine").then((res) => res.data!)
}

export const getMyInvestmentsQueryOptions = () =>
  queryOptions({
    queryKey: ["investments", "mine"],
    queryFn: () => getMyInvestments(),
  })

type UseGetMyInvestmentsOptions = {
  config?: QueryConfig<typeof getMyInvestmentsQueryOptions>
}

export const useGetMyInvestments = ({
  config,
}: UseGetMyInvestmentsOptions = {}) => {
  return useQuery({
    ...getMyInvestmentsQueryOptions(),
    ...config,
  })
}
