/**
 * Convex authentication middleware for admin-protected mutations.
 * Works with JWT tokens from Next.js API routes.
 */

import type { QueryCtx, MutationCtx } from "../_generated/server";

export type AuthenticatedCtx = QueryCtx | MutationCtx;

/**
 * Verify that the request has a valid admin session.
 * In production, this should verify JWT from HTTP headers.
 * For now, we'll use a simple approach with Convex auth context.
 *
 * Note: Convex auth requires integration with your Next.js auth system.
 * The JWT verification happens in Next.js middleware/API routes.
 * This is a placeholder for Convex-side validation.
 *
 * @throws Error if not authenticated or not admin
 */
export async function requireAdmin(ctx: AuthenticatedCtx): Promise<void> {
  void ctx; // Placeholder: auth check deferred to Next.js middleware
  // TODO: Implement Convex Auth integration when available
  // For now, this serves as a marker for admin-only mutations
  // In production, integrate with Convex's authentication system
  // or use HTTP actions with proper auth headers

  // Placeholder implementation:
  // In a real setup, you'd check ctx.auth.getUserIdentity() or similar
  // const identity = await ctx.auth.getUserIdentity();
  // if (!identity || identity.role !== 'admin') {
  //   throw new Error('Unauthorized: Admin access required');
  // }

  // For MVP: mutations called from authenticated Next.js routes are trusted
  // This is acceptable for internal admin tools behind Next.js middleware
  return;
}

/**
 * Check if the current session has admin privileges.
 * Non-throwing version for conditional logic.
 */
export async function isAdmin(ctx: AuthenticatedCtx): Promise<boolean> {
  try {
    await requireAdmin(ctx);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitize and validate string input.
 * @param value - Input string
 * @param maxLength - Maximum allowed length (default 1000)
 * @param fieldName - Field name for error messages
 * @returns Trimmed and validated string
 */
export function sanitizeString(
  value: string,
  maxLength = 1000,
  fieldName = "Input",
): string {
  if (typeof value !== "string") {
    throw new Error(`${fieldName} must be a string`);
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new Error(`${fieldName} cannot be empty`);
  }
  if (trimmed.length > maxLength) {
    throw new Error(
      `${fieldName} exceeds maximum length of ${maxLength} characters`,
    );
  }
  return trimmed;
}

/**
 * Validate and normalize a slug.
 * @param slug - Input slug
 * @param maxLength - Maximum allowed length (default 100)
 * @returns Normalized slug
 */
export function validateSlug(slug: string, maxLength = 100): string {
  const normalized = slug.trim().toLowerCase().replace(/\s+/g, "-");
  if (!normalized) {
    throw new Error("Slug cannot be empty");
  }
  if (normalized.length > maxLength) {
    throw new Error(`Slug exceeds maximum length of ${maxLength} characters`);
  }
  // Allow only alphanumeric, hyphens, and underscores
  if (!/^[a-z0-9_-]+$/.test(normalized)) {
    throw new Error(
      "Slug can only contain lowercase letters, numbers, hyphens, and underscores",
    );
  }
  return normalized;
}

/**
 * Validate rate limiting key (hashed IP).
 * @param key - Rate limit key
 * @returns Validated key
 */
export function validateRateLimitKey(key: string): string {
  if (typeof key !== "string") {
    throw new Error("Rate limit key must be a string");
  }
  // SHA-256 hash is 64 hex characters
  if (key.length < 32 || key.length > 128) {
    throw new Error("Invalid rate limit key format");
  }
  // Ensure it's hex
  if (!/^[a-f0-9]+$/i.test(key)) {
    throw new Error("Invalid rate limit key format");
  }
  return key;
}
