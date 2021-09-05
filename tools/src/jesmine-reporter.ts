import * as path from 'path';
import * as fs from 'fs';
import { AutomationLoggerInternal, writeToConsole } from './logger';
import { createHtmlReport } from './html-report';

let __registered;

const LOG_DIR = 'logs';
let LOG_FILE: string = undefined;
const CURRENT_SUITE: string[] = [];
const TEST_FAILURES: { error: Error }[] = [];

export function registerJasmineReporter() {
    const env = (jasmine as any).getEnv();
    if (env && !__registered) {
        __registered = true;
        env.addReporter(new JasmineReporter());
    }
}

class JasmineReporter {
    jasmineStarted() {
        createDir(LOG_DIR);
    }
    suiteStarted(suite: { description: string; testPath: string }) {
        const filePath = path.parse(suite.testPath);
        const relativePath = filePath.dir.substring(filePath.dir.indexOf('src') + 4);
        const logFile = path.join(LOG_DIR, relativePath, filePath.name + '.html');
        if (LOG_FILE !== logFile) {
            LOG_FILE = logFile;
            AutomationLoggerInternal.startFile(filePath.name);
        }
        CURRENT_SUITE.push(suite.description);
        AutomationLoggerInternal.startSuite(suite.description);
    }
    suiteDone(suite) {
        CURRENT_SUITE.pop();
        AutomationLoggerInternal.endSuite(!!TEST_FAILURES.length);
        if (CURRENT_SUITE.length === 0 && TEST_FAILURES.length > 0) {
            AutomationLoggerInternal.endFile(!!TEST_FAILURES.length);
            createDir(path.dirname(LOG_FILE));
            const report = createHtmlReport();
            fs.writeFileSync(LOG_FILE, report);
        }
        TEST_FAILURES.length = 0;
    }
    specStarted(test: { description: string }) {
        AutomationLoggerInternal.startTest(test.description);
    }
    specDone(test: { status: string; failedExpectations: { error: Error }[] }) {
        if (test.status === 'failed')
            TEST_FAILURES.push(...test.failedExpectations);
        AutomationLoggerInternal.endTest(test.status);
    }
}

function createDir(dir: string): void {
    if (!fs.existsSync(dir)) {
        try {
            fs.mkdirSync(dir, { recursive: true });
        } catch (e) {
            writeToConsole(`ERROR: while creating a folder: ${dir}\n${e.stack}`);
        }
    }
}