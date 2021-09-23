export interface CatInfo {
    id: string;
    name: string;
    image: Image;
    temperament: string;
    description: string;
    price: number;
}

export interface Image {
    url: string;
}

export interface SubmitOrderRequest {
    catIds: string[];
}

export interface SubmitOrderResponse {
    orderId: number;
    status: boolean;
}

export interface AppApi {
    getCats(): Promise<CatInfo[]>;
    placeOrder(order: SubmitOrderRequest): Promise<SubmitOrderResponse>;
}