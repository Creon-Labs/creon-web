import { Metadata } from "next"
import { AdminCampaignsView } from "@/modules/admin"

export const metadata: Metadata = {
  title: "Campaign Proposals Review - Creon Admin",
  description:
    "Manage funding proposals from entrepreneurs and monitor active campaigns.",
}

export default function AdminCampaignsPage() {
  return <AdminCampaignsView />
}
