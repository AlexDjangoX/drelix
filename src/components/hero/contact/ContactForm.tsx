'use client';

import { AnimateText } from '@/components';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ContactSubmitButton } from '@/components/hero/contact';

type ContactState = { error: string | null; success: boolean } | null;

type ContactFormProps = {
  formAction: (formData: FormData) => void;
  state: ContactState;
  placeholderMessage: string;
};

export function ContactForm({
  formAction,
  state,
  placeholderMessage,
}: ContactFormProps) {
  return (
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
            className="bg-secondary/50 border-border focus:border-primary resize-none flex-1 min-h-30"
            placeholder={placeholderMessage}
          />
        </div>

        <ContactSubmitButton />
      </form>
    </div>
  );
}
