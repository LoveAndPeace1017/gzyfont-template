import React, {Component} from 'react';
import {
    Input, Select, DatePicker, Button, Modal, message, InputNumber
} from 'antd';
import { ReloadOutlined, EllipsisOutlined } from '@ant-design/icons';
import {SelectProject} from 'pages/auxiliary/project';
import SelectGoodsCate from "pages/auxiliary/category/views/selectGoodsCate";
import SelectGoodsOrFitting from 'components/business/goodsPop';
import {SelectDeliveryAddress} from 'components/business/deliveryAddress';
import SelectIncomeType from "pages/auxiliary/income/views/selectIncomeType";
import {SelectSupplier} from 'pages/supplier/index'
import {SelectCustomer} from "pages/customer/index";
import {SelectMultiCustomer} from "pages/customer/index";
import {SelectEmployeeFix, SelectEmployeeIdFix} from 'pages/auxiliary/employee';
import CopyFromSale from 'components/business/copyFromSaleWithFilterToolBar';
import {OutboundOrderPop} from 'pages/inventory/outbound/index';
import {SelectWorkCenter} from 'pages/auxiliary/workCenter';
import {SelectSettlement} from 'pages/auxiliary/orderType';
import {SelectCurrency} from 'pages/auxiliary/multiCurrency';
import {SelectGroupType} from 'pages/auxiliary/group';
import {SelectInvoiceType} from "pages/auxiliary/bill";
import Icon from 'components/widgets/icon';
import intl from 'react-intl-universal';

const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const InputGroup = Input.Group;

import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");

import styles from "../styles/index.scss";
import classNames from "classnames/bind";


const cx = classNames.bind(styles);
const SelectGroup = (props) => {
    const {options, fieldName, showType} = props;
    let passAry = ['node.customer.followStatus','node.customer.disableFlag','node.customer.twoWayBindFlag','node.goods.wareState','node.goods.combinationState','node.goods.distributionFlag','node.goods.disableFlag','node.goods.expirationState0','node.goods.expirationState1','node.inventory.in.approveStatus','node.inventory.in.enterType','node.inventory.out.bindStates','node.inventory.out.outType','node.purchase.interchangeStatus','node.purchase.approveStatusTitle',
        'node.purchase.deliveryState','node.purchase.payState','node.purchase.invoiceStateTitle','report.grossProfit.inventoryState','report.inactiveStock.dullDaysState','report.inventoryPrice.finalQuantityState','node.report.purchaseTrace.state','node.report.purchaseTrace.payState','node.report.purchaseTrace.invoiceState','node.report.saleTrace.state','node.report.saleTrace.payState',
        'node.report.saleTrace.invoiceState','report.waresum.inventoryState','report.waresum.originalQuantityState','node.sale.interchangeStatus','node.sale.approveStatus','node.sale.state','node.sale.payState','node.sale.invoiceState','node.sale.deliveryDate','node.sale.settlement','node.supplier.bindStates','node.supplier.disableFlag','node.supplier.twoWayBindFlag','goods.serialNumQuery.instoreStatus','node.inventory.out.approveStatus','components.approve.approveStatus',
        'components.approve.approvePerson','node.purchase.assignee','node.goods.specFlag','node.subcontract.orderDate', 'node.subcontract.inState', 'node.subcontract.outState', 'node.subcontract.outProd','node.subcontract.inProd','node.subcontract.warehouseNameIn','node.subcontract.warehouseNameOut','node.subcontract.remindDate', 'node.subcontract.inboundDone','node.subcontract.inboundWait','node.subcontract.outboundDone','node.subcontract.outboundWait',
        'node.report.purchaseRefundSummaryByProd.incomingQuantity', 'node.report.saleRefundSummaryByProd.outcomingQuantity','node.requisition.purchaseStatus','components.approve.attachmentState', "node.sale.currencyName","node.report.check_customer.warehouseStatus","node.purchase.state","node.purchase.invoiceState"];
    let optionsStr = '';
    if(passAry.indexOf(props.label)!= -1){
        optionsStr = options && options.map((opts, index) =>
            <Option key={index} title={opts.label && intl.get(opts.label)} value={opts.value}>{opts.label && intl.get(opts.label)}</Option>
        );
    }else{
        optionsStr = options && options.map((opts, index) =>
            opts.label && <Option key={index} title={opts.label} value={opts.value}>{opts.label}</Option>
        );
    }
    let prefix = "";
    let placeholder = props.label && (props.label.split('.').length>2?intl.get(props.label):props.label);
    if (showType && showType === "full") {
        prefix = (<span>{props.label && intl.get(props.label)}：</span>);
        placeholder = intl.get("components.filterToolBar.index.all");
    }

    return (
        <React.Fragment>
            {prefix}
            <Select style={props.style && props.style} value={props.value && props.value} onChange={props.onChange && props.onChange}  allowClear placeholder={placeholder}>
                {
                    props.notNormalOption ? null : (
                        <Option key={fieldName + "all"} title={ props.label && (intl.get("components.filterToolBar.index.all")+  intl.get(props.label))} value={""}>{intl.get("components.filterToolBar.index.all")} {props.label && intl.get(props.label)}</Option>
                    )
                }
                {optionsStr}
            </Select>
        </React.Fragment>);

};

let isInitialized = false;

class FilterToolBar extends Component {

