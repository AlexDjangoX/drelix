import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Navbar, HeroSection, AboutSection, Footer } from "@/components";

const ProductSection = dynamic(
  () => import("@/components/products/ProductSection/ProductSection"),
  {
    ssr: true,
  },
);
const WhyUsSection = dynamic(
  () => import("@/components/hero/why-us/WhyUsSection"),
  {
    ssr: true,
  },
);
const ContactSection = dynamic(
  () => import("@/components/hero/contact/ContactSection"),
  {
    ssr: true,
  },
);

function SectionFallback() {
  return <div className="py-20 md:py-32" />;
}

export default function Home() {
  return (
    <div
      className="min-h-screen bg-background overflow-x-hidden"
      data-testid="home-page"
    >
      <Navbar />
      <main
        id="main-content"
        data-testid="main-content"
        role="main"
        aria-label="Treść główna"
      >
        <HeroSection />
        <AboutSection />
        <Suspense fallback={<SectionFallback />}>
          <ProductSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <WhyUsSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <ContactSection />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
