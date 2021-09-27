import { ReplaySubject, Subscription } from 'rxjs';
import { filter, take, timeout } from 'rxjs/operators';
import { Expected } from "./expect-utils";
import { Allure } from "./allure";
import MatcherResult = jest.CustomMatcherResult;

export type ApiMock<T> = {
    [K in keyof T]:
    T[K] extends () => Promise<infer Resp> ? RequestMock<never, Resp> :
    T[K] extends (...args: infer Args) => Promise<infer Resp> ? RequestMock<Args, Resp> :
    T[K] extends object ? ApiMock<T[K]> :
    never;
};

interface Resettable {
    reset(): void;
}

export interface RequestMock<Args, Resp> extends Resettable {
    expectRequest(expected?: Expected<Args>, timeoutMs?: number): Promise<PromiseMock<Args, Resp>>;
    expectNoRequest(expected?: Expected<Args>, timeoutMs?: number): Promise<void>;
    setup(setup: Resp | Error): void;
}

export interface PromiseMock<Args, Resp> {
    readonly request: Args;
    resolve(response: Resp): void;
    reject(reason: Error): void;
}

export class MockUtils {
    private static mocks: Resettable[] = [];

    static requestMock<Resp>(name: string): (...args: any[]) => Promise<Resp> {
        const mock = new RequestMockImpl<any, Resp>(name);
        MockUtils.mocks.push(mock);
        return new Proxy((...args: any[]) => mock.handleRequest(args), {
            get(target: any, p: PropertyKey) {
                return p in mock ? mock[p as keyof RequestMockImpl<any, Resp>] : target[p];
            }
        });
    }

    static reset() {
        MockUtils.mocks.forEach(x => x.reset());
        MockUtils.mocks.length = 0;
    }
}

////////// Implementation

const WAIT_TIMEOUT = 100;

class RequestMockImpl<Args extends Array<any>, Resp> implements Resettable, RequestMock<Args, Resp> {
    private _setup: Subscription = Subscription.EMPTY;
    private _calls = new ReplaySubject<PromiseMockImpl<Args, Resp>>();

    constructor(private readonly name: string) {
    }

    reset(): void {
        this._setup.unsubscribe();
        this._calls.complete();
        this._calls.unsubscribe();
        this._calls = new ReplaySubject<PromiseMockImpl<Args, Resp>>();
    }

    expectRequest(expected?: Expected<Args>, timeoutMs?: number): Promise<PromiseMock<Args, Resp>> {
        return Allure.step(`[Mock] ${this.name}.expectRequest(${expected ? JSON.stringify(expected) : ''})`, () => {
            const matcher = requestMatcher(expected);
            const matchResults: string[] = [];
            return this._calls.pipe(
                filter(x => {
                    const result = matcher(x.request);
                    if (!result.pass) matchResults.push(result.message());
                    return result.pass;
                }),
                take(1),
                timeout(timeoutMs ?? WAIT_TIMEOUT)
            ).toPromise().catch(() => {
                const message = matchResults.length
                    ? matchResults.map((r, i) => `\nRequest[${i}] mismatches:\n${r}\n`).join()
                    : 'no requests found';
                throw new Error(`Mock: ${this.name} expectRequest() failed: ${message}`);
            });
        });
    }

    expectNoRequest(expected?: Expected<Args>, timeoutMs?: number): Promise<void> {
        return Allure.step(`[Mock] ${this.name}.expectNoRequest(${expected ? JSON.stringify(expected) : ''})`, () => {
            const matcher = requestMatcher(expected);
            return Promise.race([
                this._calls.pipe(
                    filter(x => matcher(x.request).pass),
                    take(1)
                ).toPromise().then(x => {
                    throw new Error(`Unexpected request found:\n${JSON.stringify(x.request)}`);
                }),
                new Promise(resolve => setTimeout(resolve, timeoutMs ?? WAIT_TIMEOUT))
            ]) as Promise<void>;
        });
    }

    setup(setup: Resp | Error): void {
        this._setup.unsubscribe();
        this._setup = this._calls.subscribe(promiseMock => {
            if (setup instanceof Error)
                promiseMock.reject(setup);
            else
                promiseMock.resolve(setup);
        })
    }

    handleRequest(args: Args): Promise<Resp> {
        Allure.step(`[Mock] called ${this.name}(${args?.length ? JSON.stringify(args) : ''})`);
        const promiseMock = new PromiseMockImpl<Args, Resp>(this.name, args);
        this._calls.next(promiseMock);
        return promiseMock.promise;
    }
}

class PromiseMockImpl<Args, Resp> implements PromiseMock<Args, Resp> {
    readonly promise: Promise<Resp>;
    resolve!: (response: Resp) => void;
    reject!: (reason: Error) => void;

    constructor(private readonly name: string, readonly request: Args) {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = response =>
                Allure.step(`[Mock] ${this.name} resolved with ${JSON.stringify(response)}`, () =>
                    resolve(response));
            this.reject = reason =>
                Allure.step(`[Mock] ${this.name} rejected with ${JSON.stringify(reason)}`, () =>
                    reject(reason));
        })
    }
}

const SUCCESS: MatcherResult = { pass: true, message: null as any };

function requestMatcher<T>(expected?: Expected<T>): (request: T) => MatcherResult {
    if (expected === undefined)
        return () => SUCCESS;

    return request => {
        try {
            expect({ request }).toMatchObject({ request: expected });
            return SUCCESS;
        } catch (e) {
            return { pass: false, message: () => (e as Error).message };
        }
    };
}