import { act } from "react-dom/test-utils";
import { MockApi, mockCats, UiApi, userOpensApplication } from "../dsl";

describe('[Cat Shop]', () => {
    let app: UiApi;
    let mock: MockApi;

    beforeEach(() => {
        [app, mock] = userOpensApplication()
    });

    afterEach(() => app?.dispose());

    test('initial state when application started', () => act(async () => {
        await app.expect({
            navBar: {
                title: 'Welcome',
                search: { text: '', placeholder: 'Search…' },
                cartIcon: { disabled: true }
            },
            cats: [],
            checkoutForm: null
        });
    }));

    test('should request cats data from server', () => act(async () => {
        await mock.getCats.expectRequest();
    }));

    test('should show cat cards when data loaded', () => act(async () => {
        mock.getCats.setup(mockCats(
            { name: 'the cat 1', description: 'about cat 1', price: 123 },
            { name: 'cat 2', description: 'about cat 2', price: 321 },
            { name: 'a cat 3', description: 'about cat 3', price: 222 },
        ));
        await app.expect({
            cats: [
                { title: 'the cat 1', description: 'about cat 1', price: '$123' },
                { title: 'cat 2', description: 'about cat 2', price: '$321' },
                { title: 'a cat 3', description: 'about cat 3', price: '$222' },
            ]
        });
    }));

    test('should filter cats by entering search', () => act(async () => {
        mock.getCats.setup(mockCats(
            { name: 'the cat 1', description: 'about cat 1', price: 123 },
            { name: 'cat 2', description: 'about cat 2', price: 321 },
            { name: 'a cat 3', description: 'about cat 3', price: 222 },
        ));
        await app.expect({ cats: [{}, {}, {}] });

        app.navBar.search.type('2');
        await app.expect({
            cats: [
                { title: 'cat 2', description: 'about cat 2', price: '$321' },
            ]
        });

        app.navBar.search.type('');
        await app.expect({
            cats: [
                { title: 'the cat 1', description: 'about cat 1', price: '$123' },
                { title: 'cat 2', description: 'about cat 2', price: '$321' },
                { title: 'a cat 3', description: 'about cat 3', price: '$222' },
            ]
        });
    }));

    test('should add / remove cats to cart', () => act(async () => {
        mock.getCats.setup(mockCats(
            { name: 'the cat 1', description: 'about cat 1', price: 123 },
            { name: 'cat 2', description: 'about cat 2', price: 321 },
            { name: 'a cat 3', description: 'about cat 3', price: 222 },
        ));
        await app.expect({ cats: [{}, {}, {}] });

        app.cats[0].cartIcon.click();
        app.cats[1].cartIcon.click();
        app.cats[2].cartIcon.click();

        app.cats[0].addIcon.click();
        app.cats[1].removeIcon.click();

        await app.expect({
            cats: [
                { cartIcon: null, addIcon: {}, removeIcon: {}, quantity: '2 cats' },
                { cartIcon: {}, addIcon: null, removeIcon: null, quantity: null },
                { cartIcon: null, addIcon: {}, removeIcon: {}, quantity: '1 cats' },
            ]
        });
    }));

    test('should NOT be able to add more than 5 different cats', () => act(async () => {
        mock.getCats.setup(mockCats(6));
        await app.expect({ cats: new Array(6) });

        for (let i = 0; i < 5; i++)
            app.cats[i].cartIcon.click();

        await app.expect({
            cats: [...new Array(5), { cartIcon: { disabled: true } }]
        });
    }));

    test('Cart page: check initial state', () => act(async () => {
        mock.getCats.setup(mockCats({ name: 'my cat', price: 123 }));
        await app.expect({ cats: new Array(1) });
        app.cats[0].cartIcon.click();
        await app.expect({ navBar: { cartIcon: { text: '1', disabled: false } } });

        app.navBar.cartIcon.click();
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

    test('Cart page: user should be able to change cats count', () => act(async () => {
        mock.getCats.setup(mockCats({ name: 'my cat', price: 123 }));
        await app.expect({ cats: new Array(1) });
        app.cats[0].cartIcon.click();
        await app.expect({ navBar: { cartIcon: { text: '1', disabled: false } } });
        app.navBar.cartIcon.click();
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

    test('Shipping Address page: check initial state', () => act(async () => {
        mock.getCats.setup(mockCats({ name: 'my cat', price: 123 }));
        await app.expect({ cats: new Array(1) });
        app.cats[0].cartIcon.click();
        await app.expect({ navBar: { cartIcon: { text: '1', disabled: false } } });
        app.navBar.cartIcon.click();
        await app.expect({ checkoutForm: { cartPage: {}, nextButton: { text: 'Next', disabled: false } } });

        app.checkoutForm.nextButton.click();
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

    test('Shipping Address page: when user populates all required fields, Next button should unlock', () => act(async () => {
        mock.getCats.setup(mockCats({ name: 'my cat', price: 123 }));
        await app.expect({ cats: new Array(1) });
        app.cats[0].cartIcon.click();
        await app.expect({ navBar: { cartIcon: { text: '1', disabled: false } } });
        app.navBar.cartIcon.click();
        await app.expect({ checkoutForm: { cartPage: {}, nextButton: { text: 'Next', disabled: false } } });
        app.checkoutForm.nextButton.click();
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

    test('Payment Details page: check initial state', () => act(async () => {
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

    test('Payment Details page: when user populates all required fields, Next button should unlock', () => act(async () => {
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

    test('Order summary page: check state', () => act(async () => {
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

    test('Place Order: check place request', () => act(async () => {
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
        await app.expect({ checkoutForm: { reviewOrderPage: {}, nextButton: { text: 'Place Order', disabled: false } } });

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

    test('Place Order: handle reject response', () => act(async () => {
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
        await app.expect({ checkoutForm: { reviewOrderPage: {}, nextButton: { text: 'Place Order', disabled: false } } });

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

    test('Checkout form: should disappear when user click outside', () => act(async () => {
        mock.getCats.setup(mockCats({ name: 'my cat', price: 123 }));
        await app.expect({ cats: new Array(1) });
        app.cats[0].cartIcon.click();
        await app.expect({ navBar: { cartIcon: { text: '1', disabled: false } } });
        app.navBar.cartIcon.click();
        await app.expect({ checkoutForm: { cartPage: {}, nextButton: { text: 'Next', disabled: false } } });

        app.checkoutForm.clickOutside();
        await app.expect({ checkoutForm: null });
    }));
});
