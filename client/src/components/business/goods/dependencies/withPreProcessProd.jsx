import React, {Component} from 'react';
import _ from "lodash";
import {formatCurrency, removeCurrency} from 'utils/format';
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';
import Base from './base';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");

export default function withPreProcessProd(WrappedComponent) {
    return class withPreProcessProd extends Base {
        constructor(props) {
            super(props);
            this.state = {
            }
        }

        _setPreProcessFn = (type) => {
            return '_setPreProcessBy'+ type.substring(0,1).toUpperCase()+type.substring(1);
        };

        /** 初始化物品弹层的物品*/
        _setPreProcessByGoodsPop = (source, defaultForm, list) => {
            let priceDecimalNum = getCookie("priceDecimalNum");
            let quantityDecimalNum = getCookie("quantityDecimalNum");
            let {displayCode: prodCustomNo, description: descItem,
                id, editable, code, name, minQuantity, maxQuantity,imageUrl, categoryCode, categoryName,currentQuantity, failNum,mallProd,successNum, remarks,discountSalePrice, ...out} = list;
            let unitConverter = out.unitConverter || 1;
            let unitConverterText = `1${out.recUnit || out.unit}=${unitConverter || 1}${out.unit}`;
            let quantity = out.quantity;
            if(source === 'QUOTATION'){
                quantity = 1;
            }
            let recQuantity;
            if(quantity || quantity===0) recQuantity = fixedDecimal(_.divide(quantity, unitConverter), quantityDecimalNum);
            let unitPrice = out[Base.SOURCE_MAP[source].unitPriceKey];
            if(unitPrice){
                unitPrice = fixedDecimal(unitPrice, priceDecimalNum);
            }
            let taxRate = (defaultForm && defaultForm.taxRate) || 0;
            let obj = this.inverseCalc(quantity, taxRate, unitPrice, null);
            if(obj) out = {...out, ...obj};
            if(source === 'STOCK'){ // 盘点时
                out.systemNum = currentQuantity;
                out.unitFlag = false; // 盘点无多单位
            }

            return {
                ...defaultForm,
                ...out,
                productCode: out.productCode || out.prodNo,
                prodNo: out.productCode || out.prodNo,
                prodCustomNo,
                descItem,
                unitConverter,
                unitConverterText,
                recQuantity,
                quantity,
                recUnit: out.recUnit || out.unit,
                unitPrice,
                remarks,
            };
        };

        /** 初始化物品建议词的物品*/
        _setPreProcessByGoodsSuggest = (source, defaultForm, list) => {
            let {code: productCode, displayCode: prodCustomNo, name: prodName, description: descItem,
                minQuantity, maxQuantity,categoryCode, categoryName,currentQuantity=0, failNum,mallProd,successNum, remarks, ...out} = list;
            let unitConverter = out.unitConverter || 1;
            let unitConverterText = `1${out.recUnit || out.unit}=${unitConverter || 1}${out.unit}`;
            if(source === 'STOCK'){ // 盘点时
                out.systemNum = currentQuantity;
                out.unitFlag = false; // 盘点无多单位
            }

            if(source === 'QUOTATION'){
                let priceDecimalNum = getCookie("priceDecimalNum");
                let quantityDecimalNum = getCookie("quantityDecimalNum");
                out.quantity = 1;
                out.recQuantity = fixedDecimal(_.divide(out.quantity, unitConverter), quantityDecimalNum);
                let unitPrice = out[Base.SOURCE_MAP[source].unitPriceKey];
                if(unitPrice){
                    unitPrice = fixedDecimal(unitPrice, priceDecimalNum);
                }
                let taxRate = (defaultForm && defaultForm.taxRate) || 0;
                let obj = this.inverseCalc(out.quantity, taxRate, unitPrice, null);
                if(obj) out = {...out, ...obj};
            }
            return {
                ...defaultForm,
                ...out,
                productCode,
                prodCustomNo,
                prodName,
                descItem,
                unitConverter,
                unitConverterText,
                remarks,
                prodNo: productCode,
                recUnit: out.recUnit || out.unit,
                unitPrice: out[Base.SOURCE_MAP[source].unitPriceKey],
            };
        };

        /** 初始化从订单复制弹层的物品*/
        _setPreProcessByCopyOrderPop = (source, defaultForm, list) => {
            let quantityDecimalNum = getCookie("quantityDecimalNum");
            let priceDecimalNum = getCookie("quantityDecimalNum");
            let {addedTime, amount, isDeleted, outNum, purchaseNum, receiverQuantity, tax, unOutNum, untaxedAmount, untaxedPrice, updatedTime,...out} = list;
            if(out.deliveryDeadlineDate) {
                out.deliveryDeadlineDate = moment(out.deliveryDeadlineDate);
            }
            let unitConverter = out.unitConverter || 1;
            let unitConverterText = `1${out.recUnit}=${unitConverter || 1}${out.unit}`;
            let quantity = out[Base.SOURCE_MAP[source].copyQuantityKey];
            let recQuantity;
            if(quantity || quantity===0) recQuantity = fixedDecimal(_.divide(quantity, unitConverter), quantityDecimalNum);
            let taxRate = out.taxRate || (defaultForm && defaultForm.taxRate) || 0;
            let unitPrice = out.unitPrice || 0;
            if(unitPrice){
                unitPrice = fixedDecimal(unitPrice, priceDecimalNum);
            }
            let obj = this.inverseCalc(quantity, taxRate, unitPrice, null);
            if(obj) out = {...out, ...obj};
            return {
                ...out,
                prodNo: out.productCode,
                recUnit: out.recUnit || out.unit,
                unitConverter,
                unitConverterText,
                recQuantity,
                quantity,
                unitPrice,
                taxRate
            };
        };

        /** 初始化修改的物品*/
        _setPreProcessByModify = (source, defaultForm, list) =>{
            let {id,addedTime,entNum,isDeleted,minQuantity,maxQuantity,orderCode,orderCodeV2,categoryCode,quantityDelivered,unEntNum,updatedTime,thumbnailUri,serialNumberList,...out} = list;
            let unitConverter = out.unitConverter || 1;
            let unitConverterText = `1${out.recUnit || out.unit}=${unitConverter || 1}${out.unit}`;
            if(!out.productCode){
                out.productCode = out.prodNo;
            }
            if(out.deliveryDeadlineDate) {
                out.deliveryDeadlineDate = moment(out.deliveryDeadlineDate);
            }
            if(out.productionDate){
                out.productionDate = moment(out.productionDate);
            }
            if(out.expirationDate){
                out.expirationDate = moment(out.expirationDate);
            }
            if(out.amount){
                out.amount = removeCurrency(formatCurrency(out.amount, 2, true))
            }
            if(serialNumberList){
                out.serialNumber = _.join(serialNumberList, ',');
            }
            return {
                ...out,
                unitConverter,
                unitConverterText
            };
        };

        /** 初始化从对规格弹层的物品*/
        _setPreProcessByMultiSpecGoods = (source, defaultForm, list) => {
            let quantityDecimalNum = getCookie("quantityDecimalNum");
            let {key, categoryCode, categoryName, code, currentQuantity, description, displayCode, editable,imageUrl,form, failNum,mallProd,name,successNum, remarks,wareIsFetching, ...out} = list;
            let unitConverter = out.unitConverter || 1;
            let unitConverterText = `1${out.recUnit || out.unit}=${unitConverter || 1}${out.unit}`;
            let quantity = out.quantity;
            let taxRate = (defaultForm && defaultForm.taxRate) || 0;
            let recQuantity;
            if(quantity || quantity===0) recQuantity = fixedDecimal(_.divide(quantity, unitConverter), quantityDecimalNum);
            let unitPrice = out[Base.SOURCE_MAP[source].unitPriceKey];
            let obj = this.inverseCalc(quantity, taxRate, unitPrice, null);
            if(obj) out = {...out, ...obj};
            return {
                ...defaultForm,
                ...out,
                productCode: out.prodNo,
                unitConverter,
                unitConverterText,
                recQuantity,
                quantity,
                taxRate,
                remarks,
                recUnit: out.recUnit || out.unit,
                unitPrice
            };
        };

        /** 初始化物品*/
        _setPreProcessByGoods = (source, defaultForm, list) => {
            let quantityDecimalNum = getCookie("quantityDecimalNum");
            let {categoryCode, categoryName,failNum,mallProd,successNum,description,name,code, displayCode, ...out} = list;
            if(out.deliveryDeadlineDate) {
                out.deliveryDeadlineDate = moment(out.deliveryDeadlineDate);
            }
            if(out.productionDate){
                out.productionDate = moment(out.productionDate);
            }
            if(out.expirationDate){
                out.expirationDate = moment(out.expirationDate);
            }
            let recUnit = out.recUnit || out.unit;
            let unitConverter = out.unitConverter || 1;
            let unitConverterText = `1${recUnit}=${unitConverter || 1}${out.unit}`;
            let quantity = out.quantity;
            let taxRate = (defaultForm && defaultForm.taxRate) || out.taxRate || 0;
            let unitPrice = out.unitPrice || out[Base.SOURCE_MAP[source].unitPriceKey];
            let recQuantity;
            if(quantity || quantity===0) recQuantity = fixedDecimal(_.divide(quantity, unitConverter), quantityDecimalNum);
            let obj = this.inverseCalc(quantity, taxRate, unitPrice, null);
            if(obj) out = {...out, ...obj};
            return {
                ...out,
                productCode: code,
                prodNo: code,
                prodCustomNo: displayCode,
                prodName: name,
                descItem: description,
                recUnit,
                unitConverterText,
                quantity,
                recQuantity,
                taxRate,
                unitPrice
            }
        };

        /** 初始化扫码录单*/
        _setPreProcessByScan = (source, defaultForm, list) => {
            let quantityDecimalNum = getCookie("quantityDecimalNum");
            let {code: productCode, displayCode: prodCustomNo, name: prodName, description: descItem,
                minQuantity, maxQuantity,categoryCode,categoryName,images, currentQuantity=0, failNum,mallProd,successNum, remarks, ...out} = list;
            let unitConverter = out.unitConverter || 1;
            let unitConverterText = `1${out.recUnit || out.unit}=${unitConverter || 1}${out.unit}`;
            let quantity = 1;
            let recQuantity = fixedDecimal(_.divide(quantity, unitConverter), quantityDecimalNum);
            let unitPrice = out[Base.SOURCE_MAP[source].unitPriceKey];
            let obj = {};
            if(defaultForm && defaultForm.taxRate){
                obj = this.inverseCalc(quantity, defaultForm.taxRate, unitPrice, null);
            }
            if(obj) out = {...out, ...obj};
            if(source === 'STOCK'){ // 盘点时
                out.systemNum = currentQuantity;
                out.unitFlag = false; // 盘点无多单位
            }
            return {
                ...defaultForm,
                ...out,
                productCode,
                prodNo: productCode,
                prodCustomNo,
                prodName,
                descItem,
                unitConverter,
                unitConverterText,
                recQuantity,
                quantity,
                remarks,
                recUnit: out.recUnit || out.unit,
                unitPrice
            };
        };

        /**
         * 预处理物品数据
         * @param type  处理的类型
         * @param source    单据的来源
         * @param defaultForm  默认带入物品的数据
         * @param list  物品列表数据(单条)
         * @param lists  物品列表数据(多条)
         */
        preProcessProd = ({type, source, defaultForm, list, lists}) => {
            if(!list && !lists) return false;
            let fn = this._setPreProcessFn(type);
            if(!this[fn]) return false;
            if(list && _.isObject(list)) return this[fn](source, defaultForm, list);
            if(lists && _.isArray(lists)) return _.map(lists, (list) => this[fn](source, defaultForm, list));
            return false;
        };

        render(){
            return (
                <React.Fragment>
                    <WrappedComponent
                        {...this.props}
                        preProcessProd={this.preProcessProd}
                    />
                </React.Fragment>
            )
        }
    }
}