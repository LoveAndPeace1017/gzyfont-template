import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import 'core-js/es6/map';
import 'core-js/es6/set';
import { Modal, Spin } from 'antd';
import rootReducer from './store';
import routes from './routes';
import coopRouters from './coopRouters';
import traceRouters from './traceRouters';

import Index from 'pages/index';
import loading from './images/loading.gif'

export default class App extends React.Component {
	componentDidMount() {
		setTimeout(function(){
			//隐藏loading
			const oLoading = document.getElementById('loading');
			oLoading.style.display = 'none';

			const oBody = document.getElementsByTagName('body')[0];
			oBody.style.overflow = 'auto';
		},1000);

		Spin.setDefaultIndicator(<img src={loading} style={{width: '130px', height:'auto'}}/>)

		//把用户信息放入cookie中
		// setCookie('main_user_id_enc', 'XuoAyMgUOKvC', 20);
		// setCookie('sub_user_id_enc', 'XuoAyMgUOKvC', 20);
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

        // 判断是否为合伙人域名
		const isCooperateFlag = (window.location.hostname === 'hehuo.abiz.com');
		// 判断是否为订单追踪平台
        const isTracePlateformFlag = (window.location.hostname === 'order.abiz.com');
		return (
				<Router getUserConfirmation={getConfirmation}>
					<React.Fragment>
						<Index routes={isCooperateFlag ? coopRouters : isTracePlateformFlag ? traceRouters : routes}/>
					</React.Fragment>
				</Router>
		);
	}
}