    static getDerivedStateFromProps(nextProps, prevState) {
        // Should be a controlled component.
        if(nextProps.dataSource){
            const selectObj = {
                params: {
                    ...prevState.params
                },
                select: {},
                date: {},
                singleDate:{},
                interval: {},
                input: {},
                inputNoBtn: {},
                depEmployee: {},
                work: {},
                currency: {},
                depEmployeeById: {},
                warehouse: undefined,
                propMappingName: '',
                propValue: ''
            };
            if(nextProps.dataSource.selectComponents && nextProps.dataSource.selectComponents.length>0){
                nextProps.dataSource.selectComponents.forEach((item) => {
                    //有初始值 && 之前没有这个state状态
                    if (item.defaultValue) {
                        selectObj.select[item.fieldName] = item.defaultValue;
                        selectObj.params[item.fieldName] = item.defaultValue;
                    }
                });
            }
            if(nextProps.dataSource.workComponents && nextProps.dataSource.workComponents.length>0){
                nextProps.dataSource.workComponents.forEach((item) => {
                    if (item.defaultValue) {
                        selectObj.work[item.fieldName] = item.defaultValue;
                        selectObj.params[item.fieldName] = item.defaultValue;
                    }
                });
            }
            if(nextProps.dataSource.currencyComponents && nextProps.dataSource.currencyComponents.length>0){
                nextProps.dataSource.currencyComponents.forEach((item) => {
                    if (item.defaultValue) {
                        selectObj.work[item.fieldName] = item.defaultValue;
                        selectObj.params[item.fieldName] = item.defaultValue;
                    }
                });
            }
            if(nextProps.dataSource.inputComponents && nextProps.dataSource.inputComponents.length>0){
                nextProps.dataSource.inputComponents.forEach((item) => {
                    //有初始值 && 之前没有这个state状态
                    if (item.defaultValue) {
                        selectObj.input[item.fieldName] = item.defaultValue;
                        selectObj.params[item.fieldName] = item.defaultValue;
                    }
                });
            }

            if(nextProps.dataSource.inputNoBtnComponents && nextProps.dataSource.inputNoBtnComponents.length>0){
                nextProps.dataSource.inputNoBtnComponents.forEach((item) => {
                    //有初始值 && 之前没有这个state状态
                    if (item.defaultValue) {
                        selectObj.inputNoBtn[item.fieldName] = item.defaultValue;
                        selectObj.params[item.fieldName] = item.defaultValue;
                    }
                });
            }

            if(nextProps.dataSource.warehouseComponents && nextProps.dataSource.warehouseComponents.length>0){
                nextProps.dataSource.warehouseComponents.forEach((item) => {
                    //有初始值 && 之前没有这个state状态
                    if (item.defaultValue) {
                        selectObj.warehouse = item.defaultValue;
                        selectObj.params[item.fieldName] = item.defaultValue;
                    }
                });
            }
            if(nextProps.dataSource.datePickerComponents && nextProps.dataSource.datePickerComponents.length>0){
                nextProps.dataSource.datePickerComponents.forEach((item) => {
                    //有初始值 && 之前没有这个state状态
                    if (item.defaultValue) {
                        selectObj.date[item.fieldName] = item.defaultValue || [undefined, undefined];
                    }
                });
            }
            if(nextProps.dataSource.singleDateComponents && nextProps.dataSource.singleDateComponents.length>0){
                nextProps.dataSource.singleDateComponents.forEach((item) => {
                    //有初始值 && 之前没有这个state状态
                    if (item.defaultValue) {
                        selectObj.singleDate[item.fieldName] = item.defaultValue;
                    }
                });
            }
            if(nextProps.dataSource.intervalComponents && nextProps.dataSource.intervalComponents.length>0){
                nextProps.dataSource.intervalComponents.forEach((item) => {
                    //有初始值 && 之前没有这个state状态
                    if (item.defaultValue) {
                        selectObj.interval = {
                            ...prevState.params.interval,
                            ...item.defaultValue
                        };
                    }
                });
            }
            if(nextProps.dataSource.customComponents && nextProps.dataSource.customComponents.length>0){
                nextProps.dataSource.customComponents.forEach((item) => {
                    //有初始值 && 之前没有这个state状态
                    if (item.defaultValue) selectObj.propMappingName = item.defaultValue;
                    if(item.propValue) selectObj.propValue = item.propValue;
                });
            }
            if(nextProps.dataSource.depEmployeeComponents && nextProps.dataSource.depEmployeeComponents.length>0){
                nextProps.dataSource.depEmployeeComponents.forEach((item) => {
                    if (item.defaultValue) {
                        selectObj.depEmployee[item.fieldName] = item.defaultValue;
                    }
                });
            }
            if(nextProps.dataSource.depEmployeeByIdComponents && nextProps.dataSource.depEmployeeByIdComponents.length>0){
                nextProps.dataSource.depEmployeeByIdComponents.forEach((item) => {
                    if (item.defaultValue) {
                        selectObj.depEmployee[item.fieldName] = item.defaultValue;
                    }
                });
            }
            if((Object.keys(selectObj.select).length>0 || Object.keys(selectObj.date).length>0 ||
                Object.keys(selectObj.input).length>0 || Object.keys(selectObj.interval).length>0 ||
                Object.keys(selectObj.depEmployee).length>0 || Object.keys(selectObj.depEmployeeById).length>0 || selectObj.warehouse || selectObj.propMappingName) && isInitialized){
                isInitialized = false;
                return selectObj;
            }else{
                return null;
            }
        }
        return null;
    }

    constructor(props) {
        super(props);
        this.state = {
            propMappingName: "",
            propValue: "",
            customSearchBtnVisible: false,
            intervalSearchBtnVisible: false,
            params: {},
            select: {},
            date: {},
            singleDate: {},
            work: {},
            currency: {},
            interval: {},
            project: {},
            settlement: {},
            category: {},
            product: {},
            saleOrders: {},
            outBoundOrders: {},
            supplier: {},
            customer: {},
            group: {},
            invoiceType: {},
            multiCustomer: {},  //客户多选
            depEmployee: {},
            depEmployeeById: {},
            finance: {},
            input: {},
            inputNoBtn: {},
            number: {},
            warehouse: undefined,
            goodsPopVisible: false,
            goodsTabKey: 'prodNo',  // 当前打开的物品弹层所对应的Select组件的的fieldName
            prodSelectType: 'radio',  // 物品弹层的选择状态
            multiGoodsMaxLength: 100, //物品弹层多选最多可选择数量
            saleOrderPopVisible: false,
            outOrderPopVisible: false,
            salesTabKey: 'billNo',
            outBoundTabKey: 'billNo',
            salesSelectType: 'radio',
            outBoundSelectType: 'checkbox',
            saleOrdersMaxLength: 100,
        };
    }

