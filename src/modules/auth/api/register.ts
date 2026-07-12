import { api, type ApiResponse } from "@/shared/lib/api-client"
import { MutationConfig } from "@/shared/lib/react-query"
import { useMutation } from "@tanstack/react-query"

import { RegisterPayload } from "../types/register.types"
import { AuthRole } from "../types/login.types"

type AuthPrincipalResponse = {
  userId: string
  roles: AuthRole[]
}

export type RegisterResponse = ApiResponse<AuthPrincipalResponse>

export const register = async (
  data: RegisterPayload
): Promise<RegisterResponse> => {
  try {
    const res = await api.post<RegisterResponse>("/auth/register", data)

    return res
  } catch (error) {
    throw error
  }
}

type UseRegisterOptions = {
  config?: MutationConfig<typeof register>
}

export const useRegister = ({ config }: UseRegisterOptions = {}) => {
  return useMutation({
    mutationFn: register,
    ...config,
  })
}
