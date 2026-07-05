import { Icon } from "@phosphor-icons/react"
import { Route } from "next"

export interface SidebarNavItem {
  title: string
  href: Route
  icon: Icon
}
