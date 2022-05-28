import React from 'react';
import {createRoot} from 'react-dom/client';
import './app/layout/styles.css';
import App from './app/layout/App';
import reportWebVitals from './reportWebVitals';
import {Router} from "react-router-dom";
import {createBrowserHistory} from "history";
import {StoreProvider} from "./app/context/StoreContext";

export const history = createBrowserHistory();
const rootElement = document.getElementById("root");

const root = createRoot(rootElement!);
root.render(
    <Router history={history}>
        <React.StrictMode>
            <StoreProvider>
            <App/>
            </StoreProvider>
        </React.StrictMode>
    </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
