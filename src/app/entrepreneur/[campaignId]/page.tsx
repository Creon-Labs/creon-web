import { redirect } from "next/navigation"

export default async function Page({
  params,
}: {
  params: Promise<{ campaignId: string }>
}) {
  const { campaignId } = await params

  redirect(`/entrepreneur/${campaignId}/overview`)
}
