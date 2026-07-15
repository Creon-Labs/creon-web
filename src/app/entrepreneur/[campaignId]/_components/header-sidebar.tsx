"use client"

import { SidebarGroup, SidebarMenu, useSidebar } from "@shadcn-ui/sidebar"
import { useParams } from "next/navigation"

import { ProposalSwitcherPopover } from "@/modules/proposal"
import { useGetProposals } from "@/modules/proposal/"
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
import { useIsMobile } from "@/shared/hooks/use-mobile"
import { ProposalStatusBadge } from "@/modules/proposal"

type EntrepreneurSidebarProps = Omit<AppSidebarProps, "navGroups" | "footer">

export function EntrepreneurSidebar(props: EntrepreneurSidebarProps) {
  const params = useParams<{ campaignId?: string }>()
  const campaignId = params?.campaignId

  const isMobile = useIsMobile()

  const { data: proposals } = useGetProposals()

  // Look up the active campaign name by its ID
  const activeCampaign = proposals?.find(
    (proposal) => proposal.campaignId === campaignId
  )
  const triggerLabel = activeCampaign?.businessName ?? "Select Campaign"

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
      topContent={
        <>
          {isMobile && (
            <SidebarGroup>
              <div className="ml-2 flex flex-col pt-0.5">
                {activeCampaign?.status && (
                  <ProposalStatusBadge
                    className="z-10 -mb-1.5 ml-1 h-fit border-none bg-transparent p-0 text-[10px]"
                    status={activeCampaign?.status}
                  />
                )}
                <ProposalSwitcherPopover
                  proposals={proposals ?? []}
                  title={triggerLabel}
                />
              </div>
            </SidebarGroup>
          )}
        </>
      }
      footer={
        <SidebarMenu>
          <SidebarUserMenu />
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

  const { data: proposals } = useGetProposals()

  // Look up the active campaign name by its ID
  const activeCampaign = proposals?.find(
    (proposal) => proposal.campaignId === campaignId
  )
  const triggerLabel = activeCampaign?.businessName ?? "Select Campaign"

  return (
    <>
      <AppHeader
        toggleSidebar={toggleSidebar}
        titleSlot={
          <div className="flex flex-col pt-0.5">
            {activeCampaign?.status && (
              <ProposalStatusBadge
                className="z-10 -mb-1.5 ml-1 h-fit border-none bg-transparent p-0 text-[10px]"
                status={activeCampaign?.status}
              />
            )}
            <ProposalSwitcherPopover
              proposals={proposals ?? []}
              title={triggerLabel}
            />
          </div>
        }
      />
    </>
  )
}
