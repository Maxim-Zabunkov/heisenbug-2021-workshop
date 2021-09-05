export type Predicate<T> = (x: T) => boolean;
export type DeepPartial<T> = T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;
export type MatchResult = { success: boolean, mismatches: string[] };
export type Matcher<T = any> = { match(actual: T, obkName: string): MatchResult };

export type ExpectedPartial<T> = T extends object ? { [K in keyof T]?: ExpectedPartial<T[K]> } : T;
export type Expected<T> = T | Matcher<T> | Predicate<T> | ExpectedPartial<T> | null | undefined;