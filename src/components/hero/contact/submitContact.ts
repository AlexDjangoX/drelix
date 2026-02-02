type ContactState = { error: string | null; success: boolean } | null;

export async function submitContact(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name = (formData.get('name') as string)?.trim() ?? '';
  const email = (formData.get('email') as string)?.trim() ?? '';
  const message = (formData.get('message') as string)?.trim() ?? '';

  if (!name || !email || !message) {
    return { error: 'Name, email and message are required', success: false };
  }

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        error: (data.error as string) || 'Failed to send',
        success: false,
      };
    }
    return { error: null, success: true };
  } catch {
    return { error: 'Network error', success: false };
  }
}
