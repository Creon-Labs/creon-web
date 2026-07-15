import { queryOptions, useQuery } from "@tanstack/react-query"

import { api, type ApiResponse } from "@/shared/lib/api-client"
import { QueryConfig } from "@/shared/lib/react-query"

import { AdminKycItem, KycStatus } from "../types"

// -------------------------
// API function
// -------------------------

export type GetAdminKycListInput = {
  status?: KycStatus
}

export const getAdminKycList = async ({
  status,
}: GetAdminKycListInput = {}): Promise<AdminKycItem[]> => {
  return api
    .get<ApiResponse<AdminKycItem[]>>("/admin/kyc", {
      params: { status },
    })
    .then((res) => res.data)
}

// -------------------------
// Query options + hook
// -------------------------

export const getAdminKycListQueryOptions = (input: GetAdminKycListInput = {}) =>
  queryOptions({
    queryKey: ["admin", "kyc", input.status ?? "PENDING"],
    queryFn: () => getAdminKycList(input),
  })

type UseGetAdminKycListOptions = GetAdminKycListInput & {
  config?: QueryConfig<typeof getAdminKycListQueryOptions>
}

export const useGetAdminKycList = ({
  status,
  config,
}: UseGetAdminKycListOptions = {}) => {
  return useQuery({
    ...getAdminKycListQueryOptions({ status }),
    ...config,
  })
}
