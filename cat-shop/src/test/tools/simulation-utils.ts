import { ReactWrapper } from "enzyme";

export function simulateClick(control: ReactWrapper): void {
    if (!control.exists())
        throw new Error('simulateClick: element is not shown.');
    if (control.prop('disabled'))
        throw new Error(`simulateClick: element is disabled`);
    control.simulate('click');
}

export function simulateInputChange(input: ReactWrapper, value: string): void {
    if (!input.exists())
        throw new Error('simulateInputChange: input element is not shown.');
    if (input.type() !== 'input')
        throw new Error(`simulateInputChange: invalid element: expected <input/>, but was ${input.type()}`);
    if (input.getDOMNode<HTMLInputElement>().disabled)
        throw new Error(`simulateInputChange: input element is disabled`);
    input.simulate('change', { target: { value } });
}