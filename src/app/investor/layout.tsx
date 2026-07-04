import { SidebarInset, SidebarProvider } from "@shadcn-ui/sidebar"

import { InvestorSidebar } from "@/shared/components/sidebar/investor-sidebar"

export default function InvestorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <InvestorSidebar />
      <SidebarInset className="p-4">{children}</SidebarInset>
    </SidebarProvider>
  )
}
