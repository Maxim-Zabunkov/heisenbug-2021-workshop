import React from "react";
import { Provider } from "react-redux";
import App from "./App";
import { AppStore } from "./configure-store";

export function AppComponent(props: { store: AppStore }) {
    return (
        <React.StrictMode>
            <Provider store={props.store}>
                <App />
            </Provider>
        </React.StrictMode>
    );
}