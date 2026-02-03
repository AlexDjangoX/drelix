/**
 * Unit tests for convex/lib/errorMessages.
 * Tests error sanitization and message constants.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  PUBLIC_ERRORS,
  ADMIN_ERRORS,
  sanitizeErrorForPublic,
} from '../../convex/lib/errorMessages';

describe('PUBLIC_ERRORS', () => {
  it('provides generic error messages', () => {
    expect(PUBLIC_ERRORS.UNAUTHORIZED).toBe('Authentication required');
    expect(PUBLIC_ERRORS.NOT_FOUND).toBe('Resource not found');
    expect(PUBLIC_ERRORS.SERVER_ERROR).toBe(
      'An error occurred. Please try again.'
    );
  });
});

describe('ADMIN_ERRORS', () => {
  it('provides detailed error messages with parameters', () => {
    expect(ADMIN_ERRORS.PRODUCT_NOT_FOUND('ABC-123')).toBe(
      'Product not found: ABC-123'
    );
    expect(ADMIN_ERRORS.CATEGORY_EXISTS('test-slug')).toBe(
      'Category already exists: test-slug'
    );
    expect(ADMIN_ERRORS.CATEGORY_HAS_PRODUCTS('gloves', 5)).toBe(
      'Cannot delete category "gloves": it contains 5 product(s)'
    );
  });
});

describe('sanitizeErrorForPublic', () => {
  it('returns generic unauthorized message for auth errors', () => {
    const error = new Error('Unauthorized: Admin access required');
    expect(sanitizeErrorForPublic(error)).toBe(PUBLIC_ERRORS.UNAUTHORIZED);
  });

  it('returns generic not found message for not found errors', () => {
    const error = new Error('Product not found: XYZ');
    expect(sanitizeErrorForPublic(error)).toBe(PUBLIC_ERRORS.NOT_FOUND);
  });

  it('returns generic invalid input for validation errors', () => {
    const error = new Error('Invalid slug format');
    expect(sanitizeErrorForPublic(error)).toBe(PUBLIC_ERRORS.INVALID_INPUT);
  });

  it('returns generic rate limit message for rate limit errors', () => {
    const error = new Error('Rate limit exceeded');
    expect(sanitizeErrorForPublic(error)).toBe(PUBLIC_ERRORS.RATE_LIMITED);
  });

  it('returns generic server error for unknown errors', () => {
    const error = new Error('Some unexpected database error');
    expect(sanitizeErrorForPublic(error)).toBe(PUBLIC_ERRORS.SERVER_ERROR);
  });

  it('handles non-Error objects gracefully', () => {
    expect(sanitizeErrorForPublic('string error')).toBe(
      PUBLIC_ERRORS.SERVER_ERROR
    );
    expect(sanitizeErrorForPublic(null)).toBe(PUBLIC_ERRORS.SERVER_ERROR);
    expect(sanitizeErrorForPublic(undefined)).toBe(PUBLIC_ERRORS.SERVER_ERROR);
  });
});

describe('logError', () => {
  const originalConsoleError = console.error;
  let consoleOutput: unknown[][] = [];

  beforeEach(() => {
    consoleOutput = [];
    console.error = (...args: unknown[]) => {
      consoleOutput.push(args);
    };
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it('logs error message with context', async () => {
    const { logError } = await import('../../convex/lib/errorMessages');
    const error = new Error('Test error');
    logError('TestContext', error);

    expect(consoleOutput.length).toBeGreaterThan(0);
    expect(consoleOutput[0][0]).toContain('TestContext');
    expect(consoleOutput[0][1]).toBe('Test error');
  });

  it('logs stack trace for Error objects', async () => {
    const { logError } = await import('../../convex/lib/errorMessages');
    const error = new Error('Test error with stack');
    logError('TestContext', error);

    const hasStackLog = consoleOutput.some((log) =>
      log.some((arg: unknown) => arg && String(arg).includes('Stack trace'))
    );
    expect(hasStackLog).toBe(true);
  });

  it('handles non-Error objects', async () => {
    const { logError } = await import('../../convex/lib/errorMessages');
    logError('TestContext', 'Plain string error');

    expect(consoleOutput[0][0]).toContain('TestContext');
    expect(consoleOutput[0][1]).toBe('Plain string error');
  });

  it('handles null and undefined', async () => {
    const { logError } = await import('../../convex/lib/errorMessages');
    logError('TestContext', null);
    logError('TestContext', undefined);

    expect(consoleOutput.length).toBe(2);
  });
});
