"use server"

import { cookies } from "next/headers"

export const authMe = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get("creon_access_token")?.value

  if (!token) {
    return { isLoggedIn: false }
  }

  return { isLoggedIn: true }
}
