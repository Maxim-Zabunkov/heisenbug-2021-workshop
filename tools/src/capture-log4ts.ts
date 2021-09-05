import BaseAppender from "log4ts/build/appenders/BaseAppender";
import { Logger, LoggerConfig } from "log4ts";
import { LogEntry } from "log4ts/build/LogEntry";
import { LogLevel } from "log4ts/build/LogLevel";
import { AutomationLogger } from "./logger";

const map = new Map<LogLevel, string>([
    [LogLevel.ERROR, 'error'],
    [LogLevel.FATAL, 'error'],
    [LogLevel.WARN, 'warn'],
    [LogLevel.INFO, 'log'],
    [LogLevel.TRACE, 'debug']
]);

export function captureLog4tsLogs() {
    const Appender = class extends BaseAppender {
        clear = () => void 0;
        append = ({ tag, level, message }: LogEntry) => {
            const msg = `${LogLevel[level]}: ${tag ? '[' + tag + '] ' : ''}${message}`;
            const method = map.get(level);
            AutomationLogger[method]('App', message);
        };
    }
    Logger.setConfig(new LoggerConfig(new Appender(), LogLevel.ALL));
}