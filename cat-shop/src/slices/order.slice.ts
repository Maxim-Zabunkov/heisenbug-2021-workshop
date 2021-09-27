import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./initial-state";
import { OrderInfo } from "../contracts/app-state.contracts";

const orderSlice = createSlice({
    name: 'order',
    initialState: initialState.orderInfo,
    reducers: {
        setOrder(state: OrderInfo, action: PayloadAction<OrderInfo>) {
            return action.payload;
        },
        setOrderFailed(state: OrderInfo, action: PayloadAction<Error>) {
            state.error = action.payload;
            state.inProgress = false;
        }
    },
});

export default orderSlice.reducer;
export const { setOrder, setOrderFailed } = orderSlice.actions;