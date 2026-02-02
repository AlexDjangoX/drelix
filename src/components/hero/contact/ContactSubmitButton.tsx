'use client';

import { useFormStatus } from 'react-dom';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimateText } from '@/components';

/** React 19: useFormStatus must be used in a descendant of the form. */
export function ContactSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full cursor-pointer bg-gradient-primary text-primary-foreground font-bold py-6 rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50"
    >
      {pending ? (
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <AnimateText k="contact.form.sending" />
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <Send size={18} />
          <AnimateText k="contact.form.send" />
        </span>
      )}
    </Button>
  );
}
