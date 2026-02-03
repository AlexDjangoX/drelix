'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

/** React 19: useFormStatus must be used in a descendant of the form. */
export function LoginSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="w-full cursor-pointer"
      disabled={pending}
      data-testid="admin-login-submit"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Logowanie...
        </>
      ) : (
        'Zaloguj'
      )}
    </Button>
  );
}
