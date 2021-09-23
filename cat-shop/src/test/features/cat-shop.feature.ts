describe('[Cat Shop]', () => {
    test('initial state when application started', () => {
        const app = userOpensApplication();
        app.expect({
            navBar: {
                title: 'Wellcome',
                search: { text: '', placeholder: 'Search...' },
                cartIcon: { disabled: true }
            },
            cats: [],
            checkoutForm: null
        });
    });

    test.todo('should request cats data from server');
    test.todo('should show cat cards when data loaded');

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
