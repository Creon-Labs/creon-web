import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api, ApiResponse } from "@/shared/lib/api-client"
import { MutationConfig } from "@/shared/lib/react-query/query-config"
import { Proposal } from "../types"

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
      // Update detail cache — status is now SUBMITTED, no edit allowed
      queryClient.setQueryData(["proposals", data.id], data)
      // Invalidate list so status badge updates
      queryClient.invalidateQueries({ queryKey: ["proposals"] })
    },
    ...config,
  })
}
