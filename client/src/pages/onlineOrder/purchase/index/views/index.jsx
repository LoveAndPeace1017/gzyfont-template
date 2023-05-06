import React, {Component} from 'react';
import {
    Modal, Table, Input, Menu, Dropdown, message, Spin, Select, Layout
} from 'antd';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import Tooltip from 'components/widgets/tooltip';
import {PRICE_NO_AUTH_RENDER} from 'utils/constants';
import {Link} from 'react-router-dom';
import FooterFixedBar from  'components/layout/footerFixedBar'

import styles from '../styles/index.scss';
import classNames from "classnames/bind";


import {
    asyncFetchPurchaseList,
    asyncTogglePurchaseInfo,
    asyncDeletePurchaseInfo,
    asyncUpdateConfig,
    asyncBatchUpdateConfig,
    asyncFetchProdAbstractByBillNo
} from 'pages/purchase/index/actions';

import {
    WareEnterBatchEdit,
    FinanceExpendBatchEdit,
    FinanceInvoiceBatchEdit
} from 'components/business/batchEditPop';

import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import Icon from 'components/widgets/icon';
import FilterToolBar from 'components/business/filterToolBar';
import BatchPopTitle from 'components/business/batchPopTitle';
import TableFieldConfigMenu from 'components/business/tableFieldConfigMenu';
import ListOpeBar from 'components/business/listOpeBar';
import CheckResult from 'components/business/checkResult';
import Crumb from 'components/business/crumb';
import {parse} from "url";
import {CopyMenu, ModifyMenu, DeleteMenu} from "components/business/authMenu";
import Pagination from 'components/widgets/pagination';
import ListTable from 'components/business/listTable';
import {Amount} from 'components/business/amount';
import {actions as operActions} from 'components/business/operateOrder';
import LimitOnlineTip from 'components/business/limitOnlineTip';
import {formatCurrency} from 'utils/format';
import {Auth} from 'utils/authComponent';
import ListPage from  'components/layout/listPage'

const cx = classNames.bind(styles);

export class Index extends ListPage {

    constructor(props) {
        super(props);
        const searchQuery = parse(props.location.search, true);
        this.state = {
            selectedRowKeys: [], // Check here to configure the default column
            selectedRow: [],
            listToolBarVisible: true,
            filterToolBarVisible: false,
            checkResultVisible: false,
            stockInPopVisible: false,
            expendBatchPopVisible: false,
            invoiceBatchPopVisible: false,
            mergeInvoice: false,
            mergePay: false,
            mergeExpend: false,
            condition: {
                key: searchQuery.query.key || '',
                source:'mall',
            },
            showTip: false,
        };
    }

    fetchListData = (params,callback)=>{
        this.props.asyncFetchPurchaseList(params, callback);
    };

    componentDidMount() {
        //初始化列表数据
        this.fetchListData(this.state.condition);
    }


