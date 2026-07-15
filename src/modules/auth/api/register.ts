import { api, type ApiResponse } from "@/shared/lib/api-client"
import { MutationConfig } from "@/shared/lib/react-query"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { RegisterPayload } from "../types/register.types"
import { AuthRole } from "../types/login.types"
import { authMeQueryKey } from "./auth-me"

type AuthPrincipalResponse = {
  userId: string
  roles: AuthRole[]
}

export const register = async (data: RegisterPayload) => {
  const res = await api.post<ApiResponse<AuthPrincipalResponse>>(
    "/auth/register",
    data
  )

  return res.data
}

type UseRegisterOptions = {
  config?: MutationConfig<typeof register>
}

export const useRegister = ({ config }: UseRegisterOptions = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...config,
    mutationFn: register,
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: authMeQueryKey })
      config?.onSuccess?.(...args)
    },
  })
}
