import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Clean up old login attempt records daily (keeps table small)
crons.daily(
  "cleanup stale login attempts",
  { hourUTC: 3, minuteUTC: 0 },
  internal.auth.cleanupStaleLoginAttempts,
);

export default crons;
