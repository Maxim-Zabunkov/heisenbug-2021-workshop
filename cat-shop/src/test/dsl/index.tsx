import createSagaMiddleware from "@redux-saga/core";
import { mount } from "enzyme";
import { createStore, applyMiddleware } from "redux";
import { createAppAPi } from "../../api/create-app-api";
import { AppComponent } from "../../create-app-component";
import { rootSaga } from "../../sagas/root.saga";
import { rootReducer } from "../../slices/root.reducer";

export type UiApi = ReturnType<typeof userOpensApplication>;

export function userOpensApplication() {
    const sagaMiddleware = createSagaMiddleware();
    const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
    const api = createAppAPi();
    const root = mount(<AppComponent store={store} />)
    const sagaTask = sagaMiddleware.run(rootSaga, api);

    return Object.assign(root, {
        dispose() {
            sagaTask.cancel();
            root.unmount();
        }
    });
}
