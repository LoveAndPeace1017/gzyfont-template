import React from 'react';
import ReactDOM from 'react-dom';
import {ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { AppContainer } from 'react-hot-loader';
import App from './app';

const render = (App) => {
    ReactDOM.render(
        <ConfigProvider locale={zhCN}>
            <AppContainer>
                <App />
            </AppContainer>
        </ConfigProvider>,
        document.getElementById('root')
    )
};

render(App);

//热模块替换
if (module.hot) {
    module.hot.accept('./app', () => {
        render(App);
    })
}


