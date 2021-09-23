import { createStore, applyMiddleware } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import createSagaMiddleware from "redux-saga";
import { createAppAPi } from "./api/create-app-api";
import { rootSaga } from "./sagas/root.saga";
import { rootReducer } from "./slices/root.reducer";

export function configureStore() {
    const sagaMiddleware = createSagaMiddleware();
    const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
    const api = createAppAPi();
    sagaMiddleware.run(rootSaga, api);
    return store;
}

export type AppStore = ReturnType<typeof configureStore>;
export type AppDispatch = AppStore['dispatch'];
export const useAppDispatch = () => useDispatch<AppDispatch>();
