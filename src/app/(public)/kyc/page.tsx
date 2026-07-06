import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"

import { KycPageClient } from "./kyc-page-client"

export const metadata: Metadata = {
  title: "Identity Verification (KYC) — Creon",
  description:
    "Complete your identity verification to start participating on the Creon platform.",
}

export default function KycPage() {
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

        {/* KYC form client wrapper */}
        <KycPageClient />
      </main>
    </div>
  )
}
