# Convex Backend - Drelix

Production-ready backend for the Drelix product catalog and admin system.

## Overview

This Convex backend provides:

- **Product catalog management** with categories
- **Admin authentication** with rate limiting
- **Image storage** for product photos
- **Secure CRUD operations** with input validation
- **CSV import/export** capabilities

## Architecture

```
convex/
├── _generated/          # Auto-generated Convex types
├── lib/                 # Shared utilities
│   ├── authHelpers.ts   # Login rate limiting logic
│   ├── constants.ts     # Configuration constants
│   ├── convexAuth.ts    # Authentication middleware
│   ├── errorMessages.ts # Centralized error messages
│   ├── helpers.ts       # Data transformation utilities
│   ├── types.ts         # TypeScript type definitions
│   ├── validators.ts    # Convex input validators
│   └── index.ts         # Barrel exports
├── auth.ts              # Login rate limiting mutations
├── catalog.ts           # Product & category mutations/queries
├── crons.ts             # Scheduled jobs
├── schema.ts            # Database schema definition
├── SECURITY.md          # Security documentation
├── PRODUCTION_CHECKLIST.md # Deployment guide
└── README.md           # This file
```

## Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn
- Convex account

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Deploy to Convex
npx convex dev
```

### Environment Variables

Required variables in `.env.local`:

```bash
# Convex
CONVEX_DEPLOYMENT=dev:your-deployment
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Authentication
JWT_SECRET=your-secret-key-min-32-chars
ADMIN_PASSWORD=your-secure-admin-password
```

## Schema

### Products Table

Stores product information from CSV imports:

- **Kod** (string): Unique product code
- **Nazwa** (string): Product name
- **CenaNetto** (string): Net price
- **Rodzaj** (string): Product type
- Other CSV columns...
- **categorySlug** (string): Associated category
- **imageStorageId** (optional): Large image
- **thumbnailStorageId** (optional): Thumbnail image

**Indexes:**

- `by_kod`: Find product by code
- `by_category`: List products in category

### Categories Table

Organizes products into sections:

- **slug** (string): URL-friendly identifier
- **titleKey** (string): i18n translation key
- **displayName** (optional): Custom category name
- **createdAt** (optional): Creation timestamp

**Indexes:**

- `by_slug`: Find category by slug

### Login Attempts Table

Tracks failed login attempts for rate limiting:

- **key** (string): Hashed client identifier (IP)
- **attempts** (number): Failed attempt count
- **lastAttemptAt** (number): Timestamp of last attempt

**Indexes:**

- `by_key`: Find attempts by client
- `by_lastAttemptAt`: Cleanup old records

## API Reference

### Public Queries (No Auth Required)

#### `listCatalogSections`

Lists entire catalog grouped by category.

```typescript
const sections = await convex.query(api.catalog.listCatalogSections);
// Returns: CatalogSection[]
```

#### `listCategories`

Lists all categories (for navigation).

```typescript
const categories = await convex.query(api.catalog.listCategories);
// Returns: Category[]
```

#### `getCatalogSection`

Gets products for a specific category.

```typescript
const section = await convex.query(api.catalog.getCatalogSection, {
  slug: 'protective-gloves',
});
// Returns: CatalogSection | null
```

#### `checkLoginAllowed`

Checks if login is allowed for a client.

```typescript
const result = await convex.query(api.auth.checkLoginAllowed, {
  key: hashedIp,
});
// Returns: { allowed: boolean, lockoutUntil?: number }
```

### Admin Mutations (Auth Required)

All admin mutations require authentication via `requireAdmin()` middleware.

#### `updateProduct`

Updates a product's fields.

```typescript
await convex.mutation(api.catalog.updateProduct, {
  kod: 'PROD-123',
  updates: { Nazwa: 'New Name', CenaNetto: '29.99' },
});
```

#### `createProduct`

Creates a new product.

```typescript
await convex.mutation(api.catalog.createProduct, {
  categorySlug: 'gloves',
  row: {
    Kod: 'PROD-456',
    Nazwa: 'Work Gloves',
    CenaNetto: '15.99',
    // ... other fields
  },
});
```

#### `deleteProduct`

Deletes a product and its images.

```typescript
await convex.mutation(api.catalog.deleteProduct, {
  kod: 'PROD-123',
});
```

#### `createCategory`

Creates a new category.

```typescript
await convex.mutation(api.catalog.createCategory, {
  slug: 'new-category',
  displayName: 'New Category',
});
```

#### `deleteCategory`

Deletes an empty category.

```typescript
await convex.mutation(api.catalog.deleteCategory, {
  slug: 'old-category',
});
```

#### `generateUploadUrl`

Generates a URL for file upload.

```typescript
const url = await convex.mutation(api.catalog.generateUploadUrl);
// Upload file to this URL, get storageId back
```

#### `updateProductImage`

Updates product's image references.

```typescript
await convex.mutation(api.catalog.updateProductImage, {
  kod: 'PROD-123',
  storageId: 'storage_abc123',
  thumbnailStorageId: 'storage_def456',
});
```

#### `replaceCatalogFromSections`

Replaces entire catalog (CSV import).

```typescript
await convex.mutation(api.catalog.replaceCatalogFromSections, {
  sections: [
    {
      slug: 'gloves',
      titleKey: 'products.gloves',
      items: [
        /* product rows */
      ],
    },
  ],
});
```

⚠️ **Warning:** This is a destructive operation!

## Security Features

### Authentication

- JWT-based session management
- HTTP-only secure cookies
- 24-hour session expiration
- Admin-only mutation protection

### Rate Limiting

- 5 failed attempts per 15 minutes
- 15-minute lockout after limit
- IP-based tracking (hashed)
- Daily cleanup of stale records

### Input Validation

- String length limits enforced
- Slug format validation
- Type checking on all inputs
- XSS prevention via sanitization

### Error Handling

- Generic errors for public endpoints
- Detailed errors for admin only
- Secure error logging
- No information leakage

### Data Integrity

- Cascade deletion protection
- Race condition handling
- Transaction safety
- Image cleanup on delete

See [SECURITY.md](./SECURITY.md) for complete security documentation.

## Development

### Running Locally

```bash
# Terminal 1: Start Convex
npx convex dev

