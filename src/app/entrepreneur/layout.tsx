import { SidebarInset, SidebarProvider } from "@shadcn-ui/sidebar"

import { EntrepreneurSidebar } from "@/shared/components/sidebar/entrepreneur-sidebar"

export default function EntrepreneurLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <EntrepreneurSidebar />
      <SidebarInset className="p-4">{children}</SidebarInset>
    </SidebarProvider>
  )
}
