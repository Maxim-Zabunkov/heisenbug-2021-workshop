import { call, put, select } from "redux-saga/effects";
import { AppApi, SubmitOrderRequest, SubmitOrderResponse } from "../api/contracts";
import { AppState } from "../contracts/app-state.contracts";
import { setOrder } from "../slices/order.slice";
import { clearPurchase } from "../slices/purchase.slice";

export function* submitOrderSaga(api: AppApi) {
    yield put(setOrder({ inProgress: true }));
    const state: AppState = yield select();
    const catIds = state.purchases.map(purchase => purchase.id);
    const order: SubmitOrderRequest = { catIds };
    const response: SubmitOrderResponse = yield call(api.placeOrder.bind(api), order);
    if (response.status) {
        yield put(clearPurchase());
        yield put(setOrder({ orderId: response.orderId, inProgress: false }));
    }
}