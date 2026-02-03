# Security Documentation

## Overview

This document outlines the security measures implemented in the Convex backend for production readiness.

## Authentication & Authorization

### Admin Authentication

All admin mutations are protected with the `requireAdmin()` middleware:

```typescript
// Example usage
export const updateProduct = mutation({
  handler: async (ctx, args) => {
    await requireAdmin(ctx); // Validates admin session
    // ... rest of handler
  },
});
```

**Protected Mutations:**

- `updateProduct` - Update product details
- `generateUploadUrl` - Generate file upload URLs
- `updateProductImage` - Update product images
- `clearProductImage` - Remove product images
- `createCategory` - Create new category
- `deleteCategory` - Delete category
- `createProduct` - Create new product
- `deleteProduct` - Delete product
- `replaceCatalogFromSections` - Replace entire catalog
- `setCategories` - Seed categories (destructive)

### Authentication Flow

1. User logs in via Next.js API route (`/api/admin/login`)
2. JWT token is created and stored in HTTP-only cookie
3. Next.js middleware validates JWT for admin routes
4. Convex mutations are called from authenticated Next.js routes only
5. Convex trusts calls from authenticated Next.js backend

**Note:** Convex mutations currently trust calls from authenticated Next.js routes. For enhanced security in future versions, consider:

- Implementing Convex HTTP actions with JWT validation
- Using Convex Auth when available
- Adding request signing between Next.js and Convex

## Rate Limiting

### Login Attempts

Rate limiting prevents brute-force attacks on admin login:

```typescript
// Configuration (convex/lib/constants.ts)
MAX_LOGIN_ATTEMPTS = 5;
LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
LOGIN_LOCKOUT_MS = 15 * 60 * 1000; // 15 min lockout
```

**Implementation:**

- Failed attempts are tracked by hashed IP address
- After 5 failed attempts within 15 minutes, login is locked for 15 minutes
- Successful login clears all attempts
- Stale records (>24h) are cleaned up daily via cron job

### Key Validation

Rate limiting keys (hashed IPs) are validated to prevent abuse:

- Must be 32-128 characters
- Must be hexadecimal format
- Prevents injection of arbitrary keys into database

## Input Validation & Sanitization

### String Validation

All user inputs are validated using `sanitizeString()`:

```typescript
// Validates and sanitizes string inputs
const validated = sanitizeString(input, maxLength, fieldName);
```

**Checks:**

- Type validation (must be string)
- Trimming whitespace
- Maximum length enforcement
- Empty string detection

### Slug Validation

Category and product slugs are normalized and validated:

```typescript
const normalized = validateSlug(slug, maxLength);
```

**Rules:**

- Lowercase only
- Only alphanumeric, hyphens, and underscores
- No spaces (converted to hyphens)
- Maximum 100 characters (configurable)

### Maximum Length Limits

- **Product code (Kod):** 100 characters
- **Category slug:** 100 characters
- **Display name:** 200 characters
- **Title key:** 200 characters
- **Storage ID:** 500 characters
- **Rate limit key:** 32-128 characters

## Error Handling

### Centralized Error Messages

Errors are categorized into public and admin-specific messages:

```typescript
// Public (safe for display)
PUBLIC_ERRORS.NOT_FOUND; // "Resource not found"

// Admin (detailed)
ADMIN_ERRORS.PRODUCT_NOT_FOUND(kod); // "Product not found: ABC123"
```

**Benefits:**

- Prevents information leakage to attackers
- Provides detailed debugging for admins
- Consistent error format across codebase

### Storage Deletion

File deletion includes comprehensive error handling:

```typescript
const result = await deleteProductImages(ctx, product);
// Returns: { deleted: number, failed: number }
```

**Features:**

- Uses `Promise.allSettled()` for resilient deletion
- Logs failures without throwing errors
- Returns detailed result statistics
- Prevents transaction rollback on storage errors

## Race Condition Prevention

### Category Creation

Double-check pattern prevents duplicate categories:

```typescript
try {
  await ctx.db.insert('categories', { slug, ... });
} catch (error) {
  // Check if another request created it
  const existing = await ctx.db.query('categories')...
  if (existing) throw new Error('Already exists');
  throw error; // Different error
}
```

## Destructive Operations

### Safety Confirmations

Destructive operations require explicit confirmation:

