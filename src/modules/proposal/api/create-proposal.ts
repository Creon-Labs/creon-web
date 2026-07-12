import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api, ApiResponse } from "@/shared/lib/api-client"
import { MutationConfig } from "@/shared/lib/react-query/query-config"
import { Proposal, CreateProposalInput } from "../types"

// --- API function ---

export const createProposal = async (data: CreateProposalInput) => {
  const res = await api.post<ApiResponse<Proposal>>("/proposals", data)
  return res.data
}

// --- Hook ---

type UseCreateProposalOptions = {
  config?: MutationConfig<typeof createProposal>
}

export const useCreateProposal = ({
  config,
}: UseCreateProposalOptions = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProposal,
    onSuccess: () => {
      // Invalidate proposals list so it refetches after a new one is created
      queryClient.invalidateQueries({ queryKey: ["proposals"] })
    },
    ...config,
  })
}
