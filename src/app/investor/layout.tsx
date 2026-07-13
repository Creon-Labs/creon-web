import { SidebarInset, SidebarProvider } from "@shadcn-ui/sidebar"

import { AppContainer } from "@/shared/components/layouts/app-container"
import { sidebarCookieState } from "@/shared/components/sections/sidebar/get-sidebar-cookie"
import { InvestorHeader, InvestorSidebar } from "./_components/header-sidebar"
import { InvestorAuthProvider } from "./_components/auth-provider"
import { KycStatusAlert } from "@/modules/kyc"

export default async function InvestorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const defaultOpen = await sidebarCookieState()

  return (
    <InvestorAuthProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <InvestorSidebar />
        <SidebarInset>
          <InvestorHeader />
          <AppContainer>
            <KycStatusAlert />
            {children}
          </AppContainer>
        </SidebarInset>
      </SidebarProvider>
    </InvestorAuthProvider>
  )
}
