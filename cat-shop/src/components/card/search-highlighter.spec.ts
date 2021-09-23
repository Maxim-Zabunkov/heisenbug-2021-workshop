import { splitText } from "./search-highlighter";

describe('SerachHighlighter', () => {
    test('should split text onto parts', () => {
        const result = splitText('Hello My Friend', 'fri');
        expect(result).toMatchSnapshot();
    });
});