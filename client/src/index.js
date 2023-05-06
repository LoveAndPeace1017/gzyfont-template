// import "@babel/polyfill";
import React from 'react';
import ReactDOM from 'react-dom';
import I18n from './I18n';
import { AppContainer, setConfig  } from 'react-hot-loader';
import App from './App';
import {applyMiddleware, createStore} from "redux";
import thunk from "redux-thunk";
import rootReducer from "./store";
import {Provider} from "react-redux";
import simpleAsync from "utils/reduxSimpleAsync";


// setConfig({ logLevel: 'debug' });

const store = applyMiddleware(thunk, simpleAsync)(createStore)(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./store', () => store.replaceReducer(rootReducer))
}

const render = (App) => {
    ReactDOM.render(
        <I18n>
            <AppContainer>
                <Provider store={store}>
                    <App/>
                </Provider>
            </AppContainer>
        </I18n>,
        document.getElementById('root')
    )
};

render(App);

//热模块替换
if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./App', () => {
        render(App);
    })
}


