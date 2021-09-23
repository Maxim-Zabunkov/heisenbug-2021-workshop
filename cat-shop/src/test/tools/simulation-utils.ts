import { ReactWrapper } from "enzyme";

export function simulateInputChange(input: ReactWrapper, value: string) {
    if (!input.exists())
        throw new Error('simulateInputChange: input element is not shown.');
    if (input.type() !== 'input')
        throw new Error(`simulateInputChange: invalid element: expected <input/>, but was ${input.type()}`);
    if (input.getDOMNode<HTMLInputElement>().disabled)
        throw new Error(`simulateInputChange: input element is disabled`);
    input.simulate('change', { target: { value } });
}