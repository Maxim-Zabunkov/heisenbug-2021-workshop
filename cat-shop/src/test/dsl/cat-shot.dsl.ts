import { ReactWrapper } from "enzyme";

interface CatShopState {
    navBar: NavBarState;
    cats: CatCardState[];
    checkoutForm: CheckoutFormState;
}

interface NavBarState {
    title: string;
    search: SearchState;
    cartIcon: ButtonState;
}

interface SearchState {
    text: string;
    placeholder: string;
    disabled: boolean;
}

interface ButtonState {
    text: string;
    disabled: boolean;
}

interface CatCardState {
    title: string;
}

interface CheckoutFormState {
    title: string;
}

export type Expected<T> = {
    [K in keyof T]?: T[K] extends object ?Expected<T[K]> : T[K] | null;
} | null;

export class CatShopDsl {
    constructor(private root: ReactWrapper) {
    }

    expect(expected: Expected<CatShopState>): void {
        throw new Error('Not implemented');
    }
}