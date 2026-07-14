"use client"

import { StackedCardsIllustration } from "@/shared/assets/stacked-card"
import { PlusIcon } from "@phosphor-icons/react"
import { Button } from "@shadcn-ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@shadcn-ui/empty"
import { useRouter } from "next/navigation"
import { useGetProposals } from "../api/get-proposals"
import { ProposalCard, ProposalCardSkeleton } from "./proposal-card"

export function ProposalList() {
  const router = useRouter()
  const { data, isLoading } = useGetProposals()

  if (isLoading) {
    return (
      <Container>
        {Array.from({ length: 3 }).map((_, index) => (
          <ProposalCardSkeleton key={index} />
        ))}
      </Container>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div>
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia>
              <StackedCardsIllustration />
            </EmptyMedia>
            <EmptyTitle>No campaigns have been submitted yet</EmptyTitle>
            <EmptyDescription>
              Once you submit your proposal, it will be reviewed by our team and
              you will be notified of the outcome.
            </EmptyDescription>
            <EmptyDescription></EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              onClick={() => router.push("/entrepreneur/campaign/new")}
              size="sm"
            >
              <PlusIcon />
              Submit Campaign
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    )
  }
  return (
    <Container>
      <Button
        onClick={() => router.push("/entrepreneur/campaign/new")}
        variant={"outline"}
        className="h-10 border-dashed"
      >
        <PlusIcon /> New Campaign Proposal
      </Button>
      <div className="grid gap-4">
        {data.map((proposal) => {
          const imageUrl =
            proposal.media?.find((media) => media.kind === "IMAGE")?.url || ""
          return (
            <ProposalCard
              key={proposal.id}
              id={proposal.id}
              title={proposal.businessName}
              description={proposal.businessDescription}
              imageUrl={imageUrl}
              goalAmount={Number(proposal.requestedAmount)}
              investorsCount={0}
              raisedAmount={0}
              endAt={"Null"}
              variant={`entr.${proposal.status}`}
              href={`/entrepreneur/${proposal.id}/overview`}
            />
          )
        })}
      </div>
    </Container>
  )
}

function Container({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-6">{children}</div>
}
