import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {initialState} from "./initial-state";
import {AddressDetails} from "../contracts/app-state.contracts";

const addressDetailsSlise = createSlice({
    name: 'addressDetails',
    initialState: initialState.addressDetails,
    reducers: {
        setFirstName(state: AddressDetails, action: PayloadAction<string>) {
            state.firstName = action.payload;
        },
        setLastName(state: AddressDetails, action: PayloadAction<string>) {
            state.lastName = action.payload;
        },
        setState(state: AddressDetails, action: PayloadAction<string>) {
            state.state = action.payload;
        },
        setAddressLine1(state: AddressDetails, action: PayloadAction<string>) {
            state.addressLine1 = action.payload;
        },
        setAddressLine2(state: AddressDetails, action: PayloadAction<string>) {
            state.addressLine2 = action.payload;
        },
        setCity(state: AddressDetails, action: PayloadAction<string>) {
            state.city = action.payload;
        },
        setCountry(state: AddressDetails, action: PayloadAction<string>) {
            state.country = action.payload;
        },
        setZipCode(state: AddressDetails, action: PayloadAction<string>) {
            state.zipCode = action.payload;
        },
    },
});

export default addressDetailsSlise.reducer;
export const { setFirstName, setLastName, setCity, setCountry, setAddressLine1, setAddressLine2, setState, setZipCode } = addressDetailsSlise.actions;