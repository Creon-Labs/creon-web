export type MilestoneStatus =
  | "DRAFT"
  | "PENDING"
  | "VOTING"
  | "APPROVED"
  | "RELEASING"
  | "RELEASED"
  | "REJECTED"
  | "FAILED"

/**
 * A campaign's milestone as returned by the milestones voting endpoints.
 */
export type Milestone = {
  id: string
  campaignId: string
  order: number
  /** order − 1; the index the contract's Vec<i128> constructor arg is keyed on */
  onchainIndex: number
  title: string
  description: string
  /** This milestone's release amount as a decimal string (7 decimals) */
  amount: string
  status: MilestoneStatus
  votingStartedAt: string | null
  votingEndsAt: string | null
  /** True once the once-only quorum-miss extension has been used */
  votingExtended?: boolean
  /** Hex-encoded Stellar tx hash of the on-chain release_milestone(), once released */
  releaseTxHash: string | null
}

export type VoteChoice = "APPROVE" | "REJECT"

export type MilestoneVote = {
  milestoneId: string
  choice: VoteChoice
  /** The voter's current share balance, as a decimal string (7 decimals) */
  weight: string
}

export type MilestoneTally = {
  /** Total voting weight (shares) cast so far, as a decimal string */
  participation: string
  approve: string
  reject: string
  /** Snapshotted total supply (the quorum denominator) */
  totalSupply: string | null
  quorumMet: boolean
  approvalMet: boolean
  /** Required participation, in basis points of total supply */
  quorumBps: number
  /** Required approval share of cast weight, in basis points */
  approvalBps: number
}

export type MilestoneDetail = Milestone & {
  /** Total supply snapshot frozen when voting opened */
  snapshotTotalSupply: string | null
  /** Presigned URL (5-minute TTL) for the proof-of-progress file; null before submission */
  proofUrl: string | null
  tally: MilestoneTally
  /** The caller's own ballot, or null if they haven't voted */
  myVote: {
    choice: VoteChoice
    weight: string
    votedAt: string
  } | null
}