    initDefaultValue = () => {
        let select = {};
        let date = {};
        let interval = {};
        let product = {};
        let input = {};
        let inputNoBtn = {};
        let multiCustomer = {};
        let singleDate = {};
        let work = {};
        let currency = {};
        let saleOrders = {};
        this.props.dataSource.selectComponents && this.props.dataSource.selectComponents.forEach((item) => {
                select[item.fieldName] = item.defaultValue;
            }
        );
        this.props.dataSource.workComponents && this.props.dataSource.workComponents.forEach((item) => {
                work[item.fieldName] = item.defaultValue;
            }
        );
        this.props.dataSource.groupComponents && this.props.dataSource.groupComponents.forEach((item) => {
                work[item.fieldName] = item.defaultValue;
            }
        );
        this.props.dataSource.currencyComponents && this.props.dataSource.currencyComponents.forEach((item) => {
                work[item.fieldName] = item.defaultValue;
            }
        );
        this.props.dataSource.datePickerComponents && this.props.dataSource.datePickerComponents.forEach((item) => {
                date[item.fieldName] = item.defaultValue || [undefined, undefined];
            }
        );
        this.props.dataSource.singleDateComponents && this.props.dataSource.singleDateComponents.forEach((item) => {
                singleDate[item.fieldName] = item.defaultValue;
            }
        );
        this.props.dataSource.intervalComponents && this.props.dataSource.intervalComponents.forEach((item) => {
                interval[item.fieldName] = item.defaultValue || [undefined, undefined];
            }
        );
        this.props.dataSource.productComponents && this.props.dataSource.productComponents.forEach((item) => {
                if (item.defaultValue) {
                    product.item = item.defaultValue;
                }
            }
        );
        this.props.dataSource.multiCustomerComponents && this.props.dataSource.multiCustomerComponents.forEach((item) => {
                if (item.defaultValue) {
                    multiCustomer.item = item.defaultValue;
                }
            }
        );
        this.props.dataSource.multProductComponents && this.props.dataSource.multProductComponents.forEach((item) => {
                if (item.defaultValue) {
                    product[item.fieldName] = item.defaultValue;
                }
            }
        );
        this.props.dataSource.inputComponents && this.props.dataSource.inputComponents.forEach((item) => {
                input[item.fieldName] = item.defaultValue;
            }
        );
        this.props.dataSource.inputNoBtnComponents && this.props.dataSource.inputNoBtnComponents.forEach((item) => {
                if (item.defaultValue) {
                    inputNoBtn[item.fieldName] = item.defaultValue;
                }
            }
        );
        this.props.dataSource.saleOrderComponents && this.props.dataSource.saleOrderComponents.forEach((item) => {
                if (item.defaultValue) {
                    saleOrders[item.fieldName] = item.defaultValue;
                }
            }
        );
        this.setState({select, date, interval, product, input, singleDate, work, currency, inputNoBtn, saleOrders});
    };

    componentDidMount() {
        isInitialized = true;
        this.initDefaultValue();
    }

    componentWillUnmount() {
        isInitialized = false;
    }

    doReset = () => {
        this.reset();
        this.props.doFilter({}, true);
    };

    // 重置筛选项
    reset = () => {
        this.setState({
            propMappingName: "",
            propValue: "",
            customSearchBtnVisible: false,
            intervalSearchBtnVisible: false,
            params: {},
            select: {},
            date: {},
            singleDate: {},
            work: {},
            currency: {},
            interval: {},
            project: {},
            settlement: {},
            category: {},
            product: {},
            saleOrders: {},
            outBoundOrders: {},
            supplier: {},
            customer: {},
            multiCustomer: {},
            depEmployee: {},
            depEmployeeById: {},
            finance: {},
            input: {},
            group: {},
            invoiceType: {},
            inputNoBtn: {},
            number: {},
            warehouse: undefined,
            goodsPopVisible: false
        });
    };

    updateFilterCondition = (fieldName, value, type, fieldStartKey, fieldEndKey) => {
        let obj = this.state.params;
        fieldName == 'departmentName'?(obj.usePerson = ''):null;
        fieldName == 'departmentId'?(obj.employeeId = ''):null;
        type = type || "select";
        if (type === "date") {
            const startKey = fieldStartKey || fieldName + "Start";
            const endKey =  fieldEndKey || fieldName + "End";
            if (value && value.length !== 0) {
                obj[startKey] = moment(value[0]).format("YYYY-MM-DD");
                obj[endKey] = moment(value[1]).format("YYYY-MM-DD");
                //处理自定义字段 日期类型 需要添加 当前字段的空值
                //预防对其他日期类型影响，只对包括property_value的字段进行处理
                fieldName.includes('property_value') && (obj[fieldName] = '*');
            } else {
                obj[startKey] = '';
                obj[endKey] = '';
            }
        }else if(type === "number"){

            let numberObj = this.state.number[fieldName] || {};
             obj[fieldName] = `${numberObj[fieldStartKey]||''}*${numberObj[fieldEndKey]||''}`;

        }else if(type === 'singleDate'){
            obj[fieldName] = moment(value).format("YYYY-MM-DD");
        }
        else if (type === 'product') {
            obj[fieldName] = value.prodNo;
        } else if (type === 'multProduct') {
            if(value && value.length > 0){
                obj[fieldName] = value && value.map(item=>item.prodNo).join(',');
            } else {
                obj[fieldName] = '';
            }
        } else if(type ==='saleOrders'){
            if(value && value.length > 0){
                obj[fieldName] = value && value.map(item=>item[this.state.orderKey || 'displayBillNo']).join(',');
            } else {
                obj[fieldName] = '';
            }
        } else if(type === 'outBoundOrders'){
            if(value && value.length > 0){
                obj[fieldName] = value && value.map(item=>item.billNo).join(',');
            } else {
                obj[fieldName] = '';
            }
        }
        else if (type === 'category') {
            obj[fieldName] = value.value === ''?undefined:value.value;
        } else if (type === 'supplier') {
            obj[fieldName] = value.label === ''?undefined:value.label;
        } else if (type === 'customer') {
            obj[fieldName] = value.label === ''?undefined:value.label;
        } else if (type === 'depEmployee') {
            let groupNames = value.split('-');
            obj.departmentName = groupNames[0];
            obj.employeeName = groupNames[1];
            obj[fieldName] = value;
        } else if (type === 'finance') {
            obj[fieldName] = value.key;
        } else {
            obj[fieldName] = value;
        }

        console.log(obj);
        this.setState({
            params: obj
        });
    };

    changeBtnVisible = (flag, type) => {
        this.setState({
            [type]: flag
        });
    };

    onSelectChange = (fieldName, value,onSelectChanges) => {
        onSelectChanges && onSelectChanges(value);
        let getSelectState =  this.state.select;
        onSelectChanges && (getSelectState.usePerson && delete getSelectState.usePerson);
        onSelectChanges && (getSelectState.departmentId && delete getSelectState.employeeId);

        this.setState({
            select: {
                ...getSelectState,
                [fieldName]: value
            }
        });
        this.updateFilterCondition(fieldName, value);
        this.props.doFilter(this.state.params);

    };

    onProjectChange = (fieldName, value) => {
        console.log('onProjectChange:', fieldName, value);
        this.setState({
            project: {
                ...this.state.project,
                [fieldName]: value
            }
        });
        this.updateFilterCondition(fieldName, value);
        this.props.doFilter(this.state.params);
    };

    onGroupChange = (fieldName, value) => {
        console.log('onGroupChange:', fieldName, value);
        this.setState({
            group: {
                ...this.state.group,
                [fieldName]: value
            }
        });
        this.updateFilterCondition(fieldName, value);
        this.props.doFilter(this.state.params);
    };

    onInvoiceTypeChange= (fieldName, value) => {
        console.log('onInvoiceTypeChange:', fieldName, value);
        this.setState({
            invoiceType: {
                ...this.state.invoiceType,
                [fieldName]: value
            }
        });
        this.updateFilterCondition(fieldName, value);
        this.props.doFilter(this.state.params);
    };

