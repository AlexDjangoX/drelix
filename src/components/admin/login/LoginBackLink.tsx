import Link from 'next/link';
import { LOGIN_STRINGS } from '@/components/admin/login/loginData';

export function LoginBackLink() {
  return (
    <p className="mt-4 text-center text-sm text-muted-foreground">
      <Link href="/" className="underline hover:text-foreground">
        {LOGIN_STRINGS.backToHome}
      </Link>
    </p>
  );
}
