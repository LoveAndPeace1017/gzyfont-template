import React, {Component} from 'react';
import {
    Dropdown, Layout, Table, Menu, message, Modal, Tooltip
} from 'antd';
import Icon from 'components/widgets/icon';
const {Content} = Layout;
const confirm = Modal.confirm;
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import styles from '../styles/index.scss';
import classNames from "classnames/bind";

import {actions as customerActions} from '../index';
import {actions as contactRecordActions} from 'pages/contactRecord/index'
import {actions as commonActions} from 'components/business/commonRequest/index';
import {reducer as customerIndex} from "../index";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import intl from 'react-intl-universal';
import {Link} from 'react-router-dom';

import FilterToolBar from 'components/business/filterToolBar/index';
import ListOpeBar from 'components/business/listOpeBar';
import CheckResult from 'components/business/checkResult';
import Crumb from 'components/business/crumb';
import BindCustomer from 'components/business/bindCustomer';
import TableFieldConfigMenu from 'components/business/tableFieldConfigMenu';
import ContactRecord from 'pages/contactRecord/index';
import {Choose} from 'pages/account/index';
import {ModifyMenu, DeleteMenu, DispatchMenu, ToggleVisibleMenu} from "components/business/authMenu";
import InviteModal from 'components/widgets/invite';
import Pagination from 'components/widgets/pagination';
import ListTable from 'components/business/listTable';
import ContactRecordAdd from 'pages/contactRecord/add';
import FooterFixedBar from  'components/layout/footerFixedBar'
import ListPage from  'components/layout/listPage'
import {parse} from "url";

const cx = classNames.bind(styles);
let initParams = {
    condition: {},
    selectedRowKeys: [],
    filterToolBarVisible: false,
    checkResultVisible: false
};
const DEFAULT_TITLE = 'customer';

export class Index extends ListPage {
    constructor(props) {
        super(props);
        let params = this.doInitParams(props.initListCondition, initParams, DEFAULT_TITLE);
        this.state = {
            ...params,
            listToolBarVisible: true,
            contactRecordVisible: false,
            assignSubAccountVisible: false, // 选择单个客户分配子账号
            batchAssignSubAccountVisible: false, // 批量选择客户分配子账号
            curCustomerNo: '',
            curCustomerId: 0,
            addFriendVisible: false,
        };
    }



    fetchListData = (params,callback)=>{
        this.props.asyncFetchCustomerList(params, callback);
    };

    componentDidMount() {
        let condition = {
            disableFlag: "0", //展示状态 默认为显示
            ...this.state.condition
        };
        this.setState({condition});
        //初始化列表数据
        this.fetchListData(condition,res=>{
            let filterConfigList = res && res.filterConfigList;
            filterConfigList = this.initFetchListCallback(filterConfigList, condition);
            this.props.dealFilterConfigList(filterConfigList);
        });
    }

    componentWillUnmount() {
        let params = {};
        for(let key in initParams){
            params[key] = this.state[key];
        }
        this.props.asyncFetchInitListCondition({TITLE: DEFAULT_TITLE, ...params});
        //离开页面初始化数据
        this.props.asyncFetchCustomerList();
    }


    onSelectChange = (selectedRowKeys,selectedRows) => {
        this.setState({
            selectedRowKeys,
            selectedRows,
            checkResultVisible: selectedRowKeys.length > 0,
            inviteType:selectedRowKeys.length > 1?'mult':'',
        });
    };

    viewContactRecord = (customerNo) => {
        this.setState({
            customerNo,
            contactRecordVisible: true
        });
    };

    assignSubAccount = (customerId) => {
        this.openModal('assignSubAccountVisible');
        this.setState({
            curCustomerId: customerId
        })
    };

    //批量分配给子账号
    batchAssignToSubAccount = () => {
        this.openModal('batchAssignSubAccountVisible');
    };

