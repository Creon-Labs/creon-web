"use client"

import { QueryConfig } from "@/shared/lib/react-query"
import { queryOptions, useQuery } from "@tanstack/react-query"
import { authMe } from "./api-function"

export const authMeQueryKey = ["auth", "me"] as const

export const authMeQueryOptions = () =>
  queryOptions({
    queryKey: authMeQueryKey,
    queryFn: authMe,
    staleTime: Infinity,
    retry: false,
  })

type UseGetAuthMeOptions = {
  config?: QueryConfig<typeof authMeQueryOptions>
}

export const useAuthMe = ({ config }: UseGetAuthMeOptions = {}) => {
  return useQuery({
    ...config,
    ...authMeQueryOptions(),
  })
}
