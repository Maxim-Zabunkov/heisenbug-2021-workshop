import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {initialState} from "./initial-state";
import {PaymentDetails} from "../contracts/app-state.contracts";

const paymentDetailsSlice = createSlice({
    name: 'paymentDetails',
    initialState: initialState.paymentDetails,
    reducers: {
        setCardName(state: PaymentDetails, action: PayloadAction<string>) {
            state.cardName = action.payload;
        },
        setCardNumber(state: PaymentDetails, action: PayloadAction<string>) {
            state.cardNumber = action.payload;
        },
        setCvv(state: PaymentDetails, action: PayloadAction<string>) {
            state.cvv = action.payload;
        },
        setExpiryDate(state: PaymentDetails, action: PayloadAction<string>) {
            state.expiryDate = action.payload;
        },
    },
});

export default paymentDetailsSlice.reducer;
export const { setCardName, setCardNumber, setCvv, setExpiryDate } = paymentDetailsSlice.actions;