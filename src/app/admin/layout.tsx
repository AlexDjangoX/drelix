import type { Metadata } from "next";

/**
 * Admin area: not for public indexing. robots.txt Disallow /admin/ is primary;
 * noindex here covers edge cases (e.g. linked admin URL) per SEO_Guide §9.
 */
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
