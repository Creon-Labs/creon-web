import { useQuery, queryOptions } from "@tanstack/react-query"
import { api, type ApiResponse } from "@/shared/lib/api-client"
import { QueryConfig } from "@/shared/lib/react-query/query-config"
import { Refund } from "../types"

export type GetCampaignRefundInput = {
  campaignId: string
}

export const getCampaignRefund = ({
  campaignId,
}: GetCampaignRefundInput): Promise<Refund | null> => {
  return api
    .get<ApiResponse<Refund | null>>(`/campaigns/${campaignId}/refund`)
    .then((res) => res.data)
}

export const getCampaignRefundQueryOptions = ({
  campaignId,
}: GetCampaignRefundInput) =>
  queryOptions({
    queryKey: ["campaigns", campaignId, "refund"],
    queryFn: () => getCampaignRefund({ campaignId }),
  })

type UseGetCampaignRefundOptions = GetCampaignRefundInput & {
  config?: QueryConfig<typeof getCampaignRefundQueryOptions>
}

export const useGetCampaignRefund = ({
  campaignId,
  config,
}: UseGetCampaignRefundOptions) => {
  return useQuery({
    ...getCampaignRefundQueryOptions({ campaignId }),
    refetchInterval: (query) =>
      query.state.data?.status === "PENDING" ? 5_000 : false,
    ...config,
  })
}