    onSettlementChange = (fieldName, value) => {
        console.log('onSettlementChange:', fieldName, value);
        this.setState({
            settlement: {
                ...this.state.settlement,
                [fieldName]: value
            }
        });
        this.updateFilterCondition(fieldName, value);
        this.props.doFilter(this.state.params);
    };

    onWorkChange = (fieldName, value) => {
        console.log('onWorkChange:', fieldName, value);
        this.setState({
            work: {
                ...this.state.work,
                [fieldName]: value
            }
        });
        this.updateFilterCondition(fieldName, value);
        this.props.doFilter(this.state.params);
    };

    onCurrencyChange = (fieldName, value) => {
        console.log('onCurrencyChange:', fieldName, value);
        this.setState({
            work: {
                ...this.state.currency,
                [fieldName]: value
            }
        });
        this.updateFilterCondition(fieldName, value);
        this.props.doFilter(this.state.params);
    };


    onWarehouseChange = (fieldName, value) => {
        console.log('onWarehouseChange:', fieldName, value);
        this.setState({warehouse: value});
        this.updateFilterCondition(fieldName, value);
        this.props.doFilter(this.state.params);
    };

    onCategoryChange = (fieldName, value) => {
        console.log('onCategoryChange:', fieldName, value);
        this.setState({
            category: {
                ...this.state.category,
                [fieldName]: value
            }
        });
        this.updateFilterCondition(fieldName, value, 'category');
        this.props.doFilter(this.state.params);
    };

    openModal = (type) => {
        this.setState({
            [type]: true
        })
    };

    closeModal = (type) => {
        this.setState({
            [type]: false
        })
    };

    showGoodsList = (fieldName, prodSelectType,maxLength) => {
        this.setState({
            goodsTabKey: fieldName,
            prodSelectType: prodSelectType ? prodSelectType : 'radio',
            multiGoodsMaxLength: maxLength || 100
        });
        this.openModal('goodsPopVisible');
    };

    showSaleOrderList = (fieldName,salesSelectType,maxLength, orderKey = 'displayBillNo') => {
        this.setState({
            salesTabKey: fieldName,
            salesSelectType: salesSelectType ? salesSelectType : 'radio',
            saleOrdersMaxLength: maxLength || 100,
            orderKey
        });
        this.openModal('saleOrderPopVisible');
    }

    showOutBoundOrderList = (fieldName,salesSelectType,maxLength) => {
        this.setState({
            outBoundTabKey: fieldName,
            salesSelectType: salesSelectType ? salesSelectType : 'checkbox',
            saleOrdersMaxLength: maxLength || 100
        });
        this.openModal('outOrderPopVisible');
    }

    onSelectSupplier = (value) => {
        console.log(' onSelectSupplier :', value, value);
        this.setState({
            supplier: {
                ...value,
                [this.props.dataSource.supplierComponents[0].fieldName]: value
            }
        });
        this.updateFilterCondition(this.props.dataSource.supplierComponents[0].fieldName, value, 'supplier');
        this.props.doFilter(this.state.params);
    };

    onCustomerChange = (fieldName, value) => {
        console.log(' onCustomerChange :', fieldName, value);
        this.setState({
            customer: {
                [fieldName]: value
            }
        });
        this.updateFilterCondition(fieldName, value, 'customer');
        this.props.doFilter(this.state.params);
    };

    onMultiCustomerChange = (fieldName, value) => {
        console.log(' onMultiCustomerChange :', fieldName, value);
        this.setState({
            multiCustomer: {
                [fieldName]: value
            }
        });
        this.updateFilterCondition(fieldName, value, 'multiCustomer');
        this.props.doFilter(this.state.params);
    };

    onDepEmployeeChange = (fieldName, value) => {
        console.log('onDepEmployeeChange :', fieldName, value);
        this.setState({
            depEmployee: {
                ...this.state.depEmployee,
                [fieldName]: value
            }
        });
        this.updateFilterCondition(fieldName, value, 'depEmployee');
        this.props.doFilter(this.state.params);
    };

    onDepEmployeeByIdChange = (fieldName, value) => {
        console.log('onDepEmployeeByIdChange :', fieldName, value);
        this.setState({
            depEmployeeById: {
                ...this.state.depEmployeeById,
                [fieldName]: value
            }
        });
        this.updateFilterCondition(fieldName, value, 'depEmployeeById');
        this.props.doFilter(this.state.params);
    };

    onSelectFinanceType = (fieldName, value) => {
        console.log(' onSelectFinanceType :', fieldName, value);
        this.setState({
            finance: {
                ...this.state.finance,
                [fieldName]: value
            }
        });
        this.updateFilterCondition(fieldName, value, 'finance');
        this.props.doFilter(this.state.params);
    };

    onProductChange = (selectedRows, visibleKey) => {
        let {goodsTabKey: fieldName} = this.state;
        this.closeModal(visibleKey);
        if(this.state.prodSelectType === 'checkbox'){
            this.setState({
                product: {
                    [fieldName]: selectedRows
                }
            });
            this.updateFilterCondition(fieldName, selectedRows, 'multProduct');
            this.props.doFilter(this.state.params);
            this.props.doBackProductData && this.props.doBackProductData(selectedRows);
        } else {
            if (selectedRows.length > 0) {
                const item = selectedRows[0];
                this.setState({
                    product: {
                        item
                    }
                });

                this.updateFilterCondition(this.props.dataSource.productComponents[0].fieldName, item, 'product');
                this.props.doFilter(this.state.params);
                this.props.doBackProductData && this.props.doBackProductData(item);
            }
        }
    };

    onOutBoundOrderChange = (selectedRows)=>{
        console.log(selectedRows,'selectedRows');
        let {outBoundTabKey: fieldName} = this.state;
        if(this.state.salesSelectType === 'checkbox'){
            this.setState({
                outBoundOrders: {
                    [fieldName]: selectedRows
                }
            });
            this.updateFilterCondition(fieldName, selectedRows, 'outBoundOrders');
            this.props.doFilter(this.state.params);
            this.props.doBackProductData && this.props.doBackProductData(selectedRows);
        } else {
            if (selectedRows.length > 0) {
                const item = selectedRows[0];
                this.setState({
                    outBoundOrders: {
                        item
                    }
                });
                this.updateFilterCondition(this.props.dataSource.outBoundOrdersComponents[0].fieldName, item, 'outBoundOrders');
                this.props.doFilter(this.state.params);
                this.props.doBackProductData && this.props.doBackProductData(item);
            }
        }
    }

