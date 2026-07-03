"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import * as React from "react"
import { queryConfig } from "./query-config"

type ReactQueryProviderProps = {
  children: React.ReactNode
}

export const ReactQueryProvider = ({ children }: ReactQueryProviderProps) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      })
  )

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
