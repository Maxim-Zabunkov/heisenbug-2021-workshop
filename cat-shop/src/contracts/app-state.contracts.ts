import { CatInfo } from "../api/contracts";

export interface AppState {
    cards: CatInfo[];
    purchases: CatInfo[];
    search: Search;
    addressDetails: AddressDetails;
    paymentDetails: PaymentDetails;
    orderInfo: OrderInfo;
}

export interface OrderInfo {
    orderId?: number;
    inProgress: boolean;
}

export interface Search {
    pattern: string;
}

export interface AddressDetails {
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2: string;
    zipCode: string;
    city: string;
    state: string;
    country: string;
}

export interface PaymentDetails {
    cardName: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;

}