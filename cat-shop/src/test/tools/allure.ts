import { Reporter, Status } from "jest-allure/dist/Reporter";

declare const reporter: Reporter;

export const Allure = {
    step<T>(name: string, step?: () => T): T {
        reporter.startStep(name);
        if (!step) {
            reporter.endStep();
            return void 0 as any;
        }

        try {
            const result = step();
            if (isPromise(result)) {
                result
                    .then(() => reporter.endStep())
                    .catch(() => reporter.endStep(Status.Failed));
            } else {
                reporter.endStep();
            }
            return result;
        } catch (e) {
            reporter.endStep(Status.Failed);
            throw e;
        }
    }
}

function isPromise(obj: any): obj is Promise<any> {
    return obj && typeof obj['then'] === 'function';
}