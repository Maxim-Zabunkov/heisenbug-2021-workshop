import { CircularProgress, FormHelperText, Grid, Modal, TextField } from "@material-ui/core";
import { ComponentClass, ComponentType, ReactWrapper, StatelessComponent } from "enzyme";
import { read } from "fs";
import Card from "../../components/card/card";
import AddressForm from "../../components/checkout/address-form";
import Cart from "../../components/checkout/cart";
import Checkout from "../../components/checkout/checkout";
import { OrderProcessing } from "../../components/checkout/order-processing";
import PaymentForm from "../../components/checkout/payment-form";
import { Purchase } from "../../components/checkout/purchase";
import Review from "../../components/checkout/review";
import TopBar from "../../components/top-bar/top-bar";
import { Expected, expectState, getText, itemsReader, readState, simulateClick, simulateInputChange, textReader } from "../tools";

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

    cartIcon: ButtonState;
    addIcon: ButtonState;
    removeIcon: ButtonState;
    quantity: string;
}

interface CheckoutFormState {
    title: string;
    cartPage: CartPageState;
    shippingAddressPage: ShippingAddressPageState;
    paymentDetailsPage: PaymentDetailsPageState;
    reviewOrderPage: ReviewOrderPageState;
    orderPage: OrderPageState;

    nextButton: ButtonState;
    backButton: ButtonState;
}

interface CartPageState {
    title: string;
    cats: PurchaseState[];
    total: string;
}

interface FormFieldState {
    text: string;
    label: string;
    required: boolean;
    hint: string;
}

interface ShippingAddressFields {
    firstName: FormFieldState;
    lastName: FormFieldState;
    address1: FormFieldState;
    address2: FormFieldState;
    city: FormFieldState;
    state: FormFieldState;
    country: FormFieldState;
    zipCode: FormFieldState;
}

interface ShippingAddressPageState extends ShippingAddressFields {
    title: string;
}

interface PaymentDetailsFields {
    cardName: FormFieldState;
    cardNumber: FormFieldState;
    expDate: FormFieldState;
    cvv: FormFieldState;
}

interface PaymentDetailsPageState extends PaymentDetailsFields {
    title: string;
}

interface ReviewOrderPageState {
    title: string;
    cats: PurchaseState[];
    total: string;
    shipping: { title: string; text: string };
    payment: {
        title: string;
        content: { [field: string]: string | null };
    };
}

interface OrderPageState {
    hasProgressIndicator: boolean;
    title: string;
    text: string;
}

interface PurchaseState {
    text: string;
    count: string;
    price: string;
    total: string;
    addIcon: ButtonState;
    removeIcon: ButtonState;
}

type EnterFields<T extends object> = {
    [K in keyof T]?: string;
}

type StateReader<T> = (control: ReactWrapper<any, any>, expected: Expected<T>) => Expected<T>;

export class CatShopDsl {
    readonly navBar = {
        search: {
            type: (text: string) => simulateInputChange(this.root.find(TopBar).find('input[id="search"]'), text)
        },
        cartIcon: {
            click: () => simulateClick(this.root.find(TopBar).find('button[id="cart"]'))
        }
    }

    get cats() {
        const cats = this.root.find(Card);
        return cats.map(card => ({
            cartIcon: {
                click: () => simulateClick(card.find('button[id="cart-icon"]'))
            },
            addIcon: {
                click: () => simulateClick(card.find('button[id="add-icon"]'))
            },
            removeIcon: {
                click: () => simulateClick(card.find('button[id="remove-icon"]'))
            }
        }));
    }