    onSalesOrderChange = (selectedRows, visibleKey) => {
        console.log(selectedRows, 'selectedRows');
        let {salesTabKey: fieldName} = this.state;
        this.closeModal(visibleKey);
        // if (this.state.salesSelectType === 'checkbox') {
            this.setState({
                saleOrders: {
                    [fieldName]: selectedRows
                }
            });
            this.updateFilterCondition(fieldName, selectedRows, 'saleOrders');
            this.props.doFilter(this.state.params);
            this.props.doBackProductData && this.props.doBackProductData(selectedRows);
        // } else {
        //     if (selectedRows.length > 0) {
        //         const item = selectedRows[0];
        //         this.setState({
        //             saleOrders: {
        //                 item
        //             }
        //         });
        //         this.updateFilterCondition(this.props.dataSource.saleOrderComponents[0].fieldName, item, 'saleOrders');
        //         this.props.doFilter(this.state.params);
        //         this.props.doBackProductData && this.props.doBackProductData(item);
        //     }
        // }
    }

    onDateChange = (fieldName, date, fieldStartKey, fieldEndKey) => {
        if (date && date.length === 0) {
            let date = this.state.date;
            delete date[fieldName];
            this.setState({
                date
            });
        } else {
            this.setState({
                date: {
                    ...this.state.date,
                    [fieldName]: date
                }
            });
        }
        this.updateFilterCondition(fieldName, date, "date", fieldStartKey, fieldEndKey);
        this.props.doFilter(this.state.params);
    };

    onNumberChange = (fieldName, value, fieldKey,item) => {
        let obj = this.state.number[fieldName] || {}
        obj[fieldKey] = value;
        this.setState({
            number: {
                ...this.state.number,
                [fieldName]: obj
            }
        },()=>{
            this.updateFilterCondition(fieldName, value, "number",item.fieldStartKey,item.fieldEndKey);
            //this.props.doFilter(this.state.params);
        });
    };

    onSingleDateChange = (fieldName, date) =>{
        this.setState({
            singleDate: {
                ...this.state.singleDate,
                [fieldName]: date
            }
        });
        this.updateFilterCondition(fieldName, date, 'singleDate');
        this.props.doFilter(this.state.params);
    }

    onIntervalInputChange = (fieldName, e) => {
        const {value} = e.target;
        this.setState({
            interval: {
                ...this.state.interval,
                [fieldName]: value
            }
        });
        this.updateFilterCondition(fieldName, value);
    };

    onCustomerSelectChange = (value) => {
        this.setState({propMappingName: value});
        this.updateFilterCondition("propMappingName", value);
    };

    onCustomerInputChange = (e) => {
        const {value} = e.target;
        this.setState({propValue: value});
        this.updateFilterCondition("propValue", value);
    };

    onInputChange = (e, fieldName) => {
        const {value} = e.target;
        this.setState({
            input: {
                ...this.state.input,
                [fieldName]: value
            }
        });
        this.updateFilterCondition(fieldName, value, 'input');
    };

    onInputNoBtnChange = (e, fieldName) => {
        const {value} = e.target;
        this.setState({
            inputNoBtn: {
                ...this.state.inputNoBtn,
                [fieldName]: value
            }
        });
        this.updateFilterCondition(fieldName, value, 'inputNoBtn');
        this.props.doFilter(this.state.params);
    };

    onInputSearch = (e, fieldName) => {
        console.log("onInputSearch:", fieldName);
        this.props.doFilter(this.state.params);
    };

    onCustomerSearch = () => {
        console.log("onCustomerSearch:", this.state.params.mappingName, this.state.params.propValue);
        let params = {
            ...this.state.params,
            [this.state.params.mappingName]: this.state.params.propValue
        };
        this.props.doFilter(params);
    };

    onIntervalSearch = () => {
        const {params} = this.state;
        const lower = params.wareQuantityLower;
        const upper = params.wareQuantityUpper;
        if (parseInt(lower) > parseInt(upper)) {
            Modal.error({
                title: intl.get("components.filterToolBar.index.warningTip"),
                content: intl.get("components.filterToolBar.index.intervalSearchMsg")
            })
        } else {
            this.props.doFilter(this.state.params);
        }

    };

