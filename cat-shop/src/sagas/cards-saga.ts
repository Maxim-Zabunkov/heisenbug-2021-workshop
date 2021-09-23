import { call, put } from 'redux-saga/effects';
import { AppApi, CatInfo } from "../api/contracts";
import { setCards } from "../slices/cards.slice";

export function* cardsSaga(api: AppApi) {
    const cards: CatInfo[] = yield call(api.getCats.bind(api));
    yield put(setCards(cards));
}