```typescript
export const setCategories = mutation({
  args: {
    categories: v.array(...),
    confirmDestruction: v.optional(v.boolean()),
  },
  handler: async (ctx, { confirmDestruction = false }) => {
    if (!confirmDestruction) {
      throw new Error('Requires explicit confirmation');
    }
    // ... proceed with deletion
  },
});
```

**Protected Operations:**

- `setCategories` - Deletes ALL categories including custom ones
- `replaceCatalogFromSections` - Deletes ALL products

### Memory Safety

Large operations trigger warnings:

```typescript
if (products.length > CATALOG_MEMORY_WARNING_THRESHOLD) {
  console.warn(ADMIN_ERRORS.MEMORY_WARNING(products.length));
}
```

**Threshold:** 1,000 records
**Recommendation:** Implement pagination for catalogs exceeding this limit

## Type Safety

### Explicit Return Types

Functions use explicit types instead of generic casting:

```typescript
// Before
return data as Record<string, string>; // ❌

// After
return productToUpdateResult(data); // ✅
```

**Benefits:**

- Compile-time type checking
- Better IDE autocomplete
- Prevents type mismatches

### Validated Inputs

All inputs are validated at function boundaries:

```typescript
export const updateProduct = mutation({
  args: {
    kod: v.string(),           // Convex validator
    updates: v.record(...)     // Validated schema
  },
  handler: async (ctx, { kod, updates }) => {
    const validated = sanitizeString(kod, 100); // Runtime validation
    // ... use validated value
  },
});
```

## Data Integrity

### Category-Product Relationship

Cascade deletion protection:

```typescript
// Cannot delete category if it has products
const products = await ctx.db
  .query('products')
  .withIndex('by_category', ...)
  .collect();

if (products.length > 0) {
  throw new Error(`Category contains ${products.length} products`);
}
```

### Image Cleanup

Images are automatically cleaned up when products are deleted:

```typescript
await deleteProductImages(ctx, product); // Delete files
await ctx.db.delete(product._id); // Delete record
```

## Logging & Monitoring

### Error Logging

All errors are logged with context:

```typescript
console.error(`Failed to delete storage ${id}:`, err);
console.warn(`Deleting ${count} custom categories:`, slugs);
```

### Operation Metrics

Large operations return detailed metrics:

```typescript
return {
  ok: true,
  productsInserted: 150,
  categoriesDeleted: 3,
};
```

## Best Practices

### 1. Never Trust Client Input

- All inputs validated at function boundary
- Multiple validation layers (Convex schema + runtime)
- Sanitization before database operations

### 2. Fail Securely

- Generic error messages for public endpoints
- Detailed errors only for authenticated admins
- Storage errors don't block database operations

### 3. Defense in Depth

- Authentication at API route level
- Authorization at mutation level
- Input validation at handler level
- Data validation at database level

### 4. Audit Trail

- All admin operations logged
- Deletion metrics tracked
- Rate limit attempts recorded

## Future Enhancements

### High Priority

1. **Implement Convex Auth** - Native authentication when available
2. **Add Audit Logging** - Track all admin operations in database
3. **IP Whitelist** - Restrict admin access by IP range
4. **2FA Support** - Two-factor authentication for admin

### Medium Priority

1. **Pagination** - Implement for catalogs >1000 products
2. **Bulk Operations** - Batch updates with progress tracking
3. **Role-Based Access** - Multiple admin permission levels
4. **Session Management** - Active session tracking and revocation

### Low Priority

1. **CSRF Protection** - Token-based CSRF prevention
2. **Request Signing** - Sign requests between Next.js and Convex
3. **Content Security** - File upload scanning
4. **Rate Limit Per User** - Track by user ID, not just IP

## Security Checklist

Before deploying to production:

- [ ] Environment variables are set correctly
- [ ] JWT_SECRET is strong and unique (min 32 characters)
- [ ] ADMIN_PASSWORD is strong (min 16 characters)
- [ ] HTTPS is enforced in production
- [ ] Cookies are set with `secure: true` in production
- [ ] Admin routes are behind Next.js middleware authentication
- [ ] Rate limiting is enabled and configured
- [ ] Error logging is enabled
- [ ] Monitoring is set up for admin operations
- [ ] Backup strategy is in place
- [ ] All mutations have authentication checks
- [ ] Input validation is applied consistently
- [ ] Destructive operations require confirmation

## Contact

For security issues or questions, contact: [Your security contact]

---

Last updated: 2026-02-03
