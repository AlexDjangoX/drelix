import {
  MAX_LOGIN_ATTEMPTS,
  LOGIN_WINDOW_MS,
  LOGIN_LOCKOUT_MS,
} from "./constants";

type LoginAttemptRow = { attempts: number; lastAttemptAt: number };

/**
 * Compute attempts-in-window and lockout state for rate limiting.
 * Shared by checkLoginAllowed and recordFailedLoginAttempt.
 */
export function getLoginAttemptState(
  existing: LoginAttemptRow | null,
  now: number,
): {
  attempts: number;
  lockoutUntil: number | undefined;
  isLockedOut: boolean;
} {
  if (!existing) {
    return { attempts: 0, lockoutUntil: undefined, isLockedOut: false };
  }
  const cutoff = now - LOGIN_WINDOW_MS;
  const inWindow = existing.lastAttemptAt > cutoff;
  const attempts = inWindow ? existing.attempts : 0;
  const lockoutUntil =
    attempts >= MAX_LOGIN_ATTEMPTS
      ? existing.lastAttemptAt + LOGIN_LOCKOUT_MS
      : undefined;
  const isLockedOut = lockoutUntil !== undefined && now < lockoutUntil;
  return { attempts, lockoutUntil, isLockedOut };
}
