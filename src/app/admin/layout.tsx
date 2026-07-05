import { SidebarInset, SidebarProvider } from "@shadcn-ui/sidebar"

import { AdminSidebar } from "@/shared/components/sidebar/admin-sidebar"
import { sidebarCookieState } from "@/shared/components/sidebar/get-sidebar-cookie"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const defaultOpen = await sidebarCookieState()

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AdminSidebar />
      <SidebarInset className="p-4">{children}</SidebarInset>
    </SidebarProvider>
  )
}
