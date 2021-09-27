import { act } from "react-dom/test-utils";
import { MockApi, mockCats, UiApi, userOpensApplication } from "../dsl";

describe('Checkout. Cart', () => {
    let app: UiApi;
    let mock: MockApi;

    beforeEach( () => act(async () => {
        [app, mock] = userOpensApplication();
        mock.getCats.setup(mockCats({ name: 'my cat', price: 123 }));
        await app.expect({ cats: new Array(1) });
        app.cats[0].cartIcon.click();
        await app.expect({ navBar: { cartIcon: { text: '1', disabled: false } } });
        app.navBar.cartIcon.click();
    }));

    afterEach(() => app?.dispose());

    test('check initial state', () => act(async () => {
        await app.expect({
            checkoutForm: {
                title: 'Checkout',
                cartPage: {
                    title: 'Cart',
                    cats: [
                        { text: '1. my cat', count: '1', price: '$123', total: '$123', addIcon: {}, removeIcon: {} }
                    ],
                    total: '$123'
                },
                nextButton: { text: 'Next', disabled: false },
                backButton: null
            }
        });
    }));

    test.todo('should sort cats alpabetically');

    test('user should be able to change cats count', () => act(async () => {
        await app.expect({
            checkoutForm: {
                cartPage: {
                    cats: [
                        { text: '1. my cat', count: '1', price: '$123', total: '$123', addIcon: {}, removeIcon: {} }
                    ],
                },
            }
        });

        app.checkoutForm.cartPage.getCatLine(0).addIcon.click()
        await app.expect({
            checkoutForm: {
                cartPage: {
                    cats: [
                        { text: '1. my cat', count: '2', price: '$123', total: '$246', addIcon: {}, removeIcon: {} }
                    ],
                    total: '$246'
                },
                nextButton: { text: 'Next', disabled: false },
            }
        });

        app.checkoutForm.cartPage.getCatLine(0).removeIcon.click()
        await app.expect({
            checkoutForm: {
                cartPage: {
                    cats: [
                        { text: '1. my cat', count: '1', price: '$123', total: '$123', addIcon: {}, removeIcon: {} }
                    ],
                    total: '$123'
                },
                nextButton: { text: 'Next', disabled: false },
            }
        });

        // remove last cat from cart => Next button should become disabled
        app.checkoutForm.cartPage.getCatLine(0).removeIcon.click()
        await app.expect({
            checkoutForm: {
                cartPage: {
                    cats: [],
                    total: '$0'
                },
                nextButton: { text: 'Next', disabled: true },
            }
        });
    }));

    test('should disappear when user clicks outside the form', () => act(async () => {
        await app.expect({ checkoutForm: { cartPage: {} } });

        app.checkoutForm.clickOutside();
        await app.expect({ checkoutForm: null });
    }));
});
