"use client"

import { CampaignCard, CampaignStatus } from "@/modules/campaign"
import { SearchInput } from "@/shared/components/blocks/search-input"
import { useSearchState } from "@/shared/hooks/use-search-state"
import { InfoIcon, PlusIcon } from "@phosphor-icons/react"
import { Button } from "@shadcn-ui/button"
import { Tabs, TabsContent } from "@shadcn-ui/tabs"
import z from "zod"
import { CampaignItem } from "../types"

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

  return (
    <>
      <div className="flex justify-between gap-4">
        <SearchInput
          className="max-w-lg"
          onSearch={(val) => console.log(val)}
        />
        <Button>
          <PlusIcon />
          New Campaign
        </Button>
      </div>

      <Tabs defaultValue="all" value={searchParams.tab}>
        <div className="flex items-center flex-wrap gap-2">
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

const mockCampaigns: CampaignItem[] = [
  {
    id: "1",
    title: "Kopi.Online Outlet - Ease of Drinking Coffee for Young People ",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    goalAmount: 10_000,
    raisedAmount: 100,
    endAt: "2024-12-31",
    status: "submitted",
    imageUrl: "/temp/kopi-online.webp",
  },
  {
    id: "2",
    title: "Martabak Manis - Sweet and Delicious Martabak for All Ages",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    goalAmount: 15_000,
    raisedAmount: 500,
    endAt: "2024-12-31",
    status: "live",
    imageUrl: "/temp/martabak-manis.webp",
  },
  {
    id: "3",
    title: "Bakso Malang - Authentic Indonesian Meatball Experience",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    goalAmount: 20_000,
    raisedAmount: 1_000,
    endAt: "2024-12-31",
    status: "active",
    imageUrl: "/temp/bakso-malang.webp",
  },
  {
    id: "5",
    title: "Sate Ayam - Grilled Chicken Skewers with Traditional Flavors",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    goalAmount: 12_000,
    raisedAmount: 800,
    endAt: "2024-12-31",
    status: "rejected",
    imageUrl: "/temp/sate-ayam.webp",
    message:
      "Your campaign was rejected due to insufficient marketing strategy.",
  },
  {
    id: "4",
    title: "Nasi Goreng - Classic Indonesian Fried Rice with a Twist",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    goalAmount: 18_000,
    raisedAmount: 1_200,
    endAt: "2024-12-31",
    status: "under_review",
    imageUrl: "/temp/nasi-goreng.webp",
  },
  {
    id: "6",
    title: "Es Teh Manis - Refreshing Sweet Iced Tea for Hot Days",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    goalAmount: 8_000,
    raisedAmount: 400,
    endAt: "2024-12-31",
    status: "submitted",
    imageUrl: "/temp/es-teh-manis.webp",
  },
]
