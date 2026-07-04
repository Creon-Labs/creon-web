"use client"

import { SidebarMenu } from "@shadcn-ui/sidebar"

import { AppSidebar, type AppSidebarProps } from "@/shared/components/sidebar/app-sidebar"
import { SidebarUserMenu } from "@/shared/components/sidebar/sidebar-user-menu"
import { entrepreneurNavItems } from "@/shared/constants/nav-entrepreneur"

// Mock user — replace with real auth data when auth module is ready
const MOCK_USER = {
  name: "Budi Santoso",
  email: "budi@umkm.co.id",
  avatarUrl: undefined,
}

type EntrepreneurSidebarProps = Omit<AppSidebarProps, "navGroups" | "footer">

/**
 * Scope-specific sidebar for the Entrepreneur portal.
 * Bundles nav items + footer so no functions cross the Server→Client boundary.
 */
export function EntrepreneurSidebar(props: EntrepreneurSidebarProps) {
  return (
    <AppSidebar
      navGroups={[{ items: entrepreneurNavItems }]}
      footer={
        <SidebarMenu>
          <SidebarUserMenu user={MOCK_USER} />
        </SidebarMenu>
      }
      {...props}
    />
  )
}
