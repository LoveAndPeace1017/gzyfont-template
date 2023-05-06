import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {Modal, Menu, Dropdown, message, Spin} from 'antd';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import {
    DownOutlined
} from '@ant-design/icons';
import Tooltip from 'components/widgets/tooltip';
import {PRICE_NO_AUTH_RENDER} from 'utils/constants';
import {Link, withRouter} from 'react-router-dom';
import FooterFixedBar from  'components/layout/footerFixedBar';

import {
    asyncFetchPurchaseList,
    asyncTogglePurchaseInfo,
    asyncDeletePurchaseInfo,
    asyncBeforeDeletePurchaseInfo,
    asyncUpdateConfig,
    asyncBatchUpdateConfig,
    asyncFetchProdAbstractByBillNo,
    dealFilterConfigList
} from '../actions';
import {actions as vipServiceHomeActions} from "pages/vipService/index";
import {
    WareEnterBatchEdit,
    FinanceExpendBatchEdit,
    FinanceInvoiceBatchEdit
} from 'components/business/batchEditPop';

import {actions as commonActions} from "components/business/commonRequest";

import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import Icon from 'components/widgets/icon';
import FilterToolBar from 'components/business/filterToolBar';
import BatchPopTitle from 'components/business/batchPopTitle';
import TableFieldConfigMenu from 'components/business/tableFieldConfigMenu';
import ListOpeBar from 'components/business/listOpeBar';
import CheckResult from 'components/business/checkResult';
import Crumb from 'components/business/crumb';
import {CopyMenu, ModifyMenu, DeleteMenu} from "components/business/authMenu";
import Pagination from 'components/widgets/pagination';
import ListTable from 'components/business/listTable';
import {Amount} from 'components/business/amount';
import {actions as operActions} from 'components/business/operateOrder';
import {formatCurrency} from 'utils/format';
import {Auth} from 'utils/authComponent';
import PageTurnLink from 'components/business/pageTurnLink';
import ListPage from  'components/layout/listPage';
import {actions as approveActions, APPROVE_COLOR_GROUP, backDisabledStatus, BACKEND_TYPES, SelectApproveItem, withApprove} from 'components/business/approve';
import {getUrlParamValue} from 'utils/urlParam';
import styles from '../styles/index.scss';
import classNames from "classnames/bind";


const cx = classNames.bind(styles);
let initParams = {
    condition: {},
    selectedRowKeys: [],
    selectedRows: [],
    filterToolBarVisible: false,
    checkResultVisible: false
};
const DEFAULT_TITLE = 'purchase';

