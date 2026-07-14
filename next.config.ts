import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  typedRoutes: true,
  images: {
    remotePatterns: [
      new URL("https://pub-30a0e9c26e5c47679d56bf7e5f8fd633.r2.dev/**"),
    ],
  },
}

export default nextConfig
