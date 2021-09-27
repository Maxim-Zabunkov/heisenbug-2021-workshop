import { act } from "react-dom/test-utils";
import { MockApi, mockCats, UiApi, userOpensApplication } from "../dsl";

describe('Checkout. Place Order', () => {
    let app: UiApi;
    let mock: MockApi;

    beforeEach(() => act(async () => {
        [app, mock] = userOpensApplication();
        mock.getCats.setup(mockCats({ id:'123', name: 'my cat', price: 123 }));
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
        await app.expect({ checkoutForm: { reviewOrderPage: {}, nextButton: { text: 'Place Order', disabled: false } } });
    }));

    afterEach(() => app?.dispose());

    test('Place Order: check place request', () => act(async () => {
        await mock.placeOrder.expectNoRequest();
        app.checkoutForm.nextButton.click();

        await mock.placeOrder.expectRequest([{ catIds: ['123'] }]);
        await app.expect({
            checkoutForm: {
                orderPage: {
                    hasProgressIndicator: true,
                    title: null,
                    text: null
                }
            }
        });
    }));

    test('Place Order: handle success response', () => act(async () => {
        app.checkoutForm.nextButton.click();

        await mock.placeOrder.setup({ orderId: 12121212, status: true });
        await app.expect({
            checkoutForm: {
                orderPage: {
                    hasProgressIndicator: false,
                    title: 'Thank you for your order.',
                    text: 'Your order number is #12121212.We have emailed your order confirmation, and will send you an update when your order has shipped.'
                }
            }
        });
    }));

    test.todo('Place Order: handle server response with status=false');

    test('Place Order: handle reject response', () => act(async () => {
        app.checkoutForm.nextButton.click();

        await mock.placeOrder.setup(new Error('server error'));
        await app.expect({
            checkoutForm: {
                orderPage: {
                    hasProgressIndicator: false,
                    title: 'Something goes wrong.',
                    text: 'Your order was not submitted due to technical issue.Please try again or contact support center.'
                }
            }
        });
    }));

    test('should disappear when user clicks outside the Order Success form', () => act(async () => {
        app.checkoutForm.nextButton.click();
        await mock.placeOrder.setup({ orderId: 12121212, status: true });
        await app.expect({
            checkoutForm: {
                orderPage: {
                    hasProgressIndicator: false,
                    title: 'Thank you for your order.',
                }
            }
        });

        app.checkoutForm.clickOutside();
        await app.expect({ checkoutForm: null });
    }));

    test.todo('Checkout form: should NOT disapper if user clicks outside during order processing');
});
