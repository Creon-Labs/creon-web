import type { Milestone } from "../types"

/** Mock milestones data for UI development. */
export const mockMilestones: Milestone[] = [
  {
    id: "m1",
    campaignId: "c1",
    order: 1,
    onchainIndex: 0,
    title: "Rent & Renovation",
    description: "Rent space + renovation of the first outlet.",
    amount: "6000.0000000",
    status: "RELEASED",
    votingStartedAt: "2026-06-01T10:00:00Z",
    votingEndsAt: "2026-06-08T10:00:00Z",
    votingExtended: false,
    releaseTxHash: "4a2b9c...",
  },
  {
    id: "m2",
    campaignId: "c1",
    order: 2,
    onchainIndex: 1,
    title: "Equipment Purchase",
    description: "Purchase coffee machines and other equipment.",
    amount: "3000.0000000",
    status: "VOTING",
    votingStartedAt: "2026-07-09T08:00:00Z",
    votingEndsAt: "2026-07-16T08:00:00Z",
    votingExtended: false,
    releaseTxHash: null,
  },
  {
    id: "m3",
    campaignId: "c1",
    order: 3,
    onchainIndex: 2,
    title: "Working Capital Months 1-3",
    description: "Initial raw materials and operational costs.",
    amount: "1000.0000000",
    status: "PENDING",
    votingStartedAt: null,
    votingEndsAt: null,
    votingExtended: false,
    releaseTxHash: null,
  },
]

import type { MilestoneDetail } from "../types"

export const mockMilestoneDetail: MilestoneDetail = {
  ...mockMilestones[1], // VOTING milestone as example
  snapshotTotalSupply: "10000.0000000",
  proofUrl: "https://example.com/proof.pdf",
  tally: {
    participation: "4500.0000000",
    approve: "3000.0000000",
    reject: "1500.0000000",
    totalSupply: "10000.0000000",
    quorumMet: true,
    approvalMet: true, // 66.6% approval, assuming approvalBps is 5000 (50%)
    quorumBps: 3000, // 30%
    approvalBps: 5000, // 50%
  },
  myVote: null,
}
