import { SidebarInset, SidebarProvider } from "@shadcn-ui/sidebar"

import { AppContainer } from "@/shared/components/layouts/app-container"
import { sidebarCookieState } from "@/shared/components/sections/sidebar/get-sidebar-cookie"
import { AdminHeader, AdminSidebar } from "./header-sidebar"

export default async function InvestorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const defaultOpen = await sidebarCookieState()

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AdminSidebar />
      <SidebarInset>
        <AdminHeader />
        <AppContainer>{children}</AppContainer>
      </SidebarInset>
    </SidebarProvider>
  )
}
