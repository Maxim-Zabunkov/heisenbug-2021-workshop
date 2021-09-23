import { CatInfo } from "../api/contracts";
import { AppState } from "../contracts/app-state.contracts";
import { canAddToPurchase } from "./purchase-selector";

describe('selectors', () => {
    test('canAddToPurchase should work', () => {
        const selector = canAddToPurchase({ id: 'a' } as CatInfo);
        const result = selector({ purchases: [] } as any);
        expect(result).toBe(true);
    });
});