import {
  HouseIcon,
  RocketLaunchIcon,
  HandCoinsIcon,
  ChartLineUpIcon,
  FileTextIcon,
  GearSixIcon,
} from "@phosphor-icons/react/dist/ssr"
import { SidebarNavItem } from "../types"


export const entrepreneurNavItems: SidebarNavItem[] = [
  {
    title: "Overview",
    href: "/entrepreneur",
    icon: HouseIcon,
  },
  {
    title: "My Campaigns",
    href: "/entrepreneur/campaigns",
    icon: RocketLaunchIcon,
  },
  {
    title: "Funding",
    href: "/entrepreneur/funding",
    icon: HandCoinsIcon,
  },
  {
    title: "Performance",
    href: "/entrepreneur/performance",
    icon: ChartLineUpIcon,
  },
  {
    title: "Reports",
    href: "/entrepreneur/reports",
    icon: FileTextIcon,
  },
  {
    title: "Settings",
    href: "/entrepreneur/settings",
    icon: GearSixIcon,
  },
]
