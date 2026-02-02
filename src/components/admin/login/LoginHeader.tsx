import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { LOGIN_STRINGS } from './loginData';

export function LoginHeader() {
  return (
    <CardHeader className="space-y-1 text-center">
      <div className="flex justify-center mb-2">
        <div className="p-3 rounded-full bg-primary/10">
          <Lock className="w-6 h-6 text-primary" />
        </div>
      </div>
      <CardTitle className="text-2xl font-bold">
        {LOGIN_STRINGS.title}
      </CardTitle>
      <CardDescription>{LOGIN_STRINGS.description}</CardDescription>
    </CardHeader>
  );
}
