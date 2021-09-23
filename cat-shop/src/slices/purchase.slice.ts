import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { CatInfo } from "../api/contracts";
import {initialState} from "./initial-state";

const purchaseSlice = createSlice({
    name: 'purchases',
    initialState: initialState.purchases,
    reducers: {
        addPurchase(state: CatInfo[], action: PayloadAction<CatInfo>) {
            state.push(action.payload);
        },
        removePurchase(state: CatInfo[], action: PayloadAction<CatInfo>) {
            const index = state.findIndex(item => item.id === action.payload.id);
            if(index >= 0){
                state.splice(index, 1);
            }
        },
        clearPurchase(state: CatInfo[]) {
            state.length = 0;
        }
    },
});

export default purchaseSlice.reducer;
export const { addPurchase, removePurchase, clearPurchase } = purchaseSlice.actions;