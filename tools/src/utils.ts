import { isFunction, isMap, isSet } from 'lodash-es';

function replacer(_, value) {
    if (isFunction(value)) return undefined;
    if (isMap(value) || isSet(value)) return [...value];
    return value;
}

export function stringify(obj: any, multiline?: boolean): string {
    return isFunction(obj) ? 'Func' :
        multiline ? JSON.stringify(obj, replacer, 4) :
            JSON.stringify(obj, replacer)
}