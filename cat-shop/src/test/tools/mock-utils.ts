import { AppApi } from "../../api/contracts";
import { Expected } from "./expect-utils";

async function test(mock: ApiMock<AppApi>) {
    await mock.getCats.expectRequest();
    const rpc = await mock.placeOrder.expectRequest([{ catIds: ['12'] }]);
    rpc.resolve({ orderId: 123 });
    rpc.reject('error');

    mock.getCats.setup([{ id: 'id' }]);
    mock.placeOrder.setup({ orderId: '321', status: true });
}

export type ApiMock<T> = {
    [K in keyof T]:
    T[K] extends () => Promise<infer Resp> ? RequestMock<never, Resp> :
    T[K] extends (...args: infer Args) => Promise<infer Resp> ? RequestMock<Args, Resp> :
    T[K] extends object ? ApiMock<T[K]> :
    never;
};

export interface RequestMock<Args, Resp> {
    expectRequest(expected?: Expected<Args>): Promise<PromiseMock<Args, Resp>>;
    expectNoRequest(expected?: Expected<Args>): Promise<void>;
    setup(setup: Resp): void;
}

export interface PromiseMock<Args, Resp> {
    readonly request: Args;
    resolve(response: Resp): void;
    reject(reason: string): void;
}