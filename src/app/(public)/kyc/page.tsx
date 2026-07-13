"use client"
import Image from "next/image"
import Link from "next/link"

import { KycForm, useGetMyKycStatus } from "@/modules/kyc"
import { notFound, useRouter } from "next/navigation"
import { useCallback } from "react"
import { useAuthMe } from "@/modules/auth"

export default function KycPage() {
  const router = useRouter()

  const { data, isLoading } = useAuthMe({ config: { retry: false } })
  const { data: kycData, isLoading: isKycLoading } = useGetMyKycStatus()

  const handleSuccess = useCallback(() => {
    if (data?.roles?.includes("ENTREPRENEUR")) {
      router.push("/entrepreneur")
    }

    if (data?.roles?.includes("INVESTOR")) {
      router.push("/investor")
    }
  }, [router, data?.roles])

  if (isLoading || isKycLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!data || kycData?.submittedAt) {
    notFound()
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-6 sm:p-10">
      <main className="w-full max-w-md">
        {/* Logo */}
        <Link
          href="/"
          className="mb-8 flex items-center self-start"
          aria-label="Creon — Home"
        >
          <Image
            src="/logo-text.svg"
            alt="Creon Logo"
            width={96}
            height={32}
            className="dark:invert"
          />
        </Link>

        {/* Heading */}
        <header className="mb-8 flex flex-col gap-1.5">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Identity Verification (KYC)
          </h1>
          <p className="text-sm text-muted-foreground">
            Please provide your information and photos to verify your identity.
          </p>
        </header>

        <KycForm onSuccess={handleSuccess} />
      </main>
    </div>
  )
}
