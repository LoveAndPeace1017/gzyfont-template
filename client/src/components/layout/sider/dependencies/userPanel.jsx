import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Menu, Dropdown, Modal, Tabs, message, Popover, Row, Col, Input} from 'antd';
import axios from 'utils/axios';
import Icon from 'components/widgets/icon';
import QrCode from 'components/widgets/qrcode';
import CompleteComInfo from 'components/business/completeComInfo';
import {actions as commonActions} from 'components/business/commonRequest/index';
import {actions as accountActions} from 'pages/account/index';
import {actions as menuActions} from 'pages/auxiliary/menu';
import {
    QrcodeOutlined,
    DownOutlined,
    RightOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import AccountIndex from 'pages/account/index'
import WarehouseIndex from 'pages/warehouse/index'
import FittingIndex from 'pages/fitting/index'
import  styles from '../styles/userPanel.scss';
import classNames from "classnames/bind";
import {getCookie,setCookie} from 'utils/cookie';
import Tooltip from 'components/widgets/tooltip';
import intl from 'react-intl-universal';
import avatar from '../images/avatar.png';
import {bindActionCreators} from "redux";
import {Link} from "react-router-dom";
import Account from 'pages/account/add';


const TabPane = Tabs.TabPane;
const cx = classNames.bind(styles);
class UserPanel extends Component{
    constructor(props){
        super(props);
        const userIdEnc = getCookie('uid');
        const comName = getCookie('comName');
        let url = `https://erp.abiz.com/info/inviteSpecial?userIdEnc=${userIdEnc}&comName=${comName}&type=`;
        const inviteCustomerUrl = url + '1';
        const inviteSupplierUrl = url + '0';

        this.state = {
            mulAccountVisible: false,
            subAccountVisible: false,
            warehouseVisible: false,
            fittingVisible:false,
            accountVisible: false,
            inviteRegisterQrCodeVisible:false,
            logonAppQrCodeVisible:false,
            inviteCustomerUrl,
            inviteSupplierUrl,
            appLoginUrl:'',
            appLoginMsg:"",
            qrcodeExpireFlag:false,
            comName:'',
            fromMain:false,
            companyVisible:false
        }
    }
    componentDidMount() {
        this.props.asyncGetComInfo(data=>{

            let companyVisible = (data.mainUserFlag && (data.comName=='N/A'||data.comName==''))?true:false;
            this.setState({
                comName:data.comName,
                companyVisible:companyVisible,
                fromMain:data.fromMain,
                mainUserIdEnc:data.mainUserIdEnc,
                mainUserName: data.mainUserName,
                subUserIdEnc:data.subUserIdEnc,
                subUserName: data.subUserName,
                vipValid: data.vipValid,
                mainUserFlag: data.mainUserFlag, //是否是主账号
                userTabFlag: false  //帐号切换防双击
            });

            if(data.mainUserFlag){
                this.props.asyncFetchSwitchAccountList();
            }
        });
        this.props.asyncInintInfor();
        //获取菜单配置内容
        this.props.asyncFetchMenuList();
        this.refreshLoginQrcode();
    }

    cancelComInfo = ()=>{
        this.setState({
            companyVisible:false,
        })
    };


    refreshLoginQrcode=()=>{
        this.props.asyncGetAppLoginQrCode(data=>{
            if(data.retCode=='0'){
                this.setState({
                    appLoginUrl:data.qrCode,
                    appLoginMsg:'',
                    qrcodeExpireFlag:false
                });
            }else{
                this.setState({
                    appLoginUrl:"",
                    appLoginMsg:data.retMsg,
                    qrcodeExpireFlag:true
                });
            }
        });
    };
    openLoginModal = (visible)=>{
        if(visible){
            let _this = this;
            window.loginLoop = setTimeout(function(){
                axios.post('/login/app_qrcode', {
                    qr_code:_this.state.appLoginUrl
                }).then(res => {
                    if(res.data&&res.data.retCode=='0'){
                        // clearInterval( window.loginLoop);
                        _this.closeModal('logonAppQrCodeVisible');
                        message.success(intl.get("home.account.tip1"));
                    }
                }).catch(error => {
                    alert(error);
                })
            },3000);
        }else{
            clearInterval( window.loginLoop);
        }
    };
    /*closeLoginModal = ()=>{
        this.closeModal('logonAppQrCodeVisible');
        clearInterval( window.loginLoop);
    };*/


    openModal = (visibleKey)=>{
        this.setState({
            [visibleKey]:true
        })
    };
    closeModal = (visibleKey)=>{
        this.setState({
            [visibleKey]:false
        })
    };

    switchAccount = (id,status)=>{
        console.log('switch:',id,status);
        if(!this.state.userTabFlag){
            this.setState({userTabFlag: true});
            this.props.asyncSwitchAccount(id,data=>{
                if(data.retCode==0){
                    this.setState({userTabFlag: false});
                    location.reload();
                }
            });
        }
    };

    getVipEndTime = ()=>{
        if(getCookie('getCookieExpiredTipFormatDate') && getCookie('getCookieExpiredTipFormatDate')!=''){
            return (<p>{intl.get("home.account.tip2")}{getCookie('getCookieExpiredTipFormatDate')||'暂无数据'}{intl.get("home.account.tip3")}</p>)
        }else{
            return null;
        }
    }

    getCurForm = ({mainForm}) => {
        this.mainForm = mainForm;
    };

    handleNewCreat = () =>{
        let form = this.mainForm;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            console.log('Received values of form: ', values);
            //发送提交数据请求
            this.props.asyncFetchMainToSub(values).then((res) => {
               if(res.retCode == '0'){
                   this.closeModal('accountVisible');
                   message.success(intl.get("common.confirm.success"));
               }else{
                   message.error(intl.get("common.confirm.error"));
               }
            });

        });
    }

    render(){
        const {switchAccountList, currentAccountInfo} = this.props;
        const accountInfo = currentAccountInfo.get('data');
        let subAccountListData = switchAccountList.getIn(['data', 'data']);
        subAccountListData = subAccountListData?subAccountListData.toJS():[];

        let subAccountListStr = this.state.fromMain
            ?(
                <div className={cx("switch-account-menu")}>
                    <a className={cx("switch-account-logout")} onClick={() => this.switchAccount(this.state.mainUserIdEnc)}>
                        {intl.get("home.account.switch")}
                    </a>
                    <div className={"clear"}></div>
                </div>
        )
        :(
            subAccountListData.map((account,index) =>
                (account.userStatus!=3 || (account.subAccountStatus!="OPENED" && account.subAccountStatus!="TRY"))?
                <Tooltip key={index} title={intl.get("home.account.lay")} placement="topLeft">
                <li key={index} ga-data="global-switch-account">
                    <a className={cx("switch-account-menu")}  disabled={true}
                       onClick={() => this.switchAccount(account.userIdEnc,account.userStatus)}>
                        <span title={account.loginName} className={cx("switch-account-logusername")}>{account.loginName}</span>
                        <span title={account.userName} className={cx("switch-account-username")}>{account.userName}</span>
                    </a>
                </li>
                </Tooltip>:
                <li key={index} ga-data="global-switch-account">
                    <a className={cx("switch-account-menu")}
                       onClick={() => this.switchAccount(account.userIdEnc,account.userStatus)}>
                        <span title={account.loginName} className={cx("switch-account-logusername")}>{account.loginName}</span>
                        <span title={account.userName} className={cx("switch-account-username")}>{account.userName}</span>
                    </a>
                </li>
            )
        );
        return (
            <div className={cx("user-panel")}>
                <div className={cx("user-info")}>
                    <Popover content={
                        <QrCode value={this.state.appLoginUrl} desc={intl.get("home.account.tip4")}
                                expire={this.state.qrcodeExpireFlag}
                                errMsg={this.state.appLoginMsg}
                                onRefresh={this.refreshLoginQrcode}/>
                    }
                             placement={'rightTop'}
                     onVisibleChange={this.openLoginModal}
                    >
                        <div className={cx("invite-qrcode")}>
                            <div className={cx("hidden-div")}></div>
                            <QrcodeOutlined/>
                        </div>
                    </Popover>

                    <div className={cx("com-name")} title={(!accountInfo || accountInfo.get('comName') =='N/A'||accountInfo.get('comName')=='')?intl.get("home.account.tip5"):accountInfo.get('comName')}>
                        {
                            (!accountInfo || accountInfo.get('comName') =='N/A'||accountInfo.get('comName')=='')?
                                <React.Fragment>
                                    <InfoCircleOutlined theme={'filled'} style={{color:'#f9b03e','fontSize':'15px'}}/>
                                    <a onClick={()=>this.openModal('companyVisible')} style={{color:'#f9b03e'}}>{intl.get("home.account.tip5")}</a>
                                </React.Fragment>
                                :
                                <React.Fragment>
                                    {this.state.mainUserFlag?(<span style={{cursor: "pointer"}} onClick={()=>this.openModal('accountVisible')}>{accountInfo.get('comName')}</span>):(<span>{accountInfo.get('comName')}</span>)}
                                    {/*<Icon type="icon-vip" className={cx({"light": accountInfo && accountInfo.get('vipValid')})}/>*/}
                                </React.Fragment>
                        }
                    </div>
                    {
                        this.state.fromMain||(this.state.mainUserIdEnc!=this.state.subUserIdEnc)?<div className={cx("primary-account")} title={this.state.subUserName}>
                        <label>{intl.get("home.account.account")}：{this.state.subUserName}</label>
                            <div className={cx("switch-account")}>
                                <Dropdown overlay={
                                    <div className={cx("dropdown")}>
                                        <ul className={cx("dropdown-lst")}>
                                            {subAccountListStr}
                                        </ul>
                                    </div>
                                }>
                                    <div>
                                        <div className={cx("icon-account-switch")}>
                                            <DownOutlined />
                                        </div>
                                    </div>
                                </Dropdown>
                            </div>
                        </div>:<div className={cx("primary-account")} title={this.state.mainUserName}>
                            <div>
                                <label>{intl.get("home.account.account1")}：{this.state.mainUserName}</label>
                            </div>
                            <div className={cx("switch-account")}>
                                <Dropdown overlay={
                                    <div className={cx("dropdown")}>
                                        <ul className={cx("dropdown-lst")}>
                                            {subAccountListStr}
                                        </ul>
                                    </div>
                                } placement="bottomRight">
                                    <div>
                                        <div className={cx("icon-account-switch")}>
                                            <DownOutlined />
                                        </div>
                                    </div>
                                </Dropdown>
                            </div>
                        </div>
                    }
                    <div className={cx('vip-time')}>
                        {this.getVipEndTime()}
                    </div>
                </div>
                <div className={cx("account-ope-narrow")}>
                    VIP
                </div>
                <div className={cx("account-ope")}>
                    <Link to={"/vip/service"}>
                        <span className={cx("govip")} ></span>
                    </Link>
                    <h3 className={cx("title")}>
                        <Icon type={"icon-app-menu"} style={{margin: "0 10px"}}/>
                        {intl.get("home.account.service1")}
                        <RightOutlined  style={{marginLeft: "54px"}}/>
                    </h3>
                    <div className={cx("sub")} style={{display: "none"}}>
                        {accountInfo && accountInfo.get('mainUserFlag')?(
                            <a title={intl.get("home.account.service2")} onClick={()=>this.openModal('mulAccountVisible')}>{intl.get("home.account.service2")}</a>
                        ): <a title={intl.get("home.account.service2")} onClick={()=>this.openModal('subAccountVisible')}>{intl.get("home.account.service2")}</a>}
                        <Link to={"/vip/service?type=3"}>
                            <span title={intl.get("home.account.service3")}>{intl.get("home.account.service3")}</span>
                        </Link>
                    </div>

                    <Modal
                        title={intl.get("home.account.content1")}
                        width={''}
                        className={cx("modal-mul-account") + " list-pop list-pop-no-footer"}
                        visible={this.state.mulAccountVisible}
                        onCancel={()=>this.closeModal('mulAccountVisible')}
                        destroyOnClose={true}
                        footer={null}
                    >
                        <AccountIndex/>
                    </Modal>

                    <Modal
                        title={intl.get("common.modal.title")}
                        width={500}
                        visible={this.state.subAccountVisible}
                        onOk={()=>this.closeModal('subAccountVisible')}
                        onCancel={()=>this.closeModal('subAccountVisible')}
                        destroyOnClose={true}
                    >
                        <div>{intl.get("home.account.content2")}</div>
                    </Modal>

                    <WarehouseIndex
                        visible={this.state.warehouseVisible}
                        onClose={()=>this.closeModal('warehouseVisible')}
                    />
                    <Modal
                        title={intl.get("home.account.title")}
                        width={''}
                        className={cx("modal-mul-account")+ " list-pop list-pop-no-footer"}
                        visible={this.state.fittingVisible}
                        footer = {null}
                        onCancel={()=>this.closeModal('fittingVisible')}
                        destroyOnClose={true}
                    >
                        <FittingIndex/>
                    </Modal>

                    {/*主账号绑定部门员工弹框*/}
                    <Modal
                        title={intl.get("home.account.title2")}
                        width={800}
                        visible={this.state.accountVisible}
                        onOk={this.handleNewCreat.bind(this)}
                        onCancel={()=>this.closeModal('accountVisible')}
                        destroyOnClose={true}
                    >
                        <Account.AccountMainForm
                            getCurForm={this.getCurForm}
                            mainUserName = {this.state.mainUserName}
                        />
                    </Modal>

                    <CompleteComInfo
                        visible={this.state.companyVisible}
                        onCancel={this.cancelComInfo}
                        okCallback={this.cancelComInfo}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    collapsed: state.getIn(['sider', 'collapsed']),
    switchAccountList: state.getIn(['accountIndex', 'switchAccountList']),
    currentAccountInfo: state.getIn(['commonInfo', 'currentAccountInfo'])
});
const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncGetComInfo: commonActions.asyncGetComInfo,
        asyncInintInfor: commonActions.asyncInintInfor,
        asyncGetAppLoginQrCode: commonActions.asyncGetAppLoginQrCode,
        asyncSwitchAccount: commonActions.asyncSwitchAccount,
        asyncFetchSwitchAccountList:accountActions.asyncFetchSwitchAccountList,
        asyncFetchImproveCompanyInfor:accountActions.asyncFetchImproveCompanyInfor,
        asyncFetchMainToSub:accountActions.asyncFetchMainToSub,
        asyncFetchMenuList: menuActions.asyncFetchMenuList
    }, dispatch)
};

export default connect(mapStateToProps,mapDispatchToProps)(UserPanel)