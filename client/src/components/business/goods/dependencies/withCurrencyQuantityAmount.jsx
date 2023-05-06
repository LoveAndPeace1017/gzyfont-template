import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom'
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {PRICE_NO_AUTH_RENDER} from 'utils/constants';
import defaultOptions from 'utils/validateOptions';
import {formatCurrency, removeCurrency} from 'utils/format';
import {numberReg} from 'utils/reg';
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';
import {isAuth} from 'utils/authComponent';
import {AuthInput} from 'components/business/authMenu';
import Tooltip from 'components/widgets/tooltip';
import {Input, Form, Spin} from "antd";
import {SelectRate} from 'pages/auxiliary/rate';
import {SelectUnit} from 'pages/auxiliary/goodsUnit';
import {actions as addGoodsActions} from 'pages/goods/add';
import Base from './base';
import _ from "lodash";

const mapStateToProps = (state) => ({
    stockInfo: state.getIn(['goodsAdd', 'stockInfo']),
    currentAccountInfo: state.getIn(['commonInfo', 'currentAccountInfo'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchStockByCode: addGoodsActions.asyncFetchStockByCode
    }, dispatch)
};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
export default function withQuantityAmount(WrappedComponent) {
    return class WithQuantityAmount extends Base {
        static propTypes = {
            /** 字段的key前缀，一般会改成我们向后端提交数据时，后端需要的名称 */
            dataPrefix: PropTypes.string,
            /** 获取表单数据 */
            getFormField: PropTypes.func,
            /** 填充当前行数据 */
            setFormField: PropTypes.func,
            /** 填充总数量*/
            setTotalQuantity: PropTypes.func,
            /** 填充含税总金额 */
            setTotalAmount: PropTypes.func,
            /** 填充优惠金额 */
            setAggregateAmount: PropTypes.func,
            /** 填充优惠后金额 */
            setDiscountAmount: PropTypes.func,
            /** 获取合计相关的值 */
            getTotalForm: PropTypes.func,
            /** 填充合计相关的值*/
            setTotalForm: PropTypes.func,
        };

        constructor(props) {
            super(props);
            this.state = {
                quantity: 0,
                amount: 0
            }
        }

        /**
         * 处理基本数量变化
         * **/
        handleRecQuantityChange = (value, idx, key) => {
            let quantityDecimalNum = getCookie("quantityDecimalNum");
            let priceDecimalNum = getCookie("priceDecimalNum");
            let {getFormState, getFormField, setFormField} = this.props;
            const {getFieldValue} = this.props.formRef.current;
            let quotation = getFieldValue('quotation') || 100;
            let row = getFormState(idx);
            const unitConverter = row.unitConverter || 1;

            value = value || 0;
            let quantity = fixedDecimal(value * unitConverter, quantityDecimalNum);
            let taxRate = getFormField(key, 'taxRate');
            let unitPrice = getFormField(key, 'unitPrice');
            let amount = getFormField(key, 'amount');
            setFormField(key, {quantity: quantity});  // 改变数量
            let obj = this.inverseCalc(quantity, taxRate, unitPrice, amount) || {};
            if(obj) {
                setFormField(key, {
                    untaxedPrice: obj.untaxedPrice,
                    tax: obj.tax,
                    unitPrice: obj.unitPrice,
                    amount: obj.amount,
                    untaxedAmount: obj.untaxedAmount,
                    currencyUnitPrice: fixedDecimal(obj.unitPrice*quotation/100, priceDecimalNum),
                    currencyAmount: removeCurrency(formatCurrency(obj.amount*quotation/100, 2, true))
                });
            }

            // 计算合计
            let q = _.subtract(quantity||0, this.quantity||0);
            let a = _.subtract(obj.amount||0, this.amount||0);
            this.calcTotalForOneRow(q, a);
        };

        /** 处理税率变化 */
        handleRateChange = (value, idx, key) => {
            let priceDecimalNum = getCookie("priceDecimalNum");
            let { getFormField, setFormField} = this.props;
            const {getFieldValue} = this.props.formRef.current;
            let quotation = getFieldValue('quotation') || 100;
            let quantity = getFormField(key, 'quantity');
            let unitPrice = getFormField(key, 'unitPrice');
            let amount = getFormField(key, 'amount');

            const val = value && value !== '' ? parseFloat(value) : 0;
            let obj = this.inverseCalc(quantity, val, unitPrice, amount) || {};
            obj && setFormField(key, {
                untaxedPrice: obj.untaxedPrice,
                tax: obj.tax,
                unitPrice: obj.unitPrice,
                amount: obj.amount,
                untaxedAmount: obj.untaxedAmount,
                currencyUnitPrice: fixedDecimal(obj.unitPrice*quotation/100, priceDecimalNum),
                currencyAmount: removeCurrency(formatCurrency(obj.amount*quotation/100, 2, true))
            });
            // 计算合计
            let a = _.subtract(obj.amount||0, amount||0);
            this.calcTotalForOneRow(null, a);
        };

        /** 处理含税单价变化 */
        handleUnitPriceChange = (value, idx, key) => {
            let priceDecimalNum = getCookie("priceDecimalNum");
            let {getFormField, setFormField} = this.props;
            const {getFieldValue} = this.props.formRef.current;
            let quotation = getFieldValue('quotation') || 100;
            let quantity = getFormField(key, 'quantity');
            let taxRate = getFormField(key, 'taxRate');
            let amount = getFormField(key, 'amount');

            value = value || 0;
            let obj = this.inverseCalc(quantity, taxRate, value, undefined) || {};
            obj && setFormField(key, {
                untaxedPrice: obj.untaxedPrice,
                tax: obj.tax,
                unitPrice: obj.unitPrice,
                amount: obj.amount,
                untaxedAmount: obj.untaxedAmount,
                currencyUnitPrice: fixedDecimal(obj.unitPrice*quotation/100, priceDecimalNum),
                currencyAmount: removeCurrency(formatCurrency(obj.amount*quotation/100, 2, true))
            });
            // 计算合计
            let a = _.subtract(obj.amount||0, amount||0);
            this.calcTotalForOneRow(null, a);
        };

        /** 处理价税合计变化 */
        handleAmountChange = (value, idx, key) => {
            let priceDecimalNum = getCookie("priceDecimalNum");
            let {getFormField, setFormField} = this.props;
            const {getFieldValue} = this.props.formRef.current;
            let quotation = getFieldValue('quotation') || 100;
            let quantity = getFormField(key, 'quantity');
            let taxRate = getFormField(key, 'taxRate');

            value = value || 0;
            let obj = this.inverseCalc(quantity, taxRate, undefined, value) || {};
            obj && setFormField(key, {
                untaxedPrice: obj.untaxedPrice,
                tax: obj.tax,
                unitPrice: obj.unitPrice,
                amount: obj.amount,
                untaxedAmount: obj.untaxedAmount,
                currencyUnitPrice: fixedDecimal(obj.unitPrice*quotation/100, priceDecimalNum),
                currencyAmount: removeCurrency(formatCurrency(obj.amount*quotation/100, 2, true))
            });
            // 计算合计
            let a = _.subtract(obj.amount||0, this.amount||0);
            this.calcTotalForOneRow(null, a);
        };

        /** 获取当前行的数量和 */
        handleOnFocus = (idx, key) => {
            let {getFormField} = this.props;
            let quantity = getFormField(key, 'quantity') || 0;
            let amount = getFormField(key, 'amount') || 0;
            this.quantity = quantity;
            this.amount = amount;
        };

        /** 当某一行的数据发生改变时，通过改方法计算合计*/
        calcTotalForOneRow = (quantity=0, amount=0) => {
            let {getTotalForm, setTotalForm} = this.props;
            const {getFieldValue} = this.props.formRef.current;
            let quotation = getFieldValue('quotation') || 100;
            let {totalQuantity, totalAmount, aggregateAmount, currencyTotalAmount} = getTotalForm();
            totalQuantity = _.add(totalQuantity*1, quantity);
            totalAmount = _.add(totalAmount*1, amount);
            aggregateAmount = _.add(aggregateAmount*1, amount);
            currencyTotalAmount = aggregateAmount * quotation / 100 ;
            setTotalForm({totalQuantity, totalAmount, aggregateAmount, currencyTotalAmount});
        };

        /**
         * 计算总数量
         * **/
        calcTotal = () => {
            let {getFormField, getTotalForm, setTotalForm} = this.props;
            const {getFieldValue} = this.props.formRef.current;
            let quotation = getFieldValue('quotation') || 100;
            setTimeout(()=>{
                let totalQuantity = 0, totalAmount = 0;
                let discountAmount = getTotalForm('discountAmount') || 0;
                let dataSource = getFormField();
                _.forIn(dataSource, (data) =>{
                    if (data){
                        if(data.quantity) totalQuantity += data.quantity*1;
                        if(data.amount) totalAmount += data.amount*1;
                    }
                });
                let aggregateAmount = _.subtract(totalAmount, discountAmount);
                let currencyTotalAmount = aggregateAmount * quotation / 100;
                setTotalForm({totalQuantity, totalAmount, aggregateAmount, currencyTotalAmount});
            },50)
        };

        /** 当牌价发生变化时*/
        handleQuotationOnChange = (quotation) => {
            let priceDecimalNum = getCookie("priceDecimalNum");
            let {getFormField, setFormField, getTotalForm, setTotalForm} = this.props;
            setTimeout(()=>{
                let dataSource = getFormField();
                _.forIn(dataSource, (data, key) =>{
                    if (data){
                        let currencyUnitPrice = 0, currencyAmount = 0;
                        if(data.unitPrice) currencyUnitPrice =  fixedDecimal(data.unitPrice*quotation/100, priceDecimalNum);
                        if(data.amount) currencyAmount = removeCurrency(formatCurrency(data.amount*quotation/100, 2, true));
                        setFormField(key, {currencyUnitPrice, currencyAmount});
                    }
                });
                let {aggregateAmount} = getTotalForm();
                let currencyTotalAmount = aggregateAmount * quotation / 100;
                setTotalForm({currencyTotalAmount});
            },50)
        };

        /**
         * 加载库存数据
         * **/
        loadStock = (visible, code) => {
            if (visible) {
                this.props.asyncFetchStockByCode(code);
            }
        };

        render() {
            let { dataPrefix, source, stockInfo, currentAccountInfo } = this.props;
            let quantityDecimalNum = getCookie("quantityDecimalNum");
            let priceDecimalNum = getCookie("priceDecimalNum");
            const accountInfo = currentAccountInfo.get('data');
            let authModule = Base.SOURCE_MAP[source].priceAuthModule;
            const priceAuthFlag = isAuth(accountInfo, authModule, 'show');

            let stockData = stockInfo.get('data') ? stockInfo.get('data').toJS() : [];
            const reg = numberReg.numberOnlyTwo;

            /** 数量 */
            let recQuantityColumn = {
                title: '数量',
                required: true,
                key: 'recQuantity',
                dataIndex: 'recQuantity',
                columnName: 'recQuantity',
                width: 120,
                render: (text, record, index) => {
                    let {productCode} = record;
                    const inputStr = (
                        <Form.Item
                            name={[dataPrefix, record.key, 'recQuantity']}
                            rules={[
                                {
                                    validator: (rules, value, callback) => {
                                        let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+ quantityDecimalNum +'})?$/');
                                        if(!value){
                                            callback('该项为必填项');
                                        } else if (!reg.test(value)) {
                                            callback(`整数部分不能超过10位，小数点后不能超过${quantityDecimalNum}位`);
                                        } else if(value === 0 || value === '0'){
                                            callback(`数量不能为0！`);
                                        }
                                        callback();
                                    }
                                }
                            ]}
                        >
                            <Input maxLength={11+Number(quantityDecimalNum)}
                                   onFocus={()=>{this.handleOnFocus(index, record.key)}}
                                   onBlur={(e)=>{this.handleRecQuantityChange(e.target.value, index, record.key)}}/>
                        </Form.Item>
                    );
                    return (
                        <React.Fragment>
                            {
                                productCode ? (
                                    <Tooltip
                                        type="info"
                                        title={
                                            <Spin
                                                spinning={stockInfo.get('isFetching')}
                                            >
                                                <div>
                                                    <p>当前库存：{stockData && stockData[0] && stockData[0].currentQuantity}</p>
                                                    <p>库存上限：{stockData && stockData[0] && stockData[0].maxQuantity}</p>
                                                    <p>库存下限：{stockData && stockData[0] && stockData[0].minQuantity}</p>
                                                </div>
                                            </Spin>
                                        }
                                        onVisibleChange={(visible) => this.loadStock(visible, productCode)}
                                    >
                                        {inputStr}
                                    </Tooltip>
                                ) : (<React.Fragment>
                                    {inputStr}
                                </React.Fragment>)
                            }
                        </React.Fragment>
                    )
                }
            };

            /** 单位关系 */
            let unitConverterColumn = {
                title: '单位关系',
                key: 'unitConverterText',
                dataIndex: 'unitConverterText',
                columnName: 'unitConverter',
                width: 150
            };

            /** 基本单位数量 */
            let quantityColumn = {
                title: '基本单位数量',
                key: 'quantity',
                dataIndex: 'quantity',
                columnName: 'quantity',
                width: 150,
                type: 'INPUT',
                readOnly: true
            };

            /**未税单价 */
            let unTaxedPriceColumn = {
                title: '未税单价',
                key: 'untaxedPrice',
                dataIndex: 'untaxedPrice',
                columnName: 'untaxedPrice',
                width: 150,
                align: 'right',
                type: 'INPUT',
                readOnly: true,
                isValidatePriceAuth: true,  // 是否校验价格权限
                priceAuthFlag: priceAuthFlag,  // 是否有价格权限
            };

            /** 单价 */
            let unitPriceColumn = {
                title: '单价',
                key: 'unitPrice',
                dataIndex: 'unitPrice',
                columnName: 'unitPrice',
                width: 150,
                align: 'right',
                isValidatePriceAuth: true,  // 是否校验价格权限
                priceAuthFlag: priceAuthFlag,  // 是否有价格权限
                render: (unitPrice, record, index) => {
                    return (
                        <React.Fragment>
                            <Form.Item
                                {...defaultOptions}
                                name={[dataPrefix, record.key, 'unitPrice']}
                                rules={[
                                    {
                                        validator: (rules, value, callback) => {
                                            let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+ priceDecimalNum +'})?$/');
                                            if (value && !reg.test(value)) {
                                                callback(`整数部分不能超过10位，小数点后不能超过${priceDecimalNum}位`);
                                            }
                                            callback();
                                        }
                                    }
                                ]}
                            >
                                <Input maxLength={11+Number(quantityDecimalNum)}
                                       onBlur={(e)=>{this.handleUnitPriceChange(e.target.value, index, record.key)}}
                                />
                            </Form.Item>
                        </React.Fragment>
                    )
                }
            };

            /** 金额 */
            let unTaxedAmountColumn = {
                title: '未税金额',
                key: 'untaxedAmount',
                dataIndex: 'untaxedAmount',
                columnName: 'untaxedAmount',
                isValidatePriceAuth: true,  // 是否校验价格权限
                priceAuthFlag: priceAuthFlag,  // 是否有价格权限
                width: 150,
                render: (untaxedAmount, record, index) => {
                    return (
                        <Form.Item
                            {...defaultOptions}
                            name={[dataPrefix, record.key, 'untaxedAmount']}
                            rules={[
                                {
                                    validator: (rules, value, callback) => {
                                        if(value && !reg.rules.test(value)){
                                            callback(reg.message);
                                        }
                                        callback();
                                    }
                                }
                            ]}
                        >
                            <Input maxLength={13}/>
                        </Form.Item>
                    )
                }
            };

            /** 税率 */
            let taxRateColumn = {
                title: '税率',
                key: 'taxRate',
                dataIndex: 'taxRate',
                columnName: 'taxRate',
                width: 150,
                align: 'right',
                render: (text, record, index) => {
                    return (
                        <Form.Item
                            {...defaultOptions}
                            name={[dataPrefix, record.key, 'taxRate']}
                        >
                            <SelectRate showEdit
                                        onChange={(value) => this.handleRateChange(value, index, record.key)}/>
                        </Form.Item>
                    )
                }
            };

            /** 税额 */
            let taxColumn = {
                title: '税额',
                key: 'tax',
                dataIndex: 'tax',
                columnName: 'tax',
                type: 'INPUT',
                readOnly: true,
                isValidatePriceAuth: true,  // 是否校验价格权限
                priceAuthFlag: priceAuthFlag,  // 是否有价格权限
            };

            /** 价税合计 */
            let amountColumn = {
                title: '金额',
                key: 'amount',
                dataIndex: 'amount',
                columnName: 'amount',
                isValidatePriceAuth: true,  // 是否校验价格权限
                priceAuthFlag: priceAuthFlag,  // 是否有价格权限
                render: (amount, record, index) => {
                    return (
                        <Form.Item
                            {...defaultOptions}
                            name={[dataPrefix, record.key, 'amount']}
                            rules={[
                                {
                                    validator: (rules, value, callback) => {
                                        if(value && !reg.rules.test(value)){
                                            callback(reg.message);
                                        }
                                        callback();
                                    }
                                }
                            ]}
                        >
                            <Input maxLength={14}
                                   onFocus={()=>{this.handleOnFocus(index, record.key)}}
                                   onBlur={(e)=>{this.handleAmountChange(e.target.value, index, record.key)}} />
                        </Form.Item>
                    )
                }
            };

            /** 本币单价 */
            let currencyUnitPriceColumn = {
                title: '本币单价',
                key: 'currencyUnitPrice',
                dataIndex: 'currencyUnitPrice',
                columnName: 'currencyUnitPrice',
                width: 150,
                align: 'right',
                type: 'INPUT',
                readOnly: true,
                isValidatePriceAuth: true,  // 是否校验价格权限
                priceAuthFlag: priceAuthFlag,  // 是否有价格权限
            };

            /** 本币金额 */
            let currencyAmountColumn = {
                title: '本币金额',
                key: 'currencyAmount',
                dataIndex: 'currencyAmount',
                columnName: 'currencyAmount',
                width: 150,
                align: 'right',
                type: 'INPUT',
                readOnly: true,
                isValidatePriceAuth: true,  // 是否校验价格权限
                priceAuthFlag: priceAuthFlag,  // 是否有价格权限
            };

            let quantityColumns = [
                recQuantityColumn,
                unitConverterColumn,
                quantityColumn,
                unTaxedPriceColumn,
                unitPriceColumn,
                unTaxedAmountColumn,
                taxRateColumn,
                taxColumn,
                amountColumn,
                currencyUnitPriceColumn,
                currencyAmountColumn
            ];

            return (
                <React.Fragment>
                    <WrappedComponent
                        {...this.props}
                        calcTotalForOneRow={this.calcTotalForOneRow}
                        calcTotal={this.calcTotal}
                        quantityColumns={quantityColumns}
                        handleQuotationOnChange={this.handleQuotationOnChange}
                    />
                </React.Fragment>
            )
        }
    }

}

