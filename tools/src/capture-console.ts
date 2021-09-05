import { AutomationLogger, Logger } from "./logger";

export function captureConsoleLogs({ logToConsole }: { logToConsole: boolean } = { logToConsole: false }): void {
    const realConsole = { ...global.console };

    override('error', 'error', realConsole, logToConsole);
    override('warn', 'warn', realConsole, logToConsole);
    override('log', 'log', realConsole, logToConsole);
    override('trace', 'debug', realConsole, logToConsole);
    override('debug', 'debug', realConsole, logToConsole);
}

function override(method: any, toMethod: any, realConsole: Console, duplicateLogsInConsole: boolean): void {
    global.console[method] = (...args) => {
        AutomationLogger[toMethod](...args);
        if (duplicateLogsInConsole) realConsole[method](...args);
    }
}