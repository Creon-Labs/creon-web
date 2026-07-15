import { queryOptions, useQuery } from "@tanstack/react-query"

import { api, type ApiResponse } from "@/shared/lib/api-client"
import { QueryConfig } from "@/shared/lib/react-query"

import { AdminProposalItem, ProposalStatus } from "../types"

// -------------------------
// API function
// -------------------------

export type GetAdminProposalListInput = {
  status?: ProposalStatus
}

export const getAdminProposalList = async ({
  status,
}: GetAdminProposalListInput = {}): Promise<AdminProposalItem[]> => {
  return api
    .get<ApiResponse<AdminProposalItem[]>>("/admin/proposals", {
      params: { status },
    })
    .then((res) => res.data)
}

// -------------------------
// Query options + hook
// -------------------------

export const getAdminProposalListQueryOptions = (
  input: GetAdminProposalListInput = {}
) =>
  queryOptions({
    queryKey: ["admin", "proposals", input.status ?? "SUBMITTED"],
    queryFn: () => getAdminProposalList(input),
  })

type UseGetAdminProposalListOptions = GetAdminProposalListInput & {
  config?: QueryConfig<typeof getAdminProposalListQueryOptions>
}

export const useGetAdminProposalList = ({
  status,
  config,
}: UseGetAdminProposalListOptions = {}) => {
  return useQuery({
    ...getAdminProposalListQueryOptions({ status }),
    ...config,
  })
}
