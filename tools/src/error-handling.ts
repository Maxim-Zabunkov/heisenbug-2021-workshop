import { isArray, isString, times } from "lodash";
import { AutomationLogger, LogLevel } from "./logger";

export interface ErrorInfo {
    message: string;
    moreInfo?: string;
}

export interface ErrorInfoProvider {
    title: string;
    getInfo(): string | ErrorInfo[] | null;
}

let generatingError;
const errorInfoProviders: ErrorInfoProvider[] = [];

export function createError(category: string, message: string, error?: Error): AutomationAssertionError {
    if(error instanceof AutomationAssertionError) return error;
    return AutomationLogger.startOperation(category, message, entry => {
        entry.logLevel = LogLevel.ERROR;
        return new AutomationAssertionError(message, error);
    });
}

class AutomationAssertionError {
    name = 'AutomationAssertionError';
    message: string;
    stack: string;

    constructor(message: string, error?: Error) {
        this.message = `\n${error ? error.message + '\n' : ''}\n`;

        if (error) {
            AutomationLogger.error(error.name, error.message, error.stack);
            this.stack = error.stack;
        }

        if (!generatingError && errorInfoProviders.length) {
            generatingError = true;
            errorInfoProviders.forEach(x => {
                try {
                    const info = x.getInfo();
                    if (isString(info) && info.length) {
                        AutomationLogger.warn('MORE INFO', x.title, info);
                    }
                    if (isArray(info) && info.length) {
                        AutomationLogger.startOperation('MORE INFO', x.title, entry => {
                            entry.logLevel = LogLevel.WARN;
                            info.forEach(i => AutomationLogger.warn('MORE INFO', i.message, i.moreInfo));
                        });
                    }
                } catch (e) {
                    AutomationLogger.error('ERROR', `${x.title}.getInfo failed`, e.stack);
                }
            });
        }
    }
}