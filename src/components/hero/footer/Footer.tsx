import {
  FooterBottomBar,
  FooterBrand,
  FooterQuickLinks,
  FooterSocialLinks,
} from '@/components/hero/footer';

export default function Footer() {
  return (
    <footer
      aria-label="Stopka"
      className="bg-secondary/50 border-t border-border"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid sm:grid-cols-3 gap-8 mb-8">
          <FooterBrand />
          <FooterQuickLinks />
          <FooterSocialLinks />
        </div>

        <FooterBottomBar />
      </div>
    </footer>
  );
}
