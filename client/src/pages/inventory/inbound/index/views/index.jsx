import React, {Component} from 'react';
import intl from 'react-intl-universal';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Layout, Menu, message, Modal, Spin } from 'antd';
import moment from "moment/moment";

const {Content} = Layout;
const confirm = Modal.confirm;
import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import {
    asyncFetchInboundOrderList,
    asyncToggleInboundOrderInfo,
    asyncDeleteInboundOrderInfo,
    asyncFetchStatistic,
    asyncUpdateConfig,
    asyncFetchProdAbstractByBillNo,
    asyncBatchUpdateConfig,
    asyncBatchApproved,
    asyncBatchUnApproved,
    dealFilterConfigList
} from '../actions';
import {actions as vipServiceHomeActions} from "pages/vipService/index";
import {actions as commonActions} from "components/business/commonRequest";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import FilterToolBar from 'components/business/filterToolBar/index';
import ListOpeBar from 'components/business/listOpeBar';
import CheckResult from 'components/business/checkResult';
import Crumb from 'components/business/crumb';
import TableFieldConfigMenu from 'components/business/tableFieldConfigMenu';
import {ModifyMenu, DeleteMenu} from "components/business/authMenu";
import Pagination from 'components/widgets/pagination';
import ListTable from 'components/business/listTable';
import {Amount} from 'components/business/amount';
import FooterFixedBar from  'components/layout/footerFixedBar';
import {actions as approveActions, APPROVE_COLOR_GROUP, backDisabledStatus, BACKEND_TYPES, SelectApproveItem, withApprove} from 'components/business/approve';
import 'url-search-params-polyfill';
import {formatCurrency} from 'utils/format';
import {Auth} from 'utils/authComponent';
import {PRICE_NO_AUTH_RENDER} from 'utils/constants';
import ListPage from  'components/layout/listPage';
import PageTurnLink from 'components/business/pageTurnLink';
import {getUrlParamValue} from 'utils/urlParam';
import {withRouter} from "react-router-dom";
const cx = classNames.bind(styles);

let initParams = {
    condition: {},
    selectedRowKeys: [],
    selectedRows: [],
    filterToolBarVisible: false,
    checkResultVisible: false
};
const DEFAULT_TITLE = 'inbound';

