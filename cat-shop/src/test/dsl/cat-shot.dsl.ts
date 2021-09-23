import { ReactWrapper } from "enzyme";
import Card from "../../components/card/card";
import Checkout from "../../components/checkout/checkout";
import TopBar from "../../components/top-bar/top-bar";
import { Expected, expectState, itemsReader, readState, simulateInputChange, textReader } from "../tools";

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
    price: string;
    description: string;
    temperament: string;
}

interface CheckoutFormState {
    title: string;
}

export class CatShopDsl {
    readonly navBar = {
        search: {
            type: (text: string) => simulateInputChange(this.root.find(TopBar).find('input[id="search"]'), text)
        }
    }
    
    constructor(private root: ReactWrapper) {
    }

    expect(expected: Expected<CatShopState>): Promise<void> {
        return expectState('ui', expected, this.getState.bind(this));
    }

    private getState(expected: Expected<CatShopState>): Expected<CatShopState> {
        this.root.update();
        return {
            navBar: readState(expected, 'navBar', this.getNavBarState.bind(this)),
            cats: readState(expected, 'cats', itemsReader(this.root.find(Card), this.getCardState.bind(this))),
            checkoutForm: readState(expected, 'checkoutForm', this.getCheckoutFormState.bind(this))
        };
    }

    private getCheckoutFormState(expected: Expected<CheckoutFormState>): Expected<CheckoutFormState> {
        return this.root.find(Checkout).exists() ? {} : null;
    }

    private getCardState(card: ReactWrapper<any, any>, expected: Expected<CatCardState>): Expected<CatCardState> {
        return {
            title: readState(expected, 'title', textReader(card.find('span.MuiCardHeader-title'))),
            price: readState(expected, 'price', textReader(card.find('span.MuiCardHeader-subheader'))),
            temperament: readState(expected, 'temperament', textReader(card.find({ id: 'temperament' }).first())),
            description: readState(expected, 'description', textReader(card.find({ id: 'description' }).first())),
        }
    }

    private getNavBarState(expected: Expected<NavBarState>): Expected<NavBarState> {
        const navBar = this.root.find(TopBar);
        return navBar.exists() ? {
            title: readState(expected, 'title', textReader(navBar.find('h6[id="title"]'))),
            search: readState(expected, 'search', e => this.getSearchState(navBar, e)),
            cartIcon: readState(expected, 'cartIcon', e => this.getButtonState(navBar.find('button[id="cart"]'), e))
        } : null;
    }

    private getSearchState(navBar: ReactWrapper<any, any>, expected: Expected<SearchState>): Expected<SearchState> {
        const search = navBar.find('input[id="search"]');
        return search.exists() ? {
            text: readState(expected, 'text', textReader(search)),
            placeholder: readState(expected, 'placeholder', () => search.getDOMNode<HTMLInputElement>().placeholder ?? null),
            disabled: readState(expected, 'disabled', () => search.getDOMNode<HTMLInputElement>().disabled)
        } : null;
    }

    private getButtonState(button: ReactWrapper<any, any>, expected: Expected<ButtonState>): Expected<ButtonState> {
        return button.exists() ? {
            text: readState(expected, 'text', textReader(button)),
            disabled: readState(expected, 'disabled', () => button.getDOMNode<HTMLButtonElement>().disabled)
        } : null;
    }
}