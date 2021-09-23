import {cardsSaga} from "./cards-saga";
import {fork, takeLatest} from 'redux-saga/effects'
import {submitOrderSaga} from "./submit-order-saga";
import { AppApi } from "../api/contracts";

export function* rootSaga(api: AppApi){
    yield fork(cardsSaga, api);
    yield takeLatest('SUBMIT_ORDER', submitOrderSaga, api);
}