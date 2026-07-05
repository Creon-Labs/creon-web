import { SidebarInset, SidebarProvider } from "@shadcn-ui/sidebar"

import { InvestorSidebar } from "@/shared/components/sidebar/investor-sidebar"
import { sidebarCookieState } from "@/shared/components/sidebar/get-sidebar-cookie"

export default async function InvestorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const defaultOpen = await sidebarCookieState()

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <InvestorSidebar />
      <SidebarInset className="p-4">{children}</SidebarInset>
    </SidebarProvider>
  )
}
