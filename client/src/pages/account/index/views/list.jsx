import React, {Component} from 'react';
import {Modal, Table, Button, Switch, message, Radio, Alert} from "antd";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import Icon from 'components/widgets/icon';
import intl from 'react-intl-universal';
import classNames from "classnames/bind";
import styles from "../styles/index.scss";

const cx = classNames.bind(styles);

import {asyncFetchSubAccountList, asyncFetchUserStatus} from '../actions'
import {actions as addActions} from 'pages/account/add';
import Account from 'pages/account/add';
import Auth, {actions as authActions} from 'pages/account/auth';
import * as constants from 'utils/constants'
import ListModalTable from 'components/business/listModalTable'

const {Column} = Table;



class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addModalVisible: false,
            editModalVisible: false,
            authModalVisible: false,
            userId: 0,  //子账号用户id，从列表中获取传到修改子账号信息的弹出中
            loginName: '', //子账号用户名，从列表中获取传到修改子账号信息的弹出中
            editActiveKey: 'edit', //修改账号激活的tab的ket，默认是修改信息tab,
            curForm: '',

        }
    }

    //打开新增/修改子账号弹层
    openModal = (visibleType, userId, loginName) => {
        this.setState({
            [visibleType]: true
        });
        if (userId) {
            this.setState({
                userId
            })
        }
        if (loginName) {
            this.setState({
                loginName
            })
        }
    };

    //关闭新增/修改子账号弹层
    closeModal = (visibleType) => {
        this.setState({
            [visibleType]: false
        })
    };

    //新增子账号提交操作
    handleCreate = (type) => {
        const form = this.state.curForm ? this.state.curForm : this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            console.log('Received values of form: ', values);

            let msgStr;

            if (type === 'add') {
                msgStr = intl.get("account.index.add");
                //发送提交数据请求
                this.props.asyncAddSubAccount(values).then((res) => {
                    if (res.data.retCode === '0') {
                        //重新获取列表数据，不加延时会加载不到新建的数据
                        setTimeout(()=>{
                            this.props.asyncFetchSubAccountList();
                        }, 500);

                        message.success(msgStr);
                        form.resetFields();
                        this.setState({addModalVisible: false});
                    }else if(res.data.retCode === '2002'){
                        message.error(res.data.retValidationMsg.msg[0].msg)
                    }
                    else {
                        message.error(res.data.retMsg)
                    }
                });
            }
            else if (type === 'edit') {
                if (this.state.editActiveKey === 'edit') {
                    msgStr = intl.get("account.index.editor");
                    //发送提交数据请求
                    console.log(values,'values');
                    this.props.asyncEditSubAccount(values).then((res) => {
                        if (res.data.retCode === '0') {
                            message.success(msgStr);
                            //重新获取列表数据，不加延时会加载不到新建的数据
                            setTimeout(()=>{
                                this.props.asyncFetchSubAccountList();
                            }, 500);
                            form.resetFields();
                            this.setState({editModalVisible: false});
                        }
                        else {
                            alert(res.data.retMsg)
                        }
                    });
                }
                else if (this.state.editActiveKey === 'reset') {
                    msgStr = intl.get("account.index.reset");
                    //发送提交数据请求
                    this.props.asyncResetSubAccountPwd(values).then((res) => {
                        if (res.data.retCode === '0') {
                            message.success(msgStr);
                            form.resetFields();
                            this.setState({editModalVisible: false});
                        }
                        else {
                            alert(res.data.retMsg)
                        }

                    });
                }

            }
            else if (type === 'auth') {
                msgStr = intl.get("account.index.success");
                this.props.asyncSubmitSubAccountAuth(values).then((res) => {
                    if (res.data.retCode === '0') {
                        message.success(msgStr);
                        this.setState({authModalVisible: false});
                    }
                    else {
                        alert(res.data.retMsg)
                    }

                })
            }

        });
    };

    //获取弹层中的form
    saveFormRef = (formRef) => {
        this.formRef = formRef;
    };

    //停用/启用
    handleSwitch = (userId, checked) => {
        let msgStr,
            opeType;
        if (checked) {
            opeType = '1';
            msgStr = intl.get("account.index.open");
        }
        else {
            opeType = '0';
            msgStr = intl.get("account.index.close");
        }
        this.props.asyncFetchUserStatus(userId, opeType).then((res) => {
            if(res.data && res.data.retCode === '0'){
                message.success(msgStr);
            }else{
                alert(res.data && res.data.retMsg)
            }
        });
    };

    //修改子账号信息页面tab切，修改其激活的key
    handleTabSwitch = (key, curForm) => {
        this.setState({
            editActiveKey: key,
            curForm
        })
    };

    componentDidMount() {
        //初始化列表数据
        console.log(this.props.getUrl,'url');
        this.props.asyncFetchSubAccountList(this.props.getUrl);
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
                switch: {
                    userIdEnc: item.get('userIdEnc'),
                    userStatus: item.get('userStatus') === "3",
                    isFetching: item.get('isFetching')
                },
                action: {
                    userIdEnc: item.get('userIdEnc'),
                    loginName: item.get('loginName'),
                    subAccountStatus: item.get('status')
                }
            }
        }).toJS();
        return (
            <div className={cx("mul-account")}>
                {/*{
                    dataSource && dataSource.length >= 20 ? (
                        <Alert message="最多添加20个子账号！详询客服400-6979-890（转1） 或 18402578025（微信同号）" type="warning" showIcon/>
                    ) : null
                }
*/}
                <div className={cx("account-notice") + " cf"}>
                    <span className={cx("an-txt-l")}>
                        {dataSource && dataSource.length > 0 ? intl.get("account.index.tip1") : intl.get("account.index.tip2")}
                    </span>
                    <p className={cx("an-txt-r")}>{intl.get("account.index.tip3")}
                        <a style={{color:'#0066dd'}} href="http://www.abiz.com/info/assistant-sfaq/63517.htm" target="_blank">{intl.get("account.index.detail")}</a>
                        <span className={cx("an-txt-r")} style={{float:'right'}}>
                        <Icon type="message" className={'blue'} theme="filled" /> <a style={{color:'#2A7EDC'}} target="_blank" href="https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true">{intl.get("account.index.online")}</a>
                    </span>
                    </p>

                </div>

                <div className={cx('account-ope')+ " cf"}>
                    {/*disabled={dataSource && dataSource.length >= 20}*/}
                    {
                        this.props.pageType === 'batchChoose' && (
                            <Radio.Group style={{'lineHeight': '30px'}} onChange={this.props.onRadioChange} value={this.props.status}>
                                <Radio value={1}>{intl.get("account.index.tip4")}</Radio>
                                <Radio value={2}>{intl.get("account.index.tip5")}</Radio>
                            </Radio.Group>
                        )
                    }
                    <Button type="primary" className="fr"
                            onClick={this.openModal.bind(this, 'addModalVisible')}>{intl.get("account.index.new")}</Button>
                </div>
                <ListModalTable
                    dataSource={dataSource}
                    rowSelection={this.props.rowSelection?this.props.rowSelection:null}
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
                    {this.props.pageType === 'index' ?
                        <Column
                            title={intl.get("account.index.switch")}
                            dataIndex="switch"
                            key="switch"
                            width={80}
                            render={({userIdEnc, userStatus, isFetching}) => (
                                <Switch
                                    defaultChecked={userStatus}
                                    onChange={this.handleSwitch.bind(this, userIdEnc)}
                                    loading={isFetching}
                                />
                            )}
                        />
                       :null
                    }
                    {this.props.pageType === 'index'?
                        <Column
                        title={intl.get("account.index.action")}
                        dataIndex="action"
                        key="action"
                        width={200}
                        render={({userIdEnc, loginName, subAccountStatus}) => (
                        <span>
                        <a href="#!" className="mr5"
                        onClick={this.openModal.bind(this, 'editModalVisible', userIdEnc)}>{intl.get("account.index.editor1")}</a>
                        {subAccountStatus === 1 || subAccountStatus === 2 ?
                            <a href="#!" className="mr5"
                               onClick={this.openModal.bind(this, 'authModalVisible', userIdEnc, loginName)}>{intl.get("account.index.set")}</a>
                            : <a target="_blank" href="https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true" className="mr5">{intl.get("account.index.pay")}</a>
                        }
                        </span>
                        )}
                        />
                    :null}
                </ListModalTable>
                {/*新建子账号弹层*/}
                <Modal
                    title={intl.get("account.index.new")}
                    visible={this.state.addModalVisible}
                    onCancel={this.closeModal.bind(this, 'addModalVisible')}
                    width={800}
                    onOk={this.handleCreate.bind(this, 'add')}
                    confirmLoading={this.props.addSubAccount.get('isFetching')}
                    destroyOnClose={true}
                >
                    <Account.AccountAdd
                        wrappedComponentRef={this.saveFormRef}
                    />
                </Modal>

                {
                    this.props.pageType === 'index'?(
                        <div>
                            {/*修改子账号弹层*/}
                            <Modal
                                title={intl.get("account.index.editor2")}
                                visible={this.state.editModalVisible}
                                onCancel={this.closeModal.bind(this, 'editModalVisible')}
                                width={800}
                                onOk={this.handleCreate.bind(this, 'edit')}
                                confirmLoading={this.state.editActiveKey === 'edit' ?
                                    this.props.addSubAccount.get('isFetching') :
                                    this.props.resetSubAccountPwd.get('isFetching')
                                }
                                destroyOnClose={true}
                            >
                                <Account.AccountEdit
                                    wrappedComponentRef={this.saveFormRef}
                                    userId={this.state.userId}
                                    handleTabSwitch={this.handleTabSwitch}
                                />
                            </Modal>

                            {/*权限设置*/}
                            <Modal
                                title={intl.get("account.index.set1")}
                                visible={this.state.authModalVisible}
                                onCancel={this.closeModal.bind(this, 'authModalVisible')}
                                width={''}
                                onOk={this.handleCreate.bind(this, 'auth')}
                                confirmLoading={this.props.submitSubAccountAuth.get('isFetching')}
                                destroyOnClose={true}
                                className="list-pop"
                            >
                                <Auth
                                    wrappedComponentRef={this.saveFormRef}
                                    userId={this.state.userId}
                                    loginName={this.state.loginName}
                                />
                            </Modal>
                        </div>
                    ):null
                }
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

export default connect(mapStateToProps, mapDispatchToProps)(Index)
