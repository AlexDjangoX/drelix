import { internalMutation, mutation, query } from './_generated/server';
import { v } from 'convex/values';
import {
  MAX_LOGIN_ATTEMPTS,
  LOGIN_LOCKOUT_MS,
  LOGIN_ATTEMPTS_CLEANUP_AGE_MS,
} from './lib/constants';
import { getLoginAttemptState } from './lib/authHelpers';
import { validateRateLimitKey } from './lib/convexAuth';

/** Read-only check: is login allowed for this key? */
export const checkLoginAllowed = query({
  args: { key: v.string() },
  handler: async (ctx, { key }) => {
    // Validate rate limit key to prevent abuse
    const validatedKey = validateRateLimitKey(key);

    const now = Date.now();
    const existing = await ctx.db
      .query('loginAttempts')
      .withIndex('by_key', (q) => q.eq('key', validatedKey))
      .unique();

    const { isLockedOut, lockoutUntil } = getLoginAttemptState(existing, now);
    if (isLockedOut) return { allowed: false, lockoutUntil: lockoutUntil! };
    return { allowed: true };
  },
});

/**
 * Record a failed login attempt. Call only when password was wrong.
 * Returns { allowed, lockoutUntil? } if we just hit the limit.
 */
export const recordFailedLoginAttempt = mutation({
  args: { key: v.string() },
  handler: async (ctx, { key }) => {
    // Validate rate limit key to prevent abuse
    const validatedKey = validateRateLimitKey(key);

    const now = Date.now();
    const existing = await ctx.db
      .query('loginAttempts')
      .withIndex('by_key', (q) => q.eq('key', validatedKey))
      .unique();

    const { attempts, isLockedOut, lockoutUntil } = getLoginAttemptState(
      existing,
      now
    );

    if (existing) {
      if (isLockedOut) return { allowed: false, lockoutUntil: lockoutUntil! };
      if (attempts >= MAX_LOGIN_ATTEMPTS) {
        // Lockout expired, reset to 1 attempt
        await ctx.db.patch(existing._id, {
          attempts: 1,
          lastAttemptAt: now,
        });
        return { allowed: true };
      }

      const newAttempts = attempts + 1;
      await ctx.db.patch(existing._id, {
        attempts: newAttempts,
        lastAttemptAt: now,
      });
      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
        return { allowed: false, lockoutUntil: now + LOGIN_LOCKOUT_MS };
      }
      return { allowed: true };
    }

    await ctx.db.insert('loginAttempts', {
      key: validatedKey,
      attempts: 1,
      lastAttemptAt: now,
    });
    return { allowed: true };
  },
});

/** Clear attempts on successful login. */
export const clearLoginAttempts = mutation({
  args: { key: v.string() },
  handler: async (ctx, { key }) => {
    // Validate rate limit key to prevent abuse
    const validatedKey = validateRateLimitKey(key);

    const existing = await ctx.db
      .query('loginAttempts')
      .withIndex('by_key', (q) => q.eq('key', validatedKey))
      .unique();
    if (existing) {
      await ctx.db.delete(existing._id);
    }
    return { ok: true };
  },
});

/** Internal: remove stale records (older than 24h). Called by cron. */
export const cleanupStaleLoginAttempts = internalMutation({
  args: {},
  handler: async (ctx) => {
    const cutoff = Date.now() - LOGIN_ATTEMPTS_CLEANUP_AGE_MS;
    const stale = await ctx.db
      .query('loginAttempts')
      .withIndex('by_lastAttemptAt', (q) => q.lt('lastAttemptAt', cutoff))
      .collect();
    for (const row of stale) {
      await ctx.db.delete(row._id);
    }
    return { deleted: stale.length };
  },
});
