"use client"

import { use } from "react"

export default function Page({
  params,
}: {
  params: Promise<{ campaignId: string; milestoneId: string }>
}) {
  const resolvedParams = use(params)

  return <div>Milestone Detail: {resolvedParams.milestoneId}</div>
}
