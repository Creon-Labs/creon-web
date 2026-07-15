import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api, ApiResponse } from "@/shared/lib/api-client"
import { MutationConfig } from "@/shared/lib/react-query/query-config"
import { Proposal, ProposalWithFundingStats } from "../types"

// --- API function ---

export type SubmitProposalInput = {
  id: string
}

export const submitProposal = async ({ id }: SubmitProposalInput) => {
  const res = await api.post<ApiResponse<Proposal>>(`/proposals/${id}/submit`)

  return res.data
}

// --- Hook ---

type UseSubmitProposalOptions = {
  config?: MutationConfig<typeof submitProposal>
}

export const useSubmitProposal = ({
  config,
}: UseSubmitProposalOptions = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: submitProposal,
    onSuccess: (data) => {
      // Preserve read-only funding statistics, which write endpoints do not return.
      queryClient.setQueryData<ProposalWithFundingStats | undefined>(
        ["proposals", data.id],
        (current) => (current ? { ...current, ...data } : current)
      )
      // Invalidate list so status badge updates
      queryClient.invalidateQueries({ queryKey: ["proposals"] })
    },
    ...config,
  })
}
