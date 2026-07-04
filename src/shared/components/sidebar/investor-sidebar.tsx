"use client"

import { SidebarMenu } from "@shadcn-ui/sidebar"

import { AppSidebar, type AppSidebarProps } from "@/shared/components/sidebar/app-sidebar"
import { SidebarUserMenu } from "@/shared/components/sidebar/sidebar-user-menu"
import { investorNavItems } from "@/shared/constants/nav-investor"

// Mock user — replace with real auth data when auth module is ready
const MOCK_USER = {
  name: "Martin Scorsese",
  email: "scorsese@mail.com",
  avatarUrl: undefined,
}

type InvestorSidebarProps = Omit<AppSidebarProps, "navGroups" | "footer">

/**
 * Scope-specific sidebar for the Investor portal.
 * Bundles nav items + footer so no functions cross the Server→Client boundary.
 */
export function InvestorSidebar(props: InvestorSidebarProps) {
  return (
    <AppSidebar
      navGroups={[{ items: investorNavItems }]}
      footer={
        <SidebarMenu>
          <SidebarUserMenu user={MOCK_USER} />
        </SidebarMenu>
      }
      {...props}
    />
  )
}
