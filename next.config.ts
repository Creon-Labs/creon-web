import { env } from "@/shared/lib/env"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  typedRoutes: true,
  images: {
    remotePatterns: [new URL(`${env.IMAGE_REMOTE_URL}/**`)],
  },
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: `${env.NEXT_PUBLIC_BASE_API_URL}/:path*`,
      },
    ]
  },
}

export default nextConfig
