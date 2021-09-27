import { act } from "react-dom/test-utils";
import { MockApi, mockCats, UiApi, userOpensApplication } from "../dsl";

describe('Checkout. Payment Details', () => {
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
    }));

    afterEach(() => app?.dispose());

    test('check initial state', () => act(async () => {
        await app.expect({
            checkoutForm: {
                shippingAddressPage: null,
                paymentDetailsPage: {
                    title: 'Payment method',
                    cardName: { label: 'Name on card *', text: '', required: true },
                    cardNumber: { label: 'Card number *', text: '', required: true },
                    expDate: { label: 'Expiry date *', text: '', required: true },
                    cvv: { label: 'CVV *', text: '', required: true, hint: 'Last three digits on signature strip' },
                },
                nextButton: { text: 'Next', disabled: true },
                backButton: { text: 'Back', disabled: false }
            }
        });
    }));

    test('when user populates all required fields, Next button should unlock', () => act(async () => {
        await app.expect({ checkoutForm: { paymentDetailsPage: {}, nextButton: { text: 'Next', disabled: true } } });

        // fill not all required fields
        app.checkoutForm.paymentDetailsPage.enterFields({ cardName: 'Max', cardNumber: '1234 5678', expDate: '10/21' });
        await app.expect({ checkoutForm: { paymentDetailsPage: {}, nextButton: { text: 'Next', disabled: true } } });

        // fill the rest of required fileds
        app.checkoutForm.paymentDetailsPage.enterFields({ cvv: 'xxx' });
        await app.expect({ checkoutForm: { paymentDetailsPage: {}, nextButton: { text: 'Next', disabled: false } } });

        // remove one of required fields
        app.checkoutForm.paymentDetailsPage.enterFields({ cardName: '' });
        await app.expect({
            checkoutForm: {
                paymentDetailsPage: {
                    cardNumber: { text: '1234 5678' },
                    cardName: { text: '' }
                },
                nextButton: { text: 'Next', disabled: true }
            }
        });
    }));

    test.todo('when user clicks Back should show Shipment Address page');

    test('should disappear when user clicks outside the form', () => act(async () => {
        await app.expect({ checkoutForm: { paymentDetailsPage: {} } });

        app.checkoutForm.clickOutside();
        await app.expect({ checkoutForm: null });
    }));
});
