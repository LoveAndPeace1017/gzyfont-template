import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { BrowserRouter as Router } from 'react-router-dom';

import 'core-js/es6/map';
import 'core-js/es6/set';
import {Modal, Spin} from 'antd';
import rootReducer from '../src/store';
import routes from './routes';
import simpleAsync from "utils/reduxSimpleAsync";

import Index from 'pages/index';
import loading from "images/loading.gif";

const store = applyMiddleware(thunk, simpleAsync)(createStore)(
	rootReducer,
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default class App extends React.Component {
	componentDidMount() {
		setTimeout(function(){
			//隐藏loading
			const oLoading = document.getElementById('loading');
			oLoading.style.display = 'none';

			const oBody = document.getElementsByTagName('body')[0];
			oBody.style.overflow = 'hidden';
		},1000);

		Spin.setDefaultIndicator(<img src={loading} style={{width: '80px', height:'auto'}}/>)
	}

	render() {
		const getConfirmation = (message,callback) => {
			const ConFirmComponent = () => (
				<Modal
					title={"提示信息"}
					visible={true}
					onOk={() => {callback(true);ReactDOM.unmountComponentAtNode(document.getElementById('root1'))}}
					onCancel={() => {callback(false);ReactDOM.unmountComponentAtNode(document.getElementById('root1'))}}
				>
					{message}
				</Modal>
			);
			ReactDOM.render(
				<ConFirmComponent />,
				document.getElementById('root1')
			)
		};

		return (
			<Provider store={store}>
				<Router getUserConfirmation={getConfirmation}>
					<React.Fragment>
						<Index routes={routes}/>
					</React.Fragment>
				</Router>
			</Provider>
		);
	}
}
