import React, { Component } from 'react';
import { Popover } from 'antd';
import renderRoutes from 'utils/renderRoutes';
import Content from 'components/layout/content'
import ImportGoodsGuide from 'components/business/importGoodsGuide';
import Header from 'components/layout/header';
import CooperatorHeader from 'components/layout/cooperatorHeader';
import TraceHeader from 'components/layout/traceHeader';
import Sider from 'components/layout/sider';
import TraceSider from 'components/layout/traceSider';
import Icon from 'components/widgets/icon';
import {RightOutlined, LeftOutlined} from '@ant-design/icons'

import {isAuthed} from 'utils/isHasAuth';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import intl from 'react-intl-universal';
import {actions as commonActions} from 'components/business/commonRequest/index';
import {actions as collapseActions} from "components/layout/sider";
import {getUrlParamValue} from 'utils/urlParam';
import machine from 'images/machine.png';
import {withRouter} from 'react-router-dom';

//包含所有的公共样式
import 'styles/common.scss';
//覆盖ant样式
import 'styles/ant.scss';
//动画样式
import 'styles/animation.scss';

//针对1366屏幕尺寸的样式（谁让老板是笔记本小屏呢。。）
import 'styles/narrow_screen.scss';

 class Index extends Component {

 	state={
		guideVisible: false
	};

 	getGuideVisible=(guideVisible)=>{
		this.setState({
			guideVisible
		})
	};

	componentDidMount() {
		this.props.asyncGetComInfo();
	}

	openKefu = () => {
        //P版环境http://kefu.trademessenger.com/chat?domain=abiz&businessType=MozgN71yEsE
        window.open("http://kefu.trademessenger.com/chat?domain=abiz&businessType=tWjREgBZ-6E", "kefu", "toolbar=no,location=no,directories=no,resizable=yes,status=yes,menubar=no,scrollbars=yes,width=862,height=615,left=100,top=100");
	};

	render() {
		const {routes,currentAccountInfo} =this.props;
        // 判断是否为合伙人域名
        const isCooperateFlag = (window.location.hostname === 'hehuo.abiz.com');
        // 判断是否为订单追踪平台
        const isTracePlateformFlag = (window.location.hostname === 'order.abiz.com');
		const accountInfo = currentAccountInfo.get('data');
		console.log('render------==========')
		//如果url的query中有current参数，那么把它给路由，用这个来进行定位菜单
		const current = getUrlParamValue('current');

		// 优采应用走改分支
        if(!isCooperateFlag){
            routes &&routes.forEach((item)=>{
                if(item.uid && this.props.location.uid === item.uid){
                    if(current){
                        item.customCurrent = current; //为了不影响之前的current所以添加了一个自定义的current，
                    }else{
                        item.customCurrent = '';
                    }
                }
            });

            //给权限赋值
            if(accountInfo.get('comName')&&!accountInfo.get('mainUserFlag')){
                let authMap = accountInfo.get('authMap').toJS();
                console.log(authMap, 'authMap');
                routes&&routes.forEach((item)=>{
                    if(item.authModule){
                        item.isAuthed = isAuthed(authMap, item.authModule, item.authType, item.authCombineType, item.authAllDataRange)
                    }
                });
            }
		}


        return (
            <div style={{ minHeight: '100vh' }}>
				{
                    isCooperateFlag ? (
                    	<React.Fragment>
                            <CooperatorHeader />
                            <section style={{overflow:"hidden"}}  id="contentWrap">
                                <Content>
                                 {renderRoutes(routes)}
								</Content>
							</section>
						</React.Fragment>
					) : isTracePlateformFlag?(
                        <React.Fragment>
                            <TraceHeader />
                            <section className="content-layout">
                                <section className={this.props.collapsed?"content-wrap content-wrap-collapsed":"content-wrap"} id="contentWrap">
                                    <Content>
                                        {renderRoutes(routes)}
                                    </Content>
                                </section>
                                <div className="side-wrap">
                                    <TraceSider routes={routes}/>
                                </div>
                            </section>
                        </React.Fragment>
                    ):(
                    	<React.Fragment>
                            <Header />
                            <section className="content-layout">
                                <section className={this.props.collapsed?"content-wrap content-wrap-collapsed":"content-wrap"} id="contentWrap">
                                    <Content>
                                        {renderRoutes(routes)}
                                        <Popover content={intl.get("home.account.tip6")} placement="left">
                                            <div onClick={this.openKefu} className="machine-chat">
                                                <img src={machine} width={70} height={70} alt={"111"}/>
                                            </div>
                                        </Popover>
                                    </Content>
                                </section>
                                <div className="side-wrap">
                                    <Sider routes={routes} className={this.state.guideVisible?"guide-visible":""}/>
                                    <span
                                        ga-data="nav-sidebar-arrow-trigger"
                                        className="trigger-btn"
                                        onClick={this.props.toggle}
                                    >
										{
                                            this.props.collapsed ?  <RightOutlined /> : <LeftOutlined />
										}
									</span>
                                </div>
                            </section>
                            {/*<ImportGoodsGuide getGuideVisible={this.getGuideVisible}/>*/}
						</React.Fragment>
					)
				}
            </div>
		);
	}
}

const mapStateToProps = state => ({
	collapsed: state.getIn(['sider', 'collapsed']),
	currentAccountInfo: state.getIn(['commonInfo', 'currentAccountInfo']),
});
const mapDispatchToProps = dispatch => {
	return bindActionCreators({
		asyncGetComInfo: commonActions.asyncGetComInfo,
        toggle: collapseActions.toggle
	}, dispatch)
};

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Index))
