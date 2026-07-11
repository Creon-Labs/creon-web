import {
  GearSixIcon,
  HouseIcon,
  TrendUpIcon,
} from "@phosphor-icons/react/dist/ssr"
import { SidebarNavItem } from "../types"

export const investorNavItems: SidebarNavItem[] = [
  {
    title: "Overview",
    href: "/investor/overview",
    icon: HouseIcon,
  },
  {
    title: "Investments",
    href: "/investor/investments",
    icon: TrendUpIcon,
  },
  {
    title: "Settings",
    href: "/investor/settings",
    icon: GearSixIcon,
  },
]
