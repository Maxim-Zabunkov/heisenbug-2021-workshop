import { createError } from "./error-handling";

export enum LogLevel {
    DEBUG,
    LOG,
    WARN,
    ERROR,
    SUCCESS,
    SKIPPED
}

export interface LogEntry {
    category: string;
    message: string;
    moreInfo?: string;
    logLevel: LogLevel;

    parent?: LogEntry;
    entries?: LogEntry[];
    isOperation?: boolean;
}

export interface Logger {
    logLevel: LogLevel;

    log(category: string, message: string, moreInfo?: string): void;
    debug(category: string, message: string, moreInfo?: string): void;
    warn(category: string, message: string, moreInfo?: string): void;
    error(category: string, message: string, moreInfo?: string): void;

    startOperation<T>(category: string, message: string, operation: (start: LogEntry) => T): T;
    startOperation<T>(category: string, message: string, moreInfo: string, operation: (start: LogEntry) => T): T;
}

class LoggerImpl implements Logger {
    logLevel: LogLevel = LogLevel.LOG;

    logs?: LogEntry;
    private operation?: LogEntry;
    private suite?: LogEntry;
    private test?: LogEntry;

    startFile(fileName: string): void {
        this.logs = this.operation = null;
        this.startOperationEntry({ category: 'File', message: fileName, logLevel: LogLevel.SUCCESS });
    }

    endFile(hasErrors: boolean): void {
        if (hasErrors) this.logs.logLevel = LogLevel.ERROR;
    }

    startSuite(suite: string): void {
        this.suite = this.startOperationEntry({ category: 'Suite', message: suite, logLevel: LogLevel.SUCCESS });
    }

    endSuite(failed: boolean): void {
        this.endOpeartionEntry(this.suite, failed ? LogLevel.ERROR : LogLevel.SUCCESS);
    }

    startTest(test: string): void {
        this.test = this.startOperationEntry({ category: 'Test', message: test, logLevel: LogLevel.SUCCESS });
    }

    endTest(status: string): void {
        const logLevel = status === 'failed' ? LogLevel.ERROR :
            status === 'passed' ? LogLevel.SUCCESS :
                ['todo', 'pending', 'disabled'].includes(status) ? LogLevel.SKIPPED
                    : LogLevel.LOG;
        this.endOpeartionEntry(this.test, logLevel);
    }

    log(category: string, message: string, moreInfo?: string): void {
        this.addLogEntry({ category, message, moreInfo, logLevel: LogLevel.LOG });
    }
    debug(category: string, message: string, moreInfo?: string): void {
        this.addLogEntry({ category, message, moreInfo, logLevel: LogLevel.DEBUG });
    }
    warn(category: string, message: string, moreInfo?: string): void {
        this.addLogEntry({ category, message, moreInfo, logLevel: LogLevel.WARN });
    }
    error(category: string, message: string, moreInfo?: string): void {
        this.addLogEntry({ category, message, moreInfo, logLevel: LogLevel.ERROR });
    }

    startOperation<T>(category: string, message: string, operation: (start: LogEntry) => T): T;
    startOperation<T>(category: string, message: string, moreInfo: string, operation: (start: LogEntry) => T): T;
    startOperation<T>(category: any, message: any, moreInfoOrOperation: any, op?: any): any {
        const moreInfo: string = op ? moreInfoOrOperation : undefined;
        const operation: Function = op ? op : moreInfoOrOperation;

        const start = this.startOperationEntry({ category, message, moreInfo, logLevel: LogLevel.LOG });

        let result;
        try {
            result = operation(start);
        } catch (e) {
            try {
                throw createError(category, `${message} - FAILED`);
            } finally {
                this.endOpeartionEntry(start, LogLevel.ERROR);
            }
        }

        if (isPromise(result))
            return result.then(x => {
                this.endOpeartionEntry(start, LogLevel.SUCCESS);
                return x;
            }, error => {
                const e = createError(category, `${message} - FAILED - ${error.message}`, error);
                this.endOpeartionEntry(start, LogLevel.ERROR);
                return Promise.reject(error);
            });
        else {
            this.endOpeartionEntry(start, LogLevel.SUCCESS);
            return result;
        }
    }

    private startOperationEntry(entry: LogEntry): LogEntry {
        return this.operation = this.addLogEntry(entry);
    }

    private endOpeartionEntry(entry: LogEntry, newLogLevel?: LogLevel) {
        if (entry !== this.operation)
            writeToConsole(`ERROR: An attempt to endOperation != current running operation.`);
        if (newLogLevel) entry.logLevel = newLogLevel;
        this.operation = this.operation.parent;
    }

    private addLogEntry(logEntry: LogEntry): LogEntry {
        const entry = {
            entries: [],
            ...logEntry
        } as LogEntry;
        if (this.operation) {
            entry.parent = this.operation;
            this.operation.entries?.push(entry);
        } else {
            this.logs = entry;
        }
        return entry;
    }

}
const _logger = new LoggerImpl();

export const AutomationLoggerInternal = _logger;

export const AutomationLogger = _logger as Logger;

export function writeToConsole(message: string) {
    if (process.stdout) process.stdout.write(message + '\n');
    else console.log(message);
}

function isPromise(value: any): value is Promise<any> {
    return value
        && typeof (value as any).then === 'function'
        && typeof (value as any).catch === 'function';
}