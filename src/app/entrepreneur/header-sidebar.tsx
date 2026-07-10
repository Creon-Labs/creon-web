"use client"

import { useParams } from "next/navigation"
import { SidebarMenu, useSidebar } from "@shadcn-ui/sidebar"

import { AppHeader } from "@/shared/components/sections/app-header"
import {
  AppSidebar,
  AppSidebarProps,
} from "@/shared/components/sections/sidebar"
import { SidebarUserMenu } from "@/shared/components/sections/sidebar/sidebar-user-menu"
import {
  entrepreneurStaticNavItems,
  getEntrepreneurNavItems,
} from "@/shared/constants/nav-entrepreneur"
import { CampaignSwitcherPopover } from "@/modules/campaign"
import { mockCampaigns } from "@/modules/campaign"

// Mock user — replace with real auth data when auth module is ready
const MOCK_USER = {
  name: "Budi Santoso",
  email: "budi@umkm.co.id",
  avatarUrl: undefined,
}

type EntrepreneurSidebarProps = Omit<AppSidebarProps, "navGroups" | "footer">

export function EntrepreneurSidebar(props: EntrepreneurSidebarProps) {
  const params = useParams<{ campaignId?: string }>()
  const campaignId = params?.campaignId

  // Build the nav groups based on whether we're inside a campaign context
  const navGroups = campaignId
    ? [
        {
          items: getEntrepreneurNavItems(campaignId),
        },
      ]
    : [{ items: entrepreneurStaticNavItems }]

  return (
    <AppSidebar
      navGroups={navGroups}
      footer={
        <SidebarMenu>
          <SidebarUserMenu user={MOCK_USER} />
        </SidebarMenu>
      }
      {...props}
    />
  )
}

export function EntrepreneurHeader() {
  const { toggleSidebar } = useSidebar()

  return <AppHeader toggleSidebar={toggleSidebar} />
}

/** Header used inside [campaignId]/* — the title becomes a campaign-switcher popover */
export function EntrepreneurCampaignHeader() {
  const { toggleSidebar } = useSidebar()
  const params = useParams<{ campaignId?: string }>()
  const campaignId = params?.campaignId

  // Look up the active campaign name by its ID
  const activeCampaign = mockCampaigns.find((c) => c.id === campaignId)
  const triggerLabel = activeCampaign?.title ?? "Select Campaign"

  return (
    <AppHeader
      toggleSidebar={toggleSidebar}
      titleSlot={
        <CampaignSwitcherPopover
          campaigns={mockCampaigns}
          title={triggerLabel}
        />
      }
    />
  )
}
