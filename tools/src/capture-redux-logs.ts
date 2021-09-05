import { AutomationLogger } from "./logger";
import { stringify } from "./utils";

type Reducer<S> = (state: S, action: { type: string }) => S;

export function wrapReducer<T>(reducer: Reducer<T>): Reducer<T> {
    return (state, action) => {
        AutomationLogger.debug('Reducer', stringify(action));
        return reducer(state, action);
    }
}
