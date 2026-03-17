import Image from "next/image";

const IMAGE_ALT = "Drelix - odzież robocza i ochronna Wadowice";

const SHOP_IMAGES = [
  { src: "/shop-images/shop-front-1.jpg", alt: IMAGE_ALT },
  { src: "/shop-images/shop-front-2.jpg", alt: IMAGE_ALT },
];

export function AboutImage() {
  return (
    <div className="relative w-full">
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {SHOP_IMAGES.map((img, i) => (
          <div
            key={img.src}
            className="aspect-[4/5] relative rounded-2xl overflow-hidden shadow-card"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 50vw, 40vw"
              priority={i === 0}
            />
          </div>
        ))}
      </div>
      {/* Decorative accent */}
      <div
        className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-2xl -z-10"
        aria-hidden
      />
    </div>
  );
}
