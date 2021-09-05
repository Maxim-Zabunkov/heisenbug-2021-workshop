import { DeepPartial, Expected } from "./contracts";

export type ApiMock<T> = {
    [P in keyof T]
    : T[P] extends (...args: infer Req) => Promise<infer Resp> ? RequestMock<Req, Resp>
    : T[P] extends object ? ApiMock<T[P]>
    : never;
}

interface RequestMock<Req, Resp> {
    expectRequest(request?: Expected<Req>): Promise<PromiseMock<Req, Resp>>;
    expectNoRequest(request?: Expected<Req>): Promise<void>;
    expectRequestCount(count: number, request?: Expected<Req>): Promise<PromiseMock<Req, Resp>[]>;

    setup(response: DeepPartial<Resp>, request?: Expected<Req>): void;
    clearCallHistory(): void;
    resetMock(): void;
}

interface PromiseMock<Req, R> {
    readonly request: Req;
    resolve(response: R): void;
    reject(error: Error): void;
}