import {
  ChartBarIcon,
  GearSixIcon,
  HouseIcon,
  UsersIcon,
  ShieldCheckIcon,
  ClipboardTextIcon,
} from "@phosphor-icons/react/dist/ssr"
import { SidebarNavItem } from "../types"

export const adminNavItems: SidebarNavItem[] = [
  {
    title: "Overview",
    href: "/admin",
    icon: HouseIcon,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: UsersIcon,
  },
  {
    title: "Campaigns",
    href: "/admin/campaigns",
    icon: ChartBarIcon,
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: ClipboardTextIcon,
  },
  {
    title: "Verification",
    href: "/admin/verification",
    icon: ShieldCheckIcon,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: GearSixIcon,
  },
]
