import { env } from "@/shared/lib/env"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  typedRoutes: true,
  images: {
    remotePatterns: [new URL(`${env.IMAGE_REMOTE_URL}/**`)],
  },
}

export default nextConfig
