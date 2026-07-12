import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api, ApiResponse } from "@/shared/lib/api-client"
import { MutationConfig } from "@/shared/lib/react-query/query-config"
import { Proposal, UpdateProposalInput } from "../types"

// --- API function ---

export type UpdateProposalParams = {
  id: string
} & UpdateProposalInput

export const updateProposal = async ({ id, ...data }: UpdateProposalParams) => {
  const res = await api.patch<ApiResponse<Proposal>>(`/proposals/${id}`, data)
  return res.data!
}

// --- Hook ---

type UseUpdateProposalOptions = {
  config?: MutationConfig<typeof updateProposal>
}

export const useUpdateProposal = ({
  config,
}: UseUpdateProposalOptions = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateProposal,
    onSuccess: (data) => {
      // Update the specific proposal in cache to avoid a refetch
      queryClient.setQueryData(["proposals", data.id], data)
      // Also invalidate the list so the summary card reflects changes
      queryClient.invalidateQueries({ queryKey: ["proposals"] })
    },
    ...config,
  })
}