const mapStateToProps = (state) => ({
    purchaseList: state.getIn(['purchaseIndex', 'purchaseList']),
    initListCondition: state.getIn(['commonInfo', 'initListCondition'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchPurchaseList,
        asyncTogglePurchaseInfo,
        asyncDeletePurchaseInfo,
        asyncUpdateConfig,
        asyncBatchUpdateConfig,
        asyncFetchProdAbstractByBillNo,
        dealFilterConfigList,
        asyncBeforeDeletePurchaseInfo,
        asyncConvertToLocalProd: operActions.asyncConvertToLocalProd,
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
            listToolBarVisible: true,
            stockInPopVisible: false,
            expendBatchPopVisible: false,
            invoiceBatchPopVisible: false,
            mergeInvoice: false,
            mergePay: false,
            mergeExpend: false,
        };
    }

    fetchListData = (params,callback)=>{
        this.props.asyncFetchPurchaseList(params, callback);
    };
    
    componentDidMount() {
        let {condition} = this.state;
        //初始化列表数据
        // 首页审批模块点击进入
        let approveStatus = getUrlParamValue("approveStatus");
        let approvePerson = getUrlParamValue("approvePerson");
        if(approveStatus) condition.approveStatus = approveStatus;
        if(approvePerson) condition.approvePerson = approvePerson;

        this.fetchListData(condition, (data) => {
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

    batchUpdateConfig = (callback) => {
        const {purchaseList} = this.props;
        let filterConfigList = purchaseList.getIn(['data', 'filterConfigList']);
        filterConfigList = filterConfigList ? filterConfigList.toJS() : [];
        let tableConfigList = purchaseList.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];
        let cannotEditFilterColumnsMap = {
            'purchaseOrderDate':1
        };
        let moduleType = {
            search:'purchase_search_list',
            table:'purchase_list'
        };
        this.batchUpdateConfigSuper(filterConfigList,tableConfigList,cannotEditFilterColumnsMap, moduleType,callback);
    };

    deleteConfirm = (ids, cannotDelete, callback, source) => {
        let _this = this;
        let prefix = source||'list';
        if (cannotDelete) {
            Modal.warning({
                title: intl.get("purchase.index.index.warningTip"),
                content: intl.get("purchase.index.index.deleteWarningContent"),
            });
            return false;
        }
        _this.props.asyncBeforeDeletePurchaseInfo(ids, (res)=>{

            console.log(res,'res');

            Modal.confirm({
                title: intl.get("purchase.index.index.warningTip"),
                content: res == 1? intl.get("purchase.index.index.deleteConfirmContent_1") : intl.get("purchase.index.index.deleteConfirmContent_2"),
                okButtonProps:{
                    'ga-data':prefix +'-delete-ok'
                },
                cancelButtonProps:{
                    'ga-data':prefix +'-delete-cancel'
                },
                onOk() {
                    _this.props.asyncDeletePurchaseInfo(ids, function(res) {
                        if (res.retCode === '0') {
                            message.success(intl.get("purchase.index.index.deleteSuccessMessage"));
                            _this.props.asyncFetchPurchaseList(_this.state.condition, () => _this.checkRemove());
                            if (callback) {
                                callback();
                            }
                        }
                        else {
                            alert(res.retMsg);
                        }
                    });
                }
            });

        });


    };

    onHasUnbindProd = (billList) => {
        this.closeModal('stockInPopVisible');
        let _self = this;
        Modal.confirm({
            title: intl.get("purchase.index.index.warningTip"),
            okText: intl.get("purchase.index.index.okText"),
            cancelText: intl.get("purchase.index.index.cancelText"),
            content: (
                <React.Fragment>
                    <div>
                        <strong>{intl.get("purchase.index.index.bindProdConfirmContent_1")}</strong>
                    </div>
                    <p style={{marginTop: '20px', textSize: '10px'}}>
                        {intl.get("purchase.index.index.bindProdConfirmContent_2")}
                    </p>
                </React.Fragment>),
            onOk() {
                return new Promise((resolve, reject) => {
                    _self.props.asyncConvertToLocalProd('purchase', billList, res => {
                        resolve();
                        if (res && res.retCode == 0) {
                            _self.openModal('stockInPopVisible');
                            _self.refresh();
                        }
                        else {
                            message.error(res && res.retMsg);
                        }
                    });

                }).catch(() => {
                    //alert("操作失败")
                })

            },
            onCancel() {
            },
        });
    };

    canPerformBatchAction = () => {
        if (this.state.selectedRows.length > 20) {
            message.info(intl.get("purchase.index.index.orderOverLimitTip"));
            return false;
        }
        if (this.state.selectedRows.some(item => item.interchangeStatus === 1 || item.interchangeStatus === 3)) {
            message.info(intl.get("purchase.index.index.orderUnableExecute"));
            return false;
        }

        return true
    };

    onBatchWareEnter = () => {
        if (this.canPerformBatchAction()) {
            this.openModal('stockInPopVisible');
        }
    };

    onBatchInvoice(merge) {
        if (this.canPerformBatchAction()) {
            this.setState({
                mergeInvoice: merge || false,
                invoiceBatchPopVisible: true
            });
        }
    };

    onBatchExpend(merge) {
        if (this.canPerformBatchAction()) {
            this.setState({
                mergePay: merge || false,
                expendBatchPopVisible: true
            });
        }
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

    //选中项批量删除
    batchDelete = () => {
        let _this = this;
        //在线订单为未接受或已接收状态都不能删除
        const cannotFlag = this.state.selectedRows.some(item => {
            return item.interchangeStatus === 1 || item.interchangeStatus === 2
        });
        this.deleteConfirm(this.state.selectedRowKeys, cannotFlag, function() {
            _this.checkRemove();
        },'batch');
    };

    //加载当前物品概要数据
    loadWare = (visible, billNo) => {
        const {purchaseList} = this.props;
        const dataSource = purchaseList.getIn(['data', 'list']);
        const hasCache = dataSource.filter(item => {
            return item.get('billNo') === billNo && item.get('prodAbstractList')
        }).size > 0;
        if (visible && !hasCache) {
            this.props.asyncFetchProdAbstractByBillNo(billNo)
        }
    };

    popModal = (title, content, icon, theme) => {
        Modal.confirm({
            icon: <Icon type={icon} theme={theme || 'filled' } />,
            title: title,
            content: content
        })
    };

    render() {
        const {purchaseList} = this.props;
        let dataSource = purchaseList.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];
        let approveFlag = purchaseList.getIn(['data', 'approveFlag']); //当前账号是否具备审批权
        let approveModuleFlag = purchaseList.getIn(['data', 'approveModuleFlag']); //当前账号是否具备审批功能
        let filterConfigList = purchaseList.getIn(['data', 'filterConfigList']);
        filterConfigList = filterConfigList ? filterConfigList.toJS() : [];
        let tableConfigList = purchaseList.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];
        const pageAmount = purchaseList.getIn(['data', 'pageAmount']);
        const totalAmount = purchaseList.getIn(['data', 'totalAmount']);

        let paginationInfo = purchaseList.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};

        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };
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
                if (item.fieldName === "displayBillNo") {
                    obj.render = (displayBillNo, data) => {
                        return (
                            <React.Fragment>
                                <span className={cx("txt-clip")} title={displayBillNo}>
                                    {/*<Link ga-data="list-billNo" to={`/purchase/show/${data.billNo}`}>{displayBillNo}</Link>*/}
                                    <PageTurnLink data={dataSource} type={"purchase"} linkdata={"billNo"} showdata={"displayBillNo"} current={data}/>
                                </span>
                                {/*<span className={cx("txt-bill-no") + ' txt-clip'} title={displayBillNo}>*/}
                                {/*<Link to={`/purchase/show/${data.billNo}`}>{displayBillNo}</Link>*/}
                                {/*</span>*/}
                            </React.Fragment>
                        )
                    }
                }
                else if (item.fieldName === "interchangeState") {
                    obj.align = "center";
                    obj.render = (interchangeState, data) => (
                        <Tooltip
                            type={"info"}
                            title={
                                data.interchangeStatus == 1 ? intl.get("purchase.index.index.interchangeStatus_notReceive"):
                                    data.interchangeStatus == 2 ? intl.get("purchase.index.index.interchangeStatus_receive") :
                                        data.interchangeStatus == 3 ? intl.get("purchase.index.index.interchangeStatus_cancel"): ''
                            }
                        >
                            {
                                data.interchangeStatus == 1 ?
                                    <Icon type="icon-state-unfinished" className="icon-state-unfinish"/> :
                                    data.interchangeStatus == 2 ?
                                        <Icon type="icon-state-finished" className="icon-state-finished"/> :
                                        data.interchangeStatus == 3 ?
                                            <Icon type="icon-state-finished" className="icon-state-cancel"/> : ''
                            }
                        </Tooltip>
                    )
                }
                else if (item.fieldName === "state") {
                    obj.align = "center";
                    obj.render = (state) => (
                        <Tooltip
                            type={"info"}
                            title={state == 0 ? intl.get("purchase.index.index.inboundStatus_notFinish") : intl.get("purchase.index.index.inboundStatus_finish")}
                        >
                            {
                                state == 0 ? <Icon type="icon-state-unfinished" className="icon-state-unfinish"/> :
                                    <Icon type="icon-state-finished" className="icon-state-finished"/>
                            }
                        </Tooltip>
                    )
                }
                else if (item.fieldName === "invoiceState") {
                    obj.align = "center";
                    obj.render = (invoiceState) => (
                        <Tooltip
                            type={"info"}
                            title={invoiceState == 0 ? intl.get("purchase.index.index.invoiceState_notFinish"): intl.get("purchase.index.index.invoiceState_finish")}
                        >
                            {
                                invoiceState == 0 ?
                                    <Icon type="icon-state-unfinished" className="icon-state-unfinish"/> :
                                    <Icon type="icon-state-finished" className="icon-state-finished"/>
                            }
                        </Tooltip>
                    )
                }
                else if (item.fieldName === "paymentState") {
                    obj.align = "center";
                    obj.render = (paymentState, data) => (
                        <Tooltip
                            type={"info"}
                            title={data.payState == 0 ? intl.get("purchase.index.index.payState_notFinish") : intl.get("purchase.index.index.payState_finish")}
                        >
                            {
                                data.payState == 0 ?
                                    <Icon type="icon-state-unfinished" className="icon-state-unfinish"/> :
                                    <Icon type="icon-state-finished" className="icon-state-finished"/>
                            }
                        </Tooltip>
                    )
                }
                else if (item.fieldName === "approveStatus") {
                    obj.align = "center";
                    obj.render = (approveStatus) => (
                        <span style={{color: APPROVE_COLOR_GROUP[approveStatus].color}}>{APPROVE_COLOR_GROUP[approveStatus].label}</span>
                    )
                }
                else if (item.fieldName === "purchaseOrderDate") {
                    obj.render = (date) => (
                        <span className="txt-clip">
                            {date ? moment(date).format('YYYY-MM-DD') : null}
         			    </span>
                    );
                    /*obj.defaultSortOrder = 'descend';*/
                    obj.sorter = (prev, next) => prev.purchaseOrderDate - next.purchaseOrderDate;
                }
                else if (item.fieldName === "deliveryDeadlineDate") {
                    obj.render = (date) => (
                        <span className="txt-clip">
                            {date ? moment(date).format('YYYY-MM-DD') : null}
         			    </span>
                    );
                    /*obj.defaultSortOrder = 'descend';*/
                    obj.sorter = (prev, next) => prev.deliveryDeadlineDate - next.deliveryDeadlineDate;
                }
                else if (item.fieldName === "aggregateAmount" ) {
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
                    );
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
                }
                else if (item.fieldName === "payAmount") {
                    obj.render = (payAmount, data) => (
                        <Auth
                            module="purchasePrice"
                            option="show"
                        >
                            {
                                (isAuthed) =>
                                    isAuthed ? (
                                        <span className="txt-clip" title={formatCurrency(payAmount)}>
                                            <Link ga-data="list-payAmount"
                                                to={`/purchase/show/${data.billNo}#expendRecord`}>{formatCurrency(payAmount)}</Link>
                                            {/*<Link to={{pathname: "/finance/expend/", search: `?fkBillNo=${data.displayBillNo}`}}>{payAmount}</Link>*/}
                                        </span>
                                    ) : PRICE_NO_AUTH_RENDER
                            }
                        </Auth>
                    );
                    /*obj.defaultSortOrder = 'descend';*/
                    obj.sorter = (prev, next) => prev.payAmount - next.payAmount;
                }
                else if (item.fieldName === "invoiceAmount") {
                    obj.render = (invoiceAmount, data) => (

                        <Auth
                            module="purchasePrice"
                            option="show"
                        >
                            {
                                (isAuthed) =>
                                    isAuthed ? (
                                        <span className="txt-clip" title={formatCurrency(invoiceAmount)}>
                                            <Link ga-data="list-invoiceAmount"
                                                to={`/purchase/show/${data.billNo}#invoiceRecord`}>{formatCurrency(invoiceAmount)}</Link>
                                            {/*<Link to={{pathname: "/finance/invoice/", search: `?fkBillNo=${data.displayBillNo}`}}>{invoiceAmount}</Link>*/}
                                        </span>
                                    ) : PRICE_NO_AUTH_RENDER
                            }
                        </Auth>
                    );
                    /*obj.defaultSortOrder = 'descend';*/
                    obj.sorter = (prev, next) => prev.invoiceAmount - next.invoiceAmount;
                }
                else if (item.fieldName === "deliveryAddress") {
                    obj.render = (deliveryAddress, data) => {
                        const fullAddr = deliveryAddress?data.deliveryProvinceText + data.deliveryCityText + deliveryAddress: null;
                        return (
                            <span className="txt-clip" title={fullAddr}>
                                {fullAddr}
                            </span>
                        )
                    };
                }
                else if (item.fieldName === "contractTerms") {
                    obj.render = (contractTerms) => (
                        <span className="txt-clip" title={contractTerms}>{contractTerms}</span>)
                }
                else if (item.fieldName === "prodAbstract") {
                    obj.render = (prodAbstract, data) => (
                        <Dropdown
                            onVisibleChange={(visible) => this.loadWare(visible, data.billNo)}
                            overlay={() => (
                                <Menu className={cx('abstract-drop-menu')  + ' list-prodAbstract'}>
                                    <Menu.Item>
                                        <Spin
                                            spinning={data.prodAbstractIsFetching}
                                        >
                                            <div className={cx("abstract-drop")}>
                                                <div className={cx("tit")}>{intl.get("purchase.index.index.prod_abstract")}</div>
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
                                <span className={cx("txt-desc-no") + ' txt-clip'}
                                      title={prodAbstract}>{prodAbstract}</span>
                                <DownOutlined className="ml5"/>
                            </span>
                        </Dropdown>
                    )
                }
                else {
                    obj.render = (text) => (<span className="txt-clip" title={text}>{text}</span>)
                }
                tempColumns.push(obj);
            }
        });

        const operationColumn = {
            render: (operation, data) => {
                let deleteApproveDisabled = backDisabledStatus('deleteApproveDisabled', approveModuleFlag, data.approveStatus); // ***
                let tipTitle = intl.get("purchase.index.index.orderUnableExecute");
                let menuStr = (
                    <Menu>
                        <CopyMenu module={"purchase"} to={`/purchase/copy/${data.billNo}`}/>
                        {
                            (data.interchangeStatus === 1 || data.interchangeStatus === 2)?null:(
                                <DeleteMenu module={"purchase"}
                                            disabled={!deleteApproveDisabled}
                                            tipFlag={!deleteApproveDisabled}
                                            tipTitle={tipTitle}
                                            clickHandler={() => this.deleteConfirm([data.billNo], data.interchangeStatus === 1 || data.interchangeStatus === 2)}
                                />
                            )
                        }
                    </Menu>
                );
                return (
                    <Dropdown overlay={menuStr}>
                        <a href="#!">...</a>
                    </Dropdown>
                )
            }
        };


        const filterDataSource = {
            inputComponents: [],
            selectComponents: [],
            datePickerComponents: [],
            customComponents: [],
            intervalComponents: [],
            projectComponents: []
        };
        filterConfigList.forEach((item) => {
            item.visibleFlag && filterDataSource[item.type + "Components"].push(item);
        });

        return (
            <React.Fragment>
                <div className="content-hd">
                    <Crumb data={[
                        {
                            url: '/purchase/',
                            title: intl.get("purchase.index.index.purchase")
                        },
                        {
                            title: intl.get("purchase.index.index.purchase_list")
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <TableFieldConfigMenu filterList={filterConfigList} tableList={tableConfigList}
                                              onTableConfigChange={this.onTableConfigChange}
                                              onFilterConfigChange={this.onFilterConfigChange}
                                              batchUpdateConfig={this.batchUpdateConfig}
                                              refresh={this.refresh}
                                              type={'purchase'}
                        />
                    </div>
                </div>

                <div className="content-index-bd">
                    <div className="list-ope-wrap">
                        <ListOpeBar
                            visible={this.state.listToolBarVisible}
                            filterToolBarVisible={this.state.filterToolBarVisible}
                            addUrl="/purchase/add"
                            authModule={"purchase"}
                            onFilter={this.filterListData}
                            importModule={
                                {
                                    type:"purchase",
                                    text: intl.get("purchase.index.index.import"),
                                    module: "purchase",
                                    customStep2Text: intl.get("purchase.index.index.customStep2Text")
                                }
                            }
                            onSearch={this.onSearch}
                            defaultValue={this.state.condition.key}
                            searchTipsUrl={`/purchases/search/tips`}
                            searchPlaceHolder={intl.get("purchase.index.index.searchPlaceHolder")}
                            refresh={this.refresh}
                        />
                        <CheckResult
                            module={"purchase"}
                            visible={this.state.checkResultVisible}
                            onRemove={this.checkRemove}
                            onWareEnter={this.onBatchWareEnter}
                            onInvoice={this.onBatchInvoice.bind(this, false)}
                            onMergeInvoice={this.onBatchInvoice.bind(this, true)}
                            onExpend={this.onBatchExpend.bind(this, false)}
                            onMergeExpend={this.onBatchExpend.bind(this, true)}
                            onSubmitApprove={this.onSubmitApprove.bind(this)}
                            onBatchApprove={() => this.onBatchApprove(0)}
                            onBatchUnApprove={() => this.onBatchApprove(1)}
                            selectedRowKeys={this.state.selectedRowKeys}
                            selectedRows={this.state.selectedRows}
                            approveModuleFlag={approveModuleFlag}
                            approveFlag={approveFlag}
                            onDelete={this.batchDelete}
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
                                loading={this.props.purchaseList.get('isFetching')}
                                getRef={this.getRef}
                            />
                            <FooterFixedBar className="list-footer cf">
                                <Amount module="purchasePrice" pageAmount={pageAmount} totalAmount={totalAmount}/>
                                <Pagination {...paginationInfo}
                                            onChange={this.onPageInputChange}
                                            onShowSizeChange={this.onShowSizeChange}
                                />
                            </FooterFixedBar>
                        </div>
                    </div>
                    {
                        this.state.stockInPopVisible && <WareEnterBatchEdit
                            visible={this.state.stockInPopVisible}
                            popTitle={intl.get("purchase.index.index.inbound")}
                            billIds={this.state.selectedRows.map(item => item.billNo)}
                            onOk={() => {
                                this.closeModal('stockInPopVisible');
                                this.refresh();
                            }}
                            onCancel={() => this.closeModal('stockInPopVisible')}
                            onHasUnbindProd={this.onHasUnbindProd}
                        />
                    }

                    {
                        this.state.expendBatchPopVisible && <FinanceExpendBatchEdit
                            visible={this.state.expendBatchPopVisible}
                            popTitle={
                                <BatchPopTitle title={this.state.mergePay ? intl.get("purchase.index.index.mergePayTitle") : intl.get("purchase.index.index.payTitle")}
                                               infoTip={this.state.mergePay ? intl.get("purchase.index.index.mergePayContent") : intl.get("purchase.index.index.payContent")}/>
                            }
                            popType={this.state.mergePay ? 'merge' : ''}
                            billIds={this.state.selectedRows.map(item => item.billNo)}
                            onOk={() => {
                                this.closeModal('expendBatchPopVisible');
                                this.refresh();
                            }}
                            onCancel={() => this.closeModal('expendBatchPopVisible')}
                        />
                    }

                    {
                        this.state.invoiceBatchPopVisible && <FinanceInvoiceBatchEdit
                            visible={this.state.invoiceBatchPopVisible}
                            popTitle={
                                <BatchPopTitle title={this.state.mergeInvoice ? intl.get("purchase.index.index.mergeInvoiceTitle") : intl.get("purchase.index.index.invoiceTitle")}
                                               infoTip={this.state.mergeInvoice ? intl.get("purchase.index.index.mergeInvoiceContent") : intl.get("purchase.index.index.invoiceContent")}/>
                            }
                            popType={this.state.mergeInvoice ? 'merge' : ''}
                            billIds={this.state.selectedRows.map(item => item.billNo)}
                            visibleFlag={'invoiceBatchPopVisible'}
                            onOk={() => {
                                this.closeModal('invoiceBatchPopVisible');
                                this.refresh();
                            }}
                            onCancel={() => this.closeModal('invoiceBatchPopVisible')}
                        />
                    }

                </div>

                <SelectApproveItem
                    onClose={() => this.closeModal('selectApprove')}
                    onOk={(id)=>{this.batchApproveOnOkModal(id)}}
                    show={this.state.selectApprove}
                    type={BACKEND_TYPES[DEFAULT_TITLE]}
                />
            </React.Fragment>
        )
    }
}


