import type { LucideIcon } from "lucide-react";
import { MapPin, Phone, MessageCircle, Clock } from "lucide-react";

export type ContactInfoItem =
  | {
      id: string;
      icon: LucideIcon;
      labelKey:
        | "contact.address"
        | "contact.phone"
        | "contact.emailCta"
        | "contact.hours";
      value: string;
    }
  | {
      id: string;
      icon: LucideIcon;
      labelKey:
        | "contact.address"
        | "contact.phone"
        | "contact.emailCta"
        | "contact.hours";
      valueKey: "contact.hoursValue" | "contact.emailCtaValue";
    };

export const CONTACT_INFO_ITEMS: readonly ContactInfoItem[] = [
  {
    id: "address",
    icon: MapPin,
    labelKey: "contact.address",
    value: "Emila Zegadłowicza 43\n34-100 Wadowice",
  },
  {
    id: "phone",
    icon: Phone,
    labelKey: "contact.phone",
    value: "+48 725 695 933",
  },
  {
    id: "email-cta",
    icon: MessageCircle,
    labelKey: "contact.emailCta",
    valueKey: "contact.emailCtaValue",
  },
  {
    id: "hours",
    icon: Clock,
    labelKey: "contact.hours",
    valueKey: "contact.hoursValue",
  },
] as const;
