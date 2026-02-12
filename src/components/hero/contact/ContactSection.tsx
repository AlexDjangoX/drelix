"use client";

import { useActionState, useEffect, useEffectEvent } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import {
  ContactForm,
  ContactHeader,
  ContactInfoGrid,
  ContactMap,
  submitContact,
} from "@/components/hero/contact";

export default function ContactSection() {
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
        <ContactHeader />

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-12 items-stretch">
            <div className="flex flex-col gap-5">
              <ContactMap />
              <ContactInfoGrid />
            </div>

            <ContactForm
              formAction={formAction}
              state={state}
              placeholderMessage={t.contact.form.placeholderMessage}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
