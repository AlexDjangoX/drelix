/**
 * Centralized error messages for production.
 * Use generic messages for public-facing endpoints, specific for admin-only.
 */

/** Generic error messages (safe for public display). */
export const PUBLIC_ERRORS = {
  UNAUTHORIZED: "Authentication required",
  FORBIDDEN: "Access denied",
  NOT_FOUND: "Resource not found",
  INVALID_INPUT: "Invalid input provided",
  SERVER_ERROR: "An error occurred. Please try again.",
  RATE_LIMITED: "Too many requests. Please try again later.",
} as const;

/** Detailed error messages (admin-only). */
export const ADMIN_ERRORS = {
  PRODUCT_NOT_FOUND: (kod: string) => `Product not found: ${kod}`,
  PRODUCT_EXISTS: (kod: string) => `Product already exists: ${kod}`,
  CATEGORY_NOT_FOUND: (slug: string) => `Category not found: ${slug}`,
  CATEGORY_EXISTS: (slug: string) => `Category already exists: ${slug}`,
  CATEGORY_HAS_PRODUCTS: (slug: string, count: number) =>
    `Cannot delete category "${slug}": it contains ${count} product(s)`,
  INVALID_SLUG:
    "Slug must contain only lowercase letters, numbers, hyphens, and underscores",
  SLUG_TOO_LONG: (max: number) =>
    `Slug exceeds maximum length of ${max} characters`,
  STRING_TOO_LONG: (field: string, max: number) =>
    `${field} exceeds maximum length of ${max} characters`,
  EMPTY_INPUT: (field: string) => `${field} cannot be empty`,
  INVALID_TYPE: (field: string, expected: string) =>
    `${field} must be a ${expected}`,
  DESTRUCTIVE_OPERATION_REQUIRES_CONFIRMATION:
    "This destructive operation requires explicit confirmation",
  MEMORY_WARNING: (count: number) =>
    `Warning: Operation involves ${count} records - consider implementing pagination`,
} as const;

/**
 * Create a user-friendly error message for public display.
 * Sanitizes internal error details.
 */
export function sanitizeErrorForPublic(error: unknown): string {
  if (error instanceof Error) {
    // Map known error patterns to generic messages
    const message = error.message.toLowerCase();

    if (
      message.includes("unauthorized") ||
      message.includes("not authenticated")
    ) {
      return PUBLIC_ERRORS.UNAUTHORIZED;
    }
    if (message.includes("forbidden") || message.includes("access denied")) {
      return PUBLIC_ERRORS.FORBIDDEN;
    }
    if (message.includes("not found")) {
      return PUBLIC_ERRORS.NOT_FOUND;
    }
    if (message.includes("invalid") || message.includes("validation")) {
      return PUBLIC_ERRORS.INVALID_INPUT;
    }
    if (message.includes("rate limit") || message.includes("too many")) {
      return PUBLIC_ERRORS.RATE_LIMITED;
    }
  }

  return PUBLIC_ERRORS.SERVER_ERROR;
}

/**
 * Log error with context for debugging.
 */
export function logError(context: string, error: unknown): void {
  console.error(`[${context}]`, error instanceof Error ? error.message : error);
  if (error instanceof Error && error.stack) {
    console.error("Stack trace:", error.stack);
  }
}
