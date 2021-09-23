import { ReactWrapper } from "enzyme";
import TopBar from "../../components/top-bar/top-bar";
import { Expected, readState, textReader } from "../tools";

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

    expect(expected: Expected<CatShopState>): void {
        expect(this.getState(expected)).toMatchObject(expected as object);
    }

    private getState(expected: Expected<CatShopState>): Expected<CatShopState> {
        return {
            navBar: readState(expected, 'navBar', this.getNavBarState.bind(this))
        };
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