import { cookies } from "next/headers"

export async function sidebarCookieState() {
  "use server"
  const cookieStore = await cookies()
  const sidebarState = cookieStore.get("sidebar_state")
  const defaultOpen = sidebarState?.value === "true"
  return defaultOpen
}
