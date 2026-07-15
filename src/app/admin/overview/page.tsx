"use client"

import { usePageTitle } from "@/shared/components/sections/app-header"
import { AdminOverview } from "@/modules/admin"

export default function Page() {
  usePageTitle("Overview")

  return <AdminOverview />
}
