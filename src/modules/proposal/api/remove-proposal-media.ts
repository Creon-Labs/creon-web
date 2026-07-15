import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api, ApiResponse } from "@/shared/lib/api-client"
import { MutationConfig } from "@/shared/lib/react-query/query-config"
import { Proposal, ProposalWithFundingStats } from "../types"

// --- API function ---

export type RemoveProposalMediaInput = {
  id: string
  mediaId: string
}

export const removeProposalMedia = async ({
  id,
  mediaId,
}: RemoveProposalMediaInput) => {
  const res = await api.delete<ApiResponse<Proposal>>(
    `/proposals/${id}/media/${mediaId}`
  )
  return res.data
}

// --- Hook ---

type UseRemoveProposalMediaOptions = {
  config?: MutationConfig<typeof removeProposalMedia>
}

export const useRemoveProposalMedia = ({
  config,
}: UseRemoveProposalMediaOptions = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: removeProposalMedia,
    onSuccess: (data, { id }) => {
      // Preserve read-only funding statistics, which write endpoints do not return.
      queryClient.setQueryData<ProposalWithFundingStats | undefined>(
        ["proposals", id],
        (current) => (current ? { ...current, ...data } : current)
      )
      // Also invalidate the list
      queryClient.invalidateQueries({ queryKey: ["proposals"] })
    },
    ...config,
  })
}
