import { act } from "react-dom/test-utils";
import { MockApi, mockCats, UiApi, userOpensApplication } from "../dsl";

describe('Checkout. Shipping Address', () => {
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
    }));

    afterEach(() => app?.dispose());

    test('check initial state', () => act(async () => {
        await app.expect({
            checkoutForm: {
                cartPage: null,
                shippingAddressPage: {
                    title: 'Shipping address',
                    firstName: { label: 'First name *', text: '', required: true },
                    lastName: { label: 'Last name *', text: '', required: true },
                    address1: { label: 'Address line 1 *', text: '', required: true },
                    address2: { label: 'Address line 2', text: '', required: false },
                    city: { label: 'City *', text: '', required: true },
                    state: { label: 'State/Province/Region', text: '', required: false },
                    country: { label: 'Country *', text: '', required: true },
                    zipCode: { label: 'Zip / Postal code *', text: '', required: true },
                },
                nextButton: { text: 'Next', disabled: true },
                backButton: { text: 'Back', disabled: false }
            }
        });
    }));

    test('when user populates all required fields, Next button should unlock', () => act(async () => {
        await app.expect({ checkoutForm: { shippingAddressPage: {}, nextButton: { text: 'Next', disabled: true } } });

        // enter not all fields
        app.checkoutForm.shippingAddressPage.enterFields({
            firstName: 'Max', lastName: 'Zabunkov', address1: 'Home', city: 'Tosno', country: 'RF'
        });
        await app.expect({ checkoutForm: { nextButton: { text: 'Next', disabled: true } } });

        // enter the rest of required fields
        app.checkoutForm.shippingAddressPage.enterFields({
            zipCode: '187000'
        });
        await app.expect({ checkoutForm: { nextButton: { text: 'Next', disabled: false } } });

        // clear one of required fields
        app.checkoutForm.shippingAddressPage.enterFields({
            address1: ''
        });
        await app.expect({
            checkoutForm: {
                shippingAddressPage: {
                    firstName: { text: 'Max' },
                    lastName: { text: 'Zabunkov' },
                    address1: { text: '' }
                },
                nextButton: { text: 'Next', disabled: true }
            }
        });
    }));

    test.todo('when user clicks Back should show Cart page');
    test.todo('populate all fields');

    test('should disappear when user clicks outside the form', () => act(async () => {
        await app.expect({ checkoutForm: { shippingAddressPage: {} } });

        app.checkoutForm.clickOutside();
        await app.expect({ checkoutForm: null });
    }));
});
