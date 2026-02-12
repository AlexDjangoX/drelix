"use client";

import { useRef, useState, useEffect } from "react";
import { MapPin } from "lucide-react";

const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2571.5!2d19.4895!3d49.8833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4716900d8dc43f2b%3A0x9c8f5a3f9a0d7c8e!2sul.%20Emila%20Zegad%C5%82owicza%2043%2C%2034-100%20Wadowice%2C%20Poland!5e0!3m2!1sen!2spl!4v1234567890";

export function ContactMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "200px" }, // Load when within 200px of viewport
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="rounded-xl overflow-hidden border border-border shadow-card min-h-70 md:min-h-80 lg:flex-1 lg:min-h-90 relative"
    >
      {shouldLoad ? (
        <iframe
          src={MAP_EMBED_URL}
          width="100%"
          height="100%"
          style={{ border: 0, minHeight: "inherit" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Drelix Location"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
          <MapPin className="w-12 h-12 text-muted-foreground/40" />
        </div>
      )}
    </div>
  );
}