const mapStateToProps = (state) => ({
    inboundOrderList: state.getIn(['inboundOrderIndex', 'inboundOrderList']),
    initListCondition: state.getIn(['commonInfo', 'initListCondition'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchInboundOrderList,
        asyncToggleInboundOrderInfo,
        asyncDeleteInboundOrderInfo,
        asyncFetchStatistic,
        asyncUpdateConfig,
        asyncFetchProdAbstractByBillNo,
        asyncBatchUpdateConfig,
        asyncBatchApproved,
        asyncBatchUnApproved,
        dealFilterConfigList,
        asyncFetchInitListCondition: commonActions.asyncFetchInitListCondition,
        asyncFetchVipService: vipServiceHomeActions.asyncFetchVipService,
        batchSubmitApprove: approveActions.batchSubmitApprove
    }, dispatch)
};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
@withApprove
export default class Index extends ListPage {
    constructor(props) {
        super(props);
        let params = this.doInitParams(props.initListCondition, initParams, DEFAULT_TITLE);
        this.state = {
            ...params,
            selectApprove: false,  // 选择审批流弹层
            billNoGroup: [],
            billNoUpdatedTime: [],
            selectedApproveStatus: [],
            listToolBarVisible: true,
            statistic: {
                count: 0,
                countMonth: 0,
                countToday: 0
            }
        };
    }

    fetchListData = (params,callback)=>{
        this.props.asyncFetchInboundOrderList(params, callback);
    };

    componentDidMount() {
        //初始化列表数据
        let params = new URLSearchParams(this.props.location.search);
        const fkBillNo = params && params.get('fkBillNo') || "";
        let condition = this.state.condition;
        fkBillNo && (condition.purchaseBillNo = fkBillNo);

        // 首页审批模块点击进入 ***
        let approveStatus = getUrlParamValue("approveStatus");
        let approvePerson = getUrlParamValue("approvePerson");
        if(approveStatus) condition.approveStatus = approveStatus;
        if(approvePerson) condition.approvePerson = approvePerson;
        //初始化列表数据
        this.fetchListData(condition,(data) => {
            let filterConfigList = this.initFetchListCallback(data.filterConfigList, condition);
            this.props.dealFilterConfigList(filterConfigList);
        });
    }

    componentWillUnmount() {
        let params = {};
        for(let key in initParams){
            params[key] = this.state[key];
        }
        this.props.asyncFetchInitListCondition({TITLE: DEFAULT_TITLE, ...params});
    }

    // 是否显示筛选条件
    filterInboundOrder = (callback) => {
        this.setState({
            filterToolBarVisible: !this.state.filterToolBarVisible
        }, ()=>{
            callback && callback();
        });
    };

    onSelectChange = (selectedRowKeys, selectedRows) => {
        let billNoGroup = selectedRows.map(item => item.billNo);
        let selectedApproveStatus = selectedRows.map(item => item.approveStatus||'');
        let billNoUpdatedTime = selectedRows.map(item => (item.updatedTime && moment(item.updatedTime).format("YYYY-MM-DD HH:mm:ss"))||'');
        this.setState({
            selectedRowKeys,
            selectedRows,
            billNoGroup: billNoGroup,
            billNoUpdatedTime: billNoUpdatedTime,
            selectedApproveStatus: selectedApproveStatus,
            checkResultVisible: selectedRowKeys.length > 0
        });
    };

    onSubmitApprove = (selectedRowKeys) => {
        if(selectedRowKeys && selectedRowKeys.length > 20){
            message.error('所选单据数量超过20，无法批量提交');
        }
        this.props.submitApproveProcess(null, () => {
            this.openModal('selectApprove'); // 进入审批流的过程
        });
    };

    // 批量审批
    batchApproveOnOkModal = (id) => {
        let {selectedRows} = this.state;
        let params = {type: BACKEND_TYPES[DEFAULT_TITLE]};
        params.list = selectedRows.map(item => {
            let {billNo, displayBillNo} = item;
            let out = {process: id, billNo, displayBillNo };
            return out;
        });
        this.props.batchSubmitApprove(params, (res) => {
            this.closeModal('selectApprove'); // 进入审批流的过程
            if(res.data.retCode === '0'){
                let errorBillNoMessage = res.data.data.join('、');
                if(errorBillNoMessage.length > 0){
                    message.error(`${errorBillNoMessage}提交失败`);
                } else {
                    message.success('操作成功');
                }
                this.fetchListData(this.state.condition, () => this.checkRemove());
            }
        })
    };

    batchUpdateConfig = (callback) => {
        const {inboundOrderList} = this.props;
        let filterConfigList = inboundOrderList.getIn(['data', 'filterConfigList']);
        filterConfigList = filterConfigList ? filterConfigList.toJS() : [];
        let tableConfigList = inboundOrderList.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];
        let cannotEditFilterColumnsMap = {
            'enterType':1,
            'warehouseName':1,
            'enterDate':1,
        };
        let moduleType = {
            search:'wareEnter_search_list',
            table:'wareEnter_list'
        };
        this.batchUpdateConfigSuper(filterConfigList,tableConfigList,cannotEditFilterColumnsMap, moduleType,callback);
    };


    deleteConfirm = (ids, type, callback) => {
        /*let selectedApproveStatus = this.state.selectedApproveStatus;
        const {inboundOrderList} = this.props;
        let approveFlag = (inboundOrderList.getIn(['data', 'approveFlag']))==1?true:false;
        //开启审核功能和审核通过的订单不能删除
        if(approveFlag && selectedApproveStatus.indexOf(1)!=-1){
            alert('已审核的订单不能删除！');
            return false;
        }*/
        let _this = this;
        confirm({
            title: intl.get("inbound.index.index.warningTip"),
            content: intl.get("inbound.index.index.deleteMsg1"),
            onOk() {
                _this.props.asyncDeleteInboundOrderInfo(ids, function(res) {
                    if (res.retCode == 0) {
                        // 没有type说明是批量删除
                        if (res.partDeleteFlag == 1) {
                            if (type && type.length > 0) {
                                let errorMsg = (type === intl.get("inbound.index.index.stockInbound")) ? intl.get("inbound.index.index.deleteMsg2") :
                                    (type === intl.get("inbound.index.index.allocateInbound")) ? intl.get("inbound.index.index.deleteMsg3") : '';
                                errorMsg && message.warning(errorMsg);
                            }
                            else {
                                message.success(`${intl.get("inbound.index.index.deleteMsg4")} \n" + "\n" ${intl.get("inbound.index.index.deleteMsg5")}`);
                                _this.props.asyncFetchInboundOrderList(_this.state.condition, () => _this.checkRemove());
                                if (callback) {
                                    callback();
                                }
                            }
                        }
                        else {
                            message.success(intl.get("inbound.index.index.operateSuccessMessage"));
                            _this.props.asyncFetchInboundOrderList(_this.state.condition, () => _this.checkRemove());
                            if (callback) {
                                callback();
                            }
                        }

                    }
                    else {
                        Modal.error({
                            title: intl.get("inbound.add.index.warningTip"),
                            content: res.retMsg
                        });
                    }
                });
            },
            onCancel() {
            },
        });
    };

    //加载当前物品概要数据
    loadWare = (visible, billNo) => {
        const {inboundOrderList} = this.props;
        const dataSource = inboundOrderList.getIn(['data', 'list']);
        const hasCache = dataSource.filter(item => {
            return item.get('billNo') === billNo && item.get('prodAbstractList')
        }).size > 0;
        if (visible && !hasCache) {
            this.props.asyncFetchProdAbstractByBillNo(billNo)
        }
    };

    render() {
        const {inboundOrderList} = this.props;
        let dataSource = inboundOrderList.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];
        let filterConfigList = inboundOrderList.getIn(['data', 'filterConfigList']);
        filterConfigList = filterConfigList ? filterConfigList.toJS() : [];
        let tableConfigList = inboundOrderList.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];
        const pageAmount = inboundOrderList.getIn(['data', 'pageAmount']);
        const totalAmount = inboundOrderList.getIn(['data', 'totalAmount']);
        let paginationInfo = inboundOrderList.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};
        //获取当前是否有权限审批字段
        let approveFlag = inboundOrderList.getIn(['data', 'approveFlag']);
        let approveModuleFlag = inboundOrderList.getIn(['data', 'approveModuleFlag']); //当前账号是否具备审批功能
        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        let tempColumns = [];
        tableConfigList.forEach((item) => {
            if (item.visibleFlag) {
                let obj = {
                    title: item.label,
                    dataIndex: item.fieldName,
                    key: item.fieldName,
                    width: item.width
                };
                if (item.fixed) {
                    obj.fixed = item.fixed;
                }
                if (item.fieldName == "displayBillNo") {
                    obj.render = (displayBillNo, data) => {
                        return (
                            <React.Fragment>
                                <span className={cx("txt-clip")} title={displayBillNo}>
                                    <PageTurnLink data={dataSource} type={"inbound"} linkdata={"billNo"} showdata={"displayBillNo"} current={data}/>
                                    {/*<Link to={`/inventory/inbound/show/${data.billNo}`}>{displayBillNo}</Link>*/}
                                </span>
                            </React.Fragment>
                        )
                    }
                }
                else if (item.fieldName == "enterDate") {
                    obj.render = (enterDate) => (<span>{moment(enterDate).format('YYYY-MM-DD')}</span>);
                    /*obj.defaultSortOrder = 'descend';*/
                    obj.sorter = (prev, next) => prev.enterDate - next.enterDate;
                }
                else if (item.fieldName == "remarks") {
                    obj.render = (remarks) => (<span className={cx("txt-clip")} title={remarks}>{remarks}</span>)
                }
                else if (item.fieldName == "enterType"){
                    obj.render = (enterType) => {
                         return intl.get(enterType)
                    }
                }
                else if (item.fieldName == "otherEnterWarehouseName"){
                    obj.render = (name,data) => {
                        if(data.enterType == 'node.inventory.in.enterTypeOption7'){
                            return <span className={cx("txt-clip")} title={data.supplierName}>{data.supplierName}</span>
                        }else if(data.enterType == 'node.inventory.in.enterTypeOption8'){
                            return <span className={cx("txt-clip")} title={data.otherEnterWarehouseName}>{data.otherEnterWarehouseName}</span>
                        }else{
                            return <span className={cx("txt-clip")} title={name}>{name}</span>
                        }
                    }

                }
                else if (item.fieldName == "customerContacterName"){
                    obj.render = (name,data) => {
                        if(data.enterType == 'node.inventory.in.enterTypeOption7'){
                            return <span className={cx("txt-clip")} title={data.supplierContacterName}>{data.supplierContacterName}</span>
                        }else if(data.enterType == 'node.inventory.in.enterTypeOption8'){
                            return <span className={cx("txt-clip")} title={data.otherEnterWarehouseContacterName}>{data.otherEnterWarehouseContacterName}</span>
                        }else{
                            return <span className={cx("txt-clip")} title={name}>{name}</span>
                        }
                    }

                }
                else if (item.fieldName == "customerTelNo"){
                    obj.render = (tel,data) => {
                        if(data.enterType == 'node.inventory.in.enterTypeOption7'){
                            return <span className={cx("txt-clip")} title={data.supplierMobile}>{data.supplierMobile}</span>
                        }else{
                            return <span className={cx("txt-clip")} title={tel}>{tel}</span>
                        }
                    }

                }
                //对审核状态数据的显示
                else if (item.fieldName == "approveStatus") {
                    obj.render = (status) =>{
                        return <span style={{color: APPROVE_COLOR_GROUP[status].color}}>{APPROVE_COLOR_GROUP[status].label}</span>
                    }
                }
                //对需要加密的数据以**显示
                else if (item.fieldName === "aggregateAmount") {
                    obj.render = (aggregateAmount) => (
                        <Auth
                            module="purchasePrice"
                            option="show"
                        >
                            {
                                (isAuthed) =>
                                    isAuthed ? (
                                        <span className="txt-clip" title={formatCurrency(aggregateAmount)}>
                                            <strong>{formatCurrency(aggregateAmount)}</strong>
                                        </span>
                                    ) : PRICE_NO_AUTH_RENDER
                            }
                        </Auth>
                    )
                    /*obj.defaultSortOrder = 'descend';*/
                    obj.sorter = (prev, next) => prev.aggregateAmount - next.aggregateAmount;
                }
                else if (item.fieldName === "taxAllAmount" ) {
                    obj.render = (taxAllAmount) => (
                        <Auth
                            module="purchasePrice"
                            option="show"
                        >
                            {
                                (isAuthed) =>
                                    isAuthed ? (
                                        <span className="txt-clip" title={formatCurrency(taxAllAmount)}>
                                            <strong>{formatCurrency(taxAllAmount)}</strong>
                                        </span>
                                    ) : PRICE_NO_AUTH_RENDER
                            }
                        </Auth>
                    );
                    /*obj.defaultSortOrder = 'descend';*/
                    obj.sorter = (prev, next) => prev.taxAllAmount - next.taxAllAmount;
                }
                else if (item.fieldName === "discountAmount" ) {
                    obj.render = (discountAmount) => (
                        <Auth
                            module="purchasePrice"
                            option="show"
                        >
                            {
                                (isAuthed) =>
                                    isAuthed ? (
                                        <span className="txt-clip" title={formatCurrency(discountAmount)}>
                                            <strong>{formatCurrency(discountAmount)}</strong>
                                        </span>
                                    ) : PRICE_NO_AUTH_RENDER
                            }
                        </Auth>
                    );
                    /*obj.defaultSortOrder = 'descend';*/
                    obj.sorter = (prev, next) => prev.discountAmount - next.discountAmount;
                } else if (item.fieldName === "prodAbstract") {
                    obj.render = (prodAbstract, data) => (
                        <Dropdown
                            onVisibleChange={(visible) => this.loadWare(visible, data.billNo)}
                            overlay={() => (
                                <Menu className={cx('abstract-drop-menu')}>
                                    <Menu.Item>
                                        <Spin
                                            spinning={data.prodAbstractIsFetching}
                                        >
                                            <div className={cx("abstract-drop")}>
                                                <div className={cx("tit")}>{intl.get("inbound.index.index.prod_abstract")}</div>
                                                <ul>
                                                    {
                                                        data.prodAbstractList && data.prodAbstractList.map((item, index) =>
                                                            <li key={index}>
                                                                <span className={cx('prod-tit')}>{item.prodName}</span>
                                                                <span className={cx('prod-desc')}>{item.descItem}</span>
                                                                <span className={cx('amount')}>x{item.quantity}</span>
                                                            </li>
                                                        )
                                                    }
                                                </ul>
                                            </div>
                                        </Spin>
                                    </Menu.Item>

                                </Menu>
                            )}>
                             <span>
                                <span className={cx("txt-desc-no") + ' txt-clip'} title={prodAbstract}>{prodAbstract}</span>
                                <DownOutlined className="ml5" />
                            </span>
                        </Dropdown>
                    )
                }
                else {
                    obj.render = (text) => (<span className={cx("txt-clip")} title={text}>{text}</span>)
                }
                tempColumns.push(obj);
            }
        });

        const operationColumn = {
            render: (operation, data) =>{
                let deleteApproveDisabled = backDisabledStatus('deleteApproveDisabled', approveModuleFlag, data.approveStatus); // ***
                let modifyApproveDisabled = backDisabledStatus('modifyApproveDisabled', approveModuleFlag, data.approveStatus); // ***
                let tipTitle = intl.get("inbound.index.index.orderUnableExecute");
                return (
                    <Dropdown overlay={
                        <Menu>
                            <ModifyMenu module={"inbound"}
                                        disabled={!modifyApproveDisabled}
                                        tipFlag={!modifyApproveDisabled}
                                        tipTitle={tipTitle}
                                        to={`/inventory/inbound/modify/${data.billNo}`}/>
                            <DeleteMenu module={"inbound"}
                                        disabled={!deleteApproveDisabled}
                                        tipFlag={!deleteApproveDisabled}
                                        tipTitle={tipTitle}
                                        clickHandler={() => this.deleteConfirm([data.billNo], intl.get(data.enterType))}/>
                        </Menu>
                    }>
                        <a href="#!">...</a>
                    </Dropdown>
                )
            }
        };


        let params = new URLSearchParams(this.props.location.search);
        const fkBillNo = params && params.get('fkBillNo') || "";

        const filterDataSource = {
            selectComponents: [],
            inputComponents: [],
            datePickerComponents: [],
            depEmployeeComponents: [],
            customComponents: [],
            projectComponents: []
        };
        filterConfigList.forEach((item) => {
            if (item.fieldName === 'purchaseBillNo' || item.fieldName === 'contacterName') {
                item.width = 170;
            }
            if (item.fieldName === 'purchaseBillNo' && fkBillNo) {
                item.defaultValue = fkBillNo;
            }
            item.visibleFlag && filterDataSource[item.type + "Components"].push(item);
        });

        return (
            <Layout>
                <div className="content-hd">
                    <Crumb data={[
                        {
                            url: '/inventory/inbound/',
                            title: intl.get("inbound.index.index.inbound")
                        },
                        {
                            title: intl.get("inbound.index.index.inboundList")
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <TableFieldConfigMenu filterList={filterConfigList} tableList={tableConfigList}
                                              onTableConfigChange={this.onTableConfigChange}
                                              onFilterConfigChange={this.onFilterConfigChange}
                                              batchUpdateConfig={this.batchUpdateConfig}
                                              refresh={this.refresh}
                                              type={'wareEnter'}
                        />
                        {/*<StatisticMenu linkList={linkList} statistic={this.state.statistic} moduleName={"供应商"} />*/}
                    </div>
                </div>

                <div className="content-index-bd">
                    <div className="list-ope-wrap">
                        <ListOpeBar
                            visible={this.state.listToolBarVisible}
                            filterToolBarVisible={this.state.filterToolBarVisible}
                            addUrl="/inventory/inbound/add"
                            authModule={"inbound"}
                            searchTipsUrl={"/enterwares/search/tips"}
                            onFilter={this.filterInboundOrder}
                            importModule={
                                {
                                    type:"inbound",
                                    text: intl.get("inbound.index.index.import"),
                                    module: "inbound",
                                    customStep2Text: intl.get("inbound.index.index.inboundImportTip")
                                }
                            }
                            onSearch={this.onSearch}
                            defaultValue={this.state.condition.key}
                            searchPlaceHolder={intl.get("inbound.index.index.searchPlaceHolder")}
                            refresh={this.refresh}
                        />
                        <CheckResult
                            module={"inbound"}
                            visible={this.state.checkResultVisible}
                            onRemove={this.checkRemove}
                            selectedRowKeys={this.state.selectedRowKeys}
                            selectedRows={this.state.selectedRows}
                            onDelete={this.batchDelete}
                            onSubmitApprove={this.onSubmitApprove.bind(this)}
                            approveModuleFlag={approveModuleFlag}
                            approveFlag={approveFlag}
                            onBatchUnApprove={this.batchUnApprove}
                        />
                        {
                            filterConfigList.length > 0 && <FilterToolBar dataSource={filterDataSource}
                                                                          doFilter={this.doFilter}
                                                                          style={{display: this.state.filterToolBarVisible ? 'block' : 'none'}}
                                                                          ref={(child) => {
                                                                              this.filterToolBarHanler = child;
                                                                          }}
                            />
                        }
                    </div>
                    <div className={"data-wrap cf"}>
                        <div className={"tb-wrap"}>
                            <ListTable
                                columns={tempColumns}
                                operationColumn={operationColumn}
                                dataSource={dataSource}
                                rowSelection={rowSelection}
                                loading={this.props.inboundOrderList.get('isFetching')}
                                getRef={this.getRef}
                            />
                            <FooterFixedBar className="list-footer cf">
                                <Amount module={["purchasePrice", "salePrice"]} pageAmount={pageAmount} totalAmount={totalAmount}/>
                                <Pagination {...paginationInfo}
                                            onChange={this.onPageInputChange}
                                            onShowSizeChange={this.onShowSizeChange}
                                />
                            </FooterFixedBar>
                        </div>
                    </div>
                </div>

                <SelectApproveItem
                    onClose={() => this.closeModal('selectApprove')}
                    onOk={(id)=>{this.batchApproveOnOkModal(id)}}
                    show={this.state.selectApprove}
                    type={BACKEND_TYPES[DEFAULT_TITLE]}
                />
            </Layout>
        )
    }
}
