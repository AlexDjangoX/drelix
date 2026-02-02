import {
  Navbar,
  HeroSection,
  AboutSection,
  ProductSection,
  WhyUsSection,
  ContactSection,
  Footer,
} from '@/components';

export default function Home() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <main id="main-content" role="main" aria-label="Treść główna">
        <HeroSection />
        <AboutSection />
        <ProductSection />
        <WhyUsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
