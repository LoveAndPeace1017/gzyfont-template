import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {
    Modal, Menu, Dropdown, message, Spin,
} from 'antd';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");

import {Link} from 'react-router-dom';

import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import Tooltip from 'components/widgets/tooltip';
import Icon from 'components/widgets/icon';
import BatchPopTitle from 'components/business/batchPopTitle';
import FooterFixedBar from  'components/layout/footerFixedBar';
import {APPROVE_COLOR_GROUP, backDisabledStatus} from 'components/business/approve';
import {formatCurrency} from 'utils/format';
import {Auth} from 'utils/authComponent';
import {PRICE_NO_AUTH_RENDER} from 'utils/constants';
import {getUrlParamValue} from 'utils/urlParam';
import {getCookie} from 'utils/cookie';
import {
    DownOutlined
} from '@ant-design/icons';
import {
    asyncFetchQuotationList,
    asyncDeleteQuotationInfo,
    asyncUpdateConfig,
    asyncBatchUpdateConfig,
    asyncFetchProdAbstractByBillNo,
    dealFilterConfigList,
    asyncBeforeDeleteQuotationInfo
} from '../actions'

import {actions as operActions} from 'components/business/operateOrder';
import {actions as commonActions} from "components/business/commonRequest";

import {
    WareOutBatchEdit,
    FinanceSaleInvoiceBatchEdit,
    FinanceIncomeBatchEdit
} from 'components/business/batchEditPop';


import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import FilterToolBar from 'components/business/filterToolBar';
import TableFieldConfigMenu from 'components/business/tableFieldConfigMenu';
import ListOpeBar from 'components/business/listOpeBar';
import CheckResult from 'components/business/checkResult';
import Crumb from 'components/business/crumb';
import PageTurnLink from 'components/business/pageTurnLink';
import SaleOrderOperate from 'components/business/operateOrder';
import {parse} from "url";
import {CopyMenu, ModifyMenu, DeleteMenu} from "components/business/authMenu";
import Pagination from 'components/widgets/pagination';
import ListTable from 'components/business/listTable';
import {Amount} from 'components/business/amount';
import ListPage from  'components/layout/listPage'

const cx = classNames.bind(styles);
let initParams = {
    condition: {},
    selectedRowKeys: [],
    selectedRow: [],
    filterToolBarVisible: false,
    checkResultVisible: false
};
const DEFAULT_TITLE = 'sale';

export class Index extends ListPage {
    constructor(props) {
        super(props);
        let params = this.doInitParams(props.initListCondition, initParams, DEFAULT_TITLE);
        if(getUrlParamValue("dateType")) params.condition.key="";
        console.log(params, 'params');
        this.state = {
            ...params,
            listToolBarVisible: true,
            operateModalVisiable: false,
            wareOutPopVisible: false,
            saleInvoicePopVisible: false,
            incomePopVisible: false,
            mergeIncome: false,
            mergeSaleInvoice: false,
            operateType: '', //'cancel' or 'accept',
            billNo: '',
            customerName: '',
        };
    }

    fetchListData = (params,callback)=>{
        const {saleList} = this.props;
        let tags = saleList.getIn(['data', 'tags']);
        params = this.dealCustomField(params,tags && tags.toJS());
        this.props.asyncFetchQuotationList(params, callback);
    };



    componentDidMount() {
        /*saleDateStart: "2020-10-14",
        saleDateEnd: "2020-10-14"*/
        let {condition} = this.state;
        let dateType = getUrlParamValue("dateType");
        dateType && dateType == "0" && (condition={},condition.saleDateStart = moment().format("YYYY-MM-DD"),condition.saleDateEnd = moment().format("YYYY-MM-DD"),condition.approveStatus = "1");
        dateType && dateType == "1" && (condition={},condition.saleDateStart = moment().startOf('month').format("YYYY-MM-DD"),condition.saleDateEnd = moment().endOf('month').format("YYYY-MM-DD"),condition.approveStatus = "1");

        // 首页审批模块点击进入 ***
        let approveStatus = getUrlParamValue("approveStatus");
        let approvePerson = getUrlParamValue("approvePerson");
        if(approveStatus) condition.approveStatus = approveStatus;
        if(approvePerson) condition.approvePerson = approvePerson;

        //初始化列表数据
        this.fetchListData(condition,(data) => {
            let filterConfigList = this.initFetchListCallback(data.filterConfigList, condition);
            this.props.dealFilterConfigList(filterConfigList);
            this.setState({condition});
        });
    }

