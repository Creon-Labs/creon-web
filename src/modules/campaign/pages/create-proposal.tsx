"use client"

import { ArrowLeftIcon } from "@phosphor-icons/react"
import Link from "next/link"

import { Button } from "@shadcn-ui/button"
import { Badge } from "@shadcn-ui/badge"

import { CreateProposalForm } from "../components/proposal-form/create-proposal-form"

export function CreateProposalPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 pb-16">
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="-ml-2 w-fit text-muted-foreground hover:text-foreground"
        >
          <Link href="/entrepreneur">
            <ArrowLeftIcon data-icon="inline-start" />
            Back to Campaigns
          </Link>
        </Button>

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight">
              New Campaign Proposal
            </h1>
            <Badge variant="secondary" size="xs">
              Draft
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Fill in the details below to create a new funding campaign proposal.
            You can save it as a draft at any time, or submit it directly for
            admin review.
          </p>
        </div>
      </div>

      {/* ── Form ────────────────────────────────────────────────────── */}
      <CreateProposalForm />
    </div>
  )
}
