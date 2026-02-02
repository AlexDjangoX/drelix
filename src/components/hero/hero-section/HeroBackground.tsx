import Image from 'next/image';

const HERO_IMAGE_SRC = '/images/hero.jpg';
const HERO_IMAGE_ALT = 'Hero image for the homepage';

export function HeroBackground() {
  return (
    <>
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE_SRC}
          alt={HERO_IMAGE_ALT}
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
          quality={70}
        />
      </div>
      <div
        className="absolute inset-0 bg-linear-to-br from-background/95 via-background/90 to-secondary/80"
        aria-hidden
      />
    </>
  );
}
