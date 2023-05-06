import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {NavLink} from 'react-router-dom';
import {message, Modal, Tabs, notification, Button} from 'antd';
import Icon from 'components/widgets/icon';
import Auxiliary from 'pages/auxiliary';
import {getCookie,setCookie} from 'utils/cookie';
import Notice from './notice';
import UserFeedback from './userFeedback'
import {Auth} from 'utils/authComponent';
import {Link,withRouter} from 'react-router-dom';
import intl from 'react-intl-universal';
import '../styles/index.scss';
import qcCode from '../images/qr_code.png'
import classNames from "classnames/bind";
import styles from "../styles/index.scss";
import RenderNode from "./renderNode";
import {asyncFetchNoticeCount,asyncFetchApproveInfo} from '../actions'
import {asyncFetchDataProgressList} from '../../../../pages/auxiliary/dataProgress/actions';
import {actions as vipActions} from 'pages/vipService/index';
const cx = classNames.bind(styles);
import HOT from  '../../../../pages/home/images/hot.png';
const TabPane = Tabs.TabPane;


class ToolBar extends Component {
    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.showConfirm = this.showConfirm.bind(this);
        this.state = {
            msgVisible: false,
            auxiliaryVisible: false,
            contactUsVisible: false,
            feedbackVisible: false,
            auxiliaryKey: ''
        }
    }

    handleOpen(type, auxiliaryKey) {
        this.setState({
            [type]: true,
            auxiliaryKey
        })
    }

    handleClose(type) {
        this.setState({
            [type]: false
        })
    }


    showConfirm = () => {
        Modal.confirm({
            title: intl.get("common.confirm.title"),
            okText: intl.get("common.confirm.okText"),
            cancelText: intl.get("common.confirm.cancelText"),
            content: intl.get("common.confirm.content"),
            onOk() {
                window.location.href = '/logout/'
            },
            onCancel() {
            },
        });
    };

    /**
     * 60秒获取一次数据
     */
    loopFetchNotice=()=>{
        setTimeout(()=>{
            this.props.asyncFetchNoticeCount(()=>{
                this.loopFetchNotice();
            });
        }, 300000)
    };

    initDataProgress = ()=>{
       this.props.asyncFetchDataProgressList((data)=>{
           setCookie("priceDecimalNum",data.priceDecimalNum || 3);
           setCookie("quantityDecimalNum",data.quantityDecimalNum || 3);
       });
    }

    loopFetchApproveInfo = () =>{
        let _this = this;
        setTimeout(()=>{
            this.props.asyncFetchApproveInfo((data)=>{
                if(data.retCode && data.retCode == '0'){
                    let approveAry = data.popupList;
                    for(let i=0;i<approveAry.length;i++){
                        setTimeout(()=>{
                            if(approveAry[i].billNo && approveAry[i].creator && approveAry[i].documentType){
                                const key = `open${Date.now()}`;
                                let url = '';
                                switch (approveAry[i].documentFlag){
                                    case 'DD':
                                        url = `/purchase/show/${approveAry[i].billNo}`;
                                        break
                                    case 'XS':
                                        url = `/sale/show/${approveAry[i].billNo}`;
                                        break
                                    case 'RK':
                                        url = `/inventory/inbound/show/${approveAry[i].billNo}`;
                                        break
                                    case 'CK':
                                        url = `/inventory/outbound/show/${approveAry[i].billNo}`;
                                        break
                                    case 'FK':
                                        url = `/finance/expend/show/${approveAry[i].id}`;
                                        break
                                    case 'SK':
                                        url = `/finance/income/show/${approveAry[i].id}`;
                                        break
                                    case 'FP':
                                        url = `/finance/invoice/show/${approveAry[i].id}`;
                                        break
                                    case 'KP':
                                        url = `/finance/saleInvoice/show/${approveAry[i].id}`;
                                        break
                                    case 'BR':
                                        url = `/purchase/requisitionOrder/show/${approveAry[i].billNo}`;
                                        break
                                }
                                const btn = (
                                    <Button type="primary" size="small" onClick={()=>{
                                        _this.props.history.push(url);
                                        notification.close(key);
                                    }}>
                                        查看
                                    </Button>
                                );

                                notification.open({
                                    message: '待审批',
                                    description: <RenderNode creator={approveAry[i].employeeName} documentType={approveAry[i].documentType}/>,
                                    btn,
                                    key
                                });
                            }
                        },1000*i);

                    }
                }
            });
            this.loopFetchApproveInfo();
        }, 300000)
    }

    getCurrencyVipInfo = ()=>{
        this.props.asyncFetchVipService((data)=>{
            if(data.retCode === "0"){
                let vipInfo = data.data;
                if(vipInfo.CURRENCY.vipState === 'TRY' || vipInfo.CURRENCY.vipState === 'OPENED'){
                    setCookie('currencyVipFlag','true');
                }else{
                    setCookie('currencyVipFlag','false');
                }
            }
        });
    }

    componentDidMount() {
        this.props.asyncFetchNoticeCount();
        this.loopFetchNotice();
        this.loopFetchApproveInfo();
        //初始化更新数据精度
        this.initDataProgress();
        //获取多币种vip信息放入到cookie
        this.getCurrencyVipInfo();
    }

    render() {
        let total = this.props.noticeCount.getIn(['data', 'data']);
        const countIncreased = this.props.noticeCount.get('countIncreased');
        if(total && total>99){
            total = '99+';
        }
        return (
            <React.Fragment>
                <ul className={cx("toolbar")}>
                    <li>
                        <div className={cx("toolbar-wrap")}>
                            <Icon type="icon-phone"/>
                        </div>
                        <div className={cx("dropdown")}>
                            <div className={cx("qc-code-wrap") + ' dropdown-jxcApp-qrcode'}>
                                <img src={qcCode} alt="移动录单，数据随身行赶快扫码下载吧！"/>
                                <p>{intl.get("home.top_menu.tip1")}</p>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className={cx("toolbar-wrap")}>
                            <Icon type="icon-kefu1" style={{fontSize: '24px'}}/>
                    </div>
                        <div className={cx("dropdown")}>
                            <ul className={cx("dropdown-2st") + ' dropdown-online-service'}>
                                <li>
                                    <a style={{color:'#52d271'}} target="_blank" href="//qm.qq.com/cgi-bin/qm/qr?k=6WPdDvW_w9D6aE5ubnJKCVXlkTJxf9fT&jump_from=webapi">{intl.get("vipService.index.onlineService")}</a>
                                </li>
                                <li>
                                    <a href="http://www.abiz.com/info/assistant-assfaq.htm" target="_blank">{intl.get("home.top_menu.problems")}</a>
                                </li>
                                {/*<li>
                                    <NavLink to="/">提意见</NavLink>
                                </li>*/}
                                <li>
                                    <a href="#!" onClick={()=>this.handleOpen('contactUsVisible')}>{intl.get("home.top_menu.link")}</a>
                                </li>
                                <li>
                                    <a href="#!" onClick={()=>this.handleOpen('feedbackVisible')}>{intl.get("home.top_menu.advice")}</a>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li>
                        <div className={cx("toolbar-wrap")}>
                            <Icon type="icon-setting"/>
                        </div>
                        <div className={cx("dropdown")}>
                            <ul className={cx("dropdown-lst") + ' dropdown-project-set'}>
                                <li>
                                    <a href="#!"
                                       onClick={this.handleOpen.bind(this, 'auxiliaryVisible', 'company')}>{intl.get("home.top_menu.company")}</a>
                                </li>
                                <li>
                                    <a href="#!"
                                       onClick={this.handleOpen.bind(this, 'auxiliaryVisible', 'customerLv')}>{intl.get("home.top_menu.customerLv")}</a>
                                </li>
                                <li>
                                    <a href="#!"
                                       onClick={this.handleOpen.bind(this, 'auxiliaryVisible', 'category')}>{"分类管理"}</a>
                                </li>
                                <li>
                                    <a href="#!"
                                       onClick={this.handleOpen.bind(this, 'auxiliaryVisible', 'serial')}>{intl.get("home.top_menu.serial")}</a>
                                </li>
                                <li>
                                    <a href="#!"
                                       onClick={this.handleOpen.bind(this, 'auxiliaryVisible', 'customField')}>{intl.get("home.top_menu.customField")}</a>
                                </li>
                                <li>
                                    <a href="#!"
                                       onClick={this.handleOpen.bind(this, 'auxiliaryVisible', 'income')}>{intl.get("home.top_menu.income")}</a>
                                </li>
                                <li>
                                    <a href="#!"
                                       onClick={this.handleOpen.bind(this, 'auxiliaryVisible', 'order')}>{intl.get("home.top_menu.order")}</a>
                                </li>
                                <li>
                                    <a href="#!"
                                       onClick={this.handleOpen.bind(this, 'auxiliaryVisible', 'tax')}>{intl.get("home.top_menu.tax")}</a>
                                </li>
                                <Auth option='main'>
                                    {
                                        (isAuthed) => isAuthed ?(
                                            <li>
                                                <a href="#!"
                                                   onClick={this.handleOpen.bind(this, 'auxiliaryVisible', 'approve')}>{intl.get("home.top_menu.approve")}</a>
                                            </li>
                                        ):null
                                    }
                                </Auth>
                                <li>
                                    <img src={HOT} className={cx('icon-new')}/>
                                    <a href="#!"
                                       onClick={this.handleOpen.bind(this, 'auxiliaryVisible', 'production')}>生产模块</a>
                                </li>
                                <li>
                                    <a href="#!"
                                       onClick={this.handleOpen.bind(this, 'auxiliaryVisible', 'notification')}>通知设置</a>
                                </li>
                                <li>
                                    <Link to={"/template/list"}>{intl.get("home.top_menu.template")}</Link>
                                </li>
                                <li>
                                    <a href="#!"
                                       onClick={this.handleOpen.bind(this, 'auxiliaryVisible', 'menu')}>导航设置</a>
                                </li>
                                <li className={cx("logout-btn-lst")}>
                                    <a className={cx("logout-btn")} ga-data="global-logout" href="#!" onClick={()=>this.showConfirm()}>{intl.get("home.top_menu.exist")}</a>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li className={cx(["toolbar-message", {"toolbar-message-new": countIncreased}])}>
                        <div className={cx("toolbar-wrap") } onClick={this.handleOpen.bind(this, 'msgVisible')} ga-data="global-msg">
							<span className={cx("icon-msg-wrap")}>
								<Icon type="icon-message"/>
                                {total?(
                                    <i className={cx("badge")}>{total}</i>
                                ):null}
							</span>
                        </div>
                        <Notice
                            visible={this.state.msgVisible}
                            onClose={this.handleClose.bind(this, 'msgVisible')}
                        />
                    </li>
                </ul>
                {/*辅助资料弹层*/}
                <Auxiliary
                    defaultKey={this.state.auxiliaryKey}
                    visible={this.state.auxiliaryVisible}
                    onClose={this.handleClose.bind(this, 'auxiliaryVisible')}
                />

                {/*联系我们*/}
                <Modal
                    title={intl.get("common.modal.title")}
                    visible={this.state.contactUsVisible}
                    onCancel={()=>this.handleClose('contactUsVisible')}
                    destroyOnClose={true}
                    footer={null}
                    width={"640px"}
                >
                    <div className={"contact-panel"}>
                        <h3>{intl.get("common.modal.tip1")}</h3>
                        <ul>
                            <li>{intl.get("common.modal.tip2")}</li>
                            <li>{intl.get("common.modal.tip3")}</li>
                            <li>{intl.get("common.modal.tip4")}<a href="mailto:service@abiz.com">service@abiz.com</a></li>
                            <li>{intl.get("common.modal.tip5")}568048056</li>
                            <li>{intl.get("common.modal.tip6")}<a target="_blank" href="http://www.abiz.com/caigourj/">http://www.abiz.com/caigourj/</a></li>
                            <li>手机热线：18402578025</li>
                        </ul>
                        <p>版权信息：copyright©2013-2022 百卓网络科技有限公司 版权所有</p>
                    </div>
                </Modal>

                {/*确定退出*/}
                <Modal
                    title={intl.get("common.modal.title1")}
                    visible={this.state.logoutVisible}
                    onCancel={()=>this.handleClose('logoutVisible')}
                    okText={intl.get("common.modal.okText")}
                    cancelText={intl.get("common.modal.cancelText")}
                    onOk={this.handleLogout}
                >
                    <p>{intl.get("common.modal.content")}</p>
                </Modal>
                <UserFeedback
                    visible={this.state.feedbackVisible}
                    onCancel={()=>this.handleClose('feedbackVisible')}
                />
            </React.Fragment>
        )
    }
}


const mapStateToProps = state => ({
    noticeCount: state.getIn(['header', 'noticeCount'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchNoticeCount,
        asyncFetchApproveInfo,
        asyncFetchDataProgressList,
        asyncFetchVipService: vipActions.asyncFetchVipService
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ToolBar));
