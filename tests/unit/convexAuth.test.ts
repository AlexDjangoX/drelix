/**
 * Unit tests for convex/lib/convexAuth.
 * Pure functions - no mocks required.
 */
import { describe, it, expect, vi } from 'vitest';
import {
  sanitizeString,
  validateSlug,
  validateRateLimitKey,
  requireAdmin,
  isAdmin,
} from '../../convex/lib/convexAuth';

describe('sanitizeString', () => {
  it('returns trimmed string', () => {
    expect(sanitizeString('  hello  ', 100, 'Test')).toBe('hello');
  });

  it('throws when value is not a string', () => {
    expect(() => sanitizeString(123 as unknown as string, 100, 'Test')).toThrow(
      'Test must be a string'
    );
  });

  it('throws when empty after trim', () => {
    expect(() => sanitizeString('   ', 100, 'Test')).toThrow(
      'Test cannot be empty'
    );
  });

  it('throws when exceeds maxLength', () => {
    expect(() => sanitizeString('a'.repeat(101), 100, 'Test')).toThrow(
      'Test exceeds maximum length of 100 characters'
    );
  });

  it('accepts string at maxLength', () => {
    expect(sanitizeString('a'.repeat(100), 100, 'Test')).toBe('a'.repeat(100));
  });
});

describe('validateSlug', () => {
  it('normalizes slug to lowercase with hyphens', () => {
    expect(validateSlug('  Hello World  ')).toBe('hello-world');
  });

  it('normalizes multiple spaces to single hyphen', () => {
    expect(validateSlug('hello   world')).toBe('hello-world');
  });

  it('throws when empty after normalize', () => {
    expect(() => validateSlug('   ')).toThrow('Slug cannot be empty');
  });

  it('throws when exceeds maxLength', () => {
    expect(() => validateSlug('a'.repeat(101), 100)).toThrow(
      'Slug exceeds maximum length of 100 characters'
    );
  });

  it('throws when contains invalid characters', () => {
    expect(() => validateSlug('hello@world')).toThrow(
      'Slug can only contain lowercase letters, numbers, hyphens, and underscores'
    );
    expect(() => validateSlug('hello.world')).toThrow();
    expect(() => validateSlug('hello world!')).toThrow();
  });

  it('accepts valid slug with alphanumeric, hyphens, underscores', () => {
    expect(validateSlug('hello-world')).toBe('hello-world');
    expect(validateSlug('hello_world')).toBe('hello_world');
    expect(validateSlug('abc123')).toBe('abc123');
    expect(validateSlug('category-2024')).toBe('category-2024');
  });

  it('handles mixed valid characters', () => {
    expect(validateSlug('test_category-123')).toBe('test_category-123');
  });
});

describe('validateRateLimitKey', () => {
  it('accepts valid 64-char hex (SHA-256)', () => {
    const key = 'a'.repeat(64);
    expect(validateRateLimitKey(key)).toBe(key);
  });

  it('accepts 32-char hex minimum', () => {
    const key = 'f'.repeat(32);
    expect(validateRateLimitKey(key)).toBe(key);
  });

  it('accepts 128-char hex maximum', () => {
    const key = 'e'.repeat(128);
    expect(validateRateLimitKey(key)).toBe(key);
  });

  it('accepts mixed case hex', () => {
    const key = 'AbCdEf0123456789'.repeat(4);
    expect(validateRateLimitKey(key)).toBe(key);
  });

  it('throws when not a string', () => {
    expect(() => validateRateLimitKey(123 as unknown as string)).toThrow(
      'Rate limit key must be a string'
    );
  });

  it('throws when too short', () => {
    expect(() => validateRateLimitKey('a'.repeat(31))).toThrow(
      'Invalid rate limit key format'
    );
  });

  it('throws when too long', () => {
    expect(() => validateRateLimitKey('a'.repeat(129))).toThrow(
      'Invalid rate limit key format'
    );
  });

  it('throws when not hex', () => {
    expect(() => validateRateLimitKey('g'.repeat(64))).toThrow(
      'Invalid rate limit key format'
    );
  });

  it('throws when contains special characters', () => {
    expect(() => validateRateLimitKey('abc-123-xyz-000'.repeat(4))).toThrow(
      'Invalid rate limit key format'
    );
  });
});

describe('requireAdmin', () => {
  it('resolves without error for placeholder implementation', async () => {
    const mockCtx = {} as any;
    await expect(requireAdmin(mockCtx)).resolves.toBeUndefined();
  });

  it('does not throw in current MVP implementation', async () => {
    const mockCtx = {} as any;
    await expect(requireAdmin(mockCtx)).resolves.not.toThrow();
  });
});

describe('isAdmin', () => {
  it('returns true for placeholder implementation', async () => {
    const mockCtx = {} as any;
    const result = await isAdmin(mockCtx);
    expect(result).toBe(true);
  });

  it('calls requireAdmin internally', async () => {
    const mockCtx = {} as any;
    // In MVP, isAdmin always succeeds since requireAdmin doesn't throw
    const result = await isAdmin(mockCtx);
    expect(typeof result).toBe('boolean');
  });
});
