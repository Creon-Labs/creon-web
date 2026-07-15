import { queryOptions, useQuery } from "@tanstack/react-query"
import { api, ApiResponse } from "@/shared/lib/api-client"
import { QueryConfig } from "@/shared/lib/react-query/query-config"
import { ProposalWithFundingStats } from "../types"

// --- API function ---

export type GetProposalByIdInput = {
  id: string
}

export const getProposalById = async ({ id }: GetProposalByIdInput) => {
  const res = await api.get<ApiResponse<ProposalWithFundingStats>>(
    `/proposals/${id}`
  )

  return res.data
}

// --- Query options factory ---

export const getProposalByIdQueryOptions = ({ id }: GetProposalByIdInput) =>
  queryOptions({
    queryKey: ["proposals", id] as const,
    queryFn: () => getProposalById({ id }),
  })

// --- Hook ---

type UseGetProposalByIdOptions = GetProposalByIdInput & {
  config?: QueryConfig<typeof getProposalByIdQueryOptions>
}

export const useGetProposalById = ({
  id,
  config,
}: UseGetProposalByIdOptions) => {
  return useQuery({
    ...getProposalByIdQueryOptions({ id }),
    ...config,
  })
}
