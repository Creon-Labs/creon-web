import { useQuery, queryOptions } from "@tanstack/react-query"
import { api, type ApiResponse } from "@/shared/lib/api-client"
import { QueryConfig } from "@/shared/lib/react-query"
import { Campaign } from "../types"

export type GetCampaignByIdInput = {
  id: string
}

export const getCampaignById = ({
  id,
}: GetCampaignByIdInput): Promise<Campaign> => {
  return api
    .get<ApiResponse<Campaign>>(`/campaigns/${id}`)
    .then((res) => res.data!)
}

export const getCampaignByIdQueryOptions = ({ id }: GetCampaignByIdInput) =>
  queryOptions({
    queryKey: ["campaigns", id],
    queryFn: () => getCampaignById({ id }),
  })

type UseGetCampaignByIdOptions = GetCampaignByIdInput & {
  config?: QueryConfig<typeof getCampaignByIdQueryOptions>
}

export const useGetCampaignById = ({
  id,
  config,
}: UseGetCampaignByIdOptions) => {
  return useQuery({
    ...getCampaignByIdQueryOptions({ id }),
    ...config,
  })
}
