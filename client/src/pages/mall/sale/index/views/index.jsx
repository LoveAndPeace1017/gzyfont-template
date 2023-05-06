import React, {Component} from 'react';
import {
    Modal, Menu, Dropdown, message, Spin,Radio
} from 'antd';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import Tooltip from 'components/widgets/tooltip';
import {Link} from 'react-router-dom';
import {withRouter} from "react-router-dom";
import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import Icon from 'components/widgets/icon';
import {formatCurrency} from 'utils/format';
import BatchPopTitle from 'components/business/batchPopTitle';
import BindCustomer from 'components/business/bindCustomer';
import LimitOnlineTip from 'components/business/limitOnlineTip';
import FooterFixedBar from  'components/layout/footerFixedBar'
import {Auth} from 'utils/authComponent';
import {PRICE_NO_AUTH_RENDER} from 'utils/constants';

import {
    asyncFetchSaleList,
    asyncToggleSaleInfo,
    asyncDeleteSaleInfo,
    asyncUpdateConfig,
    asyncBatchUpdateConfig,
    asyncFetchProdAbstractByBillNo
} from 'pages/sale/index/actions'

import {actions as operActions} from 'components/business/operateOrder';
import {actions as customerActions} from 'pages/customer/index'

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
import SaleOrderOperate from 'components/business/operateOrder';
import {parse} from "url";
import {CopyMenu, ModifyMenu, DeleteMenu} from "components/business/authMenu";
import Pagination from 'components/widgets/pagination';
import ListTable from 'components/business/listTable';
import {Amount} from 'components/business/amount';
import {redirectToHome} from 'pages/mall/home'
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
            operateModalVisiable: false,
            wareOutPopVisible: false,
            saleInvoicePopVisible: false,
            incomePopVisible: false,
            mergeIncome: false,
            mergeSaleInvoice: false,
            operateType: '', //'cancel' or 'accept',
            billNo: '',
            customerName: '',
            condition:{
                key:searchQuery.query.key || '',
                source:'mall'
            },
            saveCustomerVisible:false,
            cancelPopVisible:false,
            rejectCallback:null,
            bindCustomerCallback:null,
            showTip: false,
        };
    }
    fetchListData = (params,callback)=>{
        this.props.asyncFetchSaleList(params, callback);
    };

    componentDidMount() {
        //初始化列表数据
        this.fetchListData(this.state.condition);
    }


    doFilter = (condition,resetFlag)=>{
        let params = this.state.condition;
        if(resetFlag){
            let key = params.key;
            params = condition;
            if(key&&(typeof params.key ==="undefined")){
                params.key = key;
            }
        }else{
            params = {
                ...params,
                ...condition
            }
        }
        params.source="mall";
        this.setState({
            condition:params
        });

        this.batchUpdateConfig(()=>{
            for (const key in params) {
                if (!params[key]) {
                    delete params[key];
                }
            }
            this.props.asyncFetchSaleList(params);
        });
    };
    onSearch = (value)=>{
        this.doFilter({key:value,source:'mall'},true);
        this.filterToolBarHanler.reset();
    };


    onHasUnbindProd = (billList) => {
        this.closeModal('wareOutPopVisible');
        let _self = this;
        Modal.confirm({
            title: '提示信息',
            okText: '确定',
            cancelText: '取消',
            content: (
                <React.Fragment>
                    <div>
                        <strong>您当前的订单中存在未绑定物品，是否确定将未绑定物品一键变成我的物品并进行出库操作？</strong>
                    </div>
                    <p style={{marginTop: '20px', textSize: '10px'}}>
                        您也可以在订单详情页列表进行手动绑定，全部绑定后即可出库
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

    onBatchWareOut = () => {
        if (this.canPerformBatchAction()) {
            this.openModal('wareOutPopVisible');
        }
    };

    onBatchInvoice = (merge) => {
        if (this.canPerformBatchAction()) {
            this.setState({
                mergeSaleInvoice: merge || false,
                saleInvoicePopVisible: true
            });
            this.openModal('saleInvoicePopVisible');
        }
    };

    onBatchIncome = (merge) => {
        if (this.canPerformBatchAction()) {
            this.setState({
                mergeIncome: merge || false,
                incomePopVisible: true
            });
        }
    };

    batchUpdateConfig = (callback)=>{
        let arr = [];
        const {saleList} = this.props;
        let filterConfigList = saleList.getIn(['data', 'filterConfigList']);
        filterConfigList = filterConfigList ? filterConfigList.toJS() : [];
        let tableConfigList = saleList.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];
        let cannotEditFilterColumnsMap = {
            'saleDate':1,
        };
        let moduleType = {
            search:'mall_saleOrder_search_list',
            table:'mall_saleOrder_list'
        };
        this.batchUpdateConfigSuper(filterConfigList,tableConfigList,cannotEditFilterColumnsMap, moduleType,callback);

    };

    deleteConfirm = (ids, cannotDelete, callback,source) => {
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
                'ga-data':prefix + '-sale-delete-ok'
            },
            cancelButtonProps:{
                'ga-data':prefix + '-sale-delete-cancel'
            },
            onOk() {
                _this.props.asyncDeleteSaleInfo(ids, function(res) {
                    if (res.retCode === '0') {
                        message.success('删除成功!');
                        _this.props.asyncFetchSaleList(_this.state.condition);
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
        const {saleList} = this.props;
        const dataSource = saleList.getIn(['data', 'list']);
        const hasCache = dataSource.filter(item => {
            return item.get('billNo') === billNo && item.get('prodAbstractList')
        }).size > 0;
        if (visible && !hasCache) {
            this.props.asyncFetchProdAbstractByBillNo(billNo)
        }
    };

    bindCustomerCallback = ()=>{
        if(this.state.chooseType=='accept'){
            this.acceptAndBindOkCallback();
        }else{
            this.rejectAndBindOkCallback();
        }
    };

    acceptOrder = (data) => {
        this.setState({
            billNo:data.billNo,
            customerName:data.customerName,
            chooseType:'accept',
            customerInfo:{
                customerUserId:data.customerUserId
            }
        });
        if(data.customerNo){
            this.acceptAndBindOkCallback();
        }else{
            this.openModal('saveCustomerVisible');
        }
    };
    acceptAndBindOkCallback = ()=>{
        this.setState({
            operateType: 'accept',
            operateModalVisiable: true
        });
    };
    rejectAndBindOkCallback = ()=>{
        this.setState({
            operateType: 'cancel',
            operateModalVisiable: true
        });
    };

    rejectPopOnOk = ()=>{
        if(this.state.isAllow){
            this.cancelOrderAndAllowVisit()
        }else{
            this.rejectAndAddToBlacklist()
        }
    };

    cancelOrder = (data) => {
        this.setState({
            billNo:data.billNo,
            chooseType:'reject',
            customerName:data.customerName,
            customerInfo:{
                customerUserId:data.customerUserId
            }
        });
        if(data.customerNo){
            this.rejectAndBindOkCallback()
        }else{
            this.openModal('cancelPopVisible');
        }
    };

    rejectAndAddToBlacklist = ()=>{
        let _this = this;
        Modal.confirm({
            title:'提醒信息',
            content:`您确定禁止 ${_this.state.customerName} 访问商城吗？`,
            okText:'确定',
            cancelText:'取消',
            onOk(){
                _this.props.asyncAddToBlackList({
                    saleOrderBillNo:_this.state.billNo,
                    type:'sale'
                },(data)=>{
                    if(data.retCode=='0'){
                        _this.closeModal('cancelPopVisible');
                        // _this.rejectAndBindOkCallback();
                    }else{
                        alert(data.retMsg);
                    }
                });
            }
        });
    };
    cancelOrderAndAllowVisit = ()=>{
        this.closeModal('cancelPopVisible');
        this.openModal('saveCustomerVisible');
    };
    allowRadioChange = (e)=>{
        let value = e.target.value;
        this.setState({
            isAllow:value==1
        });
    };

    // 取消订单成功后取消刷新页面
    orderOpCallback = (result) => {
        if (result) {
            this.props.asyncFetchSaleList(this.state.condition);
        }
    };

    render() {
        const {saleList} = this.props;
        let dataSource = saleList.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];
        let filterConfigList = saleList.getIn(['data', 'filterConfigList']);
        filterConfigList = filterConfigList ? filterConfigList.toJS() : [];
        let tableConfigList = saleList.getIn(['data', 'tableConfigList']);
        tableConfigList = tableConfigList ? tableConfigList.toJS() : [];
        const pageAmount = saleList.getIn(['data', 'pageAmount']);
        const totalAmount = saleList.getIn(['data', 'totalAmount']);
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
                                    <Link to={`/sale/show/${data.billNo}?source=mall&current=/mall/sale/`} ga-data={"list-sale-billNo"}>{displayBillNo}</Link>
                                </span>
                            </React.Fragment>
                        )
                    }
                }else if (item.fieldName === "interchangeState") {
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
                            type={"open"}
                            title={state == 0 ? "未完成出库" : "已完成出库"}
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
                            type={"open"}
                            title={invoiceState == 0 ? "未完成开票" : "已完成开票"}
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
                            type={"open"}
                            title={data.payState == 0 ? "未完成收款" : "已完成收款"}
                        >
                            {
                                data.payState == 0 ?  <Icon type="icon-state-unfinished"  className="icon-state-unfinish"/> :
                                    <Icon type="icon-state-finished"  className="icon-state-finished"/>
                            }
                        </Tooltip>
                    )
                } else if (item.fieldName === "saleOrderDate" || item.fieldName === "deliveryDeadlineDate") {
                    obj.render = (date) => (
                        <span className="txt-clip">
                            {date ? moment(date).format('YYYY-MM-DD') : null}
         			    </span>
                    )
                }else if (item.fieldName === "aggregateAmount") {
                    obj.render = (aggregateAmount) => (
                        <Auth
                            module="salePrice"
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
                }else if (item.fieldName === "payAmount") {
                    obj.render = (payAmount, data) => (
                        <Auth
                            module="salePrice"
                            option="show"
                        >
                            {
                                (isAuthed) =>
                                    isAuthed ? (
                                        <span className="txt-clip" title={formatCurrency(payAmount)}>
                                            <Link ga-data={'sale-income'} to={`/sale/show/${data.billNo}#incomeRecord`}>{formatCurrency(payAmount)}</Link>
                                                            {/*<Link to={{*/}
                                                            {/*    pathname: "/finance/income/",*/}
                                                            {/*    search: `?fkBillNo=${data.displayBillNo}`*/}
                                                            {/*}}>{payAmount}</Link>*/}
                                        </span>
                                    ) : PRICE_NO_AUTH_RENDER
                            }
                        </Auth>

                    )
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
                                            <Link ga-data={'sale-saleInvoice'} to={`/sale/show/${data.billNo}#saleInvoiceRecord`}>{formatCurrency(invoiceAmount)}</Link>
                                                            {/*<Link to={{*/}
                                                            {/*    pathname: "/finance/saleInvoice/",*/}
                                                            {/*    search: `?fkBillNo=${data.displayBillNo}`*/}
                                                            {/*}}>{invoiceAmount}</Link>*/}
                                        </span>
                                    ) : PRICE_NO_AUTH_RENDER
                            }
                        </Auth>

                    )
                }else if (item.fieldName === "deliveryAddress") {
                    obj.render = (deliveryAddress, data) => {
                        const fullAddr = data.deliveryProvinceText?
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
                                <Menu className={cx('abstract-drop-menu')}>
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
                                <span className={cx("txt-desc-no") + ' txt-clip'} title={prodAbstract}>{prodAbstract}</span>
                                <Icon type="down" className="ml5"/>
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
                if (data.interchangeStatus === 1) {
                    menuStr = (
                        <Menu>
                            <Menu.Item>
                                <a href="#!" onClick={() => this.acceptOrder(data)}>接收</a>
                            </Menu.Item>
                            <Menu.Item>
                                <a href="#!" onClick={() => this.cancelOrder(data)}>取消</a>
                            </Menu.Item>
                        </Menu>
                    )
                }
                else if (data.interchangeStatus === 2) {
                    menuStr = (
                        <Menu>
                            <Menu.Item>
                                <a href="#!" onClick={() => this.cancelOrder(data)}>取消订单</a>
                            </Menu.Item>
                        </Menu>
                    )
                }
                else if (data.interchangeStatus === 3) {
                    menuStr = (
                        <Menu>
                            <Menu.Item>
                                <a href="#!"
                                   onClick={() => this.deleteConfirm([data.billNo], false)}>删除</a>
                            </Menu.Item>
                        </Menu>
                    )
                }
                else {
                    menuStr = (
                        <Menu>
                            <ModifyMenu module={"sale"} to={`/sale/modify/${data.billNo}`} />
                            <CopyMenu module={"sale"} to={`/sale/copy/${data.billNo}`} />
                            <DeleteMenu module={"sale"}
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
            intervalComponents: [],
            depEmployeeComponents: []
        };
        filterConfigList.forEach(function(item) {
            item.visibleFlag && filterDataSource[item.type + "Components"].push(item);
        });

        return (
            <React.Fragment>
                <div className="content-hd">
                    <Crumb data={[
                        {
                            url: '/mall/',
                            title: '我的商城'
                        },
                        {
                            title: '在线销售单'
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <TableFieldConfigMenu filterList={filterConfigList} tableList={tableConfigList}
                                              onTableConfigChange={this.onTableConfigChange}
                                              onFilterConfigChange={this.onFilterConfigChange}
                                              batchUpdateConfig={this.batchUpdateConfig}
                                              refresh={this.refresh}
                                              type={'mall_saleOrder'}
                        />
                    </div>
                </div>

                <div className="content-index-bd">
                    <div className="list-ope-wrap">
                        <ListOpeBar
                            visible={this.state.listToolBarVisible}
                            filterToolBarVisible={this.state.filterToolBarVisible}
                            authModule={"sale"}
                            onFilter={this.filterListData}
                            onSearch={this.onSearch}
                            defaultValue={this.state.condition.key}
                            searchTipsUrl={`/saleorders/search/tips`}
                            searchPlaceHolder="销售单号/客户/物品/项目/销售员"
                            refresh={this.refresh}
                        />
                        <CheckResult
                            module={"sale"}
                            visible={this.state.checkResultVisible}
                            onRemove={this.checkRemove}
                            onWareOut={this.onBatchWareOut}
                            onIncome={this.onBatchIncome.bind(this, false)}
                            onMergeIncome={this.onBatchIncome.bind(this, true)}
                            onSaleInvoice={this.onBatchInvoice.bind(this, false)}
                            onMergeSaleInvoice={this.onBatchInvoice.bind(this, true)}
                            selectedRowKeys={this.state.selectedRowKeys}
                            selectedRows={this.state.selectedRows}
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
                        popTitle={<BatchPopTitle title={this.state.mergeSaleInvoice ? '合并开票' : '开票'}
                                                 infoTip={this.state.mergeSaleInvoice ? '同一个客户的销售订单可以合并生成同一条开票记录' : '按销售订单单号分别生成不同的开票记录'}/>}
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
                        popType={this.state.mergeIncome ? 'merge' : ''}
                        popTitle={<BatchPopTitle title={this.state.mergeIncome ? '合并收款' : '收款'}
                                                 infoTip={this.state.mergeIncome ? '同一个客户的销售订单可以合并生成同一条收款记录' : '按销售订单单号分别生成不同的收款记录'}/>}
                        billIds={this.state.selectedRows.map(item => item.billNo)}
                        onOk={() => {
                            this.closeModal('incomePopVisible');
                            this.refresh();
                        }}
                        onCancel={() => this.closeModal('incomePopVisible')}
                    />
                }

                <BindCustomer
                    visible={this.state.saveCustomerVisible}
                    tip={<div><p>如果您想接收该订单，请先处理订单客户</p><p>该客户不是您的本地客户 您可以选择是否保存到已有客户？</p></div>}
                    onCancel={()=>this.closeModal('saveCustomerVisible')}
                    customerInfo={this.state.customerInfo}
                    okCallback={this.bindCustomerCallback}
                />
                <Modal
                    title='提醒信息'
                    visible={this.state.cancelPopVisible}
                    okText='确定'
                    cancelText='取消'
                    onOk={this.rejectPopOnOk}
                    onCancel={()=>this.closeModal('cancelPopVisible')}
                >
                    <div className={cx("cancel-confirm")}>
                        <p>如果您想取消该订单，请先处理订单客户</p>
                        <p>您可以设置是否允许其访问商城 ？</p>
                        <Radio.Group onChange={this.allowRadioChange}>
                            <Radio value={1}>是</Radio>
                            <Radio value={0}>否</Radio>
                        </Radio.Group>
                    </div>
                </Modal>

                <LimitOnlineTip onClose={()=>this.closeModal('showTip')} show={this.state.showTip}/>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    saleList: state.getIn(['saleIndex', 'saleList']),
    mallPreData: state.getIn(['mallHome', 'preData']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchSaleList,
        asyncToggleSaleInfo,
        asyncDeleteSaleInfo,
        asyncUpdateConfig,
        asyncBatchUpdateConfig,
        asyncFetchProdAbstractByBillNo,
        asyncConvertToLocalProd: operActions.asyncConvertToLocalProd,
        asyncAddToBlackList: customerActions.asyncAddToBlackList,
    }, dispatch)
};

export default withRouter(redirectToHome(connect(mapStateToProps, mapDispatchToProps)(Index)))