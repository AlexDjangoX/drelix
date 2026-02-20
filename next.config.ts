import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.convex.cloud",
      },
    ],
  },
  experimental: {
    inlineCss: true,
  },
  async headers() {
    return [
      {
        source: "/admin",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
      {
        source: "/admin/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          },
        ],
      },
      {
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // NOTE: Do NOT set Cache-Control here for /products/:slug.
      // These pages use ISR (revalidate=60 in layout.tsx). Setting a manual
      // Cache-Control header (especially "immutable") would override ISR and
      // cause browsers/CDNs to cache stale content for up to a year, hiding
      // admin-added products and images from users.
    ];
  },
};

export default nextConfig;
