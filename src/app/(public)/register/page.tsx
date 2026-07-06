import type { Metadata } from "next"
import Link from "next/link"

import { RegisterPageClient } from "./register-page-client"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Create Account — Creon",
  description:
    "Create your Creon account to start funding or seeking capital for your business on the Stellar network.",
}

export default function RegisterPage() {
  return (
    <div className="relative flex min-h-screen w-full">
      {/* ── Left panel: branding (hidden on mobile) ── */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-foreground p-10 text-background lg:flex lg:w-[45%] xl:w-[40%]">
        {/* Background texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Top: logo */}
        <Link
          href="/"
          className="relative z-10 flex items-center gap-2.5 self-start"
          aria-label="Creon — Home"
        >
          <Image
            src={"/logo-text-white.svg"}
            alt="Creon logo"
            width={96}
            height={40}
            className="dark:invert"
          />
        </Link>

        {/* Middle: tagline */}
        <div className="relative z-10 flex flex-col gap-6">
          <blockquote className="flex flex-col gap-3">
            <p className="text-2xl leading-snug font-semibold tracking-tight text-background xl:text-3xl">
              &ldquo;Turn your business dreams into reality with a community of
              investors on the Stellar network.&rdquo;
            </p>
            <footer className="text-sm text-background/60">
              Web3 crowdfunding platform for Indonesian SMEs
            </footer>
          </blockquote>

          <ul className="flex flex-col gap-3 text-sm text-background/70">
            {[
              "Transparent & decentralized on Stellar/Soroban",
              "Fast wallet-based verification process",
              "Direct connection between Entrepreneurs & Investors",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span
                  className="mt-0.5 size-4 shrink-0 rounded-full bg-background/20 text-center text-[10px] leading-4 text-background"
                  aria-hidden
                >
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom: footer note */}
        <p className="relative z-10 text-xs text-background/40">
          &copy; {new Date().getFullYear()} Creon. All rights reserved.
        </p>
      </aside>

      {/* ── Right panel: form ── */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-10">
        {/* Mobile logo */}
        <Link
          href="/"
          className="mb-8 flex items-center gap-2 self-start lg:hidden"
          aria-label="Creon — Home"
        >
          <Image
            src={"/logo-text.svg"}
            alt="Creon logo"
            width={96}
            height={40}
            className="dark:invert"
          />
        </Link>

        <div className="w-full max-w-md">
          {/* Heading */}
          <header className="mb-8 flex flex-col gap-1.5">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Create New Account
            </h1>
            <p className="text-sm text-muted-foreground">
              Complete the details below to finish setting up your account.
            </p>
          </header>

          {/* Register form client wrapper */}
          <RegisterPageClient />

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/"
              className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
            >
              Connect your wallet
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
