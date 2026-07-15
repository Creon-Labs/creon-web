"use client"

import { MutationConfig } from "@/shared/lib/react-query"
import { WalletContext } from "@/shared/lib/stellar-wallet"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useContext } from "react"
import { authMeQueryKey } from "../auth-me"
import { logout } from "./api-function"

type UseLogoutOptions = {
  config?: MutationConfig<typeof logout>
}

export const useLogout = ({ config }: UseLogoutOptions = {}) => {
  const ctx = useContext(WalletContext)
  const queryClient = useQueryClient()

  return useMutation({
    ...config,
    mutationFn: () => logout(),
    onSuccess: async (...args) => {
      queryClient.removeQueries({ queryKey: authMeQueryKey })
      await config?.onSuccess?.(...args)
    },
    onSettled: async (...args) => {
      if (ctx) {
        await ctx.disconnect()
      }
      await config?.onSettled?.(...args)
      window.location.assign("/")
    },
  })
}
