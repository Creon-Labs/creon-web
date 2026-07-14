import {
  GearSixIcon,
  HouseIcon,
  TrendUpIcon,
} from "@phosphor-icons/react/dist/ssr"
import { SidebarNavItem } from "../types"
import { HandArrowDownIcon } from "@phosphor-icons/react"

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
    title: "Refunds",
    href: "/investor/refunds",
    icon: HandArrowDownIcon,
  },
  {
    title: "Settings",
    href: "/investor/settings",
    icon: GearSixIcon,
  },
]