    readonly checkoutForm = {
        nextButton: {
            click: () => simulateClick(this.root.find(Checkout).find('button[id="next"]'))
        },
        clickOutside: () => {
            const checkoutForm = this.root.find(Checkout);
            if (!checkoutForm.exists())
                throw new Error('Checkout form is not shown');
            const onClose = checkoutForm.find(Modal).invoke('onClose');
            if (onClose)
                onClose({}, 'backdropClick');
        },
        cartPage: {
            getCatLine: (index: number) => {
                const line = this.root.find(Cart).find(Purchase).at(index);
                return {
                    addIcon: {
                        click: () => simulateClick(line.find('button[id="add"]'))
                    },
                    removeIcon: {
                        click: () => simulateClick(line.find('button[id="remove"]'))
                    }
                };
            }
        },
        shippingAddressPage: {
            enterFields: (fields: EnterFields<ShippingAddressFields>) => {
                const inputs = this.root.find(AddressForm).find('input');
                if (fields.firstName !== undefined) simulateInputChange(inputs.filter({ id: 'firstName' }), fields.firstName);
                if (fields.lastName !== undefined) simulateInputChange(inputs.filter({ id: 'lastName' }), fields.lastName);
                if (fields.address1 !== undefined) simulateInputChange(inputs.filter({ id: 'address1' }), fields.address1);
                if (fields.address2 !== undefined) simulateInputChange(inputs.filter({ id: 'address2' }), fields.address2);
                if (fields.city !== undefined) simulateInputChange(inputs.filter({ id: 'city' }), fields.city);
                if (fields.state !== undefined) simulateInputChange(inputs.filter({ id: 'state' }), fields.state);
                if (fields.country !== undefined) simulateInputChange(inputs.filter({ id: 'country' }), fields.country);
                if (fields.zipCode !== undefined) simulateInputChange(inputs.filter({ id: 'zip' }), fields.zipCode);
            }
        },
        paymentDetailsPage: {
            enterFields: (fields: EnterFields<PaymentDetailsFields>) => {
                const inputs = this.root.find(PaymentForm).find('input');
                if (fields.cardName !== undefined) simulateInputChange(inputs.filter({ id: 'cardName' }), fields.cardName);
                if (fields.cardNumber !== undefined) simulateInputChange(inputs.filter({ id: 'cardNumber' }), fields.cardNumber);
                if (fields.expDate !== undefined) simulateInputChange(inputs.filter({ id: 'expDate' }), fields.expDate);
                if (fields.cvv !== undefined) simulateInputChange(inputs.filter({ id: 'cvv' }), fields.cvv);
            }
        },
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
        const form = this.root.find(Checkout);
        return form.exists() ? {
            title: readState(expected, 'title', textReader(form.find('h1[id="title"]'))),
            backButton: readState(expected, 'backButton', e => this.getButtonState(form.find('button[id="back"]'), e)),
            nextButton: readState(expected, 'nextButton', e => this.getButtonState(form.find('button[id="next"]'), e)),
            cartPage: readState(expected, 'cartPage', e => this.getCartPageState(form, e)),
            shippingAddressPage: readState(expected, 'shippingAddressPage', e => this.getShippingAddressPageState(form, e)),
            paymentDetailsPage: readState(expected, 'paymentDetailsPage', e => this.getPaymentDetailsPageState(form, e)),
            reviewOrderPage: readState(expected, 'reviewOrderPage', e => this.getReviewOrderPageState(form, e)),
            orderPage: readState(expected, 'orderPage', e => this.getOrderPageState(form, e)),
        } : null;
    }

    private getCartPageState: StateReader<CartPageState> = (form, expected) => {
        const page = form.find(Cart);
        return page.exists() ? {
            title: readState(expected, 'title', textReader(page.find({ id: 'title' }).first())),
            cats: readState(expected, 'cats', itemsReader(page.find(Purchase), this.getPurchaseState.bind(this))),
            total: readState(expected, 'total', textReader(page.find({ id: 'total-sum' }).first())),
        } : null;
    }

    private getPurchaseState: StateReader<PurchaseState> = (purchase, expected) => {
        return {
            text: readState(expected, 'text', textReader(purchase.find({ id: 'text' }).first())),
            count: readState(expected, 'count', textReader(purchase.find({ id: 'count' }).first())),
            price: readState(expected, 'price', textReader(purchase.find({ id: 'price' }).first())),
            total: readState(expected, 'total', textReader(purchase.find({ id: 'total' }).first())),
            addIcon: readState(expected, 'addIcon', e => this.getButtonState(purchase.find('button[id="add"]'), e)),
            removeIcon: readState(expected, 'removeIcon', e => this.getButtonState(purchase.find('button[id="remove"]'), e)),
        }
    }

    private getShippingAddressPageState: StateReader<ShippingAddressPageState> = (form, expected) => {
        const page = form.find(AddressForm);
        return page.exists() ? {
            title: readState(expected, 'title', textReader(page.find({ id: 'title' }).first())),
            firstName: readState(expected, 'firstName', e => this.getFieldState(page.find(TextField).filter({ id: 'firstName' }), e)),
            lastName: readState(expected, 'lastName', e => this.getFieldState(page.find(TextField).filter({ id: 'lastName' }), e)),
            address1: readState(expected, 'address1', e => this.getFieldState(page.find(TextField).filter({ id: 'address1' }), e)),
            address2: readState(expected, 'address2', e => this.getFieldState(page.find(TextField).filter({ id: 'address2' }), e)),
            city: readState(expected, 'city', e => this.getFieldState(page.find(TextField).filter({ id: 'city' }), e)),
            state: readState(expected, 'state', e => this.getFieldState(page.find(TextField).filter({ id: 'state' }), e)),
            country: readState(expected, 'country', e => this.getFieldState(page.find(TextField).filter({ id: 'country' }), e)),
            zipCode: readState(expected, 'zipCode', e => this.getFieldState(page.find(TextField).filter({ id: 'zip' }), e)),
        } : null;
    }

