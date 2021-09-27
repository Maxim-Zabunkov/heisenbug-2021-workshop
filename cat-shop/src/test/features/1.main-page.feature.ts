import { act } from "react-dom/test-utils";
import { MockApi, mockCats, UiApi, userOpensApplication } from "../dsl";

describe('Main page', () => {
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

    test.todo('if a cat has no image, no_image.png should be shown');

    test('Search: should filter cats by entering search', () => act(async () => {
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

    test.todo('Search: should show cats added to cart regardless search filter');

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
});
