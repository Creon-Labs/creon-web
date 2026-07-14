import { useQuery, queryOptions } from "@tanstack/react-query"
import { api, type ApiResponse } from "@/shared/lib/api-client"
import { QueryConfig } from "@/shared/lib/react-query"
import { ProfitDistribution } from "../types"

export type GetCampaignDistributionsInput = {
  campaignId: string
}

export const getCampaignDistributions = ({
  campaignId,
}: GetCampaignDistributionsInput): Promise<ProfitDistribution[]> => {
  return api
    .get<ApiResponse<ProfitDistribution[]>>(
      `/campaigns/${campaignId}/distributions`
    )
    .then((res) => res.data as ProfitDistribution[])
}

export const getCampaignDistributionsQueryOptions = ({
  campaignId,
}: GetCampaignDistributionsInput) =>
  queryOptions({
    queryKey: ["campaigns", campaignId, "distributions"],
    queryFn: () => getCampaignDistributions({ campaignId }),
  })

type UseGetCampaignDistributionsOptions = GetCampaignDistributionsInput & {
  config?: QueryConfig<typeof getCampaignDistributionsQueryOptions>
}

export const useGetCampaignDistributions = ({
  campaignId,
  config,
}: UseGetCampaignDistributionsOptions) => {
  return useQuery({
    ...getCampaignDistributionsQueryOptions({ campaignId }),
    ...config,
  })
}
