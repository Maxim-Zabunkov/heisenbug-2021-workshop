import { CatInfo, AppApi } from "../../api/contracts";

export function createMockApi(cats: CatInfo[] = []): AppApi {
    return {
        getCats: async () => cats,
        placeOrder: async () => ({ orderId: 123, status: true })
    }
}

let nextCatId = 100;
export function mockCats(...cats: Partial<CatInfo>[]): CatInfo[] {
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