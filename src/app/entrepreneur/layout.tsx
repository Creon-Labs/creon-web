import { SidebarInset, SidebarProvider } from "@shadcn-ui/sidebar"

import { AppContainer } from "@/shared/components/layouts/app-container"
import { AppHeader } from "@/shared/components/sections/app-header"
import { sidebarCookieState } from "@/shared/components/sections/sidebar/get-sidebar-cookie"
import { EntrepreneurSidebar } from "./sidebar"

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
        <AppHeader />
        <AppContainer>{children}</AppContainer>
      </SidebarInset>
    </SidebarProvider>
  )
}
