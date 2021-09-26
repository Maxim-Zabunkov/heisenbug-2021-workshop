import { ReactWrapper } from "enzyme";

export type Expected<T> = {
    [K in keyof T]?: T[K] extends object ? Expected<T[K]> : T[K] | null;
} | null;

type StateReader<T> = (expected: Expected<T>) => Expected<T>;

export async function expectState<T>(name: string, expected: Expected<T>, getState: StateReader<T>): Promise<void> {
    // allow application to finish pending tasks in Event loop
    await new Promise(resolve => queueMicrotask(resolve as any));
    expect({ [name]: getState(expected) }).toMatchObject({ [name]: expected });
}

export function readState<T extends object, K extends keyof T>(
    expected: Expected<T>, key: K, reader: StateReader<T[K]>
): Expected<T[K]> | undefined {
    try {
        if (!expected)
            return reader(null);
        if (expected[key] !== undefined)
            return reader(expected[key] as Expected<T[K]>)
    } catch (e) {
        const error = e as Error;
        return `Error reading state: ${key}: ${error.message}` as any;
    }
}

export function getText(control: ReactWrapper<any, any>): string | null {
    return control.exists() ? control.text().replace(/\s/g, ' ').trim() : null;
}

export function textReader(control: ReactWrapper<any, any>): StateReader<string> {
    return () => getText(control);
}

export function itemsReader<T>(
    items: ReactWrapper<any, any>,
    itemReader: (control: ReactWrapper<any, any>, expected: Expected<T>) => Expected<T>
): StateReader<T[]> {
    return expected => {
        if (expected && items.length !== expected.length)
            return `Array size mismatch. Expected ${expected.length}, but was ${items.length}` as any;
        return items.map((item, i) => {
            const expectedItem = expected && expected[i];
            if (expectedItem === undefined)
                return undefined;
            return itemReader(item, expectedItem);
        });
    }
}