/**
 * Unit tests for convex/lib/authHelpers.
 * Pure function - no mocks.
 */
import { describe, it, expect } from "vitest";
import { getLoginAttemptState } from "../../convex/lib/authHelpers";

describe("getLoginAttemptState", () => {
  const WINDOW_MS = 15 * 60 * 1000;
  const LOCKOUT_MS = 15 * 60 * 1000;

  it("returns zero attempts when no existing record", () => {
    const result = getLoginAttemptState(null, Date.now());
    expect(result).toEqual({
      attempts: 0,
      lockoutUntil: undefined,
      isLockedOut: false,
    });
  });

  it("returns attempts when within window", () => {
    const now = Date.now();
    const existing = { attempts: 3, lastAttemptAt: now - 60_000 };
    const result = getLoginAttemptState(existing, now);
    expect(result.attempts).toBe(3);
    expect(result.isLockedOut).toBe(false);
  });

  it("resets attempts when outside window", () => {
    const now = Date.now();
    const existing = { attempts: 5, lastAttemptAt: now - WINDOW_MS - 1000 };
    const result = getLoginAttemptState(existing, now);
    expect(result.attempts).toBe(0);
    expect(result.isLockedOut).toBe(false);
  });

  it("returns isLockedOut when at max attempts and within lockout", () => {
    const now = Date.now();
    const existing = { attempts: 5, lastAttemptAt: now - 60_000 };
    const result = getLoginAttemptState(existing, now);
    expect(result.attempts).toBe(5);
    expect(result.isLockedOut).toBe(true);
    expect(result.lockoutUntil).toBe(existing.lastAttemptAt + LOCKOUT_MS);
  });

  it("returns not locked out when lockout expired (outside window resets attempts)", () => {
    const now = Date.now();
    const existing = {
      attempts: 5,
      lastAttemptAt: now - LOCKOUT_MS - 1000,
    };
    const result = getLoginAttemptState(existing, now);
    // Outside window: attempts reset to 0, so not locked out
    expect(result.attempts).toBe(0);
    expect(result.isLockedOut).toBe(false);
  });
});
