"use client"

import { usePageTitle } from "@/shared/components/app-header"
import Link from "next/link"

export default function Page() {
  usePageTitle("Campaigns")

  return (
    <>
      <h1>Entrepreneur Campaigns</h1>
      <Link href="/entrepreneur/campaigns/1">To Detail</Link>
    </>
  )
}
