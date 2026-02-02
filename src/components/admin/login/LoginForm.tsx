'use client';

import { Input } from '@/components/ui/input';
import { CardContent } from '@/components/ui/card';
import { LoginSubmitButton } from '@/components/admin';
import { LoginBackLink } from './LoginBackLink';
import { LOGIN_STRINGS } from './loginData';

type LoginFormProps = {
  formAction: (formData: FormData) => void;
};

export function LoginForm({ formAction }: LoginFormProps) {
  return (
    <CardContent>
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="password"
            name="password"
            placeholder={LOGIN_STRINGS.placeholder}
            required
            autoFocus
          />
        </div>
        <LoginSubmitButton />
      </form>
      <LoginBackLink />
    </CardContent>
  );
}
