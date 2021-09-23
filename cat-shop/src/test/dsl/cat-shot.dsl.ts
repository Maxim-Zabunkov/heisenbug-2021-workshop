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

export class CatShopDsl {
    constructor(private root: ReactWrapper) {
    }

    expect(expected: CatShopState): void {
        throw new Error('Not implemented');
    }
}