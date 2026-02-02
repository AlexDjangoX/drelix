export type LoginState = { success: boolean; error: string | null } | null;

export async function submitLogin(
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
