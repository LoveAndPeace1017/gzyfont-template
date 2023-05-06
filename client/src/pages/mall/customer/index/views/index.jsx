import React, {Component} from 'react';
import {
    Switch, Layout, message, Modal, Button,
} from 'antd';

const confirm = Modal.confirm;
import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import {withRouter} from "react-router-dom";
import {actions as customerActions} from 'pages/customer/index'
import {reducer as customerIndex} from 'pages/customer/index';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Link} from 'react-router-dom';
import FilterToolBar from 'components/business/filterToolBar/index';
import ListOpeBar from 'components/business/listOpeBar';
import CheckResult from 'components/business/checkResult';
import Crumb from 'components/business/crumb';
import InviteModal from 'components/widgets/invite';
import Pagination from 'components/widgets/pagination';
import ListTable from 'components/business/listTable';
import MallGuide from 'components/business/mallGuide';
import FooterFixedBar from  'components/layout/footerFixedBar'
import {Explore, actions as mallHomeActions, redirectToHome} from 'pages/mall/home'

const cx = classNames.bind(styles);

export class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [], // Check here to configure the default column
            listToolBarVisible: true,
            filterToolBarVisible: false,
            contactRecordVisible: false,
            condition:{},
            checkResultVisible: false,
            assignWarehouseToSubAccountVisible: false,
            addFriendVisible:false,
            customerGuideVisible: props.location.state && (props.location.state.fromFourStep || props.location.state.fromExplore) && !props.location.state.fromGuideAdd,
            customerSuccessGuideVisible: props.location.state && (props.location.state.fromFourStep || props.location.state.fromExplore) && props.location.state.fromGuideAdd,
            setMallSuccessVisible: false,
            exploreVisible: false,
            inviteType:'mult'
        };
    }

    refresh = () => {
        this.props.asyncFetchCustomerList(this.state.condition);
    };
    componentDidMount() {
        //初始化列表数据
        this.props.asyncFetchCustomerList({
            init: true,
        }, res=>{
            const filterConfigList = res && res.filterConfigList;
            let condition = {};
            filterConfigList.forEach(function(item) {
                if(item.visibleFlag && item.defaultValue){
                    condition[item.fieldName] = item.defaultValue
                }
            });
            this.setState({
                condition
            });
        });
    }

    // 是否显示筛选条件
    filterCustomer = (callback) => {
        this.setState({
            filterToolBarVisible: !this.state.filterToolBarVisible
        }, ()=>{
            callback && callback();
        });
    };

    onSelectChange = (selectedRowKeys) => {
        this.setState({
            selectedRowKeys,
            checkResultVisible: selectedRowKeys.length > 0,
            inviteType:selectedRowKeys.length > 1?'mult':'',
        });
    };
    // 清除选中项
    checkRemove = () => {
        this.setState({
            selectedRowKeys: [],
            checkResultVisible: false,
            inviteType:'mult'
        })
    };

    doFilter = (condition, resetFlag) => {
        let params = this.state.condition;
        if (resetFlag) {
            let key = params.key;
            params = condition;
            if (key && (typeof params.key === "undefined")) {
                params.key = key;
            }
        }
        else {
            params = {
                ...params,
                ...condition
            }
        }
        this.setState({
            condition: params
        });
        this.props.asyncFetchCustomerList(params);
    };
    onSearch = (value) => {
        this.doFilter({key: value}, true);
        this.filterToolBarHanler.reset();
    };
    onPageInputChange = (page) => {
        this.doFilter({page});
    };
    onShowSizeChange = (current, perPage) => {
        this.doFilter({perPage, page: 1});
    };

    closeModal = (key) => {
        this.setState({
            [key]: false
        });
    };
    openModal = (key) => {
        this.setState({
            [key]: true
        });
    };

    deleteConfirm = (ids, callback) => {
        let _this = this;
        confirm({
            title: '提示信息',
            content: '删除客户后，信息将无法恢复，确定删除吗？',
            onOk() {
                _this.props.asyncDeleteCustomerInfo(ids, function(res) {
                    if (res.retCode == 0) {
                        message.success('操作成功');
                        _this.props.asyncFetchCustomerList();
                        if (callback) {
                            callback();
                        }
                    }
                    else {
                        if (res.inServiceNos && res.inServiceNos.length != 0) {
                            confirm({
                                title: '提示信息',
                                content: '该客户发生了销售、出入库等业务，暂不能删除，建议直接隐藏客户！',
                                onOk() {
                                    _this.props.asyncToggleCustomerInfo(ids, false, function(res) {
                                        if (res.retCode == 0) {
                                            message.success('操作成功');
                                            _this.props.asyncFetchCustomerList();
                                        }
                                        else {
                                            alert(res.retMsg);
                                        }
                                    });
                                },
                                onCancel() {
                                },
                            });
                        }
                        alert(res.retMsg);
                    }
                });
            },
            onCancel() {
            },
        });
    };

    onSwitchChange = (checked, data) => {
        if (checked && !data.bindAbizLoginName) {
            this.invite(data.customerNo);
        } else {
            let _this = this;
            let callback = function(){
                _this.props.asyncFetchCustomerList(_this.state.condition.params,()=>{
                    message.success('操作成功!');
                });
            };
            if(checked){
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
            title: '提示信息',
            content: content,
            okText:'确定',
            cancelText:'取消',
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
                            message.success('操作成功!');
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
            content: '关闭后，该客户不可以看你的商城。',
            optionFlag: 0,
        });
    };
    onOpenDistribute = (ids,callback) => {
        this.conformDistribute({
            ids,
            callback,
            content: '开启后，该客户可以看你的商城。',
            optionFlag: 1
        });
    };

    invite = (customerNo) => {
        if(customerNo){
            this.setState({
                inviteType:'single'
            })
        }
        this.showAddFriendModal();
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

    render() {
        const {customerList} = this.props;
        let dataSource = customerList.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];
        let filterConfigList = customerList.getIn(['data', 'filterConfigList']);
        filterConfigList = filterConfigList ? filterConfigList.toJS() : [];
        let paginationInfo = customerList.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};

        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };

        const columns = [
            {
                title: "mall.customer.customerName", dataIndex: 'customerName',width: 200,
                render: (customerName, data) => (
                    <span className={cx("txt-clip")} title={customerName}>
                        <Link to={`/customer/show/${data.customerNo}?source=mall&current=/mall/customer/`}>{customerName}</Link>
                    </span>
                )
            },
            {title: 'mall.customer.contacterName', dataIndex: 'contacterName', width: 200},
            {title: 'mall.customer.contacterPhone', dataIndex: 'telNo', width: 200},
            {title: 'mall.customer.level', dataIndex: 'level', width: 200},
            {
                title: 'mall.customer.bindAbizLoginName', dataIndex: 'bindAbizLoginName', width: 200,
                render: (bindAbizLoginName, data) => {
                    return bindAbizLoginName
                        ? <Link to={`/customer/show/${data.customerNo}?source=mall&current=/mall/customer/`}>{bindAbizLoginName}</Link>
                        : <a onClick={() => this.invite(data.customerNo)}>立即邀请</a>
                }
            },
            {
                title: 'mall.customer.remarks', dataIndex: 'remarks',
                render: (remarks) => (<span className={cx("txt-clip")} title={remarks}>{remarks}</span>)
            },
        ];
        let operationColumn =
            {
                title: '允许访问商城',
                dataIndex: 'operation',
                fixed: 'right',
                width: 100,
                render: (operation, data) => <Switch ga-data='list-switch-distribute' checked={data.distributionFlag == 1}
                                                     onChange={(checked) => this.onSwitchChange(checked,data)}/>,
            };

        const filterDataSource = {
            selectComponents: [],
            datePickerComponents: [],
            customComponents: [],
        };
        filterConfigList.forEach(function(item) {
            item.visibleFlag && filterDataSource[item.type + "Components"].push(item);
        });


        const guide = this.props.mallPreData.getIn(['data', 'data', 'guide']);

        //引导是否都完成
        const isAllCompleted = guide && guide.get('completed');


        return (
            <Layout>
                <div className="content-hd">
                    <Crumb data={[
                        {
                            url: '/mall/',
                            title: '我的商城'
                        },
                        {
                            title: '客户管理'
                        }
                    ]}/>
                </div>

                <div className={cx([{"guide-show": this.state.customerGuideVisible},{"guide-success-show": this.state.customerSuccessGuideVisible}]) + " content-index-bd"}>
                    <ul className={cx("tab-menu")}>
                        <li className={cx("current")}><b></b>我的客户</li>
                        <li><Link to={'/mall/customer/apply'}>客户申请</Link></li>
                    </ul>
                    <div className="list-ope-wrap">
                        <ListOpeBar
                            visible={this.state.listToolBarVisible}
                            filterToolBarVisible={this.state.filterToolBarVisible}
                            onFilter={this.filterListData}
                            addUrl={{pathname: "/customer/add/?source=mall&current=/mall/customer/", state: this.props.location.state && this.state.customerGuideVisible?{...this.props.location.state}:{}}}
                            authModule={"customer"}
                            onInvite="customer"
                            openInviteModal={()=>this.invite('')}
                            importType="customer"
                            exportType="customer"
                            onSearch={this.onSearch}
                            searchTipsUrl={`/customers/search/tips`}
                            searchPlaceHolder="客户名称/联系人/联系电话"
                            refresh={this.refresh}
                        />
                        <CheckResult
                            module={"customer"}
                            visible={this.state.checkResultVisible}
                            onRemove={this.checkRemove}
                            selectedRowKeys={this.state.selectedRowKeys}
                            onCancelDistribute={this.cancelDistribute}
                            onOpenDistribute={this.onOpenDistribute}
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
                            {
                                this.state.customerSuccessGuideVisible && (
                                    <ListTable
                                        columns={columns}
                                        dataSource={
                                            [
                                                {
                                                    "customerName":"南京焦点科技有限公司",
                                                    "customerNo":"KH-20190826-0001",
                                                    "contacterName": "徐林林",
                                                    "telNo":15196790900,
                                                    "level": "零售",
                                                    "bindAbizLoginName":13812334567,
                                                    "distributionFlag": 1,
                                                    "twoWayBindFlag":0,
                                                    "key":"KH-20190826-0001",
                                                    "serial":1
                                                }
                                            ]
                                        }
                                        rowSelection={rowSelection}
                                        className={cx("guide-customer-highlight")}
                                    />
                                )
                            }
                            <ListTable
                                columns={columns}
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
                    <InviteModal
                        inviteVisible={this.state.addFriendVisible}
                        onCancel={this.hideAddFriend}
                        width={800}
                        type={"1"}
                        inviteType={this.state.inviteType}
                    />
                </div>


                {/*新建客户引导*/}
                <div style={{"display": this.state.customerGuideVisible?"block":"none"}}>
                    <div className={cx("guide-mask")}/>
                    <Button className={cx("guide-skip")} onClick={()=>{
                        this.closeModal('customerGuideVisible');
                        this.props.asyncFetchMallPreData();
                    }}>跳过</Button>
                    <div className={cx("guide-customer")}>
                        <span className={cx("arrow")} />
                        <p className={cx("loc")}>创建商城共需2步，目前您在第2步：</p>
                        <p className={cx("txt")}>您可以在这里新建商城客户</p>
                    </div>
                </div>

                {/*新建客户成功引导*/}
                <div style={{"display": this.state.customerSuccessGuideVisible?"block":"none"}}>
                    <div className={cx("guide-mask")}/>
                    <Button className={cx("guide-skip")} onClick={()=>{
                        this.closeModal('customerSuccessGuideVisible');
                        this.props.asyncFetchMallPreData();
                    }}>跳过</Button>
                    <div className={cx(["guide-customer", "guide-customer-success"])}>
                        <span className={cx("arrow")} />
                        <p className={cx("txt")}>新建的客户默认允许访问商城，您可以点击按钮设置商城对客户不可见</p>
                        <Button type="primary" onClick={()=>{
                            this.closeModal('customerSuccessGuideVisible');
                            if(isAllCompleted){
                                this.openModal('setMallSuccessVisible')
                            }else{
                                this.openModal('exploreVisible')
                            }
                        }}>完成</Button>
                    </div>
                </div>


                {/*商城设置成功*/}
                <MallGuide visible={this.state.setMallSuccessVisible}/>
                <Explore
                    visible={this.state.exploreVisible}
                    onClose={()=>this.closeModal('exploreVisible')}
                />
            </Layout>
        )
    }
}

const mapStateToProps = (state) => ({
    customerList: state.getIn(['customerIndex', 'customerList']),
    mallPreData: state.getIn(['mallHome', 'preData']),

});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchCustomerList: customerActions.asyncFetchCustomerList,
        updateCustomerList: customerActions.fetchCustomerListSuccess,
        asyncToggleCustomerInfo: customerActions.asyncToggleCustomerInfo,
        asyncDeleteCustomerInfo: customerActions.asyncDeleteCustomerInfo,
        asyncFetchStatistic: customerActions.asyncFetchStatistic,
        asyncUpdateConfig: customerActions.asyncUpdateConfig,
        asyncBatchUpdateConfig: customerActions.asyncBatchUpdateConfig,
        asyncSetDistribute: customerActions.asyncSetDistribute,
        asyncFetchMallPreData: mallHomeActions.asyncFetchPreData
    }, dispatch)
};

export default withRouter(redirectToHome(connect(mapStateToProps, mapDispatchToProps)(Index)))