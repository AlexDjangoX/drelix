/**
 * Convex auth function tests.
 * Uses convex-test (mock backend) - required for Convex ctx/db.
 */
import { convexTest } from 'convex-test';
import { describe, it, expect } from 'vitest';
import { api } from '../../convex/_generated/api';
import schema from '../../convex/schema';

const modules = import.meta.glob('../../convex/**/*.ts');

describe('auth rate limiting', () => {
  it('checkLoginAllowed returns allowed when no attempts', async () => {
    const t = convexTest(schema, modules);
    const key = 'a'.repeat(64); // Valid hex key
    const result = await t.query(api.auth.checkLoginAllowed, { key });
    expect(result).toEqual({ allowed: true });
  });

  it('recordFailedLoginAttempt then checkLoginAllowed still allowed under limit', async () => {
    const t = convexTest(schema, modules);
    const key = 'b'.repeat(64);
    await t.mutation(api.auth.recordFailedLoginAttempt, { key });
    await t.mutation(api.auth.recordFailedLoginAttempt, { key });
    const result = await t.query(api.auth.checkLoginAllowed, { key });
    expect(result.allowed).toBe(true);
  });

  it('recordFailedLoginAttempt locks out after max attempts (5)', async () => {
    const t = convexTest(schema, modules);
    const key = 'd'.repeat(64);
    // Record 5 failed attempts
    for (let i = 0; i < 5; i++) {
      await t.mutation(api.auth.recordFailedLoginAttempt, { key });
    }
    const result = await t.query(api.auth.checkLoginAllowed, { key });
    expect(result.allowed).toBe(false);
    expect(result.lockoutUntil).toBeDefined();
  });

  it('clearLoginAttempts resets after failed attempts', async () => {
    const t = convexTest(schema, modules);
    const key = 'c'.repeat(64);
    await t.mutation(api.auth.recordFailedLoginAttempt, { key });
    await t.mutation(api.auth.clearLoginAttempts, { key });
    const result = await t.query(api.auth.checkLoginAllowed, { key });
    expect(result).toEqual({ allowed: true });
  });

  it('checkLoginAllowed throws error with invalid key format', async () => {
    const t = convexTest(schema, modules);
    await expect(
      t.query(api.auth.checkLoginAllowed, { key: 'invalid-key' })
    ).rejects.toThrow('Invalid rate limit key format');
  });

  it('recordFailedLoginAttempt throws error with invalid key format', async () => {
    const t = convexTest(schema, modules);
    await expect(
      t.mutation(api.auth.recordFailedLoginAttempt, { key: 'xyz' })
    ).rejects.toThrow('Invalid rate limit key format');
  });
});
