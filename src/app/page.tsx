import {
  Navbar,
  HeroSection,
  AboutSection,
  WhyUsSection,
  ContactSection,
  Footer,
} from '@/components';
import ProductSection from '@/components/ProductSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
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
