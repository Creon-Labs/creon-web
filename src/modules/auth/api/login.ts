import { api, type ApiResponse } from "@/shared/lib/api-client"
import { MutationConfig } from "@/shared/lib/react-query"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AuthRole } from "../types/login.types"
import { authMeQueryKey } from "./auth-me"

type AuthPrincipalResponse = {
  userId: string
  roles: AuthRole[]
}

export type LoginPayload = {
  walletAddress: string
  signature: string
}

export type LoginResponse = ApiResponse<AuthPrincipalResponse>

export const login = async (
  data: LoginPayload
): Promise<AuthPrincipalResponse> => {
  const res = await api.post<LoginResponse>("/auth/login", data)

  return res.data
}

type UseLoginOptions = {
  config?: MutationConfig<typeof login>
}

export const useLogin = ({ config }: UseLoginOptions = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...config,
    mutationFn: login,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: authMeQueryKey })
      config?.onSuccess?.(...args)
    },
  })
}
