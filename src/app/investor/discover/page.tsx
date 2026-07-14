import { CampaignList } from "@/modules/campaign"

export default function DiscoverCampaignsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Discover Campaigns</h1>
        <p className="text-muted-foreground mt-2">
          Explore and invest in active funding campaigns from Indonesian SMEs.
        </p>
      </div>
      <CampaignList />
    </div>
  )
}
