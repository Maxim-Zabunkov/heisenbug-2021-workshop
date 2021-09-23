import React from 'react';
import ReactDOM from 'react-dom';
import { configureStore } from './configure-store';
import { AppComponent } from './create-app-component';

const store = configureStore();

ReactDOM.render(
    <AppComponent store={store} />,
    document.getElementById('root')
);