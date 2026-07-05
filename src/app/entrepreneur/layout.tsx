import { SidebarInset, SidebarProvider } from "@shadcn-ui/sidebar"

import { AppHeader } from "@/shared/components/app-header"
import { EntrepreneurSidebar } from "@/shared/components/sidebar/entrepreneur-sidebar"
import { sidebarCookieState } from "@/shared/components/sidebar/get-sidebar-cookie"
import { AppContainer } from "@/shared/components/app-container"

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
