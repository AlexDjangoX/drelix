'use client';

import { useActionState, useEffect, useEffectEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { LoginSubmitButton } from '@/components/admin';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';

type LoginState = { success: boolean; error: string | null } | null;

async function submitLogin(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const password = (formData.get('password') as string) ?? '';

  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      return { success: true, error: null };
    }
    return {
      success: false,
      error: (data.error as string) || 'Błąd logowania',
    };
  } catch {
    return { success: false, error: 'Wystąpił błąd sieciowy' };
  }
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [state, formAction] = useActionState(submitLogin, null);

  const onStateChange = useEffectEvent(() => {
    if (!state) return;
    if (state.success) {
      toast.success('Zalogowano pomyślnie');
      router.push('/admin');
      router.refresh();
    } else if (state.error) {
      toast.error(state.error);
    }
  });

  useEffect(() => {
    if (!state) return;
    onStateChange();
  }, [state]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-3 rounded-full bg-primary/10">
              <Lock className="w-6 h-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>
            Wprowadź hasło, aby uzyskać dostęp do panelu administratora.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                name="password"
                placeholder="Hasło"
                required
                autoFocus
              />
            </div>
            <LoginSubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
