import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {initialState} from "./initial-state";
import {Search} from "../contracts/app-state.contracts";

const searchSlice = createSlice({
    name: 'search',
    initialState: initialState.search,
    reducers: {
        setSearchPattern(state: Search, action: PayloadAction<string>) {
            state.pattern = action.payload;
        },
    },
});

export default searchSlice.reducer;
export const { setSearchPattern } = searchSlice.actions;