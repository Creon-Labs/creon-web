"use client"

import { SidebarMenu } from "@shadcn-ui/sidebar"

import { adminNavItems } from "@/shared/constants/nav-admin"
import { AppSidebar, AppSidebarProps } from "./app-sidebar"
import { SidebarUserMenu } from "./sidebar-user-menu"

type AdminSidebarProps = Omit<AppSidebarProps, "navGroups" | "footer">

/**
 * Scope-specific sidebar for the Admin portal.
 * Bundles nav items + footer so no functions cross the Server→Client boundary.
 */
export function AdminSidebar(props: AdminSidebarProps) {
  return (
    <AppSidebar
      navGroups={[{ items: adminNavItems }]}
      footer={
        <SidebarMenu>
          <SidebarUserMenu />
        </SidebarMenu>
      }
      {...props}
    />
  )
}
