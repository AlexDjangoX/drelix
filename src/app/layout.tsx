import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";

/** Static until redeploy; no revalidation. */
export const dynamic = "force-static";
export const revalidate = false;
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/context/LanguageContext";
import { JsonLd } from "@/components/seo";
import { ConvexClientProvider } from "@/context/ConvexClientProvider";
import { getCanonicalBaseUrl } from "@/lib/seo";
import "@/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Self-hosted via next/font – avoids render-blocking Google Fonts request. */
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const siteUrl = getCanonicalBaseUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Drelix - Odzież Robocza i Ochronna | Wadowice",
    template: "%s | Drelix",
  },
  description:
    "Profesjonalna odzież robocza i ochronna w Wadowicach. Kaski, kamizelki odblaskowe, rękawice, obuwie BHP. CE, EN. Ponad 500 produktów. Skontaktuj się z nami.",
  authors: [{ name: "Drelix", url: siteUrl }],
  creator: "Drelix",
  publisher: "Drelix",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    alternateLocale: ["en_GB"],
    url: siteUrl,
    siteName: "Drelix - Odzież Robocza i Ochronna",
    title: "Drelix - Odzież Robocza i Ochronna | Wadowice",
    description:
      "Profesjonalna odzież robocza i ochronna w Wadowicach. Ponad 500 produktów BHP. Odwiedź nas.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Drelix - Odzież Robocza i Ochronna",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Drelix - Odzież Robocza i Ochronna | Wadowice",
    description:
      "Profesjonalna odzież robocza i ochronna w Wadowicach. Ponad 500 produktów BHP.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: { canonical: siteUrl },
  category: "business",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ea580c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href={
            process.env.NEXT_PUBLIC_CONVEX_URL ?? "https://cloud.convex.cloud"
          }
        />
        <link rel="dns-prefetch" href="https://www.google.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} antialiased bg-background text-foreground`}
      >
        <JsonLd />
        <ConvexClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey="drelix-theme"
          >
            <LanguageProvider>
              {children}
              <Toaster />
            </LanguageProvider>
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
