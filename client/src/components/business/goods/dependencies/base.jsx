import React, {Component} from 'react';
import _ from "lodash";
import {formatCurrency, removeCurrency} from 'utils/format';
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';
import classNames from "classnames/bind";
import styles from "../styles/index.scss";
const cx = classNames.bind(styles);

export default class Base extends Component {

    static formItemLayout = {
        labelCol: {
            xs: {span: 24},
            sm: {span: 0},
        },
        wrapperCol: {
            xs: {span: 24},
            sm: {span: 24},
        }
    };

    static SOURCE_MAP = {
        'PURCHASE': {
            unitPriceKey: 'orderPrice',
            priceAuthModule: 'purchasePrice',
            orderDateKey: 'purchaseOrderDate',
            deliveryDeadlineDateText : '交付日期应晚于采购日期',
            copyQuantityKey: 'unPurchaseNum'
        },
        'SALE': {
            unitPriceKey: 'salePrice',
            priceAuthModule: 'salePrice',
            orderDateKey: 'saleOrderDate',
            deliveryDeadlineDateText : '交付日期应晚于销售日期',
        },
        'QUOTATION':{
            unitPriceKey: 'salePrice',
            priceAuthModule: 'salePrice',
            orderDateKey: 'quotationDate',
            deliveryDeadlineDateText : '报价日期应晚于销售日期',
        },
        'INBOUND': {
            unitPriceKey: 'orderPrice',
            priceAuthModule: 'purchasePrice',
            copyQuantityKey: 'unStockIn'
        },
        'OUTBOUND': {
            unitPriceKey: 'orderPrice',
            priceAuthModule: 'purchasePrice'
        },
        'OUTBOUND_SALE': {
            unitPriceKey: 'salePrice',
            priceAuthModule: 'salePrice',
            copyQuantityKey: 'unStockOut'
        },   //销售出库
        'STOCK': {
            unitPriceKey: ''
        }
    };

    /** 判断当前所填写的值为空 */
    static isEmpty = (val) => {
        return val!==0 && !val;
    };

    /** 判断当前所填写的值不为空 */
    static isNotEmpty = (val) => {
        return val===0 || !(val===undefined || val===null || val==='');
    };

    /**
     *  数组转化为对象
     * @param array
     * @param key
     */
    static _invertArrayToObjectByKey = (array, key) => {
        let map = {};
        _.forEach(array, a => map[a[key]] = a);
        return map;
    };

    /**
     *  提供自定义字段
     * @param customKey
     * @param customConfigKey
     * @param customNum  自定义字段的数量
     * @return {Array}
     */
    static getCustomFields = ({customKey, customConfigKey, customNum=5, columnType}) => {
        let customArray = [];
        for(let i=1;i<=customNum;i++){
            customArray.push({
                key: `${customKey}${i}`,
                dataIndex: `${customKey}${i}`,
                columnName: `${customConfigKey}${i}`,
                width: 150,
                isCustomField: true,
                type: columnType
            })
        }
        return customArray;
    };

    closeModal = (tag) => {
        let obj = {};
        obj[tag] = false;
        this.setState(obj)
    };
    openModal = (tag) => {
        let obj = {};
        obj[tag] = true;
        this.setState(obj)
    };

    /**
     * 反算规则
     * **/
    inverseCalc = (quantity, taxRate, unitPrice, amount) => {
        let priceDecimalNum = getCookie("priceDecimalNum");

        quantity = quantity !== undefined ? parseFloat(quantity) : quantity;
        taxRate = taxRate !== undefined ? parseFloat(taxRate) / 100 : 0;
        unitPrice = unitPrice !== undefined ? parseFloat(unitPrice) : unitPrice;
        amount = amount !== undefined ? parseFloat(amount) : amount;
        let untaxedPrice, untaxedAmount, tax;

        if ((quantity === undefined) || (Base.isEmpty(unitPrice) && Base.isEmpty(amount))) {
            return;
        }

        if (unitPrice !== undefined) {
            amount = removeCurrency(formatCurrency(unitPrice * quantity, 2, true));
            untaxedPrice = fixedDecimal(unitPrice / (1 + taxRate), priceDecimalNum);
            untaxedAmount = removeCurrency(formatCurrency(unitPrice * quantity / (1 + taxRate), 2, true));
            tax = formatCurrency((unitPrice * quantity) - (unitPrice * quantity / (1 + taxRate)), 2, true);
        } else if (amount !== undefined) {
            unitPrice = fixedDecimal(amount / quantity, priceDecimalNum);
            untaxedPrice = fixedDecimal(amount / (quantity * (1 + taxRate)), priceDecimalNum);
            untaxedAmount = removeCurrency(formatCurrency(amount / (1 + taxRate), 2, true));
            tax = formatCurrency(amount - (amount / (1 + taxRate)), 2, true);
        }
        return {amount, unitPrice, untaxedPrice, untaxedAmount, tax}
    };

    /**
     *  提供需要显示的字段
     * @param configFields
     * @param columns
     * @return {*}
     */
    getVisibleColumns = (configFields, columns) => {
        if(!configFields) return columns;
        /** 数组转化为字符串 */
        let configFieldsMap = Base._invertArrayToObjectByKey(configFields, 'columnName');
        columns = _.map(columns, column => {
            let {columnName} = column;
            if(configFieldsMap[columnName]){
                let {label, visibleFlag, className} = configFieldsMap[columnName];
                if(!column.title) column.title = label;
                if(visibleFlag !== 1){
                    column.width = 0;
                    column.className = column.className ? cx('col-hide') + ' ' + column.className : cx('col-hide')
                }
            }
            return column;
        });
        return _.filter(columns, column => !column.isCustomField || (column.isCustomField && configFieldsMap[column.columnName]))  // 过滤掉不存在的自定义字段
    };

    render() {
        return null
    }

}





