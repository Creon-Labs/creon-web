import { useQuery } from "@tanstack/react-query"
import { api, ApiResponse } from "@/shared/lib/api-client"
import { QueryConfig } from "@/shared/lib/react-query"
import { Milestone } from "../types"

export type GetCampaignMilestonesInput = {
  campaignId: string
}

export const getCampaignMilestones = ({
  campaignId,
}: GetCampaignMilestonesInput): Promise<Milestone[]> => {
  return api
    .get<ApiResponse<Milestone[]>>("/milestones", {
      params: { campaignId },
    })
    .then((res) => res.data)
}

export const getCampaignMilestonesQueryOptions = ({
  campaignId,
}: GetCampaignMilestonesInput) => ({
  queryKey: ["milestones", campaignId],
  queryFn: () => getCampaignMilestones({ campaignId }),
})

type UseGetCampaignMilestonesOptions = GetCampaignMilestonesInput & {
  config?: QueryConfig<typeof getCampaignMilestonesQueryOptions>
}

export const useGetCampaignMilestones = ({
  campaignId,
  config,
}: UseGetCampaignMilestonesOptions) => {
  return useQuery({
    ...getCampaignMilestonesQueryOptions({ campaignId }),
    ...config,
  })
}
