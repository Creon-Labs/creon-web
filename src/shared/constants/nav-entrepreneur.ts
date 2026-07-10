import {
  ChartLineUpIcon,
  GearSixIcon,
  HandCoinsIcon,
  HouseIcon,
  RocketLaunchIcon,
  WalletIcon
} from "@phosphor-icons/react/dist/ssr"
import { SidebarNavItem } from "../types"


export const entrepreneurNavItems: SidebarNavItem[] = [
  {
    title: "Overview",
    href: "/entrepreneur/overview",
    icon: HouseIcon,
  },
  {
    title: "My Campaigns",
    href: "/entrepreneur/campaigns",
    icon: RocketLaunchIcon,
  },
  {
    title: "Profit Sharing",
    href: "/entrepreneur/profit-sharing",
    icon: ChartLineUpIcon,
  },
  {
    title: "Disbursment",
    href: "/entrepreneur/disbursment",
    icon: HandCoinsIcon,
  },
  {
    title: "My Wallet",
    href: "/entrepreneur/wallet",
    icon: WalletIcon,
  },
  {
    title: "Settings",
    href: "/entrepreneur/settings",
    icon: GearSixIcon,
  },
]
