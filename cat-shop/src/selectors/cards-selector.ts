import { createSelector } from "@reduxjs/toolkit";
import { AppState } from "../contracts/app-state.contracts";
import { selectPurchases } from "./purchase-selector";

export const selectSearch = (state: AppState) => state.search;
export const selectCards = (state: AppState) => state.cards;

export const selectFileterdCards = createSelector(
    selectCards, 
    selectSearch,
    selectPurchases,
    (cards, search, purchases) =>  {
    const searchPattern = search?.pattern?.toLowerCase();
    return searchPattern ? cards.filter(card =>
        purchases.some(p => p.id === card.id) ||
        card.name.toLowerCase().includes(searchPattern) ||
        card.description.toLowerCase().includes(searchPattern) ||
        card.temperament.toLowerCase().includes(searchPattern))
        : cards
});