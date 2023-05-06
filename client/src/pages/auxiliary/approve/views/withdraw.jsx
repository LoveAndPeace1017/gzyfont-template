import React, {Component} from 'react';
import {Modal, Table, Button, Switch, message, Radio, Alert} from "antd";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import Icon from 'components/widgets/icon';
import intl from 'react-intl-universal';
import classNames from "classnames/bind";
import styles from "../styles/index.scss";
const cx = classNames.bind(styles);
import {asyncFetchSubAccountList, asyncFetchUserStatus} from '../../../account/index/actions'
import {actions as addActions} from 'pages/account/add';
import Account from 'pages/account/add';
import Auth, {actions as authActions} from 'pages/account/auth';
import * as constants from 'utils/constants'
import ListModalTable from 'components/business/listModalTable'
const {Column} = Table;

class Withdraw extends Component {
    constructor(props) {
        super(props);
        this.state = {
            withdrawAuth: "1",
            selectedRowKeys: [],
            selectedRows: []
        }
    }

    componentDidMount() {
        //初始化列表数据
        this.fetchData();
    }

    fetchData = async () =>{
        await this.getListData();
        this.getDetailData();
    }

    getListData = () =>{
        return new Promise((resolve, reject)=>{
            this.props.asyncFetchSubAccountList('',(data)=>{
                console.log(data,'ds');
                if(data.retCode === '0'){
                    resolve()
                }
            });
        })
    }

    getDetailData = ()=>{
        let {moduleType} = this.props;
        this.props.asyncWithdrawDetail({moduleType},(data)=>{
            if(data.retCode === "0"){
                this.setState({
                    withdrawAuth: data.data.preCreate || "1",
                    selectedRowKeys: data.data.ids || [],
                });
            }
        });
    }

    //单选按钮触发
    withdrawChange = (e)=>{
        this.setState({
            withdrawAuth: e.target.value
        })
    }

    onSelectChange = (selectedRowKeys,selectedRows) => {
        this.setState({
            selectedRowKeys,
            selectedRows
        });
    };
    //提交数据
    onOk = ()=>{
        let {withdrawAuth,selectedRowKeys} = this.state;
        let {moduleType} = this.props;
        /*if(selectedRowKeys.length === 0){
            message.error('请勾选子账号进行权限分配');
        }else{*/
            this.props.asyncWithdraw({withdrawAuth,moduleType,vo1:selectedRowKeys},(data)=>{
                if(data.retCode === "0"){
                    message.success('操作成功！');
                    this.props.close('accountVisible');
                }else{
                    message.error('操作失败！');
                }
            });
       /* }*/
    }

    render() {
        const {subAccountList} = this.props;
        const subAccountListData = this.props.pageType === 'choose'?subAccountList.getIn(['data', 'data', 'subAccountDetails']):subAccountList.getIn(['data', 'data']);
        const dataSource = subAccountListData && subAccountListData.map((item, index) => {
            let status;
            const subAccountStatus = item.get('status');
            if (subAccountStatus === 0) {
                status = intl.get("account.index.option1");
            }
            else if (subAccountStatus === 1) {
                status = intl.get("account.index.option2");
            }
            else if (subAccountStatus === 2) {
                status = intl.get("account.index.option3");
            }
            else if (subAccountStatus === 3) {
                status = intl.get("account.index.option4");
            }
            return {
                key: item.get('userIdEnc'),
                serial: index + 1,
                subAccount: item.get('loginName'),
                name: item.get('userName'),
                status,
                serviceBeginDate: item.get('startTime'),
                serviceEndDate: item.get('endTime'),
                department: item.get('department'),
            }
        }).toJS();

        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };

        return (
            <div className={cx("mul-account")}>
                <div className={cx("title-op")}>
                    <span>发起人有权撤回：</span>
                    <Radio.Group onChange={this.withdrawChange} value={this.state.withdrawAuth}>
                        <Radio value={"1"}>是</Radio>
                        <Radio value={"0"}>否</Radio>
                    </Radio.Group>
                </div>
                <ListModalTable
                    dataSource={dataSource}
                    rowSelection={rowSelection}
                    pagination={false}
                    loading={subAccountList.get('isFetching')}
                    className={cx("tb-account")}
                    footerOpe={this.props.pageType !== 'index'}
                >
                    <Column
                        title={intl.get("account.index.serial")}
                        dataIndex="serial"
                        key="serial"
                        width={constants.TABLE_COL_WIDTH.SERIAL}
                    />
                    <Column
                        title={intl.get("account.index.subAccount")}
                        dataIndex="subAccount"
                        key="subAccount"
                    />
                    <Column
                        title={intl.get("account.index.name")}
                        dataIndex="name"
                        key="name"
                    />
                    <Column
                        title={intl.get("account.index.department")}
                        dataIndex="department"
                        key="department"
                    />
                    <Column
                        title={intl.get("account.index.status")}
                        dataIndex="status"
                        key="status"
                        width={100}
                    />
                    <Column
                        title={intl.get("account.index.serviceBeginDate")}
                        dataIndex="serviceBeginDate"
                        key="serviceBeginDate"
                        width={constants.TABLE_COL_WIDTH.DATE}
                    />
                    <Column
                        title={intl.get("account.index.serviceEndDate")}
                        dataIndex="serviceEndDate"
                        key="serviceEndDate"
                        width={constants.TABLE_COL_WIDTH.DATE}
                    />

                </ListModalTable>

                <div className={cx("footer")}>
                    <Button style={{marginRight: "6px"}} onClick={()=>this.props.close('accountVisible')}>取消</Button>
                    <Button type={"primary"} onClick={this.onOk}>确定</Button>
                </div>

            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    subAccountList: state.getIn(['accountIndex', 'subAccountList']),
    addSubAccount: state.getIn(['accountAdd', 'addSubAccount']),
    resetSubAccountPwd: state.getIn(['accountAdd', 'resetSubAccountPwd']),
    submitSubAccountAuth: state.getIn(['accountAuth', 'submitSubAccountAuth'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchSubAccountList,
        asyncFetchUserStatus,
        asyncAddSubAccount: addActions.asyncAddSubAccount,
        asyncEditSubAccount: addActions.asyncEditSubAccount,
        asyncResetSubAccountPwd: addActions.asyncResetSubAccountPwd,
        asyncSubmitSubAccountAuth: authActions.asyncSubmitSubAccountAuth
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Withdraw)
