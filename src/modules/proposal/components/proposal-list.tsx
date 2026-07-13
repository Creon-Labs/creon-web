import { useStellarWallet } from "@/shared/lib/stellar-wallet"
import { EmptyIcon, PlusIcon } from "@phosphor-icons/react"
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
  const { connectedAddress } = useStellarWallet()
  const router = useRouter()
  const { data, isLoading } = useGetProposals({
    config: {
      enabled: !!connectedAddress,
    },
  })

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
            <EmptyMedia variant="icon">
              <EmptyIcon />
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
      <ProposalCard
        id="1"
        title="Lorem Ipsum Dolor Sit Amet"
        description="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ab, veritatis laboriosam? Ad quibusdam explicabo nihil quae nam, saepe perferendis quasi, aut quisquam, voluptate eveniet? Facere quaerat voluptatum eaque dolor deserunt?"
        imageUrl="/temp/kopi-online.webp"
        goalAmount={10_000}
        raisedAmount={1_000}
        variant={"entr.DRAFT"}
      />
    </Container>
  )
}

function Container({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-6">{children}</div>
}
