import {
  GearSixIcon,
  HouseIcon,
  TrendUpIcon,
} from "@phosphor-icons/react/dist/ssr"
import { SidebarNavItem } from "../types"
import { GlobeIcon, HandArrowDownIcon } from "@phosphor-icons/react"

export const investorNavItems: SidebarNavItem[] = [
  {
    title: "Overview",
    href: "/investor/overview",
    icon: HouseIcon,
  },
  {
    title: "Discovers",
    href: "/investor/discovers",
    icon: GlobeIcon,
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
