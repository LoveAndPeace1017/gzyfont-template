import React, {Component} from 'react';
import {Button, message, Modal, Table, Switch} from 'antd';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import Tip from 'components/widgets/tip';
import Icon from 'components/widgets/icon';
import classNames from "classnames/bind";
import {actions as vipServiceHomeActions} from "pages/vipService/index";  // ***
import {actions as asyncOpenVipAction} from "components/business/vipOpe";
import {MAIN_MAP} from "components/business/vipOpe";
import {MallOpen, AddPkgOpen} from 'components/business/vipOpe';
import styles from "../../styles/index.scss";
const cx = classNames.bind(styles);
import {asyncFetchApproveList, asyncCheckApprove, asyncToggleEnable,asyncWithdraw,asyncWithdrawDetail} from "../actions";
import {actions as pendingApprovalPanelActions} from "pages/home";
import intl from 'react-intl-universal';
import {
    ExclamationCircleOutlined
} from '@ant-design/icons';
import WithDraw from './withdraw';
const {Column} = Table;

class Approve extends Component{

    toggleEnable = ({key, item, type}, callback) =>{
        this.props.asyncToggleEnable({key, item, type}, (data)=>{
            if(data.get('retCode') === '0'){
                callback && callback(true);
                this.props.asyncFetchApproveList(true);
                this.props.asyncFetchPendingApproval(true);
            }else{
                callback && callback(false);
            }
        });
    };

    state = {
        accountVisible: false,
        moduleType: ''
    };

    static defaultProps = {
        source: "multiApprove"
    }
    //查看审批vip功能是否开启
    getVipInfo = (callback, source='multiApprove') => {
        this.props.asyncFetchVipService((data) => { // 当父组件没有提供vipInfo时自己请求获取
            if(data.retCode === "0"){
                let backendKey = MAIN_MAP[source].backendKey;
                let vipInfo  = data.data[backendKey];
                callback && callback(vipInfo.vipState);
            } else {
                message.error(data.retMsg);
            }
        })
    };

    /**
     *   弹框类型
     */
    _popModal = ({title, content, icon, theme, modalType, okCallback, cancelCallback},key, item,vState) => {
        const _this = this;
        modalType = (vState == 'EXPIRED'?'error':'confirm');
        Modal[modalType]({
            icon,
            title: title,
            content: content,
            onOk() {
                okCallback && okCallback.call(null, _this);
                if(vState == 'NOT_OPEN'){
                    _this.props.asyncCheckApprove(key, item, (data)=>{
                        if(data.get('retCode') === '0'){
                            _this.toggleEnable({key, item})
                        }else if(data.get('retCode') === '2001'){
                            Modal.error({
                                title: data.get('retMsg'),
                                icon: <ExclamationCircleOutlined/>
                            })
                        }
                    });
                }
            },
            onCancel() {
                cancelCallback && cancelCallback.call(null, _this);
            }
        })
    };

    checkApprove = (key, item)=>{
        const _this = this;
        //点击先判断是否开启vip权限并且是开启操作
        let openFlag = !!item.recId;
        this.getVipInfo((vState) => {
           if(vState == 'OPENED' || vState == 'TRY' || openFlag){
               this.props.asyncCheckApprove(key, item, (data)=>{
                   if(data.get('retCode') === '0'){
                       this.toggleEnable({key, item})
                   }else if(data.get('retCode') === '2001'){
                       Modal.error({
                           title: data.get('retMsg'),
                           icon: <ExclamationCircleOutlined/>
                       })
                   }
               });
           }else{
               let {title, content,icon,okCallback} = MAIN_MAP["multiApprove"][vState];
               this._popModal({title, content,icon,okCallback},key, item,vState);
           }
        });

    };

    closeModal = type => {
        this.setState({
            [type]: false
        })
    };

    componentDidMount() {
        this.props.asyncFetchApproveList();
    }

    render() {
        const {approveList} = this.props;
        const approveListData = approveList.getIn(['data','data']);
        const dataSource = approveListData && approveListData.map((item, index) => {
            return {
                item: item.toJS(),
                key: item.get('configValue'),
                billName: intl.get(item.get('billName')),
                isEnableFetching: item.get('isEnableFetching'),
                isCheckFetching: item.get('isCheckFetching'),
                action: !!item.get('recId')
            }
        }).toJS();
        return (
            <React.Fragment>
                {/*<Tip>{intl.get("auxiliary.approve.tip1")}</Tip>*/}
                <div className={cx("aux-list")}>
                    <Table
                        dataSource={dataSource}
                        pagination={false}
                        loading={approveList.get('isFetching')}
                        className={cx("tb-aux")}
                        scroll={{y: 518}}
                    >
                        <Column
                            title={intl.get("auxiliary.approve.billName")}
                            dataIndex="billName"
                            width="85%"
                        />
                        <Column
                            title={intl.get("auxiliary.approve.action")}
                            dataIndex="action"
                            width="15%"
                            align="center"
                            render={(text, record) => (
                                <React.Fragment>
                                    <span onClick={()=>{this.setState({accountVisible: true,moduleType:record.key})}} className={cx("ch-sq")}>撤回权限</span>
                                    <Switch loading={record.isEnableFetching} onChange={()=>this.checkApprove(record.key, record.item)} checked={text} />
                                </React.Fragment>
                            )}
                        />
                    </Table>
                </div>
                <Modal
                    title={"撤回权限分配"}
                    visible={this.state.accountVisible}
                    onCancel={()=>this.closeModal('accountVisible')}
                    width={1200}
                    destroyOnClose={true}
                    footer={null}
                >
                    <WithDraw
                        close={this.closeModal}
                        moduleType={this.state.moduleType}
                        asyncWithdraw = {this.props.asyncWithdraw}
                        asyncWithdrawDetail = {this.props.asyncWithdrawDetail}
                    />
                </Modal>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        approveList: state.getIn(['auxiliaryApprove', 'approveList'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchApproveList,
        asyncCheckApprove,
        asyncToggleEnable,
        asyncWithdraw,
        asyncWithdrawDetail,
        asyncFetchPendingApproval: pendingApprovalPanelActions.asyncFetchPendingApproval,
        asyncFetchVipService: vipServiceHomeActions.asyncFetchVipService,
        asyncOpenVipAndSendRequestToOss: asyncOpenVipAction.asyncOpenVipAndSendRequestToOss
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Approve)

