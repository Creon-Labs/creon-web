import { RocketLaunchIcon, UsersIcon } from "@phosphor-icons/react"
import { HouseIcon } from "@phosphor-icons/react/dist/ssr"
import { SidebarNavItem } from "../types"

export const adminNavItems: SidebarNavItem[] = [
  {
    title: "Overview",
    href: "/admin/overview",
    icon: HouseIcon,
  },
  {
    title: "KYC Management",
    href: "/admin/kyc",
    icon: UsersIcon,
  },
  {
    title: "Campaigns Management",
    href: "/admin/campaigns",
    icon: RocketLaunchIcon,
  },
]
