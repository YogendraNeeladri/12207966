import { LogEntry } from '../types';

class LoggingMiddleware {
  private static instance: LoggingMiddleware;
  private logs: LogEntry[] = [];

  private constructor() {}

  public static getInstance(): LoggingMiddleware {
    if (!LoggingMiddleware.instance) {
      LoggingMiddleware.instance = new LoggingMiddleware();
    }
    return LoggingMiddleware.instance;
  }

  public info(message: string, data?: any): void {
    this.log('INFO', message, data);
  }

  public warn(message: string, data?: any): void {
    this.log('WARN', message, data);
  }

  public error(message: string, data?: any): void {
    this.log('ERROR', message, data);
  }

  private log(level: LogEntry['level'], message: string, data?: any): void {
    const logEntry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      data
    };

    this.logs.push(logEntry);
    
    
    const timestamp = logEntry.timestamp.toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}`;
    
    if (data) {
      console.log(logMessage, data);
    } else {
      console.log(logMessage);
    }

   
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000);
    }
  }

  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  public clearLogs(): void {
    this.logs = [];
    this.info('Logs cleared');
  }
}

export const logger = LoggingMiddleware.getInstance();