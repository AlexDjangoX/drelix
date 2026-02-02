import { internalMutation, mutation, query } from './_generated/server';
import { v } from 'convex/values';

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_MS = 15 * 60 * 1000; // 15 min lockout after max attempts

/** Read-only check: is login allowed for this key? */
export const checkLoginAllowed = query({
  args: { key: v.string() },
  handler: async (ctx, { key }) => {
    const now = Date.now();
    const cutoff = now - WINDOW_MS;

    const existing = await ctx.db
      .query('loginAttempts')
      .withIndex('by_key', (q) => q.eq('key', key))
      .unique();

    if (!existing) return { allowed: true };

    const inWindow = existing.lastAttemptAt > cutoff;
    const attempts = inWindow ? existing.attempts : 0;

    if (attempts >= MAX_ATTEMPTS) {
      const lockoutUntil = existing.lastAttemptAt + LOCKOUT_MS;
      if (now < lockoutUntil) {
        return { allowed: false, lockoutUntil };
      }
    }
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
    const now = Date.now();
    const cutoff = now - WINDOW_MS;

    const existing = await ctx.db
      .query('loginAttempts')
      .withIndex('by_key', (q) => q.eq('key', key))
      .unique();

    if (existing) {
      const inWindow = existing.lastAttemptAt > cutoff;
      const attempts = inWindow ? existing.attempts : 0;

      if (attempts >= MAX_ATTEMPTS) {
        const lockoutUntil = existing.lastAttemptAt + LOCKOUT_MS;
        if (now < lockoutUntil) {
          return { allowed: false, lockoutUntil };
        }
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
      if (newAttempts >= MAX_ATTEMPTS) {
        return { allowed: false, lockoutUntil: now + LOCKOUT_MS };
      }
      return { allowed: true };
    }

    await ctx.db.insert('loginAttempts', {
      key,
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
    const existing = await ctx.db
      .query('loginAttempts')
      .withIndex('by_key', (q) => q.eq('key', key))
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
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
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
