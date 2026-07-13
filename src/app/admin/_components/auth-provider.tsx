"use client"

import { useAuthMe } from "@/modules/auth"
import { AuthenticationLoading } from "@/shared/components/blocks/authentication-loading"
import { notFound } from "next/navigation"

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const { data: auth, isLoading } = useAuthMe({ config: { retry: false } })

  if (isLoading) {
    return <AuthenticationLoading />
  }

  if (!auth?.roles.includes("ADMIN")) {
    notFound()
  }

  return children
}
