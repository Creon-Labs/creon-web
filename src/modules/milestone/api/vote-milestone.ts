import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api, type ApiResponse } from "@/shared/lib/api-client"
import type { MutationConfig } from "@/shared/lib/react-query"
import type { MilestoneVote, VoteChoice } from "../types"

export type VoteMilestoneInput = {
  milestoneId: string
  choice: VoteChoice
}

export const voteMilestone = ({
  milestoneId,
  choice,
}: VoteMilestoneInput): Promise<MilestoneVote> => {
  return api
    .post<ApiResponse<MilestoneVote>>(`/milestones/${milestoneId}/vote`, {
      choice,
    })
    .then((response) => response.data)
}

type UseVoteMilestoneOptions = {
  config?: MutationConfig<typeof voteMilestone>
}

export const useVoteMilestone = ({ config }: UseVoteMilestoneOptions = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...config,
    mutationFn: voteMilestone,
    onSuccess: async (...args) => {
      const [vote] = args

      await queryClient.invalidateQueries({
        queryKey: ["milestone", vote.milestoneId],
      })

      await config?.onSuccess?.(...args)
    },
  })
}