    componentWillUnmount() {
        let params = {};
        for(let key in initParams){
            params[key] = this.state[key];
        }
        this.props.asyncFetchInitListCondition({TITLE: DEFAULT_TITLE, ...params});
    }

    onHasUnbindProd = (billList) => {
        this.closeModal('wareOutPopVisible');
        let _self = this;
        Modal.confirm({
            title: intl.get("sale.index.index.warningTip"),
            okText: intl.get("sale.index.index.okText"),
            cancelText: intl.get("sale.index.index.cancelText"),
            content: (
                <React.Fragment>
                    <div>
                        <strong>{intl.get("sale.index.index.bindProdConfirmContent_1")}</strong>
                    </div>
                    <p style={{marginTop: '20px', textSize: '10px'}}>
                        {intl.get("sale.index.index.bindProdConfirmContent_2")}
                    </p>
                </React.Fragment>),
            onOk() {
                return new Promise((resolve, reject) => {
                    _self.props.asyncConvertToLocalProd('sale', billList, res => {
                        resolve();
                        if (res && res.retCode == 0) {
                            _self.openModal('wareOutPopVisible');
                            _self.refresh();
                        } else {
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
            message.info(intl.get("sale.index.index.orderOverLimitTip"));
            return false;
        }
        if (this.state.selectedRows.some(item => item.interchangeStatus === 1 || item.interchangeStatus === 3)) {
            message.info(intl.get("sale.index.index.orderUnableExecute"));
            return false;
        }
        return true
    };

    onBatchWareOut = () => {
        if (this.canPerformBatchAction()) {
            this.openModal('wareOutPopVisible');
        }
    };

    onBatchInvoice = (merge) => {
        if (this.canPerformBatchAction()) {
            let currencyList =  this.state.selectedRows.filter(item => !item.currencyFlag);
            if(currencyList.length > 0){
                message.info('存在外币单据无法开票');
                return false;
            }
            this.setState({
                mergeSaleInvoice: merge || false,
                saleInvoicePopVisible: true
            });
            this.openModal('saleInvoicePopVisible');
        }
    };

    onBatchIncome = (merge) => {
        if (this.canPerformBatchAction()) {
            if(merge){ // 勾选销售订单币种不同，无法合并收款
                let isSameCurrencyFlag = true;
                let currentCurrencyName = this.state.selectedRows[0].currencyName;
                for(let i=1; i<this.state.selectedRows.length; i++){
                    if(this.state.selectedRows[i].currencyName != currentCurrencyName){
                        isSameCurrencyFlag = false;
                        break;
                    }
                }
                if(!isSameCurrencyFlag){
                    message.info('勾选销售订单币种不同，无法合并收款');
                    return false;
                }
            }
            this.setState({
                mergeIncome: merge || false,
                incomePopVisible: true
            });
        }
    };


    batchUpdateConfig = (callback)=>{
        const {saleList} = this.props;
        let filterConfigList = saleList.getIn(['data', 'filterConfigList']);
        filterConfigList = filterConfigList ? filterConfigList.toJS() : [];
        let tableConfigList = saleList.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];
        let cannotEditFilterColumnsMap = {
            'saleDate':1
        };
        let moduleType = {
            search:'quotation_search_list',
            table:'quotation_list'
        };
        this.batchUpdateConfigSuper(filterConfigList,tableConfigList,cannotEditFilterColumnsMap, moduleType,callback);
    };

    deleteConfirm = (ids, cannotDelete, callback,source) => {
        let _this = this;
        let prefix = source||'list';
        if (cannotDelete) {
            Modal.warning({
                title: intl.get("sale.index.index.warningTip"),
                content: intl.get("sale.index.index.deleteWarningContent")
            });
            return false;
        }
       /* _this.props.asyncBeforeDeleteQuotationInfo(ids, (res)=>{*/
            Modal.confirm({
                title: intl.get("sale.index.index.warningTip"),
                content: "删除后将无法恢复，确定删除吗？",
                okButtonProps:{
                    'ga-data':prefix + '-delete-ok'
                },
                cancelButtonProps:{
                    'ga-data':prefix + '-delete-cancel'
                },
                onOk() {
                    _this.props.asyncDeleteQuotationInfo(ids, function(res) {
                        if (res.retCode === '0') {
                            message.success(intl.get("sale.index.index.deleteSuccessMessage"));
                            _this.props.asyncFetchQuotationList(_this.state.condition, () => _this.checkRemove());
                            if (callback) {
                                callback();
                            }
                        }
                        else {
                            message.error(res.retMsg);
                        }
                    });
                }
            });


       /* });*/

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

    acceptOrder = (billNo, customerName) => {
        this.setState({
            billNo,
            customerName,
            operateType: 'accept',
            operateModalVisiable: true
        })
    };

    cancelOrder = (billNo) => {
        this.setState({
            billNo,
            operateType: 'cancel',
            operateModalVisiable: true
        })
    };

    // 取消订单成功后取消刷新页面
    orderOpCallback = (result) => {
        if (result) {
            this.props.asyncFetchQuotationList(this.state.condition, () => this.checkRemove());
        }
    };

    //加载当前物品概要数据
    loadWare = (visible, billNo) => {
        const {saleList} = this.props;
        const dataSource = saleList.getIn(['data', 'list']);
        const hasCache = dataSource.filter(item => {
            return item.get('billNo') === billNo && item.get('prodAbstractList')
        }).size > 0;
        if (visible && !hasCache) {
            this.props.asyncFetchProdAbstractByBillNo(billNo)
        }
    };

    render() {
        let currencyVipFlag = getCookie("currencyVipFlag");
        const {saleList} = this.props;
        let dataSource = saleList.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];
        let approveFlag = saleList.getIn(['data', 'approveFlag']); //当前账号是否具备审批权
        let approveModuleFlag = saleList.getIn(['data', 'approveModuleFlag']); //当前账号是否具备审批功能
        let filterConfigList = saleList.getIn(['data', 'filterConfigList']);
        filterConfigList = filterConfigList ? filterConfigList.toJS() : [];
        let tableConfigList = saleList.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];
        const pageAmount = saleList.getIn(['data', 'pageCurrencyAmount']);
        const totalAmount = saleList.getIn(['data', 'totalCurrencyAmount']);

        let paginationInfo = saleList.getIn(['data', 'pagination']);
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
                                    <PageTurnLink data={dataSource} type={"quotation"} linkdata={"billNo"} showdata={"displayBillNo"} current={data}/>
                                </span>
                            </React.Fragment>
                        )
                    }
                }else if (item.fieldName === "interchangeState") {
                    obj.align = "center";
                    obj.render = (interchangeState, data) => (
                         <Tooltip
                             type={"info"}
                             title={
                                 data.interchangeStatus == 1 ? intl.get("sale.index.index.interchangeStatus_notReceive") :
                                     data.interchangeStatus == 2 ? intl.get("sale.index.index.interchangeStatus_receive") :
                                         data.interchangeStatus == 3 ? intl.get("sale.index.index.interchangeStatus_cancel") : ''
                             }
                         >
                             {
                                 data.interchangeStatus == 1 ? <Icon type="icon-state-unfinished"  className="icon-state-unfinish"/> :
                                     data.interchangeStatus == 2 ? <Icon type="icon-state-finished"  className="icon-state-finished"/> :
                                         data.interchangeStatus == 3 ? <Icon type="icon-state-finished" className="icon-state-cancel"/> : ''
                             }
                         </Tooltip>
                    )
                } else if (item.fieldName === "state") {
                    obj.align = "center";
                    obj.render = (state) => (
                        <Tooltip
                            type={"info"}
                            title={state == 0 ? intl.get("sale.index.index.outboundStatus_notFinish"): intl.get("sale.index.index.outboundStatus_finish")}
                        >
                            {
                                state == 0 ?  <Icon type="icon-state-unfinished"  className="icon-state-unfinish"/> :
                                    <Icon type="icon-state-finished"  className="icon-state-finished"/>
                            }
                        </Tooltip>
                    )
                } else if (item.fieldName === "invoiceState") {
                    obj.align = "center";
                    obj.render = (invoiceState) => (
                        <Tooltip
                            type={"info"}
                            title={invoiceState == 0 ? intl.get("sale.show.index.invoiceState_notFinish"): intl.get("sale.show.index.invoiceState_finish")}
                        >
                            {
                                invoiceState == 0 ?  <Icon type="icon-state-unfinished"  className="icon-state-unfinish"/> :
                                    <Icon type="icon-state-finished"  className="icon-state-finished"/>
                            }
                        </Tooltip>
                    )
                } else if ( item.fieldName ==="paymentState") {
                    obj.align = "center";
                    obj.render = (paymentState, data) => (
                        <Tooltip
                            type={"info"}
                            title={data.payState == 0 ? intl.get("sale.show.index.payState_notFinish") : intl.get("sale.show.index.payState_finish")}
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
                } else if (item.fieldName === "quotationDate" ) {
                    obj.render = (date) => (
                        <span className="txt-clip">
                            {date ? moment(date).format('YYYY-MM-DD') : null}
         			    </span>
                    );
                    /*obj.defaultSortOrder = 'descend';*/
                    obj.sorter = (prev, next) => prev.quotationDate - next.quotationDate;

                }else if (item.fieldName === "expiredDate" ) {
                    obj.render = (date) => (
                        <span className="txt-clip">
                            {date ? moment(date).format('YYYY-MM-DD') : null}
         			    </span>
                    );
                    /*obj.defaultSortOrder = 'descend';*/
                    obj.sorter = (prev, next) => prev.expiredDate - next.expiredDate;

                }else if (item.fieldName === "deliveryDeadlineDate") {
                    obj.render = (date) => (
                        <span className="txt-clip">
                            {date ? moment(date).format('YYYY-MM-DD') : null}
         			    </span>
                    );
                    /*obj.defaultSortOrder = 'descend';*/
                    obj.sorter = (prev, next) => prev.deliveryDeadlineDate - next.deliveryDeadlineDate;

                }else if (item.fieldName === "aggregateAmount" || item.fieldName === "currencyAggregateAmount") {
                    obj.render = (text) => (
                        <Auth
                            module="salePrice"
                            option="show"
                        >
                            {
                                (isAuthed) =>
                                    isAuthed ? (
                                        <span className="txt-clip" title={formatCurrency(text)}>
                                            <strong>{formatCurrency(text)}</strong>
                                        </span>
                                    ) : PRICE_NO_AUTH_RENDER
                            }
                        </Auth>

                    );
                    /*obj.defaultSortOrder = 'descend';*/
                    obj.sorter = (prev, next) => prev.aggregateAmount - next.aggregateAmount;

                } else if (item.fieldName === "taxAllAmount" ) {
                    obj.render = (taxAllAmount) => (
                        <Auth
                            module="salePrice"
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
                } else if (item.fieldName === "discountAmount" ) {
                    obj.render = (discountAmount) => (
                        <Auth
                            module="salePrice"
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
                } else if (item.fieldName === "payAmount") {
                    obj.render = (payAmount, data) => (
                        <Auth
                            module="salePrice"
                            option="show"
                        >
                            {
                                (isAuthed) =>
                                    isAuthed ? (
                                        <span className="txt-clip" title={formatCurrency(payAmount)}>
                                            <Link ga-data={'list-income'} to={`/sale/show/${data.billNo}#incomeRecord`}>{formatCurrency(payAmount)}</Link>
                                                            {/*<Link to={{*/}
                                                            {/*    pathname: "/finance/income/",*/}
                                                            {/*    search: `?fkBillNo=${data.displayBillNo}`*/}
                                                            {/*}}>{payAmount}</Link>*/}
                                        </span>
                                    ) : PRICE_NO_AUTH_RENDER
                            }
                        </Auth>

                    );
                    /*obj.defaultSortOrder = 'descend';*/
                    obj.sorter = (prev, next) => prev.payAmount - next.payAmount;

                }else if (item.fieldName === "invoiceAmount") {
                    obj.render = (invoiceAmount, data) => (
                        <Auth
                            module="salePrice"
                            option="show"
                        >
                            {
                                (isAuthed) =>
                                    isAuthed ? (
                                        <span className="txt-clip" title={formatCurrency(invoiceAmount)}>
                                            <Link ga-data={'list-saleInvoice'} to={`/sale/show/${data.billNo}#saleInvoiceRecord`}>{formatCurrency(invoiceAmount)}</Link>
                                                            {/*<Link to={{*/}
                                                            {/*    pathname: "/finance/saleInvoice/",*/}
                                                            {/*    search: `?fkBillNo=${data.displayBillNo}`*/}
                                                            {/*}}>{invoiceAmount}</Link>*/}
                                        </span>
                                    ) : PRICE_NO_AUTH_RENDER
                            }
                        </Auth>

                    );
                    /*obj.defaultSortOrder = 'descend';*/
                    obj.sorter = (prev, next) => prev.invoiceAmount - next.invoiceAmount;

                }else if (item.fieldName === "deliveryAddress") {
                    obj.render = (deliveryAddress, data) => {
                        const fullAddr = data.deliveryAddress?
                            data.deliveryProvinceText + data.deliveryCityText + deliveryAddress:'';
                        return (
                            <span className="txt-clip" title={fullAddr}>
                                {fullAddr}
                            </span>
                        )
                    };
                }else if (item.fieldName === "remarks") {
                    obj.render = (remarks) => (<span className="txt-clip" title={remarks}>{remarks}</span>)
                }else if (item.fieldName === "prodAbstract") {
                    obj.render = (prodAbstract, data) => (
                        <Dropdown className={'list-sale-prodAbstract'}
                            onVisibleChange={(visible) => this.loadWare(visible, data.billNo)}
                            overlay={() => (
                                <Menu className={cx('abstract-drop-menu') + ' list-prodAbstract'}>
                                    <Menu.Item>
                                        <Spin
                                            spinning={data.prodAbstractIsFetching}
                                        >
                                            <div className={cx("abstract-drop")}>
                                                <div className={cx("tit")}>{intl.get("sale.index.index.prod_abstract")}</div>
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
                                <DownOutlined className="ml5"/>
                            </span>
                        </Dropdown>
                    )
                } else{
                    obj.render = (text) => (<span className="txt-clip" title={text}>{text}</span>)
                }
                tempColumns.push(obj);
            }
        });

        const operationColumn = {
            render: (operation, data) => {
                let menuStr = '';
                let deleteApproveDisabled = backDisabledStatus('deleteApproveDisabled', approveModuleFlag, data.approveStatus);
                let modifyApproveDisabled = backDisabledStatus('modifyApproveDisabled', approveModuleFlag, data.approveStatus);
                let tipTitle = intl.get("sale.index.index.orderUnableExecute");
                if (data.interchangeStatus === 1) {
                    menuStr = (
                        <Menu>
                            <Menu.Item>
                                <a href="#!" onClick={() => this.acceptOrder(data.billNo, data.customerName)}>{intl.get("sale.index.index.receiveOrder")}</a>
                            </Menu.Item>
                            <Menu.Item>
                                <a href="#!" onClick={() => this.cancelOrder(data.billNo)}>{intl.get("sale.index.index.cancelOrder")}</a>
                            </Menu.Item>
                        </Menu>
                    )
                }
                else if (data.interchangeStatus === 2) {
                    menuStr = (
                        <Menu>
                            <Menu.Item>
                                <a href="#!" onClick={() => this.cancelOrder(data.billNo)}>{intl.get("sale.index.index.cancelOrder")}</a>
                            </Menu.Item>
                        </Menu>
                    )
                }
                else if (data.interchangeStatus === 3) {
                    menuStr = (
                        <Menu>
                            <Menu.Item>
                                <a href="#!"
                                   onClick={() => this.deleteConfirm([data.billNo], false)}>{intl.get("sale.index.index.delete")}</a>
                            </Menu.Item>
                        </Menu>
                    )
                }
                else {
                    menuStr = (
                        <Menu>
                            <ModifyMenu disabled={!modifyApproveDisabled}
                                        tipFlag={!modifyApproveDisabled}
                                        tipTitle={tipTitle}
                                        module={"quotation"}
                                        to={`/quotation/modify/${data.billNo}`} />
                            <CopyMenu module={"quotation"} to={`/quotation/copy/${data.billNo}`} />
                            <DeleteMenu  disabled={!deleteApproveDisabled}
                                         tipFlag={!deleteApproveDisabled}
                                         tipTitle={tipTitle}
                                         module={"quotation"}
                                         clickHandler={() => this.deleteConfirm([data.billNo])}
                            />
                        </Menu>
                    )
                }
                return (
                    <Dropdown overlay={menuStr}>
                        <a href="#!">...</a>
                    </Dropdown>
                )
            }
        };

        const filterDataSource = {
            selectComponents: [],
            datePickerComponents: [],
            customComponents: [],
            depEmployeeComponents: [],
            settlementComponents: [],
            intervalComponents: [],
            inputComponents: [],
            currencyComponents: [],
            numberPickerComponents: []
        };
        filterConfigList.forEach((item) => {
            item.visibleFlag && filterDataSource[item.type + "Components"].push(item);
        });

        return (
            <React.Fragment>
                <div className="content-hd">
                    <Crumb data={[
                        {
                            url: '/quotation/',
                            title: "报价单"
                        },
                        {
                            title: "报价单列表"
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <TableFieldConfigMenu filterList={filterConfigList} tableList={tableConfigList}
                                              onTableConfigChange={this.onTableConfigChange}
                                              onFilterConfigChange={this.onFilterConfigChange}
                                              batchUpdateConfig={this.batchUpdateConfig}
                                              refresh={this.refresh}
                                              type={'quotation'}
                        />
                    </div>
                </div>

                <div className="content-index-bd">
                    <div className="list-ope-wrap">
                        <ListOpeBar
                            visible={this.state.listToolBarVisible}
                            filterToolBarVisible={this.state.filterToolBarVisible}
                            addUrl="/quotation/add"
                            authModule={"quotation"}
                            onFilter={this.filterListData}
                            importModule={
                                {
                                    type: "quotation",
                                    text: "导入",
                                    module: "quotation",
                                    // customStep2Text: intl.get("sale.index.index.customStep2Text")
                                }
                            }
                            onSearch={this.onSearch}
                            defaultValue={this.state.condition.key}
                            searchTipsUrl={`/quotationorders/search/tips`}
                            searchPlaceHolder={"报价单号/客户/联系人/物品"}
                            refresh={this.refresh}
                        />
                        <CheckResult
                            module={"quotation"}
                            visible={this.state.checkResultVisible}
                            onRemove={this.checkRemove}
                           /* onWareOut={this.onBatchWareOut}
                            onIncome={this.onBatchIncome.bind(this, false)}
                            onMergeIncome={this.onBatchIncome.bind(this, true)}
                            onSaleInvoice={this.onBatchInvoice.bind(this, false)}
                            onMergeSaleInvoice={this.onBatchInvoice.bind(this, true)}*/
                            selectedRowKeys={this.state.selectedRowKeys}
                            selectedRows={this.state.selectedRows}
                            approveModuleFlag={approveModuleFlag}
                            approveFlag={approveFlag}
                            onDelete={this.batchDelete}
                        />
                        <FilterToolBar dataSource={filterDataSource}
                                       doFilter={this.doFilter}
                                       style={{display: this.state.filterToolBarVisible ? 'block' : 'none'}}
                                       ref={(child) => { this.filterToolBarHanler = child; }}
                        />
                    </div>
                    <div className={"data-wrap cf"}>
                        <div className={"tb-wrap"}>
                            <ListTable
                                columns={tempColumns}
                                operationColumn={operationColumn}
                                dataSource={dataSource}
                                rowSelection={rowSelection}
                                loading={this.props.saleList.get('isFetching')}
                                getRef={this.getRef}
                            />
                            <FooterFixedBar className="list-footer cf">
                                <Amount module="salePrice" pageAmount={pageAmount} totalAmount={totalAmount}/>
                                <Pagination {...paginationInfo}
                                            onChange={this.onPageInputChange}
                                            onShowSizeChange={this.onShowSizeChange}
                                />
                            </FooterFixedBar>
                        </div>
                    </div>

                </div>

                <SaleOrderOperate visible={this.state.operateModalVisiable}
                                  visibleFlag={'operateModalVisiable'}
                                  operateCallback={this.orderOpCallback}
                                  billNo={this.state.billNo}
                                  customerName={this.state.customerName}
                                  closeModal={this.closeModal}
                                  popType={this.state.operateType}
                />

                {
                    this.state.wareOutPopVisible && <WareOutBatchEdit
                        visible={this.state.wareOutPopVisible}
                        currencyVipFlag={currencyVipFlag}
                        popTitle={'出库'}
                        billIds={this.state.selectedRows.map(item => item.billNo)}
                        onOk={() => {
                            this.closeModal('wareOutPopVisible');
                            this.refresh();
                        }}
                        onCancel={() => this.closeModal('wareOutPopVisible')}
                        onHasUnbindProd={this.onHasUnbindProd}
                    />
                }
                {
                    this.state.saleInvoicePopVisible && <FinanceSaleInvoiceBatchEdit
                        visible={this.state.saleInvoicePopVisible}
                        popTitle={<BatchPopTitle title={this.state.mergeSaleInvoice ? intl.get("sale.index.index.mergeSaleInvoiceTitle"): intl.get("sale.index.index.saleInvoiceTitle")}
                                                 infoTip={this.state.mergeSaleInvoice ? intl.get("sale.index.index.mergeSaleInvoiceContent"): intl.get("sale.index.index.saleInvoiceContent")}/>}
                        popType={this.state.mergeSaleInvoice ? 'merge' : ''}
                        billIds={this.state.selectedRows.map(item => item.billNo)}
                        onOk={() => {
                            this.closeModal('saleInvoicePopVisible');
                            this.refresh();
                        }}
                        onCancel={() => this.closeModal('saleInvoicePopVisible')}
                    />
                }

                {
                    this.state.incomePopVisible && <FinanceIncomeBatchEdit
                        visible={this.state.incomePopVisible}
                        currencyVipFlag={currencyVipFlag}
                        popType={this.state.mergeIncome ? 'merge' : ''}
                        popTitle={<BatchPopTitle title={this.state.mergeIncome ? intl.get("sale.index.index.mergeIncomeTitle") : "收款"}
                                                 infoTip={this.state.mergeIncome ? "同一个客户的销售订单可以合并生成同一条收款记录" : intl.get("sale.index.index.incomeContent")}/>}
                        billIds={this.state.selectedRows.map(item => item.billNo)}
                        onOk={() => {
                            this.closeModal('incomePopVisible');
                            this.refresh();
                        }}
                        onCancel={() => this.closeModal('incomePopVisible')}
                    />
                }

            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    saleList: state.getIn(['quotationIndex', 'quotationList']),
    initListCondition: state.getIn(['commonInfo', 'initListCondition'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchQuotationList,
        asyncDeleteQuotationInfo,
        asyncUpdateConfig,
        asyncBatchUpdateConfig,
        asyncFetchProdAbstractByBillNo,
        asyncBeforeDeleteQuotationInfo,
        dealFilterConfigList,
        asyncConvertToLocalProd: operActions.asyncConvertToLocalProd,
        asyncFetchInitListCondition: commonActions.asyncFetchInitListCondition,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)