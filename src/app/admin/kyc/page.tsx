import { Metadata } from "next"
import { AdminKycView } from "@/modules/admin"

export const metadata: Metadata = {
  title: "KYC Review - Creon Admin",
  description: "Manage user Identity Verification (KYC) submissions.",
}

export default function AdminKycPage() {
  return <AdminKycView />
}
