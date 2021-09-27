import { act } from "react-dom/test-utils";
import { MockApi, mockCats, UiApi, userOpensApplication } from "../dsl";

describe('Checkout. Order Summary', () => {
    let app: UiApi;
    let mock: MockApi;

    beforeEach(() => act(async () => {
        [app, mock] = userOpensApplication();
        mock.getCats.setup(mockCats({ name: 'my cat', price: 123 }));
        await app.expect({ cats: new Array(1) });
        app.cats[0].cartIcon.click();
        await app.expect({ navBar: { cartIcon: { text: '1', disabled: false } } });
        app.navBar.cartIcon.click();
        await app.expect({ checkoutForm: { cartPage: {}, nextButton: { text: 'Next', disabled: false } } });
        app.checkoutForm.nextButton.click();
        await app.expect({ checkoutForm: { shippingAddressPage: {}, } });
        app.checkoutForm.shippingAddressPage.enterFields({
            firstName: 'Max', lastName: 'Zabunkov', address1: 'Home', city: 'Tosno', country: 'RF', zipCode: '187000'
        });
        await app.expect({ checkoutForm: { nextButton: { text: 'Next', disabled: false } } });
        app.checkoutForm.nextButton.click();
        await app.expect({ checkoutForm: { paymentDetailsPage: {} } });
        app.checkoutForm.paymentDetailsPage.enterFields({ cardName: 'Max', cardNumber: '1234 5678', expDate: '10/21', cvv: 'cvv' });
        await app.expect({ checkoutForm: { paymentDetailsPage: {}, nextButton: { text: 'Next', disabled: false } } });
        app.checkoutForm.nextButton.click();
    }));

    afterEach(() => app?.dispose());

    test('Order summary page: check state', () => act(async () => {
        await app.expect({
            checkoutForm: {
                paymentDetailsPage: null,
                reviewOrderPage: {
                    title: 'Order summary',
                    cats: [
                        { text: '1. my cat', count: '1', price: '$123', total: '$123' }
                    ],
                    total: '$123',
                    shipping: {
                        title: 'Shipping',
                        text: 'Max, Zabunkov, Home, Tosno, RF, 187000'
                    },
                    payment: {
                        title: 'Payment details',
                        content: {
                            'Card Type': 'VISA',
                            'Name': 'Max',
                            'Card Number': '1234 5678',
                            'Expiry Date': '10/21'
                        }
                    }
                },
                nextButton: { text: 'Place Order', disabled: false }
            }
        });
    }));

    test('should disappear when user clicks outside the form', () => act(async () => {
        await app.expect({ checkoutForm: { reviewOrderPage: {} } });

        app.checkoutForm.clickOutside();
        await app.expect({ checkoutForm: null });
    }));
});
