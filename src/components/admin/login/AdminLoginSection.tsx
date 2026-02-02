'use client';

import { useActionState, useEffect, useEffectEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { LoginHeader } from './LoginHeader';
import { LoginForm } from './LoginForm';
import { submitLogin } from './submitLogin';

export function AdminLoginSection() {
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
        <LoginHeader />
        <LoginForm formAction={formAction} />
      </Card>
    </div>
  );
}
