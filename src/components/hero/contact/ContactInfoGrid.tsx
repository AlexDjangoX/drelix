'use client';

import { ContactInfoCard } from '@/components/hero/contact/ContactInfoCard';
import { CONTACT_INFO_ITEMS } from '@/components/hero/contact/contactInfoData';

export function ContactInfoGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {CONTACT_INFO_ITEMS.map((item) => (
        <ContactInfoCard key={item.id} item={item} />
      ))}
    </div>
  );
}
