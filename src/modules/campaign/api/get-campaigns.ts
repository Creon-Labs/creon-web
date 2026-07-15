import { useQuery, queryOptions } from "@tanstack/react-query"
import { api, type ApiResponse } from "@/shared/lib/api-client"
import { QueryConfig } from "@/shared/lib/react-query"
import { Campaign } from "../types"

export const getCampaigns = (): Promise<Campaign[]> => {
  return api.get<ApiResponse<Campaign[]>>(`/campaigns`).then((res) => res.data)
}

export const getCampaignsQueryOptions = () =>
  queryOptions({
    queryKey: ["campaigns"],
    queryFn: () => getCampaigns(),
  })

type UseGetCampaignsOptions = {
  config?: QueryConfig<typeof getCampaignsQueryOptions>
}

export const useGetCampaigns = ({ config }: UseGetCampaignsOptions = {}) => {
  return useQuery({
    ...getCampaignsQueryOptions(),
    ...config,
  })
}
