import { CampaignList } from "@/modules/campaign"

export default function DiscoverCampaignsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Discover Campaigns
        </h1>
        <p className="mt-2 text-muted-foreground">
          Explore and invest in active funding campaigns from Indonesian SMEs.
        </p>
      </div>
      <CampaignList />
    </div>
  )
}
