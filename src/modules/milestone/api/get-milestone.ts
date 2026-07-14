import { useQuery } from "@tanstack/react-query"
import { api, ApiResponse } from "@/shared/lib/api-client"
import { QueryConfig } from "@/shared/lib/react-query"
import { MilestoneDetail } from "../types"

export type GetMilestoneInput = {
  milestoneId: string
}

export const getMilestone = ({
  milestoneId,
}: GetMilestoneInput): Promise<MilestoneDetail> => {
  return api
    .get<ApiResponse<MilestoneDetail>>(`/milestones/${milestoneId}`)
    .then((res) => res.data!)
}

export const getMilestoneQueryOptions = ({
  milestoneId,
}: GetMilestoneInput) => ({
  queryKey: ["milestone", milestoneId],
  queryFn: () => getMilestone({ milestoneId }),
})

type UseGetMilestoneOptions = GetMilestoneInput & {
  config?: QueryConfig<typeof getMilestoneQueryOptions>
}

export const useGetMilestone = ({
  milestoneId,
  config,
}: UseGetMilestoneOptions) => {
  return useQuery({
    ...getMilestoneQueryOptions({ milestoneId }),
    ...config,
  })
}
