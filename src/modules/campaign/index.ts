export { CampaignCard } from "./components/campaign-card"
export { CampaignStatusBadge } from "./components/status-badge"
export { mockCampaigns } from "./components/mock-campaigns"

export { EntrepreneurCampaignListPage } from "./pages/entrepreneur-campaign-list"

export type { CampaignItem, CampaignStatus } from "./types"
export type {
  Proposal,
  ProposalMilestone,
  ProposalStatus,
  MilestoneStatus,
  CreateProposalInput,
  CreateMilestoneInput,
} from "./types/proposal"
export { createProposalSchema, milestoneSchema } from "./utils/proposal-schema"
export type {
  CreateProposalFormValues,
  CreateProposalFormOutput,
} from "./utils/proposal-schema"
