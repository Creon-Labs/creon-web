import { CampaignDetail } from "@/modules/campaign"

interface PageProps {
  params: Promise<{
    campaignId: string
  }>
}

export default async function CampaignDetailPage(props: PageProps) {
  const params = await props.params

  return (
    <div className="py-6">
      <CampaignDetail campaignId={params.campaignId} />
    </div>
  )
}
