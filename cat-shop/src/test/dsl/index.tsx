import createSagaMiddleware from "@redux-saga/core";
import { mount } from "enzyme";
import { applyMiddleware, createStore } from "redux";
import { AppApi, CatInfo } from "../../api/contracts";
import { AppComponent } from "../../create-app-component";
import { rootSaga } from "../../sagas/root.saga";
import { rootReducer } from "../../slices/root.reducer";
import { Allure, ApiMock, MockUtils } from "../tools";
import { createMockApi } from "./api-mock";
import { CatShopDsl } from "./cat-shot.dsl";

export { mockCats } from './api-mock';

export type UiApi = CatShopDsl & { dispose(): void };
export type MockApi = ApiMock<AppApi>;

export function userOpensApplication(): [UiApi, MockApi] {
    return Allure.step('[UI] userOpensApplication()', () => {
        const sagaMiddleware = createSagaMiddleware();
        const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
        const api = createMockApi();
        const root = mount(<AppComponent store={store} />)
        const sagaTask = sagaMiddleware.run(rootSaga, api);
    
        const uiApi = Object.assign(new CatShopDsl(root), {
            dispose() {
                sagaTask.cancel();
                root.unmount();
                MockUtils.reset();
            }
        });
    
        return [uiApi, api as unknown as MockApi];
    });
}
