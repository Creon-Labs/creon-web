import { useStellarWallet } from "@/shared/lib/stellar-wallet"
import { useGetProposals } from "../api/get-proposals"

export function ProposalList() {
  const { connectedAddress } = useStellarWallet()
  const { data, isLoading } = useGetProposals({
    config: {
      enabled: !!connectedAddress,
    },
  })

  if (isLoading) {
    return <div>Loading...</div>
  }
  return (
    <div>
      {data?.map((proposal) => (
        <div key={proposal.id}>{proposal.businessName}</div>
      ))}
    </div>
  )
}
