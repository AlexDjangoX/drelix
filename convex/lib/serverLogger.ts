/**
 * Server-side logger for Convex mutations
 * Logs are output to console and can be captured from Convex dashboard
 */

type LogLevel = "INFO" | "WARN" | "ERROR" | "DEBUG";

class ServerLogger {
  private sessionId: string;
  private logs: string[] = [];

  constructor() {
    this.sessionId = new Date().toISOString();
  }

  private formatLog(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const dataStr =
      data !== undefined ? `\n  DATA: ${JSON.stringify(data, null, 2)}` : "";
    return `[${timestamp}] [${level}] ${message}${dataStr}`;
  }

  log(level: LogLevel, message: string, data?: any) {
    const formatted = this.formatLog(level, message, data);
    this.logs.push(formatted);

    // Output to Convex console
    if (level === "ERROR") {
      console.error(formatted);
    } else if (level === "WARN") {
      console.warn(formatted);
    } else {
      console.log(formatted);
    }
  }

  info(message: string, data?: any) {
    this.log("INFO", message, data);
  }

  warn(message: string, data?: any) {
    this.log("WARN", message, data);
  }

  error(message: string, data?: any) {
    this.log("ERROR", message, data);
  }

  debug(message: string, data?: any) {
    this.log("DEBUG", message, data);
  }

  separator(title?: string) {
    const line = "=".repeat(80);
    if (title) {
      console.log(`\n${line}`);
      console.log(title);
      console.log(`${line}\n`);
    } else {
      console.log(line);
    }
  }

  getLogs(): string[] {
    return this.logs;
  }
}

// Create a new logger instance for each mutation
export function createServerLogger(): ServerLogger {
  return new ServerLogger();
}
