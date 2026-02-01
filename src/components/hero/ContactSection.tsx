'use client';

import React, { useActionState, useEffect, useEffectEvent } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { AnimateText, TwoToneHeading } from '@/components';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ContactSubmitButton } from '@/components/hero/ContactSubmitButton';

const contactInfoItems = [
  {
    icon: MapPin,
    labelKey: 'contact.address' as const,
    value: 'Emila Zegadłowicza 43\n34-100 Wadowice',
  },
  { icon: Phone, labelKey: 'contact.phone' as const, value: '+48 725 695 933' },
  {
    icon: Mail,
    labelKey: 'contact.email' as const,
    value: 'annabadura7@gmail.com',
  },
  {
    icon: Clock,
    labelKey: 'contact.hours' as const,
    valueKey: 'contact.hoursValue' as const,
  },
];

type ContactState = { error: string | null; success: boolean } | null;

async function submitContact(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name = (formData.get('name') as string)?.trim() ?? '';
  const email = (formData.get('email') as string)?.trim() ?? '';
  const message = (formData.get('message') as string)?.trim() ?? '';

  if (!name || !email || !message) {
    return { error: 'Name, email and message are required', success: false };
  }

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        error: (data.error as string) || 'Failed to send',
        success: false,
      };
    }
    return { error: null, success: true };
  } catch {
    return { error: 'Network error', success: false };
  }
}

const ContactSection: React.FC = () => {
  const { t } = useLanguage();
  const [state, formAction] = useActionState(submitContact, null);

  const onStateChange = useEffectEvent(() => {
    if (!state) return;
    if (state.success) {
      toast.success(t.contact.form.success);
    } else if (state.error) {
      toast.error(state.error);
    }
  });

  useEffect(() => {
    if (!state) return;
    onStateChange();
  }, [state]);

  return (
    <section id="contact" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <TwoToneHeading
            as="h2"
            className="text-3xl md:text-5xl font-black mb-4"
          >
            <AnimateText k="contact.title" />
          </TwoToneHeading>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            <AnimateText k="contact.subtitle" />
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-12 items-stretch">
            <div className="flex flex-col gap-5">
              <div className="rounded-xl overflow-hidden border border-border shadow-card min-h-70 md:min-h-80 lg:flex-1 lg:min-h-90">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2571.5!2d19.4895!3d49.8833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4716900d8dc43f2b%3A0x9c8f5a3f9a0d7c8e!2sul.%20Emila%20Zegad%C5%82owicza%2043%2C%2034-100%20Wadowice%2C%20Poland!5e0!3m2!1sen!2spl!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: 'inherit' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Drelix Location"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {contactInfoItems.map((info, index) => (
                  <div
                    key={index}
                    className="bg-card rounded-xl p-4 border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <info.icon className="text-primary" size={18} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-medium text-muted-foreground mb-0.5">
                          <AnimateText k={info.labelKey} />
                        </h4>
                        <p className="text-sm text-foreground font-semibold whitespace-pre-line break-words">
                          {'valueKey' in info && info.valueKey ? (
                            <AnimateText k={info.valueKey} />
                          ) : 'value' in info ? (
                            info.value
                          ) : null}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-card h-fit lg:h-full flex flex-col">
              <form
                action={formAction}
                key={state?.success ? 'submitted' : 'form'}
                className="flex flex-col gap-5 flex-1"
              >
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    <AnimateText k="contact.form.name" />
                  </label>
                  <Input
                    type="text"
                    name="name"
                    required
                    className="bg-secondary/50 border-border focus:border-primary"
                    placeholder="Jan Kowalski"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    <AnimateText k="contact.form.email" />
                  </label>
                  <Input
                    type="email"
                    name="email"
                    required
                    className="bg-secondary/50 border-border focus:border-primary"
                    placeholder="jan@example.com"
                  />
                </div>

                <div className="flex flex-col flex-1 min-h-30">
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    <AnimateText k="contact.form.message" />
                  </label>
                  <Textarea
                    name="message"
                    required
                    className="bg-secondary/50 border-border focus:border-primary resize-none flex-1 min-h-[120px]"
                    placeholder={t.contact.form.placeholderMessage}
                  />
                </div>

                <ContactSubmitButton />
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
