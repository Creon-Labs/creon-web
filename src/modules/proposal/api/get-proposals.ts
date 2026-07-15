import { useQuery } from "@tanstack/react-query"
import { api, ApiResponse } from "@/shared/lib/api-client"
import { QueryConfig } from "@/shared/lib/react-query/query-config"
import { ProposalWithFundingStats } from "../types"

// --- API function ---

export const getProposals = async () => {
  const res =
    await api.get<ApiResponse<ProposalWithFundingStats[]>>("/proposals")

  return res.data
}

// --- Query options factory ---

export const getProposalsQueryOptions = () => ({
  queryKey: ["proposals"] as const,
  queryFn: () => getProposals(),
})

// --- Hook ---

type UseGetProposalsOptions = {
  config?: QueryConfig<typeof getProposalsQueryOptions>
}

export const useGetProposals = ({ config }: UseGetProposalsOptions = {}) => {
  return useQuery({
    ...getProposalsQueryOptions(),
    ...config,
  })
}
