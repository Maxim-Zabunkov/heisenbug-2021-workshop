import { createSelector } from "@reduxjs/toolkit";
import {AppState} from "../contracts/app-state.contracts";

export const selectAddressDetails = (state: AppState) => state.addressDetails;

export const isAddressFormFilled = createSelector(selectAddressDetails, addressDetails =>
    addressDetails.addressLine1 &&
    addressDetails.city &&
    addressDetails.country &&
    addressDetails.zipCode &&
    addressDetails.firstName &&
    addressDetails.lastName);
