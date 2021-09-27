import { CatInfo, AppApi } from "../../api/contracts";
import { ApiMock, MockUtils } from "../tools/mock-utils";

export function createMockApi(): AppApi {
    return {
        getCats: MockUtils.requestMock('getCats'),
        placeOrder: MockUtils.requestMock('placeOrder')
    };
}

let nextCatId = 100;

export function mockCats(count: number): CatInfo[];
export function mockCats(...cats: Partial<CatInfo>[]): CatInfo[];
export function mockCats(...args: any[]): CatInfo[] {
    const cats: Partial<CatInfo>[] = args.length === 1 && (typeof args[0] === 'number')
    ? [...new Array(args[0] as number)].map(() => ({}))
    : args;

    return cats.map(cat => {
        const id = cat.id ?? (nextCatId++).toString();
        return {
            id,
            name: 'cat ' + id,
            price: Math.floor(Math.random() * 1000),
            description: 'about cat ' + id,
            temperament: 'norm',
            image: { url: 'url' + id },
            ...cat
        };
    });
}