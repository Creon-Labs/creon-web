"use client"

import { MutationConfig } from "@/shared/lib/react-query"
import { WalletContext } from "@/shared/lib/stellar-wallet"
import { useMutation } from "@tanstack/react-query"
import { useContext } from "react"
import { logout } from "./api-function"

type UseLogoutOptions = {
  config?: MutationConfig<typeof logout>
}

export const useLogout = ({ config }: UseLogoutOptions = {}) => {
  const ctx = useContext(WalletContext)
  return useMutation({
    ...config,
    mutationFn: () => logout(),
    onSettled: async (...args) => {
      if (ctx) {
        await ctx.disconnect()
      }
      window.location.href = "/"
      config?.onSettled?.(...args)
    },
  })
}