# Terminal 2: Start Next.js
npm run dev
```

### Code Style

```typescript
// Good: Validated input
const validated = sanitizeString(input, 100, 'Product name');

// Good: Proper error handling
try {
  await riskyOperation();
} catch (error) {
  logError('Operation failed', error);
  throw new Error(ADMIN_ERRORS.OPERATION_FAILED);
}

// Good: Type safety
const result: ProductUpdateResult = productToUpdateResult(doc);
```

### Testing

```bash
# Run linter
npm run lint

# Check types
npx tsc --noEmit

# Manual testing
# 1. Test admin login
# 2. Test CRUD operations
# 3. Test rate limiting
# 4. Test image upload
```

## Deployment

Follow the [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md) for deployment steps.

### Quick Deploy

```bash
# 1. Set production environment variables
# 2. Deploy to Convex
npx convex deploy --prod

# 3. Deploy Next.js
vercel --prod  # or your hosting platform
```

## Maintenance

### Daily Tasks

- Monitor error logs
- Check failed login attempts
- Review rate limit statistics

### Weekly Tasks

- Review security logs
- Verify backup integrity
- Update dependencies (if needed)

### Monthly Tasks

- Security audit
- Performance review
- Dependency updates

## Troubleshooting

### Common Issues

**"Unauthorized" errors on mutations**

- Ensure JWT token is valid
- Check cookie is being sent
- Verify `requireAdmin()` is working

**Rate limiting too aggressive**

- Adjust `MAX_LOGIN_ATTEMPTS` in `lib/constants.ts`
- Check IP hashing is working correctly

**Large catalog slow to load**

- Implement pagination (>1000 products)
- Check indexes are created
- Consider caching strategies

**Image upload fails**

- Check storage permissions
- Verify `generateUploadUrl` is authenticated
- Check file size limits

## Contributing

1. Create a feature branch
2. Make changes with tests
3. Run linter and type checker
4. Submit pull request
5. Wait for review

## License

[Your license here]

## Support

- **Documentation:** See `/docs` folder
- **Issues:** GitHub Issues
- **Email:** [Your support email]

---

Built with [Convex](https://convex.dev) and [Next.js](https://nextjs.org)
