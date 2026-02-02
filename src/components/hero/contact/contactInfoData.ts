import type { LucideIcon } from 'lucide-react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export type ContactInfoItem =
  | {
      id: string;
      icon: LucideIcon;
      labelKey:
        | 'contact.address'
        | 'contact.phone'
        | 'contact.email'
        | 'contact.hours';
      value: string;
    }
  | {
      id: string;
      icon: LucideIcon;
      labelKey:
        | 'contact.address'
        | 'contact.phone'
        | 'contact.email'
        | 'contact.hours';
      valueKey: 'contact.hoursValue';
    };

export const CONTACT_INFO_ITEMS: readonly ContactInfoItem[] = [
  {
    id: 'address',
    icon: MapPin,
    labelKey: 'contact.address',
    value: 'Emila Zegadłowicza 43\n34-100 Wadowice',
  },
  {
    id: 'phone',
    icon: Phone,
    labelKey: 'contact.phone',
    value: '+48 725 695 933',
  },
  {
    id: 'email',
    icon: Mail,
    labelKey: 'contact.email',
    value: 'annabadura7@gmail.com',
  },
  {
    id: 'hours',
    icon: Clock,
    labelKey: 'contact.hours',
    valueKey: 'contact.hoursValue',
  },
] as const;
