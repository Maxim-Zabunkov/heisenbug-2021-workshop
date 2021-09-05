import { get, hasIn, isArray, isBoolean, isFunction, isMap, isNil, isNumber, isObject, isSet, isString } from "lodash-es";
import { Expected, ExpectedPartial, Matcher, MatchResult, Predicate } from "./contracts";
import { stringify } from "./utils";

export function mismatch(...mismatches: string[]): MatchResult {
    return { success: false, mismatches };
}

export const MATCH_SUCCESS: MatchResult = { success: true, mismatches: [] };

export function typeMismatch(state: any, objName: string): MatchResult {
    return mismatch(`[${objName}] type mismatch, actual value: ${stringify(state)}`)
}

export function createMatcher<T>(expected: Expected<T>): Matcher<T> {
    if (isNil(expected) || isNumber(expected) || isBoolean(expected) || isString(expected)) return toEqual<T>(expected as T);
    if (isFunction(expected)) return toMatchPredicate(expected);
    if (isMatcher(expected)) return {
        match(state, objName) {
            const result = expected.match(state, objName);
            if (result.success) return MATCH_SUCCESS;
            if (result.mismatches) return mismatch(`[${objName}] mismatches:\n${result.mismatches.join('\n')}`);
            return mismatch(`[${objName}] incorrect matcher result. MatchResult is expected, but was: ${stringify(result)}`);
        }
    };
    if (isSet(expected)) return toMatchSet(expected);
    if (isMap(expected)) return toMatchMap(expected);
    if (isArray(expected)) return toMatchArray(expected) as Matcher;
    if (isObject(expected)) return toMatchObject(expected) as Matcher;
    throw new Error(`Invalid 'expected' format. Expected instance of 'Expected<T>', but was: ${stringify(expected)}`);
}

function toEqual<T>(expected: T): Matcher<T> {
    return {
        match(state, objName) {
            return state === expected ? MATCH_SUCCESS :
                mismatch(`[${objName}] expected ${stringify(expected)}, but was ${stringify(state)}`);
        }
    }
}

function toMatchPredicate<T>(predicate: Predicate<T>): Matcher<T> {
    return {
        match(state, objName) {
            const result = predicate(state);
            return isBoolean(result)
                ? result ? MATCH_SUCCESS : mismatch(`[${objName}] does not match predicate, actual value: ${stringify(state)}`)
                : mismatch(`[${objName}] incorrect predicate result, expected boolean. but was: ${stringify(result)}`);
        }
    }
}

function toMatchSet<T>(expected: Set<T>): Matcher<T> {
    return {
        match(state, objName) {
            if (isNil(state)) return mismatch(`[${objName}] expected, but was ${stringify(state)}`);
            if (!isSet(state)) return typeMismatch(state, objName);
            if (state.size != expected.size) return mismatch(`[${objName}.size] expected ${expected.size}, but was ${state.size}
    Actual Set: ${stringify(Array.from(state))}`);
            const mismatches = [];
            for (const expectedItem in expected.keys())
                if (!state.has(expectedItem)) mismatches.push(`[${objName}] has no item ${stringify(expectedItem)}`);
            return mismatches.length ? { success: false, mismatches } : MATCH_SUCCESS;
        }
    };
}

function toMatchMap<K, V>(expected: Map<K, V>): Matcher {
    return {
        match(state, objName) {
            if (isNil(state)) return mismatch(`[${objName}] expected, but was ${stringify(state)}`);
            if (!isMap(state)) return typeMismatch(state, objName);
            if (state.size != expected.size) return mismatch(`[${objName}.size] expected ${expected.size}, but was ${state.size}
    Actual Map: ${stringify(Array.from(state))}`);
            const mismatches = [];
            for (const [key, value] of expected) {
                if (!state.has(key)) {
                    if (value !== undefined)
                        mismatches.push(`[${objName}.${key}] does not exist in Map`);
                } else {
                    const actualEntry = state.get(key);
                    const entryMatch = createMatcher(value).match(actualEntry, `${objName}.${key}`);
                    if (!entryMatch.success) mismatches.push(...entryMatch.mismatches);
                }

            }
            return mismatches.length ? { success: false, mismatches } : MATCH_SUCCESS;
        }
    };
}

function toMatchArray<T>(expected: Expected<T>[]): Matcher<T[]> {
    return {
        match(state, objName) {
            if (isNil(state)) return mismatch(`[${objName}] expected, but was ${stringify(state)}`);
            if (!isArray(state)) return typeMismatch(state, objName);
            if (state.length != expected.length) return mismatch(`[${objName}.length] expected ${expected.length}, but was ${state.length}
    Actual Array: ${stringify(Array.from(state))}`);
            const mismatches = [];
            for (let i = 0; i < expected.length; i++) {
                const expectedItem = expected[i];
                const actualItem = state[i];
                const itemMatch = createMatcher(expectedItem).match(actualItem, `${objName}[${i}]`);
                if (!itemMatch.success) mismatches.push(...itemMatch.mismatches);
            }
            return mismatches.length ? { success: false, mismatches } : MATCH_SUCCESS;
        }
    };
}

function toMatchObject<T>(expected: ExpectedPartial<T>): Matcher<T> {
    return {
        match(state, objName) {
            if (isNil(state)) return mismatch(`[${objName}] expected, but was ${stringify(state)}`);
            if (!isObject(state)) return typeMismatch(state, objName);
            const mismatches = [];
            for (const key of Object.keys(expected)) {
                if (!hasIn(expected, key)) continue;
                const expectedItem = get(expected, key);
                if (!hasIn(state, key)) {
                    if (expectedItem === undefined) continue;
                    else mismatches.push(`[${objName}.${key}] expected, but was undefined`);
                    continue;
                }
                const actualItem = get(state, key);
                const itemMatch = createMatcher(expectedItem).match(actualItem, `${objName}.${key}`);
                if (!itemMatch.success) mismatches.push(...itemMatch.mismatches);
            }
            return mismatches.length ? { success: false, mismatches } : MATCH_SUCCESS;
        }
    }
}

function isMatcher(obj: any): obj is Matcher {
    return isObject(obj) && 'match' in obj;
}