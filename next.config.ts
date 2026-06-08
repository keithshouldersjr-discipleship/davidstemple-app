import type { NextConfig } from "next";

const dtSocialOrigin = process.env.DT_SOCIAL_ORIGIN?.replace(/\/$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    if (!dtSocialOrigin) return [];

    return [
      {
        source: "/dtsocial/api/:path*",
        destination: `${dtSocialOrigin}/api/:path*`
      },
      {
        source: "/dtsocial",
        destination: `${dtSocialOrigin}/dtsocial`
      },
      {
        source: "/dtsocial/:path*",
        destination: `${dtSocialOrigin}/dtsocial/:path*`
      }
    ];
  }
};

export default nextConfig;
