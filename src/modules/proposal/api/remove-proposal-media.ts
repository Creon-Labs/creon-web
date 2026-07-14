import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api, ApiResponse } from "@/shared/lib/api-client"
import { MutationConfig } from "@/shared/lib/react-query/query-config"
import { Proposal } from "../types"

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
  return res.data!
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
      // Update the specific proposal in cache
      queryClient.setQueryData(["proposals", id], data)
      // Also invalidate the list
      queryClient.invalidateQueries({ queryKey: ["proposals"] })
    },
    ...config,
  })
}
