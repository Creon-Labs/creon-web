"use client"

import { SidebarMenu } from "@shadcn-ui/sidebar"

import { investorNavItems } from "@/shared/constants/nav-investor"
import { AppSidebar, AppSidebarProps } from "./app-sidebar"
import { SidebarUserMenu } from "./sidebar-user-menu"

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