    onSearch = (value) => {
        this.doFilter({key: value,source:'mall'}, true);
        this.filterToolBarHanler.reset();
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
        this.batchUpdateConfig(() => {
            this.props.asyncFetchPurchaseList(params);
        });

    };
    batchUpdateConfig = (callback) => {
        const {purchaseList} = this.props;
        let filterConfigList = purchaseList.getIn(['data', 'filterConfigList']);
        filterConfigList = filterConfigList ? filterConfigList.toJS() : [];
        let tableConfigList = purchaseList.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];
        let cannotEditFilterColumnsMap = {
            'purchaseOrderDate':1,
        };
        let moduleType = {
            search:'mall_purchase_search_list',
            table:'mall_purchase_list'
        };
        this.batchUpdateConfigSuper(filterConfigList,tableConfigList,cannotEditFilterColumnsMap, moduleType,callback);
    };

    deleteConfirm = (ids, cannotDelete, callback, source) => {
        let _this = this;
        let prefix = source||'list';
        if (cannotDelete) {
            Modal.warning({
                title: '提示信息',
                content: '待接收/已接收状态的订单无法删除，请取消后再操作。',
            });
            return false;
        }
        Modal.confirm({
            title: '提示信息',
            content: '删除单据后将无法恢复，确定删除吗？',
            okButtonProps:{
                'ga-data':prefix +'-delete-ok'
            },
            cancelButtonProps:{
                'ga-data':prefix +'-delete-cancel'
            },
            onOk() {
                _this.props.asyncDeletePurchaseInfo(ids, function(res) {
                    if (res.retCode === '0') {
                        message.success('删除成功!');
                        _this.props.asyncFetchPurchaseList(_this.state.condition);
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
    };


    onHasUnbindProd = (billList) => {
        this.closeModal('stockInPopVisible');
        let _self = this;
        Modal.confirm({
            title: '提示信息',
            okText: '确定',
            cancelText: '取消',
            content: (
                <React.Fragment>
                    <div>
                        <strong>您当前的订单中存在未绑定物品，是否确定将未绑定物品一键变成我的物品并进行入库操作？</strong>
                    </div>
                    <p style={{marginTop: '20px', textSize: '10px'}}>
                        您也可以在订单详情页列表进行手动绑定，全部绑定后即可入库
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
                            if(res.retCode == undefined && res.status === false){
                                _self.setState({showTip:true})
                            } else {
                                message.error(res && res.retMsg);
                            }
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
            message.info('订单不能超过20条哦');
            return false;
        }
        if (this.state.selectedRows.some(item => item.interchangeStatus === 1 || item.interchangeStatus === 3)) {
            message.info('当前订单状态不能执行此操作！');
            return false;
        }

        return true
    };

    onBatchWareEnter = () => {
        if (this.canPerformBatchAction()) {
            this.openModal('stockInPopVisible');
        }
        // console.log(this.state.selectedRows);
        // const hasUnbindProdBill = this.state.selectedRows.filter(item => item.hasUnbindProdFlag);
        // if (hasUnbindProdBill && hasUnbindProdBill.length > 0) {
        //
        // } else {

        // }
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


    render() {
        const {purchaseList} = this.props;
        let dataSource = purchaseList.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];
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
                                    <Link ga-data="list-billNo" to={`/purchase/show/${data.billNo}?source=onlineOrder&current=/onlineOrder/purchase/`}>{displayBillNo}</Link>
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
                            type={"open"}
                            title={
                                data.interchangeStatus == 1 ? "未接收" :
                                    data.interchangeStatus == 2 ? "已接收" :
                                        data.interchangeStatus == 3 ? "已取消" : ''
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
                            type={"open"}
                            title={state == 0 ? "未完成入库" : "已完成入库"}
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
                            type={"open"}
                            title={invoiceState == 0 ? "未完成到票" : "已完成到票"}
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
                            type={"open"}
                            title={data.payState == 0 ? "未完成付款" : "已完成付款"}
                        >
                            {
                                data.payState == 0 ?
                                    <Icon type="icon-state-unfinished" className="icon-state-unfinish"/> :
                                    <Icon type="icon-state-finished" className="icon-state-finished"/>
                            }
                        </Tooltip>
                    )
                }
                else if (item.fieldName === "purchaseOrderDate" || item.fieldName === "deliveryDeadlineDate") {
                    obj.render = (date) => (
                        <span className="txt-clip">
                            {date ? moment(date).format('YYYY-MM-DD') : null}
         			    </span>
                    )
                }
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
                                                to={`/purchase/show/${data.billNo}?source=onlineOrder&current=/onlineOrder/purchase/#expendRecord`}>{formatCurrency(payAmount)}</Link>
                                            {/*<Link to={{pathname: "/finance/expend/", search: `?fkBillNo=${data.displayBillNo}`}}>{payAmount}</Link>*/}
                                        </span>
                                    ) : PRICE_NO_AUTH_RENDER
                            }
                        </Auth>
                    )
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
                                                to={`/purchase/show/${data.billNo}?source=onlineOrder&current=/onlineOrder/purchase/#invoiceRecord`}>{formatCurrency(invoiceAmount)}</Link>
                                            {/*<Link to={{pathname: "/finance/invoice/", search: `?fkBillNo=${data.displayBillNo}`}}>{invoiceAmount}</Link>*/}
                                        </span>
                                    ) : PRICE_NO_AUTH_RENDER
                            }
                        </Auth>
                    )
                }
                else if (item.fieldName === "deliveryAddress") {
                    obj.render = (deliveryAddress, data) => {
                        const fullAddr = data.deliveryProvinceText?
                            data.deliveryProvinceText + data.deliveryCityText + deliveryAddress:'';
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
                                <Menu className={cx('abstract-drop-menu') } ga-data={"list-prodAbstract"}>
                                    <Menu.Item>
                                        <Spin
                                            spinning={data.prodAbstractIsFetching}
                                        >
                                            <div className={cx("abstract-drop")}>
                                                <div className={cx("tit")}>物品摘要</div>
                                                <ul>
                                                    {
                                                        data.prodAbstractList && data.prodAbstractList.map((item, index) =>
                                                            <li key={index}>
                                                                <span className={cx('prod-tit')}>{item.prodName}</span>
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
                                <Icon type="down" className="ml5"/>
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
                let menuStr = (
                    <Menu>
                        <CopyMenu module={"purchase"} to={`/purchase/copy/${data.billNo}?source=onlineOrder&current=/onlineOrder/purchase/`}/>

                        {
                            (data.interchangeStatus === 1 || data.interchangeStatus === 2)?null:(
                                <DeleteMenu module={"purchase"}
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
            selectComponents: [],
            datePickerComponents: [],
            customComponents: [],
            intervalComponents: []
        };
        filterConfigList.forEach(function(item) {
            item.visibleFlag && filterDataSource[item.type + "Components"].push(item);
        });

        return (
            <React.Fragment>
                <div className="content-hd">
                    <Crumb data={[
                        {
                            url: '/onlineOrder/',
                            title: '在线订货'
                        },
                        {
                            title: '在线采购单'
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <TableFieldConfigMenu filterList={filterConfigList} tableList={tableConfigList}
                                              onTableConfigChange={this.onTableConfigChange}
                                              onFilterConfigChange={this.onFilterConfigChange}
                                              batchUpdateConfig={this.batchUpdateConfig}
                                              refresh={this.refresh}
                                              type={'mall_purchase'}
                        />
                    </div>
                </div>

                <div className="content-index-bd">
                    <div className="list-ope-wrap">
                        <ListOpeBar
                            visible={this.state.listToolBarVisible}
                            filterToolBarVisible={this.state.filterToolBarVisible}
                            // addUrl="/purchase/add?source=onlineOrder&current=/onlineOrder/purchase/"
                            authModule={"purchase"}
                            onFilter={this.filterListData}
                            onSearch={this.onSearch}
                            defaultValue={this.state.condition.key}
                            searchTipsUrl={`/purchases/search/tips`}
                            searchPlaceHolder="采购单号/供应商/物品/项目"
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
                            selectedRowKeys={this.state.selectedRowKeys}
                            selectedRows={this.state.selectedRows}
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
                            popTitle={'入库'}
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
                                <BatchPopTitle title={this.state.mergePay ? '合并付款' : '付款'}
                                               infoTip={this.state.mergePay ? '同一个供应商的采购订单可以合并生成同一条付款记录' : '按采购订单单号分别生成不同的付款记录'}/>
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
                                <BatchPopTitle title={this.state.mergeInvoice ? '合并到票' : '到票'}
                                               infoTip={this.state.mergeInvoice ? '同一个供应商的采购订单可以合并生成同一条到票记录' : '按采购订单单号分别生成不同的到票记录'}/>
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
                <LimitOnlineTip onClose={()=>this.closeModal('showTip')} show={this.state.showTip}/>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    purchaseList: state.getIn(['purchaseIndex', 'purchaseList'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchPurchaseList,
        asyncTogglePurchaseInfo,
        asyncDeletePurchaseInfo,
        asyncUpdateConfig,
        asyncBatchUpdateConfig,
        asyncFetchProdAbstractByBillNo,
        asyncConvertToLocalProd: operActions.asyncConvertToLocalProd,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Index)