    render() {
        const {
            prefixComponents,
            selectComponents,
            inputComponents,
            inputNoBtnComponents,
            datePickerComponents,
            numberPickerComponents,
            singleDateComponents,
            intervalComponents,
            customComponents,
            categoryComponents,
            productComponents,
            multProductComponents, // 物品多选
            supplierComponents,
            customerComponents,
            multiCustomerComponents, // 客户多选
            depEmployeeComponents,
            depEmployeeByIdComponents,
            financeComponents,
            projectComponents,
            groupComponents,
            settlementComponents,
            suffixComponents,
            warehouseComponents,
            workComponents,
            currencyComponents,
            saleOrderComponents,
            outBoundOrdersComponents,
            invoiceTypeComponents
        } = this.props.dataSource;


        const prefixComponentsField = prefixComponents && prefixComponents.map((item, index) =>
            <div className={cx('field-item')} key={index}>{item}</div>
        );
        const suffixComponentsField = suffixComponents && suffixComponents.map((item, index) =>
            <React.Fragment key={index}>{item}</React.Fragment>
        );
        const selectComponentsField = selectComponents && selectComponents.map((item, index) =>
            <div className={cx('field-item')} key={index}>
                <SelectGroup {...item} style={{width: item.width ? Number(item.width): 140}}
                             onChange={(value) => this.onSelectChange(item.fieldName, value,item.onSelectChanges)}
                             value={this.state.select[item.fieldName]}
                />
            </div>
        );
        const inputNoBtnComponentsField = inputNoBtnComponents && inputNoBtnComponents.map((item, index) =>
            <div className={cx('field-item')} key={index}>
                <span>{item.label  && intl.get(item.label)}：</span>
                <div style={{display: 'inline-block', verticalAlign: 'middle'}}>
                    <Input style={{width: item.width||240}}
                           placeholder={item.placeholder}
                           onChange={(e) => this.onInputNoBtnChange(e, item.fieldName)}
                           value={this.state.inputNoBtn[item.fieldName]}
                    />
                </div>
            </div>
        );
        const inputComponentsField = inputComponents && inputComponents.map((item, index) =>
            <div className={cx('field-item')} key={index}>
                <span>{item.label  && (item.label.split('.').length>2?intl.get(item.label):item.label)}：</span>
                <div className={cx('field-input')} style={{display: 'inline-block', verticalAlign: 'middle'}}
                  /*   onMouseEnter={() => this.changeBtnVisible(true, 'customSearchBtnVisible')}
                     onMouseLeave={() => this.changeBtnVisible(false, 'customSearchBtnVisible')}*/
                >
                    <Input style={{width: item.width||240}}
                           placeholder={item.placeholder}
                           onChange={(e) => this.onInputChange(e, item.fieldName)}
                           value={this.state.input[item.fieldName]}
                    />
                    <Button className={cx("input-btn")} onClick={this.onInputSearch}
                            /*style={{display: this.state.customSearchBtnVisible ? 'inline-block' : 'none'}}*/>{intl.get("components.filterToolBar.index.confirm")}</Button>
                </div>
            </div>
        );
        const datePickerComponentsField = datePickerComponents && datePickerComponents.map((item, index) =>
            <div className={cx('field-item')} key={index}>
                <span>{item.label && (item.label.split('.').length>2?intl.get(item.label):item.label)}：</span>
                <RangePicker onChange={(value) => this.onDateChange(item.fieldName, value, item.fieldStartKey, item.fieldEndKey)}
                             placeholder={[intl.get("components.filterToolBar.index.startTime"), intl.get("components.filterToolBar.index.endTime")]}
                             value={this.state.date[item.fieldName]}
                />
            </div>
        );

        const numberPickerComponentsField = numberPickerComponents && numberPickerComponents.map((item,index)=>
            <div className={cx('field-item')} key={index} >
                <span>{item.label}：</span>
                <InputNumber  value={this.state.number[item.fieldName]&&this.state.number[item.fieldName][item.fieldStartKey]} onChange={(value) => this.onNumberChange(item.fieldName, value, item.fieldStartKey, item)}/> - <InputNumber  value={this.state.number[item.fieldName]&&this.state.number[item.fieldName][item.fieldEndKey]} onChange={(value) => this.onNumberChange(item.fieldName, value, item.fieldEndKey, item)}/>
                <Button onClick={()=>this.props.doFilter(this.state.params)}>确定</Button>
            </div>
        );

        const singleDatePickerComponentsField = singleDateComponents && singleDateComponents.map((item, index) =>
            <div className={cx('field-item')} key={index}>
                <span>{item.label && intl.get(item.label)}：</span>
                <DatePicker format={"YYYY-MM-DD"} onChange={(value) => this.onSingleDateChange(item.fieldName, value)}
                             placeholder={"开始时间"}
                             value={this.state.singleDate[item.fieldName]?this.state.singleDate[item.fieldName]:null}
                />
            </div>
        );

        const intervalComponentsField = intervalComponents && intervalComponents.map((item, index) =>
            <div className={cx('field-item')} key={index}>
                <div
                    onMouseEnter={() => this.changeBtnVisible(true, 'intervalSearchBtnVisible')}
                    onMouseLeave={() => this.changeBtnVisible(false, 'intervalSearchBtnVisible')}
                    className={cx(["multi-filter", {"multi-filter-hover": this.state.intervalSearchBtnVisible}])}
                >
                    <span>{item.label && intl.get(item.label)}：</span>
                    <InputGroup style={{display: 'inline-block', width: 'auto'}}>
                        <Input style={{width: 100, textAlign: 'center'}}
                               onChange={(e) => this.onIntervalInputChange(item.firstFieldName, e)}
                               value={this.state.interval[item.firstFieldName]}
                               allowClear />
                        <span className={cx("input-group-split")}>-</span>
                        <Input style={{width: 100, textAlign: 'center'}}
                               onChange={(e) => this.onIntervalInputChange(item.secondFieldName, e)}
                               value={this.state.interval[item.secondFieldName]}
                               allowClear />
                    </InputGroup>
                    <Button onClick={this.onIntervalSearch}
                            style={{display: this.state.intervalSearchBtnVisible ? 'inline-block' : 'none'}}>{intl.get("components.filterToolBar.index.confirm")}</Button>
                </div>

            </div>
        );

        const customComponentsField = customComponents && customComponents.map((item, index) =>
            <div className={cx('field-item')} key={index}>
                <div
                    onMouseEnter={() => this.changeBtnVisible(true, 'customSearchBtnVisible')}
                    onMouseLeave={() => this.changeBtnVisible(false, 'customSearchBtnVisible')}
                    className={cx(["multi-filter", {"multi-filter-hover": this.state.customSearchBtnVisible}])}
                >
                    <span>{item.label && intl.get(item.label)}：</span>
                    <SelectGroup options={item.options} style={{width: 120}} onChange={this.onCustomerSelectChange}
                                 value={this.state.propMappingName}
                    />
                    <Input style={{width: 240, verticalAlign: 'top'}}
                           onChange={this.onCustomerInputChange}
                           value={this.state.propValue}
                           maxLength={50}
                           onPressEnter={this.onCustomerSearch}
                           allowClear
                    />
                    <Button onClick={this.onCustomerSearch}
                            style={{display: this.state.customSearchBtnVisible ? 'inline-block' : 'none'}}>{intl.get("components.filterToolBar.index.confirm")}</Button>
                </div>
            </div>
        );

        const financeComponentsField = financeComponents && financeComponents.map((item, index) =>
            <div className={cx('field-item')} key={index}>
                <span>{item.label && intl.get(item.label)}：</span>
                <SelectIncomeType
                    type={item.financeType}
                    showAll
                    placeholder={item.label && intl.get(item.label)}
                    value={this.state.finance[item.fieldName] || {
                        key: undefined,
                        label: undefined
                    }}

                    onChange={(value) => this.onSelectFinanceType(item.fieldName, value)}/>
            </div>
        );

        const projectComponentsField = projectComponents && projectComponents.map((item, index) =>
            <div className={cx('field-item')} key={index}>
                <span>{item.label && intl.get(item.label)}：</span>
                <SelectProject value={this.state.project[item.fieldName]}
                               onChange={(value) => this.onProjectChange(item.fieldName, value)}/>
            </div>
        );



        const settlementComponentsField = settlementComponents && settlementComponents.map((item, index) =>
            <div className={cx('field-item')} key={index}>
                <span>{item.label && intl.get(item.label)}：</span>
                <SelectSettlement value={this.state.settlement[item.fieldName]}
                               onChange={(value) => this.onSettlementChange(item.fieldName, value)}/>
            </div>
        );

        const workComponentsField = workComponents && workComponents.map((item, index) =>
            <div className={cx('field-item')} key={index}>
                <span>{item.label && intl.get(item.label)}：</span>
                <SelectWorkCenter value={this.state.work[item.fieldName]}
                               onChange={(value) => this.onWorkChange(item.fieldName, value)}/>
            </div>
        );

        const currencyComponentsField = currencyComponents && currencyComponents.map((item, index) =>
            <div className={cx('field-item')} key={index}>
                <span>{item.label && intl.get(item.label)}：</span>
                <SelectCurrency value={this.state.currency[item.fieldName]}
                                  onChange={(value) => this.onCurrencyChange(item.fieldName, value)}/>
            </div>
        );

        const groupComponentsField = groupComponents && groupComponents.map((item, index) =>
            <div className={cx('field-item')} key={index}>
                <span>{item.label && intl.get(item.label)}：</span>
                <SelectGroupType type={item.typeField} style={{width: "100px"}}  value={this.state.group[item.fieldName]}
                                 onChange={(value) => this.onGroupChange(item.fieldName, value)}/>
            </div>
        );

        const warehouseComponentsField = warehouseComponents && warehouseComponents.map((item, index) =>
            <div className={cx('field-item')} key={index}>
                <span>{item.label && intl.get(item.label)}：</span>
                <SelectDeliveryAddress placeholder={intl.get("components.filterToolBar.index.warehouse")} isWareHouses={true} value={this.state.warehouse}
                                       onChange={(value) => this.onWarehouseChange(item.fieldName, value)}/>
            </div>
        );

        const categoryComponentsField = categoryComponents && categoryComponents.map((item, index) =>
            <div className={cx('field-item')} key={index}>
                <span>{item.label && intl.get(item.label)}：</span>
                <SelectGoodsCate
                    value={this.state.category[item.fieldName] || {
                        value: '',
                        label: ''
                    }}
                    hideManage
                    onChange={(value) => this.onCategoryChange(item.fieldName, value)}
                />
            </div>
        );
        const prodName = this.state.product.item && this.state.product.item.prodName;
        const productComponentsField = productComponents && productComponents.map((item, index) =>
            <div className={cx('field-item')} key={index}>
                <span>{item.label && intl.get(item.label)}：</span>
                <div style={{display: 'inline-block', verticalAlign: 'middle'}}>
                    <Input
                        value={prodName || ''}
                        style={{minWidth: item.width||'200px'}}
                        allowClear={true}
                        readOnly={true}
                        onClick={this.showGoodsList}
                        onChange={(e) => {
                            if (!e.target.value) {
                                this.setState({
                                    product: {}
                                });
                                this.updateFilterCondition(this.props.dataSource.productComponents[0].fieldName, {}, 'product');
                                this.props.doFilter(this.state.params);
                            }
                        }}
                        suffix={prodName ? null : <EllipsisOutlined style={{fontSize: "16px"}} onClick={this.showGoodsList}/>}
                    />
                </div>
            </div>
        );

        // 物品弹层多选
        const multProductComponentsField = multProductComponents && multProductComponents.map((item, index) =>
            <div className={cx('field-item')} key={index}>
                <span>{item.label && intl.get(item.label)}：</span>
                <div style={{display: 'inline-block', verticalAlign: 'middle'}}
                     onClick={() => this.showGoodsList(item.fieldName, 'checkbox',item.maxLength)}
                >
                    <Select
                        style={{minWidth: item.width||'200px'}}
                        mode="multiple"
                        value={this.state.product[item.fieldName] && this.state.product[item.fieldName].map(item=>item.prodNo)}
                        allowClear={true}
                        readOnly={true}
                        showSearch={false}
                        open={false}
                        onChange={(arr) => {
                            let selectRows = this.state.product[item.fieldName].filter(item=>arr.indexOf(item.prodNo)!==-1);
                            this.setState({
                                product: {
                                    [item.fieldName]: selectRows
                                }
                            });
                            this.updateFilterCondition(item.fieldName, selectRows, 'multProduct');
                            this.props.doFilter(this.state.params);
                        }}
                    >
                        {
                            this.state.product[item.fieldName] && this.state.product[item.fieldName].map(item=>(
                                <Option key={item.prodNo}>{item.prodName}</Option>
                            ))
                        }
                    </Select>
                </div>
            </div>
        );

        //选择销售订单多选
        const saleOrderComponentsFields =  saleOrderComponents && saleOrderComponents.map((item, index)=>
            <div className={cx('field-item')} key={index}>
                <span>{item.label}：</span>
                <div style={{display: 'inline-block', verticalAlign: 'middle'}}
                     onClick={() => this.showSaleOrderList(item.fieldName, item.checkType || 'checkbox',item.maxLength, item.orderKey)}
                >
                    <Select
                        style={{minWidth: '200px'}}
                        mode="multiple"
                        value={this.state.saleOrders[item.fieldName] && this.state.saleOrders[item.fieldName].map(order=>order.displayBillNo)}
                        allowClear={false}
                        readOnly={true}
                        showSearch={false}
                        open={false}
                        onChange={(arr) => {
                            let selectRows = this.state.saleOrders[item.fieldName].filter(order=>arr.indexOf(order.displayBillNo)!==-1);
                            this.setState({
                                saleOrders: {
                                    [item.fieldName]: selectRows
                                }
                            });
                            this.updateFilterCondition(item.fieldName, selectRows, 'saleOrders');
                            this.props.doFilter(this.state.params);
                        }}
                    >
                        {
                            this.state.saleOrders[item.fieldName] && this.state.saleOrders[item.fieldName].map(item=>(
                                <Option key={item.displayBillNo}>{item.displayBillNo}</Option>
                            ))
                        }
                    </Select>
                </div>
            </div>
        );

        //选择出库订单多选  outBoundOrdersComponents
        const outBoundOrdersComponentsFields =  outBoundOrdersComponents && outBoundOrdersComponents.map((item, index)=>
            <div className={cx('field-item')} key={index}>
                {
                    item.required && <span className={cx("required-tit")}>*</span>
                }
                <span>{item.label}：</span>
                <div style={{display: 'inline-block', verticalAlign: 'middle'}}
                     onClick={() => this.showOutBoundOrderList(item.fieldName, 'checkbox',item.maxLength)}
                >

                    <Select
                        style={{minWidth: '200px',maxWidth: '600px'}}
                        mode="multiple"
                        value={this.state.outBoundOrders[item.fieldName] && this.state.outBoundOrders[item.fieldName].map(item=>item.displayBillNo)}
                        allowClear={false}
                        readOnly={true}
                        showSearch={false}
                        open={false}
                        onChange={(arr) => {
                            let selectRows = this.state.outBoundOrders[item.fieldName].filter(item=>arr.indexOf(item.displayBillNo)!==-1);
                            this.setState({
                                outBoundOrders: {
                                    [item.fieldName]: selectRows
                                }
                            });
                            this.updateFilterCondition(item.fieldName, selectRows, 'outBoundOrders');
                            this.props.doFilter(this.state.params);
                        }}
                    >
                        {
                            this.state.outBoundOrders[item.fieldName] && this.state.outBoundOrders[item.fieldName].map(item=>(
                                <Option key={item.billNo}>{item.billNo}</Option>
                            ))
                        }
                    </Select>
                </div>
            </div>
        );

        const supplierInfo = this.state.supplier.key ? {
            key: this.state.supplier.key,
            label: this.state.supplier.label
        } : {
            key: '',
            label: ''
        };
        const supplierComponentsField = supplierComponents && supplierComponents.map((item, index) =>
            <div className={cx('field-item')} key={index}>
                <span>{item.label && intl.get(item.label)}：</span>
                <SelectSupplier
                    maxLength={80}
                    value={supplierInfo}
                    onChange={(value) => this.onSelectSupplier(value)}
                />
            </div>
        );

        const customerComponentsField = customerComponents && customerComponents.map((item, index) =>
            <div className={cx('field-item')} key={index}>
                <span>{item.label && intl.get(item.label)}：</span>
                <SelectCustomer
                    value={this.state.customer[item.fieldName] || {
                        key: '',
                        label: ''
                    }}
                    hideManage
                    onChange={(value) => this.onCustomerChange(item.fieldName, value)}
                />
            </div>
        );

        const multiCustomerComponentsField = multiCustomerComponents && multiCustomerComponents.map((item, index) =>
            <div className={cx('field-item')} key={index}>
                {item.require?<span className={"red"} style={{marginRight: "5px", verticalAlign: "middle",fontWeight: "bold"}}>*</span>:null}
                <span>{item.label && intl.get(item.label)}：</span>
                <SelectMultiCustomer
                    value={this.state.multiCustomer[item.fieldName] || []}
                    maxLength={item.maxLength}
                    onChange={(value) => this.onMultiCustomerChange(item.fieldName, value)}
                />
            </div>
        );

        const invoiceTypeComponentsField = invoiceTypeComponents && invoiceTypeComponents.map((item, index) =>
            <div className={cx('field-item')} key={index}>
                <span>{item.label && intl.get(item.label)}：</span>
                <SelectInvoiceType value={this.state.invoiceType[item.fieldName]}
                                   onChange={(value) => this.onInvoiceTypeChange(item.fieldName, value)}/>
            </div>
        );

        const depEmployeeComponentsField = depEmployeeComponents && depEmployeeComponents.map((item, index) =>
            <div className={cx('field-item')} key={index}>
                <span>{item.label && intl.get(item.label)}：</span>
                <SelectEmployeeFix
                    width={200}
                    value={this.state.depEmployee[item.fieldName]}
                    onChange={(value) => this.onDepEmployeeChange(item.fieldName, value)}
                />
            </div>
        );

        const depEmployeeByIdComponentsField = depEmployeeByIdComponents && depEmployeeByIdComponents.map((item, index) =>
            <div className={cx('field-item')} key={index}>
                <span>{item.label && intl.get(item.label)}：</span>
                <SelectEmployeeIdFix
                    width={200}
                    value={this.state.depEmployeeById[item.fieldName]}
                    onChange={(value) => this.onDepEmployeeByIdChange(item.fieldName, value)}
                />
            </div>
        );

        const filterItems = Object.values(this.state.params).filter(item=> item!==undefined);

        // 物品弹层的所选行
        let selectedRows = this.state.product[this.state.goodsTabKey] || [];
        let selectedRowKeys = selectedRows && selectedRows.map(item => item.prodNo);

        return (
            <div
                style={this.props.style}
                className={cx(["filter-ope", this.props.className])}
            >
                <div className={cx("filter-ope-inner") + " cf"}>
                    {prefixComponentsField}
                    {selectComponentsField}
                    {inputComponentsField}
                    {inputNoBtnComponentsField}
                    {datePickerComponentsField}
                    {categoryComponentsField}
                    {intervalComponentsField}
                    {settlementComponentsField}
                    {customComponentsField}
                    {productComponentsField}
                    {multProductComponentsField}
                    {saleOrderComponentsFields}
                    {outBoundOrdersComponentsFields}
                    {multiCustomerComponentsField}
                    {supplierComponentsField}
                    {customerComponentsField}
                    {depEmployeeComponentsField}
                    {depEmployeeByIdComponentsField}
                    {financeComponentsField}
                    {projectComponentsField}
                    {warehouseComponentsField}
                    {singleDatePickerComponentsField}
                    {workComponentsField}
                    {currencyComponentsField}
                    {numberPickerComponentsField}
                    {groupComponentsField}
                    {invoiceTypeComponentsField}
                    <span onClick={this.doReset} className={cx("btn-reset")} style={{display:filterItems.length>0?'block':'none'}}><ReloadOutlined />{intl.get("components.filterToolBar.index.reset")}</span>
                    {suffixComponentsField}
                    <SelectGoodsOrFitting
                        visible={this.state.goodsPopVisible}
                        visibleFlag={'goodsPopVisible'}
                        onOk={(selectedRows, visibleKey) => this.onProductChange(selectedRows, visibleKey)}
                        onCancel={() => this.closeModal('goodsPopVisible')}
                        selectType={this.state.prodSelectType}
                        popType={'goods'}
                        condition={{disableFlag: 0}}
                        selectedRows={selectedRows}
                        selectedRowKeys={selectedRowKeys}
                        salePriceEditable={false}
                        maxLength={this.state.multiGoodsMaxLength}
                    />

                    <CopyFromSale
                        visible={this.state.saleOrderPopVisible}
                        visibleFlag={'saleOrderPopVisible'}
                        onOk={(selectedRows, visibleKey) => this.onSalesOrderChange(selectedRows, visibleKey)}
                        onCancel={() => this.closeModal('saleOrderPopVisible')}
                        selectType={this.state.salesSelectType}
                        popType={'goods'}
                        unitPriceSource='orderPrice'
                        copySource={'purchase'} //复制按钮的来源
                    />

                    <Modal
                        visible={this.state.outOrderPopVisible}
                        title={'选择出库单'}
                        width={'1400px'}
                        footer={null}
                        onCancel={() => this.closeModal('outOrderPopVisible')}
                        destroyOnClose={true}
                        okText={'确定'}
                        cancelText={'取消'}
                    >
                        <OutboundOrderPop  onCancel={() => this.closeModal('outOrderPopVisible')}
                                           onOk={(selectedRows) => this.onOutBoundOrderChange(selectedRows)}
                        />
                    </Modal>

                    {/*<SelectGoodsOrFitting*/}
                    {/*visible={this.state.goodsPopVisible}*/}
                    {/*visibleFlag={'goodsPopVisible'}*/}
                    {/*onOk={this.onMuliProductChange}*/}
                    {/*onCancel={() => this.closeModal('goodsPopVisible')}*/}
                    {/*selectType={"checkbox"}*/}
                    {/*popType={'goods'}*/}
                    {/*condition={{disableFlag: 0}}*/}
                    {/*selectedRows={selectedRows}*/}
                    {/*selectedRowKeys={selectedRowKeys}*/}
                    {/*salePriceEditable={false}*/}
                    {/*/>*/}

                </div>
            </div>
        )

    };
}

export default FilterToolBar