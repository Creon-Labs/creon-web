import { SidebarInset, SidebarProvider } from "@shadcn-ui/sidebar"

import { AdminSidebar } from "@/shared/components/sidebar/admin-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="p-4">{children}</SidebarInset>
    </SidebarProvider>
  )
}
