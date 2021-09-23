import { AppState } from "../contracts/app-state.contracts";
import { GroupedPurchase } from "../components/checkout/review.contracts";
import { CatInfo } from "../api/contracts";
import { MAX_COUNT_OF_PURCHASES } from "../constants/app.constants";
import { createSelector } from "@reduxjs/toolkit";

export const selectNofPurcnahses = (state: AppState) => state.purchases.length;
export const selectPurchases = (state: AppState) => state.purchases;

export const purchaseTotalPrice = createSelector(selectPurchases, calculateTotalPurchasePrice);
export const groupedPurchasesSelector = createSelector(selectPurchases, purchases => {
    const seen = new Set();
    const groupedPurchases: GroupedPurchase[] = [];
    purchases.forEach(purchase => {
        if (seen.has(purchase.id)) {
            return;
        }
        const count = purchases.filter(item => item.id === purchase.id).length;
        groupedPurchases.push({ count, purchase })
        seen.add(purchase.id);
    });
    return groupedPurchases.sort((x, y) => x.purchase.name.localeCompare(y.purchase.name));
});

function calculateTotalPurchasePrice(purchases: CatInfo[]): number {
    let price = 0;
    purchases.forEach(purchase => price += purchase.price);
    return price;
}

export const canAddToPurchase = (cat: CatInfo) => createSelector(selectPurchases, purchases => {
    const different = new Set<string>();
    purchases.forEach(p => different.add(p.id));
    return different.size < MAX_COUNT_OF_PURCHASES || different.has(cat.id);
});