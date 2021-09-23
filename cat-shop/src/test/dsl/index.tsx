import createSagaMiddleware from "@redux-saga/core";
import { mount } from "enzyme";
import { applyMiddleware, createStore } from "redux";
import { CatInfo } from "../../api/contracts";
import { AppComponent } from "../../create-app-component";
import { rootSaga } from "../../sagas/root.saga";
import { rootReducer } from "../../slices/root.reducer";
import { createMockApi } from "./api-mock";
import { CatShopDsl } from "./cat-shot.dsl";

export { mockCats } from './api-mock';

export type UiApi = ReturnType<typeof userOpensApplication>;

export function userOpensApplication(cats?: CatInfo[]) {
    const sagaMiddleware = createSagaMiddleware();
    const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
    const api = createMockApi(cats);
    const root = mount(<AppComponent store={store} />)
    const sagaTask = sagaMiddleware.run(rootSaga, api);

    return Object.assign(new CatShopDsl(root), {
        dispose() {
            sagaTask.cancel();
            root.unmount();
        }
    });
}
