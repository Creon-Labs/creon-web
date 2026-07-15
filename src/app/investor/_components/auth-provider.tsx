"use client"

import { useAuthMe } from "@/modules/auth"
import { AuthenticationLoading } from "@/shared/components/blocks/authentication-loading"
import { ApiError } from "@/shared/lib/api-client"
import { notFound, useRouter } from "next/navigation"
import { useEffect } from "react"

export function InvestorAuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: auth, error, isLoading } = useAuthMe()
  const router = useRouter()
  const isUnauthorized = error instanceof ApiError && error.statusCode === 401

  useEffect(() => {
    if (isUnauthorized) {
      router.replace("/")
    }
  }, [isUnauthorized, router])

  if (isLoading || isUnauthorized) {
    return <AuthenticationLoading />
  }

  if (!auth?.roles.includes("INVESTOR")) {
    notFound()
  }

  return children
}