    private getPaymentDetailsPageState: StateReader<PaymentDetailsPageState> = (form, expected) => {
        const page = form.find(PaymentForm);
        return page.exists() ? {
            title: readState(expected, 'title', textReader(page.find({ id: 'title' }).first())),
            cardName: readState(expected, 'cardName', e => this.getFieldState(page.find(TextField).filter({ id: 'cardName' }), e)),
            cardNumber: readState(expected, 'cardNumber', e => this.getFieldState(page.find(TextField).filter({ id: 'cardNumber' }), e)),
            expDate: readState(expected, 'expDate', e => this.getFieldState(page.find(TextField).filter({ id: 'expDate' }), e)),
            cvv: readState(expected, 'cvv', e => this.getFieldState(page.find(TextField).filter({ id: 'cvv' }), e)),
        } : null;
    }

    private getFieldState: StateReader<FormFieldState> = (field, expected) => {
        return {
            label: readState(expected, 'label', textReader(field.find('label'))),
            text: readState(expected, 'text', () => field.find('input').getDOMNode<HTMLInputElement>().value),
            required: readState(expected, 'required', () => field.exists('.Mui-required')),
            hint: readState(expected, 'hint', textReader(field.find(FormHelperText))),
        }
    }

    private getReviewOrderPageState: StateReader<ReviewOrderPageState> = (form, expected) => {
        const page = form.find(Review);
        return page.exists() ? {
            title: readState(expected, 'title', textReader(page.find({ id: 'title' }).first())),
            cats: readState(expected, 'cats', itemsReader(page.find(Purchase), this.getPurchaseState.bind(this))),
            total: readState(expected, 'total', textReader(page.find({ id: 'total-sum' }).first())),
            shipping: readState(expected, 'shipping', e => this.getReviewShippingState(page, e)),
            payment: readState(expected, 'payment', e => this.getReviewPaymentState(page, e)),
        } : null;
    }

    private getReviewShippingState: StateReader<ReviewOrderPageState['shipping']> = (page, expected) => {
        return {
            title: readState(expected, 'title', textReader(page.find({ id: 'shipping-title' }).first())),
            text: readState(expected, 'title', textReader(page.find({ id: 'shipping-text' }).first())),
        };
    }

    private getReviewPaymentState: StateReader<ReviewOrderPageState['payment']> = (page, expected) => {
        return {
            title: readState(expected, 'title', textReader(page.find({ id: 'payment-title' }).first())),
            content: readState(expected, 'content', e => this.getReviewPaymentContentState(page.find({ id: 'payment-content' }), e))
        };
    }

    private getReviewPaymentContentState: StateReader<{ [field: string]: string | null }> = content => {
        const result: { [field: string]: string | null } = {};
        const fields = content.find(Grid).filter({ id: 'field' });
        const values = content.find(Grid).filter({ id: 'value' });
        fields.forEach((f, i) => {
            const field = getText(f) as string;
            result[field] = getText(values.at(i));
        });
        return result;
    }

    private getOrderPageState: StateReader<OrderPageState> = (form, expected) => {
        const page = form.find(OrderProcessing);
        return page.exists() ? {
            title: readState(expected, 'title', textReader(page.find({ id: 'title' }).first())),
            text: readState(expected, 'text', textReader(page.find({ id: 'text' }).first())),
            hasProgressIndicator: readState(expected, 'hasProgressIndicator', () => page.exists(CircularProgress))
        } : null;
    }

    private getCardState: StateReader<CatCardState> = (card, expected) => {
        return {
            title: readState(expected, 'title', textReader(card.find('span.MuiCardHeader-title'))),
            price: readState(expected, 'price', textReader(card.find('span.MuiCardHeader-subheader'))),
            temperament: readState(expected, 'temperament', textReader(card.find({ id: 'temperament' }).first())),
            description: readState(expected, 'description', textReader(card.find({ id: 'description' }).first())),
            cartIcon: readState(expected, 'cartIcon', e => this.getButtonState(card.find('button[id="cart-icon"]'), e)),
            addIcon: readState(expected, 'addIcon', e => this.getButtonState(card.find('button[id="add-icon"]'), e)),
            removeIcon: readState(expected, 'removeIcon', e => this.getButtonState(card.find('button[id="remove-icon"]'), e)),
            quantity: readState(expected, 'quantity', textReader(card.find({ id: 'quantity' }).first())),
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

    private getSearchState: StateReader<SearchState> = (navBar, expected) => {
        const search = navBar.find('input[id="search"]');
        return search.exists() ? {
            text: readState(expected, 'text', textReader(search)),
            placeholder: readState(expected, 'placeholder', () => search.getDOMNode<HTMLInputElement>().placeholder ?? null),
            disabled: readState(expected, 'disabled', () => search.getDOMNode<HTMLInputElement>().disabled)
        } : null;
    }

    private getButtonState: StateReader<ButtonState> = (button, expected) => {
        return button.exists() ? {
            text: readState(expected, 'text', textReader(button)),
            disabled: readState(expected, 'disabled', () => button.getDOMNode<HTMLButtonElement>().disabled)
        } : null;
    }
}