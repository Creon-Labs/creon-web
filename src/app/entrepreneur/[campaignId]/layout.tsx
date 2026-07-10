import { SidebarInset, SidebarProvider } from "@shadcn-ui/sidebar"

import { AppContainer } from "@/shared/components/layouts/app-container"
import { sidebarCookieState } from "@/shared/components/sections/sidebar/get-sidebar-cookie"
import { EntrepreneurHeader, EntrepreneurSidebar } from "../header-sidebar"

export default async function EntrepreneurLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const defaultOpen = await sidebarCookieState()

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <EntrepreneurSidebar />
      <SidebarInset>
        <EntrepreneurHeader />
        <AppContainer>{children}</AppContainer>
      </SidebarInset>
    </SidebarProvider>
  )
}
