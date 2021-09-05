import { DeepPartial, Expected } from "./contracts";

export type ControlSet = ReactWrapper;
export type RootControl = ReactWrapper;

export type Selector = { name: string } & ((control: ControlSet) => ControlSet);

export interface GetState<S> { getState(expected?: Expected<S>): S | null }
export interface ExpectApi<S> { expect(expected: Expected<S>, timeoutMillis?: number): Promise<S> }

export interface DslScope { name: string; selector?: Selector | Selector[] }
type DslGetState<S> = (context: DslContext, expected?: Expected<S>) => DeepPartial<S> | string | null;
export interface DslDeclaration extends Partial<DslScope> { getState?: DslGetState<any>; }
export type DslConstructor<T extends DslDeclaration> = { new(selector: Selector[]): T };

/// Dsl type inferring
type KeysOfType<T, K> = { [P in keyof T]: T[P] extends K ? P : never }[keyof T];
type PrimitiveKeys<T extends DslDeclaration> = { [P in keyof T]: T[P] extends string | number | boolean ? P : never }[keyof T];
type FunctionKeys<T extends DslDeclaration> = { [P in keyof T]: T[P] extends Function ? P : never }[keyof T];
type NonFunctionKeys<T extends DslDeclaration> = { [P in keyof T]: T[P] extends Function ? never : P }[keyof T];
type DslInternalKeys = keyof DslDeclaration;
type DslCustomKeys<T extends DslDeclaration> = Omit<T, DslInternalKeys | PrimitiveKeys<T>>;
type DslOperations<T extends DslDeclaration> = Omit<DslCustomKeys<T>, NonFunctionKeys<T>>;
type DslFields<T extends DslDeclaration> = Omit<DslCustomKeys<T>, FunctionKeys<T>>;

type DslStateFromFields<T extends DslDeclaration> = {
    [P in keyof DslFields<T>]:
    T[P] extends DslReadArrayInstruction<infer S> ? DslState<S>[] :
    T[P] extends DslReadMapInstruction<infer S> ? { [key: string]: DslState<S> } :
    T[P] extends DslReadStateInstruction<infer S> ? S :
    T[P] extends DslDeclaration ? DslState<T[P]> :
    never
};

type DslStateFromGetState<T extends DslDeclaration> =
    T extends { getState: DslGetState<infer S> } ? S : {};

export type DslState<T extends DslDeclaration> =
    DslStateFromFields<T> & DslStateFromGetState<T>;

/// Operations types
export interface DslInstruction<T = any> extends DslScope { run(context: DslContext): T | Promise<T> }
export interface DslReadStateInstruction<T = any> extends DslScope {
    instructionType: 'DslReadStateInstruction';
    readState(context: DslContext, expected: Expected<T>): T;
}
export interface DslReadArrayInstruction<ItemDsl extends DslDeclaration> extends DslScope {
    instructionType: 'DslReadArrayInstruction';
    itemDsl: DslConstructor<ItemDsl>;
}
export interface DslReadMapInstruction<ItemDsl extends DslDeclaration> extends DslScope {
    instructionType: 'DslReadMapInstruction';
    itemDsl: DslConstructor<ItemDsl>;
}
export type DslOperation<TResult = any> = Generator<DslInstruction | DslReadStateInstruction | Promise<any>, TResult, any>;

/// Dsl runtime

export interface DslContext extends DslScope {
    contextStack: DslContextStack;
    getControlSet(): ControlSet;
    toString(): string;
}

export interface RootDslContext extends DslContext {
    refresh(): void;
    dispose(): void;
    get changes(): Observable<void>;
    get root(): RootControl;
    addTeardown(teardown: () => void): void;
    resolve(contextStack: DslContextStack): ControlSet;
    printCurrentContext(contextStack: DslContextStack): string;
}

type DslContextStack = [RootDslContext, ...DslContext[]];
