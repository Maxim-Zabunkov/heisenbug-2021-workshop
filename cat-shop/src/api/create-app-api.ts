import { CATS_API_URL } from "./api-constants";
import { AppApi, CatInfo, Image, SubmitOrderRequest, SubmitOrderResponse } from "./contracts";

interface Data {
    id: string;
    name: string;
    image: Image;
    description: string;
    temperament: string;
    adaptability: number;
}

export function createAppAPi(): AppApi {
    let nextOrderId = 123456;
    return {
        async getCats(): Promise<CatInfo[]> {
            const response: Response = await fetch(CATS_API_URL);
            const serverData: Data[] = await response.json();
            return convertServerDataToCatInfo(serverData);
        },

        placeOrder(order: SubmitOrderRequest): Promise<SubmitOrderResponse> {
            return new Promise<SubmitOrderResponse>(resolve =>
                setTimeout(() => resolve({ orderId: nextOrderId++, status: true }), 1000)
            );
        }
    }
}

function convertServerDataToCatInfo(serverData: Data[]): CatInfo[] {
    return serverData.map(item => ({
        id: item.id,
        name: item.name,
        image: item.image,
        price: 300 + Math.floor(Math.random() * 20) * 10,
        description: item.description,
        temperament: item.temperament,
    }));
}