    // 批量更新字段配置
    batchUpdateConfig = (callback) => {
        const {customerList} = this.props;
        let filterConfigList = customerList.getIn(['data', 'filterConfigList']);
        filterConfigList = filterConfigList ? filterConfigList.toJS() : [];
        let tableConfigList = customerList.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];
        let cannotEditFilterColumnsMap = {
            'twoWayBindFlag':1
        };
        let moduleType = {
            search:'customer_search_list',
            table:'customer_list'
        };
        this.batchUpdateConfigSuper(filterConfigList,tableConfigList,cannotEditFilterColumnsMap, moduleType,callback);

    };

    deleteConfirm = (ids, callback) => {
        let _this = this;
        confirm({
            title: intl.get('common.confirm.title'),
            content: intl.get("customer.index.content"),
            onOk() {
                _this.props.asyncDeleteCustomerInfo(ids, function(res) {
                    // retCode为1 代表单个删除且发生业务操作
                    if (res.retCode == 0 || res.retCode == 1) {
                        if (res.inServiceNos && res.inServiceNos.length != 0) {
                            confirm({
                                title: intl.get('common.confirm.title'),
                                content: intl.get("customer.index.content1"),
                                onOk() {
                                    _this.props.asyncToggleCustomerInfo(res.inServiceNos, false, function(res) {
                                        if (res.retCode == 0) {
                                            message.success(intl.get('common.confirm.success'));
                                            _this.props.asyncFetchCustomerList(_this.state.condition, () => _this.checkRemove());
                                        }
                                        else {
                                            alert(res.retMsg);
                                        }
                                    });
                                },
                                onCancel() {
                                    _this.props.asyncFetchCustomerList(_this.state.condition, () => _this.checkRemove());
                                },
                            });
                        } else {
                            message.success(intl.get('common.confirm.success'));
                            _this.props.asyncFetchCustomerList(_this.state.condition, () => _this.checkRemove());
                        }
                        if (callback) {
                            callback();
                        }
                    }
                });
            },
            onCancel() {
            },
        });
    };
    addFriends = (customerNo) => {
        this.setState({
            curCustomerNo: customerNo
        });
        this.props.asyncAddFriend({
            type: 'customer',
            id: customerNo
        }, (data) => {
            if (data.retCode === '0') { //添加成功
                this.addFriendModal(true);
            }
            else if (data.retCode === '1') { //还没有百卓账号
                this.addFriendModal(false);
            }
            else {
                alert(data.retMsg)
            }
        });
    };

    showAddFriendModal = () => {
        this.setState({
            addFriendVisible: true,
        });
    };
    hideAddFriend = () => {
        this.setState({
            addFriendVisible: false,
        });
    };

    addFriendModal = (isAbizAccountFlag) => {
        if (isAbizAccountFlag) {
            this.props.asyncFetchCustomerList(this.state.condition, () => this.checkRemove());
            message.success(intl.get('common.confirm.success'));
        }
        else {
            this.showAddFriendModal();
        }
    };

    toggleCustomer = (ids, disableFlag) => {
        let _this = this;
        this.props.asyncToggleCustomerInfo([ids], disableFlag, function(res) {
            if (res.retCode == 0) {
                message.success(intl.get('common.confirm.success'));
                _this.props.asyncFetchCustomerList(_this.state.condition, () => _this.checkRemove());
            }
            else {
                alert(res.retMsg);
            }
        });
    };
    onSwitchChange = (data) => {
        if (!data.distributionFlag && !data.bindAbizLoginName) {
            this.invite(data.customerNo);
        } else {
            let _this = this;
            let callback = function(){
                _this.props.asyncFetchCustomerList(_this.state.condition.params,()=>{
                    _this.checkRemove();
                    message.success(intl.get('common.confirm.success'));
                });
            };
            if(!data.distributionFlag){
                this.onOpenDistribute([data.customerNo],callback);
            }else{
                this.cancelDistribute([data.customerNo],callback);
            }
        }
    };
    conformDistribute = (params) => {
        let {ids, content, optionFlag,callback} = params;
        let _this = this;
        let prefix = optionFlag?'openDistribute':'cancelDistribute';
        if(callback){
            prefix = 'batch-' + prefix;
        }
        Modal.confirm({
            title: intl.get('common.confirm.title'),
            content: content,
            okText:intl.get('common.confirm.okText'),
            cancelText:intl.get('common.confirm.cancelText'),
            okButtonProps:{
                'ga-data':prefix + '-ok'
            },
            cancelButtonProps:{
                'ga-data':prefix + '-cancel'
            },
            onOk() {
                _this.props.asyncSetDistribute(ids, optionFlag, function(res) {
                    if (res.retCode === '0') {
                        if(callback){
                            callback()
                        }else{
                            message.success(intl.get('common.confirm.success'));
                            _this.checkRemove();
                        }
                    }
                    else {
                        alert(res.retMsg);
                    }
                });
            }
        });
    };
    cancelDistribute = (ids,callback) => {
        this.conformDistribute({
            ids,
            callback,
            content: intl.get("customer.index.content2"),
            optionFlag: 0,
        });
    };
    onOpenDistribute = (ids,callback) => {
        this.conformDistribute({
            ids,
            callback,
            content: intl.get("customer.index.content3"),
            optionFlag: 1
        });
    };

    invite = (customerNo) => {
        this.setState({
            curCustomerNo: customerNo
        });
        this.showAddFriendModal();
    };

    //获取弹层中的form
    saveFormRef = (formRef) => {
        this.formRef = formRef;
    };

    handleCreate = () => {
        const form = this.formRef.props.form;
        let _this = this;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values.fileIds = this.formRef.state.fileList.map(item => item.response.fileId);
                _this.props.asyncInsertContactRecordInfo(values,function(res){
                    if (res.retCode === '0') {
                        message.success(intl.get('common.confirm.success'));
                        _this.closeModal('contactRecordVisible');
                        let condition = {
                            disableFlag: "0", //展示状态 默认为显示
                            ..._this.state.condition
                        };
                        _this.setState({condition});
                        //初始化列表数据
                        _this.fetchListData(condition,res=>{
                            let filterConfigList = res && res.filterConfigList;
                            filterConfigList = _this.initFetchListCallback(filterConfigList, condition);
                            _this.props.dealFilterConfigList(filterConfigList);
                        });

                    }else {
                        Modal.error({
                            title: intl.get('common.confirm.title'),
                            content: res.retMsg
                        });
                    }
                });
        });
    };


    render() {
        const {customerList} = this.props;
        let dataSource = customerList.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];
        let filterConfigList = customerList.getIn(['data', 'filterConfigList']);
        filterConfigList = filterConfigList ? filterConfigList.toJS() : [];
        let tableConfigList = customerList.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];
        let paginationInfo = customerList.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};

        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        let customerIds = dataSource.filter(item=> {
            return selectedRowKeys.indexOf(item.key)!==-1
        }).map(item=> item.id);
        let tempColumns = [];
        tableConfigList.forEach((item) => {
            if (item.visibleFlag) {
                var obj = {
                    title: item.label,
                    dataIndex: item.fieldName,
                    key: item.fieldName,
                    width: item.width
                };
                if (item.fixed) {
                    obj.fixed = item.fixed;
                }
                if (item.fieldName == "customerName") {
                    obj.render = (customerName, data) => (
                        <span className={cx("txt-clip")} title={customerName}>
                             {/*{
                                 data.distributionFlag == 1?(
                                     <Tooltip
                                         title={intl.get("customer.index.allow")}
                                     >
                                         <Icon type="icon-mall" className={cx("mall-on")}/>
                                     </Tooltip>
                                 ):null
                             }*/}
                            <Link to={`/customer/show/${data.customerNo}`}>{customerName}</Link>
                        </span>
                    )
                }
                else if (item.fieldName == "addedTime") {
                    obj.render = (addedTime) => (<span>{moment(addedTime).format('YYYY-MM-DD')}</span>)
                }
                else if (item.fieldName == "salerCount;") {
                    obj.render = (salerCount, data) => (
                        <a onClick={() => this.assignSubAccount(data.customerNo)}>{salerCount}</a>)
                }
                else if (item.fieldName == "contactRecord") {
                    obj.render = (contactRecord, data) => (
                        <Link to={`/customer/show/${data.customerNo}#linkRecord`}>{contactRecord}</Link>
                       )
                }
                else if (item.fieldName == "remarks") {
                    obj.render = (remarks) => (<span className={cx("txt-clip")} title={remarks}>{remarks}</span>)
                }
                else {
                    obj.render = (text) => (<span className={cx("txt-clip")} title={text}>{text}</span>)
                }
                tempColumns.push(obj);
            }
        });
        const operationColumn = {
            render: (operation, data) => <Dropdown overlay={
                <Menu>
                    <ModifyMenu module={"customer"} to={`/customer/modify/${data.customerNo}`}/>
                    <DeleteMenu module={"customer"} clickHandler={() => this.deleteConfirm([data.customerNo])}/>
                    {
                        <Menu.Item><a href="#!" onClick={() => this.viewContactRecord(data.customerNo)}>{intl.get("customer.index.add")}</a></Menu.Item>
                    }
                    {
                        data.customerLoginName ? null : <Menu.Item>
                            <a href="#!" onClick={() => this.addFriends(data.customerNo)}>{intl.get("customer.index.invite")}</a>
                        </Menu.Item>
                    }
                    {/*{
                        data.distributionFlag == 1?(
                            <Menu.Item><a href="#!" onClick={() => this.onSwitchChange(data)}>{intl.get("customer.index.close")}</a></Menu.Item>
                        ):(
                            <Menu.Item><a href="#!" onClick={() => this.onSwitchChange(data)}>{intl.get("customer.index.open")}</a></Menu.Item>
                        )
                    }*/}
                    <DispatchMenu module={"customer"} clickHandler={() => this.assignSubAccount(data.id)}/>
                    <ToggleVisibleMenu module={"customer"}
                                       clickHandler={() => this.toggleCustomer(data.customerNo, data.disableFlag)}
                                       label={data.disableFlag ? intl.get("customer.index.show") : intl.get("customer.index.hidden")}/>
                </Menu>
            }>
                <a href="#!">...</a>
            </Dropdown>,
        };


        const filterDataSource = {
            selectComponents: [],
            datePickerComponents: [],
            customComponents: [],
            groupComponents: []
        }

        filterConfigList.forEach((item)=> {
            item.visibleFlag && filterDataSource[item.type + "Components"].push(item);
        });


        return (
            <Layout>
                <div className="content-hd">
                    <Crumb data={[
                        {
                            url: '/customer/',
                            title: intl.get("customer.index.crumb")
                        },
                        {
                            title: intl.get("customer.index.crumb1")
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <TableFieldConfigMenu filterList={filterConfigList} tableList={tableConfigList}
                                              onTableConfigChange={this.onTableConfigChange}
                                              onFilterConfigChange={this.onFilterConfigChange}
                                              batchUpdateConfig={this.batchUpdateConfig}
                                              refresh={this.refresh}
                                              type={'customer'}
                        />
                        {/*<StatisticMenu linkList={linkList} statistic={this.state.statistic} moduleName={"客户"} />*/}
                    </div>
                </div>

                <div className="content-index-bd">
                    <div className="list-ope-wrap">
                        <ListOpeBar
                            visible={this.state.listToolBarVisible}
                            filterToolBarVisible={this.state.filterToolBarVisible}
                            addUrl="/customer/add"
                            authModule={"customer"}
                            onFilter={this.filterListData}
                            importType="customer"
                            importModule={
                                {
                                    module: "customer",
                                }
                            }
                            exportType="customer"
                            exportDataSource={this.state.selectedRowKeys}
                            onSearch={this.onSearch}
                            searchTipsUrl={`/customers/search/tips`}
                            searchPlaceHolder={intl.get("customer.index.placeholder")}
                            defaultValue={this.state.condition.key}
                            refresh={this.refresh}
                        />
                        <CheckResult
                            module={"customer"}
                            visible={this.state.checkResultVisible}
                            onRemove={this.checkRemove}
                            selectedRowKeys={this.state.selectedRowKeys}
                            selectedRows={this.state.selectedRows}
                            approveModuleFlag = {0}
                            onDelete={this.batchDelete}
                            onDispatch={this.batchAssignToSubAccount}
                            exportModel={{
                                exportType: "customer",
                                exportDataSource: this.state.selectedRowKeys
                            }}
                        />
                        <FilterToolBar dataSource={filterDataSource}
                                       doFilter={this.doFilter}
                                       style={{display: this.state.filterToolBarVisible ? 'block' : 'none'}}
                                       ref={(child) => {
                                           this.filterToolBarHanler = child;
                                       }}
                        />
                    </div>

                    <div className={"data-wrap cf"}>
                        <div className={"tb-wrap"}>
                            <ListTable
                                columns={tempColumns}
                                operationColumn={operationColumn}
                                dataSource={dataSource}
                                rowSelection={rowSelection}
                                loading={this.props.customerList.get('isFetching')}
                                getRef={this.getRef}
                            />
                            <FooterFixedBar className="list-footer cf">
                                <Pagination {...paginationInfo}
                                            onChange={this.onPageInputChange}
                                            onShowSizeChange={this.onShowSizeChange}
                                />
                            </FooterFixedBar>
                        </div>
                    </div>
                </div>
                <Modal
                    title={intl.get("customer.index.title")}
                    width={800}
                    className={cx("modal-mul-account")}
                    visible={this.state.contactRecordVisible}
                    destroyOnClose={true}
                    onOk={()=>this.handleCreate()}
                    onCancel={() => this.closeModal('contactRecordVisible')}
                >
                    <ContactRecordAdd
                        customerNo={this.state.customerNo}
                        data={null}
                        wrappedComponentRef={this.saveFormRef}
                    />
                </Modal>
                {/*分配子账号*/}
                <Choose
                    visible={this.state.assignSubAccountVisible}
                    getUrl={`/customer/subAccounts/${this.state.curCustomerId}`}
                    postUrl={`/customer/allocSubAccounts/${this.state.curCustomerId}`}
                    onClose={this.closeModal.bind(this, 'assignSubAccountVisible')}
                />

                {/*批量分配子账号*/}
                <Choose
                    pageType={'batchChoose'}
                    visible={this.state.batchAssignSubAccountVisible}
                    postUrl={`/customer/batch/allocSubAccounts`}
                    selectIds={customerIds}
                    onClose={this.closeModal.bind(this, 'batchAssignSubAccountVisible')}
                    onOk={this.checkRemove}
                />

                <InviteModal
                    title={intl.get('common.confirm.title')}
                    inviteVisible={this.state.addFriendVisible}
                    onCancel={this.hideAddFriend}
                    width={800}
                    type={"1"}
                    inviteType={this.state.inviteType}
                />
            </Layout>
        )
    }
}

const mapStateToProps = (state) => ({
    customerList: state.getIn(['customerIndex', 'customerList']),
    currentAccountInfo: state.getIn(['commonInfo', 'currentAccountInfo']),
    initListCondition: state.getIn(['commonInfo', 'initListCondition'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchCustomerList: customerActions.asyncFetchCustomerList,
        asyncToggleCustomerInfo: customerActions.asyncToggleCustomerInfo,
        asyncDeleteCustomerInfo: customerActions.asyncDeleteCustomerInfo,
        asyncFetchStatistic: customerActions.asyncFetchStatistic,
        asyncUpdateConfig: customerActions.asyncUpdateConfig,
        asyncBatchUpdateConfig: customerActions.asyncBatchUpdateConfig,
        asyncSetDistribute: customerActions.asyncSetDistribute,
        dealFilterConfigList: customerActions.dealFilterConfigList,
        asyncAddFriend: commonActions.asyncAddFriend,
        asyncFetchInitListCondition: commonActions.asyncFetchInitListCondition,
        asyncInsertContactRecordInfo:contactRecordActions.asyncInsertContactRecordInfo
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)