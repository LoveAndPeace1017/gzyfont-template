import React, { Component } from 'react'
import { Provider } from 'react-redux'
import rootReducer from '../store';
import {applyMiddleware, createStore} from "redux";
import thunk from "redux-thunk";
import { ConfigProvider } from 'antd';
import zhCN from "antd/lib/locale-provider/zh_CN";
import {BrowserRouter as Router} from "react-router-dom";


//包含所有的公共样式
import 'styles/common.scss';
//覆盖ant样式
import 'styles/ant.scss';

//针对1366屏幕尺寸的样式（谁让老板是笔记本小屏呢。。）
import 'styles/narrow_screen.scss';


const store = applyMiddleware(thunk)(createStore)(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default class Wrapper extends Component {
    render() {
        return (
            <ConfigProvider locale={zhCN}>
                <Provider store={store}>
                    <Router>{this.props.children}</Router>
                </Provider>
            </ConfigProvider>
        );
    }
}