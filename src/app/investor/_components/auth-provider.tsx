"use client"

import { useAuthMe } from "@/modules/auth"
import { AuthenticationLoading } from "@/shared/components/blocks/authentication-loading"
import { notFound } from "next/navigation"

export function InvestorAuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: auth, isLoading } = useAuthMe()

  if (isLoading) {
    return <AuthenticationLoading />
  }

  if (!auth?.roles.includes("INVESTOR")) {
    notFound()
  }

  return children
}
