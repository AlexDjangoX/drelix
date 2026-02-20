/**
 * Upload Debug Logger
 * Saves all upload-related logs to localStorage and console
 */

interface LogEntry {
  timestamp: string;
  phase: "preview" | "upload" | "verify";
  level: "info" | "warning" | "error";
  message: string;
  data?: any;
}

class UploadLogger {
  private logs: LogEntry[] = [];
  private sessionId: string;
  private storageKey = "drelix_upload_debug_logs";

  constructor() {
    this.sessionId = new Date().toISOString().replace(/[:.]/g, "-");
    this.loadExistingLogs();
  }

  private loadExistingLogs() {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch {
      // Ignore parse/storage errors; logs will start fresh
    }
  }

  private saveLogs() {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.logs));
    } catch {
      // Ignore quota/storage errors
    }
  }

  log(
    phase: LogEntry["phase"],
    level: LogEntry["level"],
    message: string,
    data?: any,
  ) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      phase,
      level,
      message,
      data,
    };

    this.logs.push(entry);
    this.saveLogs();
  }

  info(phase: LogEntry["phase"], message: string, data?: any) {
    this.log(phase, "info", message, data);
  }

  warning(phase: LogEntry["phase"], message: string, data?: any) {
    this.log(phase, "warning", message, data);
  }

  error(phase: LogEntry["phase"], message: string, data?: any) {
    this.log(phase, "error", message, data);
  }

  clearLogs() {
    this.logs = [];
    this.saveLogs();
  }

  exportLogs(): string {
    const header = `=== DRELIX UPLOAD DEBUG LOGS ===
Session ID: ${this.sessionId}
Generated: ${new Date().toISOString()}
Total Entries: ${this.logs.length}

`;

    const logLines = this.logs
      .map((entry) => {
        const dataStr = entry.data
          ? `\n  Data: ${JSON.stringify(entry.data, null, 2)}`
          : "";
        return `[${entry.timestamp}] [${entry.phase.toUpperCase()}] [${entry.level.toUpperCase()}]
  ${entry.message}${dataStr}`;
      })
      .join("\n\n");

    return header + logLines;
  }

  downloadLogs() {
    if (typeof window === "undefined") return;

    const content = this.exportLogs();
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `upload-debug-${this.sessionId}.log`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  getLogsSummary() {
    const byPhase = this.logs.reduce(
      (acc, log) => {
        acc[log.phase] = (acc[log.phase] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const byLevel = this.logs.reduce(
      (acc, log) => {
        acc[log.level] = (acc[log.level] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return { byPhase, byLevel, total: this.logs.length };
  }
}

// Singleton instance
export const uploadLogger = new UploadLogger();
