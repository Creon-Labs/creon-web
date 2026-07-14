import { SidebarInset, SidebarProvider } from "@shadcn-ui/sidebar"

import { AppContainer } from "@/shared/components/layouts/app-container"
import { sidebarCookieState } from "@/shared/components/sections/sidebar/get-sidebar-cookie"
import {
  EntrepreneurCampaignHeader,
  EntrepreneurSidebar,
} from "./_components/header-sidebar"
import { ProposalCheckProvider } from "./_components/proposal-check"

export default async function EntrepreneurLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ campaignId: string }>
}) {
  const defaultOpen = await sidebarCookieState()

  const campaignId = (await params).campaignId

  return (
    <ProposalCheckProvider campaignId={campaignId}>
      <SidebarProvider defaultOpen={defaultOpen}>
        <EntrepreneurSidebar />
        <SidebarInset>
          <EntrepreneurCampaignHeader />
          <AppContainer>{children}</AppContainer>
        </SidebarInset>
      </SidebarProvider>
    </ProposalCheckProvider>
  )
}
