import Image from 'next/image';

const IMAGE_ALT = 'Drelix - odzież robocza i ochronna Wadowice';
const IMAGE_SRC = '/images/drelix.jpg';

export function AboutImage() {
  return (
    <div className="relative">
      <div className="aspect-square relative rounded-2xl overflow-hidden shadow-card">
        <Image
          src={IMAGE_SRC}
          alt={IMAGE_ALT}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={false}
        />
      </div>
      {/* Decorative accent */}
      <div
        className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-2xl -z-10"
        aria-hidden
      />
    </div>
  );
}
