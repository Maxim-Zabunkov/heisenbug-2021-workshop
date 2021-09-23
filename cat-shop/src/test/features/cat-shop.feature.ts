import { act } from "react-dom/test-utils";
import { mockCats, UiApi, userOpensApplication } from "../dsl";

describe('[Cat Shop]', () => {
    let app: UiApi;

    afterEach(() => app?.dispose());

    test('initial state when application started', () => act(async () => {
        app = userOpensApplication();
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

    // Blocked: need Mock API
    test.todo('should request cats data from server');

    test('should show cat cards when data loaded', () => act(async () => {
        app = userOpensApplication(mockCats(
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

    test.todo('should filter cats by entering search');
    test.todo('should show all cats when search removed');

    test.todo('should add / remove cats to cart');
    test.todo('should NOT be able to add more than 5 different cats');

    test.todo('Cart page: check initial state');
    test.todo('Cart page: user should be able to change cats count');
    test.todo('Shipping Address page: check initial state');
    test.todo('Shipping Address page: when user populates all required fields, Next button should unlock');
    test.todo('Payment Details page: check initial state');
    test.todo('Payment Details page: when user populates all required fields, Next button should unlock');
    test.todo('Order summary page: check state');
    test.todo('Place Order: check place request');
    test.todo('Place Order: handle success response');
    test.todo('Place Order: handle reject response');

    test.todo('Checkout form: should disappear when user click outside');
});
