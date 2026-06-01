import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ezfwhlggdrewzjffypdn.supabase.co',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
