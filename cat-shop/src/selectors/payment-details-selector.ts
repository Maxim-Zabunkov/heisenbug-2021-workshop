import { createSelector } from "@reduxjs/toolkit";
import {AppState} from "../contracts/app-state.contracts";

export const paymentDetailsSelector = (state: AppState) => state.paymentDetails;

export const isPaymentDetailsFormFilled = createSelector(paymentDetailsSelector, paymentDetails =>
    paymentDetails.cvv &&
    paymentDetails.cardNumber &&
    paymentDetails.expiryDate &&
    paymentDetails.cardName);

