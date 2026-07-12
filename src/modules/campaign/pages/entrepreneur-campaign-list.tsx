"use client"

import { useRouter } from "next/navigation"

import { CampaignCard, CampaignStatus } from "@/modules/campaign"
import { SearchInput } from "@/shared/components/blocks/search-input"
import { useSearchState } from "@/shared/hooks/use-search-state"
import { InfoIcon, PlusIcon } from "@phosphor-icons/react"
import { Button } from "@shadcn-ui/button"
import { Tabs, TabsContent } from "@shadcn-ui/tabs"
import z from "zod"
import { mockCampaigns } from "../components/mock-campaigns"

const tabs: {
  value: CampaignStatus | "all"
  label: string
}[] = [
  { value: "all", label: "All" },
  { value: "submitted", label: "Submitted" },
  { value: "under_review", label: "Under Review" },
  { value: "live", label: "Live" },
  { value: "active", label: "Active" },
  { value: "rejected", label: "Rejected" },
]

export const campaignQuerySchema = z.object({
  page: z.coerce.number().int().positive().catch(1),

  tab: z
    .enum(["all", "submitted", "under_review", "live", "active", "rejected"])
    .catch("all"),
})

export function EntrepreneurCampaignListPage() {
  const { state: searchParams, setMany } = useSearchState(campaignQuerySchema)
  const router = useRouter()

  return (
    <>
      <div className="flex justify-between gap-4">
        <SearchInput
          className="max-w-lg"
          onSearch={(val) => console.log(val)}
        />
        <Button onClick={() => router.push("/entrepreneur/campaign/new")}>
          <PlusIcon data-icon="inline-start" />
          New Campaign
        </Button>
      </div>

      <Tabs defaultValue="all" value={searchParams.tab}>
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((tab, index) => (
            <Button
              data-is-active={searchParams.tab === tab.value}
              className="data-[is-active=true]:pointer-events-none"
              key={index}
              variant={searchParams.tab === tab.value ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setMany({
                  tab: tab.value,
                  page: 1,
                })
              }}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {Object.values(tabs).map((tab, index) => (
          <TabsContent className="mt-2 space-y-4" key={index} value={tab.value}>
            {mockCampaigns
              .filter((campaign) => {
                if (searchParams.tab === "all") return true
                return campaign.status === searchParams.tab
              })
              .map((campaign, index) => (
                <CampaignCard
                  id={campaign.id}
                  key={index}
                  imageUrl={campaign.imageUrl}
                  title={campaign.title}
                  description={campaign.description}
                  goalAmount={campaign.goalAmount}
                  raisedAmount={campaign.raisedAmount}
                  endAt={campaign.endAt}
                  variant={`entr.${campaign.status}`}
                  renderFooter={
                    campaign.message
                      ? () => (
                          <p className="flex items-center gap-1 group-data-[variant=entr.rejected]/campaign-card:text-destructive!">
                            {" "}
                            <span>
                              <InfoIcon />
                            </span>
                            {campaign.message}
                          </p>
                        )
                      : undefined
                  }
                />
              ))}
          </TabsContent>
        ))}
      </Tabs>
    </>
  )
}
