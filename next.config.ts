import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  devIndicators: false,
  async redirects() {
    return [
      {
        source: "/site/:path*",
        destination: "/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
