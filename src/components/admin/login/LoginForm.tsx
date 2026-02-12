"use client";

import { Input } from "@/components/ui/input";
import { CardContent } from "@/components/ui/card";
import { LoginSubmitButton } from "@/components/admin";
import { LoginBackLink } from "@/components/admin/login";
import { LOGIN_STRINGS } from "@/components/admin/login";

type LoginFormProps = {
  formAction: (formData: FormData) => void;
};

export function LoginForm({ formAction }: LoginFormProps) {
  return (
    <CardContent>
      <form
        action={formAction}
        className="space-y-4"
        data-testid="admin-login-form"
      >
        <div className="space-y-2">
          <Input
            type="password"
            name="password"
            placeholder={LOGIN_STRINGS.placeholder}
            required
            autoFocus
            data-testid="admin-login-password"
          />
        </div>
        <LoginSubmitButton />
      </form>
      <LoginBackLink />
    </CardContent>
  );
}
