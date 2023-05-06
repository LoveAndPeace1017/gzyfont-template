import React, {Component, useState, useEffect} from 'react';
import intl from 'react-intl-universal';
import defaultOptions from 'utils/validateOptions';
import {formatCurrency, removeCurrency} from 'utils/format';
import {numberReg} from 'utils/reg';
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';
import {AuthInput} from 'components/business/authMenu';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import {Input, Spin, Form} from "antd";
import Tooltip from 'components/widgets/tooltip';
import Icon from 'components/widgets/icon';
import Calculator from 'components/business/calculator';
import {SelectRate} from 'pages/auxiliary/rate';
import Base from './base';
import Modal from './modal';

const cx = classNames.bind(styles);

export default function withQuantityAmount(WrappedComponent) {

    return class WithQuantityAmount extends Base {

        constructor(props) {
            super(props);
            this.state = {
                totalQuantity: 0,
                totalAmount: 0,  //订单含税总金额
                aggregateAmount: 0,  // 订单优惠后总金额
                discountAmount: 0,  // 订单优惠金额
                tempOffsetTop: 0,
                tempOffsetLeft: 0,
                calculateKey: ''
            }
        }

        componentDidMount() {
            window.addEventListener('click',this.closeCalculatorModal);
        }

        componentWillUnmount() {
            window.removeEventListener('click',this.closeCalculatorModal);
        }

        // 关闭计算器弹层
        closeCalculatorModal = () => {
            let {calculateKey} = this.state;
            if(calculateKey){
                this.setState({calculateKey: ''});
            }
        };

        setTotalQuantity = (totalQuantity) => {
            let {setFieldsValue} = this.props.formRef.current;
            setFieldsValue({
                totalQuantity: fixedDecimal(totalQuantity, priceDecimalNum)
            });
        };

        setTotalAmount = (totalAmount) => {
            let {setFieldsValue} = this.props.formRef.current;
            setFieldsValue({
                totalAmount: removeCurrency(formatCurrency(totalAmount))
            });
        };

        setAggregateAmount = (aggregateAmount) => {
            let {setFieldsValue} = this.props.formRef.current;
            setFieldsValue({
                aggregateAmount: removeCurrency(formatCurrency(aggregateAmount))
            });
        };

        setDiscountAmount = (discountAmount, initFlag) => {
            let {getFieldValue, setFieldsValue} = this.props.formRef.current;
            setFieldsValue({
                discountAmount: discountAmount
            });
            if(!initFlag){
                setFieldsValue({
                    aggregateAmount: removeCurrency(formatCurrency(getFieldValue('totalAmount')*1 - discountAmount*1))
                })
            }
        };

        //选择物品后计算总数量总金额
        calcTotal = (goods, emptyKeys, otherQuantityKey) => {
            //计算总数量：
            // 先把数量放到一个数组里
            const quantities = goods.map(item => {
                let recQuantity = item.recQuantity || item.quantity;
                if(item[otherQuantityKey] === 0 || item[otherQuantityKey]){
                    recQuantity = item[otherQuantityKey];
                }
                return recQuantity || 0;
            });
            this.calcTotalQuantity(quantities, emptyKeys);

            //计算总金额：
            // 先把单价放到一个
            const unitPrices = goods.map(item => {
                if (this.props.carryOrderPriceToUnitPrice && item.orderPrice) {
                    return item.orderPrice
                }
                else if (this.props.carrySalePriceToUnitPrice && item.salePrice) {
                    return item.salePrice
                }
                else if (item.unitPrice) {
                    return item.unitPrice
                }
                return 0
            });

            this.calTotalAmount(quantities, emptyKeys, unitPrices)
        };

        //处理带入单价
        carryUnitPrice = (key, goods) => {
            let {setFieldsValue} = this.props.formRef.current;
            let priceDecimalNum = getCookie("priceDecimalNum");
            let unitPrice;
            if (this.props.carryOrderPriceToUnitPrice && goods.orderPrice) {
                unitPrice = goods.orderPrice
            }
            else if (this.props.carrySalePriceToUnitPrice && goods.salePrice) {
                unitPrice = goods.salePrice
            }
            else if (goods.unitPrice) {
                unitPrice = goods.unitPrice
            }
            if (unitPrice) {
                setFieldsValue({
                    [this.dataPrefix]: {
                        [key]: {
                            [this.dataName.unitPrice]: fixedDecimal(unitPrice, priceDecimalNum)
                        }
                    }
                });
            }
            if (goods.taxRate !== undefined) {
                setFieldsValue({
                    [this.dataPrefix]: {
                        [key]: {
                            [this.dataName.taxRate]: goods.taxRate.toString()
                        }
                    }
                });
            }
        };

        //处理带入数量
        carryQuantity = (key, goods, otherQuantityKey) => {
            let {setFieldsValue} = this.props.formRef.current;
            let quantity = goods.quantity || 0;
            let recQuantity = goods.recQuantity || goods.quantity || 0;
            let quantityDecimalNum = getCookie("quantityDecimalNum");
            //如果otherQuantityKey有值说明带入的数量不是正常的数量，如带入未入库数量
            if(goods[otherQuantityKey] === 0 || goods[otherQuantityKey]){
                quantity = goods[otherQuantityKey];
                recQuantity = goods[otherQuantityKey] / (goods.unitConverter || 1);
            }
            //设置数量
            setFieldsValue({[this.dataPrefix]: {[key]: {
                [this.dataName.quantity]: fixedDecimal(quantity, quantityDecimalNum),
                [this.dataName.recQuantity]: fixedDecimal(recQuantity, quantityDecimalNum)
           }}});

            this.handleQuantityChange(key, quantity)
        };

        carryUnitPriceToInExistsLine = (needAddGoods, otherQuantityKey) => {
            if (!this.props.hideUnitPriceColumn) {
                needAddGoods = needAddGoods.map(item => {
                    if (this.props.carryOrderPriceToUnitPrice && item.orderPrice) {
                        item[this.dataName.unitPrice] = item.orderPrice;
                    }
                    else if (this.props.carrySalePriceToUnitPrice && item.salePrice) {
                        item[this.dataName.unitPrice] = item.salePrice;
                    }
                    else if (item.unitPrice) {
                        item[this.dataName.unitPrice] = item.unitPrice;
                    }
                    return item;
                })
            }

            //处理带入数量
            if (!this.props.hideRecQuantityColumn) {
                needAddGoods = needAddGoods.map(item => {
                    let recQuantity = item.recQuantity || item.quantity;
                    if(item[otherQuantityKey] === 0 || item[otherQuantityKey]){
                        recQuantity = item[otherQuantityKey];
                    }
                    item[this.dataName.recQuantity] = recQuantity;
                    return item;
                })
            }

            //单价和数量都有则计算金额
            if (!this.props.hideUnitPriceColumn && !this.props.hideUnitPriceColumn) {
                needAddGoods = needAddGoods.map(item => {
                    item[this.dataName.amount] = item[this.dataName.recQuantity] * item[this.dataName.unitPrice];
                    return item;
                })
            }

            needAddGoods = needAddGoods.map(item => {
                if (item.taxRate !== undefined) {
                    item[this.dataName.taxRate] = item.taxRate;
                }
                return item;
            });

            return needAddGoods;
        };

        /**
         * 反算规则
         * **/
        inverseCalc = (key, quantity, taxRate, unitPrice, amount) => {
            let {setFieldsValue, getFieldValue} = this.props.formRef.current;
            let priceDecimalNum = getCookie("priceDecimalNum");
            console.log(key,'key');
            console.log(this.dataName,'this.dataName');

            quantity = quantity !== undefined ? parseFloat(quantity) : quantity;
            taxRate = taxRate !== undefined ? parseFloat(taxRate) / 100 : 0;
            unitPrice = unitPrice !== undefined ? parseFloat(unitPrice) : unitPrice;
            amount = amount !== undefined ? parseFloat(amount) : amount;
            if (quantity === undefined) {
                return;
            }

            if (unitPrice !== undefined) {
                setFieldsValue({
                    [this.dataPrefix]: {
                        [key]: {
                            ...getFieldValue([this.dataPrefix, key]),
                            [this.dataName.untaxedPrice]: fixedDecimal(unitPrice / (1 + taxRate), priceDecimalNum),
                            [this.dataName.untaxedAmount]: removeCurrency(formatCurrency(unitPrice * quantity / (1 + taxRate), 2, true)),
                            [this.dataName.tax]: formatCurrency((unitPrice * quantity) - (unitPrice * quantity / (1 + taxRate)), 2, true),
                            [this.dataName.amount]: removeCurrency(formatCurrency(unitPrice * quantity, 2, true))
                        }
                    }
                });
            }
            else if (amount !== undefined) {
                setFieldsValue({
                    [this.dataPrefix]: {
                        [key]: {
                            ...getFieldValue([this.dataPrefix, key]),
                            [this.dataName.untaxedPrice]: fixedDecimal(amount / (quantity * (1 + taxRate)), priceDecimalNum),
                            [this.dataName.unitPrice]: fixedDecimal(amount / quantity, priceDecimalNum),
                            [this.dataName.untaxedAmount]: removeCurrency(formatCurrency(amount / (1 + taxRate), 2, true)),
                            [this.dataName.tax]: formatCurrency(amount - (amount / (1 + taxRate)), 2, true)
                        }
                    }
                });
            }
        };

        /**
         * 处理基本数量变化
         * **/
        handleRecQuantityChange = (key, value) => {
            let {getFieldValue, setFieldsValue} = this.props.formRef.current;
            const unitConverter = getFieldValue([this.dataPrefix, key, this.dataName.unitConverter]) || 1;
            let quantityDecimalNum = getCookie("quantityDecimalNum");

            const val = value && value !== '' ? value : 0;
            const quantity = fixedDecimal(val * unitConverter, quantityDecimalNum);
            setFieldsValue({[this.dataPrefix]: {[key]: {[this.dataName.quantity]: quantity}}});
            this.handleQuantityChange(key, quantity);
        };


        /**
         * 处理基本数量变化
         * **/
        handleQuantityChange = (key, value) => {
            let {getFieldValue} = this.props.formRef.current;

            //计算金额
            const taxRate = getFieldValue([this.dataPrefix, key, this.dataName.taxRate]);
            const unitPrice = getFieldValue([this.dataPrefix, key, this.dataName.unitPrice]);
            const amount = getFieldValue([this.dataPrefix, key, this.dataName.amount]);

            const val = value && value !== '' ? value : 0;
            this.inverseCalc(key, val, taxRate, unitPrice, amount);

            this.calcTotalQuantity([val], [key]);
            this.calTotalAmount([val], [key], [unitPrice])
        };

        /**
         * 处理税率变化
         * **/
        handleRateChange = (key, value) => {
            if(!this.props.formRef || !this.props.formRef.current) return false;
            let {getFieldValue} = this.props.formRef.current;
            //计算金额
            const quantity = getFieldValue([this.dataPrefix, key, this.dataName.quantity]);
            const unitPrice = getFieldValue([this.dataPrefix, key, this.dataName.unitPrice]);
            const amount = getFieldValue([this.dataPrefix, key, this.dataName.amount]);

            const val = value && value !== '' ? parseFloat(value) : 0;
            this.inverseCalc(key, quantity, val, unitPrice, amount);
        };

        /**
         * 处理含税单价变化
         * **/
        handleUnitPriceChange = (key, value) => {
            let {getFieldValue} = this.props.formRef.current;

            const quantity = getFieldValue([this.dataPrefix, key, this.dataName.quantity]);
            const taxRate = getFieldValue([this.dataPrefix, key, this.dataName.taxRate]);

            const val = value && value !== '' ? value : 0;
            this.inverseCalc(key, quantity, taxRate, val, undefined);

            this.calTotalAmount([value], [key], [quantity]);
        };

        /**
         * 处理价税合计变化
         * **/
        handleAmountChange = (key, value) => {
            let {getFieldValue} = this.props.formRef.current;

            const quantity = getFieldValue([this.dataPrefix, key, this.dataName.quantity]);
            const taxRate = getFieldValue([this.dataPrefix, key, this.dataName.taxRate]);

            const val = value && value !== '' ? value : 0;
            this.inverseCalc(key, quantity, taxRate, undefined, val);

            this.calTotalAmount([value], [key], 'amount');
        };

        /**
         * 计算总数量（先计算已存在行中刚添加的物品条目，再计算之前存在的物品条目）
         * **/
        calcTotalQuantity = (values, recordKeys) => {
            let {getFieldValue, setFieldsValue} = this.props.formRef.current;
            let quantityDecimalNum = getCookie("quantityDecimalNum");

            const dataSource = this.props.goodsInfo.get('data').toJS();
            //刚添加的数量之和
            let totalQuantity = 0;
            if (recordKeys === undefined) {
                values.forEach((value) => {
                    totalQuantity += value ? parseFloat(value) : 0
                });
            }
            else {
                values.forEach((value, index) => {
                    totalQuantity += recordKeys[index] !== undefined ? parseFloat(value) : 0
                });
                const allKeys = dataSource.map(item => {
                    return item.key
                });
                //排除已存在行中刚添加数据的key
                const oldKeys = this.includeANotB(allKeys, recordKeys);

                oldKeys.forEach(key => {
                    let quantity = getFieldValue([this.dataPrefix, key, this.dataName.quantity]);

                    quantity = quantity ? parseFloat(quantity) : 0;
                    totalQuantity += quantity;
                });
            }

            setFieldsValue({
                totalQuantity: fixedDecimal(totalQuantity, quantityDecimalNum)
            });
        };

        /**
         * 计算总金额（先计算已存在行中刚添加的物品条目，再计算之前存在的物品条目）
         * **/
        calTotalAmount = (values, recordKeys, unitPriceOrQuantities) => {
            if (!unitPriceOrQuantities || unitPriceOrQuantities.length === 0) {
                return;
            }

            let {getFieldValue, setFieldsValue} = this.props.formRef.current;

            const dataSource = this.props.goodsInfo.get('data').toJS();

            //刚添加的数量之和
            let totalAmount = 0;
            values.forEach((value, index) => {
                //unitPriceOrQuantities 会有三种情况，如果传入 'amount'代表是输入金额字段变化计算总金额，否则就是传入数量和单价
                const amountVal = unitPriceOrQuantities === 'amount' ? value : value * (unitPriceOrQuantities[index] ? unitPriceOrQuantities[index] : 0);
                totalAmount += recordKeys[index] !== undefined ? parseFloat(amountVal) : 0
            });

            const allKeys = dataSource.map(item => {
                return item.key
            });
            //排除已存在行中刚添加数据的key
            const oldKeys = this.includeANotB(allKeys, recordKeys);

            oldKeys.forEach(key => {
                let amount = getFieldValue([this.dataPrefix, key, this.dataName.amount]);
                amount = amount ? parseFloat(amount) : 0;
                totalAmount += amount;
            });

            totalAmount && setFieldsValue({
                aggregateAmount: removeCurrency(formatCurrency(totalAmount - getFieldValue('discountAmount'))),
                totalAmount: removeCurrency(formatCurrency(totalAmount))
            });
        };

        /**
         * 加载库存数据
         * **/
        loadStock = (visible, code, key) => {
            if (visible && code /*&& !hasCache*/) {
                this.props.asyncFetchStockByCode(code, key)
            }
        };

        emptyQuantityAmountVal = (recordKey)=>{
            let {setFieldsValue} = this.props.formRef.current;

            setFieldsValue({
                [this.dataPrefix]: {
                    [recordKey]: {
                        [this.dataName.quantity]: '',
                        [this.dataName.recQuantity]: '',
                        [this.dataName.untaxedPrice]: '',
                        [this.dataName.unitPrice]: '',
                        [this.dataName.untaxedAmount]: '',
                        [this.dataName.tax]: '',
                        [this.dataName.amount]: ''
                    }
                }
            });
        };


        render() {
            let quaColumns = [];
            //数量
            let recQuantityColumns;
            const reg = numberReg.numberOnlyThree;
            let {setFieldsValue, getFieldValue} = this.props.formRef.current;
            let quantityDecimalNum = getCookie("quantityDecimalNum");
            let priceDecimalNum = getCookie("priceDecimalNum");

            let {tempOffsetTop, tempOffsetLeft, calculateKey} = this.state;

            if (!this.props.hideRecQuantityColumn) {
                recQuantityColumns = Object.assign({}, {
                    title: intl.get("components.goods.withQuantityAmount.quantity"),
                    required: true,
                    key: this.dataName.recQuantity,
                    originalKey: 'recQuantity',
                    width: 120,
                    rules: [
                        {
                            validator: (rules, value, callback) => {
                                let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+ quantityDecimalNum +'})?$/');
                                if (value && !reg.test(value)) {
                                    callback(`整数部分不能超过10位，小数点后不能超过${quantityDecimalNum}位`);
                                }
                                callback();
                            }
                        },
                        {
                            rule: function(val) {
                                return val == 0;
                            },
                            message: intl.get("components.goods.withQuantityAmount.quantityMessage")
                        }
                    ],
                    getFieldDecoratored: true,
                    render: (recQuantity, record, index, dataSource, validConfig, requiredFlag, onKeyDown) => {
                        const stockInfo = record.stockInfo;
                        const productCode = getFieldValue([this.dataPrefix, record.key, this.dataName.productCode]);

                        const inputStr = (
                            <Form.Item
                                {...defaultOptions}
                                name={[this.dataPrefix, record.key, this.dataName.recQuantity]}
                                initialValue={fixedDecimal(recQuantity, quantityDecimalNum)}
                                rules={validConfig}
                            >
                                <Input
                                    onBlur={()=>{
                                        let value = getFieldValue([this.dataPrefix, record.key, this.dataName.recQuantity]);
                                        this.handleRecQuantityChange(record.key, value)
                                    }}
                                    onKeyDown={onKeyDown}
                                    maxLength={11+Number(quantityDecimalNum)}
                                    style={{"textAlign": 'right'}}
                                    suffix={
                                        <Icon
                                            onClick={(e) => {
                                                e.nativeEvent.stopImmediatePropagation();
                                                let scrollHeight = document.getElementById('contentWrap').scrollTop;
                                                let {top, left} = e.target.getBoundingClientRect();
                                                this.setState({
                                                    tempOffsetTop: top + scrollHeight,
                                                    tempOffsetLeft: left,
                                                    calculateKey: `${this.dataPrefix}[${record.key}].${this.dataName.recQuantity}`
                                                })
                                            }}
                                            type="icon-calculator"
                                        />
                                    }
                                />
                            </Form.Item>
                        );

                        return (
                            <React.Fragment>
                                {
                                    this.props.showStockInfo && productCode ? (
                                        <Tooltip
                                            type="info"
                                            title={
                                                <Spin
                                                    spinning={record.stockIsFetching}
                                                >
                                                    <div>
                                                        <p>{intl.get("components.goods.withQuantityAmount.currentQuantity")}：{stockInfo && stockInfo[0] && stockInfo[0].currentQuantity}</p>
                                                        <p>{intl.get("components.goods.withQuantityAmount.maxQuantity")}：{stockInfo && stockInfo[0] && stockInfo[0].maxQuantity}</p>
                                                        <p>{intl.get("components.goods.withQuantityAmount.minQuantity")}：{stockInfo && stockInfo[0] && stockInfo[0].minQuantity}</p>
                                                    </div>
                                                </Spin>
                                            }
                                            onVisibleChange={(visible) => this.loadStock(visible, productCode, record.key)}
                                        >
                                            {inputStr}
                                        </Tooltip>
                                    ) : (<React.Fragment>
                                        {inputStr}
                                    </React.Fragment>)
                                }
                                {
                                    `${this.dataPrefix}[${record.key}].${this.dataName.recQuantity}` === calculateKey && (
                                        <Modal>
                                            <div onClick={(event) => {
                                                event.nativeEvent.stopImmediatePropagation()
                                            }}>
                                                <Calculator
                                                    key={record.key}
                                                    calculate={(amount) => {
                                                        setFieldsValue({
                                                            [this.dataPrefix]: {
                                                                [record.key]: {
                                                                   [this.dataName.recQuantity]: fixedDecimal(amount, quantityDecimalNum)
                                                                }
                                                            }
                                                        });
                                                        this.setState({calculateKey: ''});
                                                        this.handleRecQuantityChange(record.key, amount);
                                                    }}
                                                    style={{top: tempOffsetTop-25+'px', left: tempOffsetLeft-110+'px'}}
                                                />
                                            </div>
                                        </Modal>
                                    )
                                }
                            </React.Fragment>

                        )
                    }
                }, this.props.recQuantityColumns ? this.props.recQuantityColumns : {});

                quaColumns = quaColumns.concat(recQuantityColumns);
            }

            // 单位关系
            let unitConverterColumns;
            if (!!this.props.showUnitConverterColumn) {
                unitConverterColumns = Object.assign({}, {
                    title: '单位关系',
                    key: this.dataName.unitConverterText,
                    originalKey: 'unitConverterText',
                    columnName: 'unitConverter',
                    width: 150,
                    align: 'right',
                    readOnly: true
                }, this.props.unitConverterColumns ? this.props.unitConverterColumns : {});
                quaColumns = quaColumns.concat(unitConverterColumns);
            }


            // 基本单位数量
            let quantityColumns;
            if (!!this.props.showQuantityColumns) {
                quantityColumns = Object.assign({}, {
                    title: '基本单位数量',
                    key: this.dataName.quantity,
                    originalKey: 'quantity',
                    columnName: 'quantity',
                    width: 150,
                    align: 'right',
                    readOnly: true
                }, this.props.quantityColumns ? this.props.quantityColumns : {});
                quaColumns = quaColumns.concat(quantityColumns);
            }

            //未税单价
            let unTaxedPriceColumns;
            if (!this.props.hideUntaxedPriceColumn) {
                unTaxedPriceColumns = Object.assign({}, {
                    title: intl.get("components.goods.withQuantityAmount.untaxedPrice"),
                    key: this.dataName.untaxedPrice,
                    originalKey: 'untaxedPrice',
                    columnName: 'untaxedPrice',
                    width: 150,
                    align: 'right',
                    readOnly: true
                }, this.props.unTaxedPriceColumns ? this.props.unTaxedPriceColumns : {});
                quaColumns = quaColumns.concat(unTaxedPriceColumns);
            }

            //含税单价
            let unitPriceColumns;
            if (!this.props.hideUnitPriceColumn) {
                unitPriceColumns = Object.assign({}, {
                    title: intl.get("components.goods.withQuantityAmount.unitPrice"),
                    key: this.dataName.unitPrice,
                    originalKey: 'unitPrice',
                    width: 150,
                    align: 'right',
                    rules: [{
                        validator: (rules, value, callback) => {
                            let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+ priceDecimalNum +'})?$/');
                            if (value && !reg.test(value)) {
                                callback(`整数部分不能超过10位，小数点后不能超过${priceDecimalNum}位`);
                            }
                            callback();
                        }
                    }],
                    getFieldDecoratored: true,
                    render: (unitPrice, record, index, dataSource, validConfig, requiredFlag, onKeyDown) => {
                        return (
                            <React.Fragment>
                                <Form.Item
                                    {...defaultOptions}
                                    name={[this.dataPrefix, record.key, this.dataName.unitPrice]}
                                    initialValue={fixedDecimal(unitPrice, priceDecimalNum)}
                                    rules={validConfig}
                                >
                                    <Input
                                        onBlur={()=>{
                                            let value = getFieldValue([this.dataPrefix, record.key, this.dataName.unitPrice]);
                                            this.handleUnitPriceChange(record.key, value);
                                        }}
                                        onKeyDown={onKeyDown}
                                        maxLength={11+Number(quantityDecimalNum)}
                                        style={{"textAlign": 'right'}}
                                        suffix={
                                            <Icon
                                                onClick={(e) => {
                                                    e.nativeEvent.stopImmediatePropagation();
                                                    let scrollHeight = document.getElementById('contentWrap').scrollTop;
                                                    let {top, left} = e.target.getBoundingClientRect();
                                                    this.setState({
                                                        tempOffsetTop: top + scrollHeight,
                                                        tempOffsetLeft: left,
                                                        calculateKey: `${this.dataPrefix}[${record.key}].${this.dataName.unitPrice}`
                                                    })
                                                }}
                                                type="icon-calculator"
                                            />
                                        }
                                    />
                                </Form.Item>

                                {
                                    `${this.dataPrefix}[${record.key}].${this.dataName.unitPrice}` === calculateKey && (
                                        <Modal>
                                            <div onClick={(event) => {
                                                event.nativeEvent.stopImmediatePropagation()
                                            }}>
                                                <Calculator
                                                    calculate={(amount) => {
                                                        setFieldsValue({
                                                            [this.dataPrefix]: {
                                                                [record.key]: {
                                                                    [this.dataName.unitPrice]: fixedDecimal(amount, priceDecimalNum)
                                                                }
                                                            }
                                                        });
                                                        this.setState({calculateKey: ''});
                                                        this.handleUnitPriceChange(record.key, amount);
                                                    }}
                                                    style={{top: tempOffsetTop-25+'px', left: tempOffsetLeft-110+'px'}}
                                                />
                                            </div>
                                        </Modal>
                                    )
                                }
                            </React.Fragment>
                        )
                    }
                }, this.props.unitPriceColumns ? this.props.unitPriceColumns : {});
                quaColumns = quaColumns.concat(unitPriceColumns);
            }

            //未税金额
            let unTaxedAmountColumns;
            if (!this.props.hideUntaxedAmountColumn) {
                unTaxedAmountColumns = Object.assign({}, {
                    title: intl.get("components.goods.withQuantityAmount.untaxedAmount"),
                    key: this.dataName.untaxedAmount,
                    originalKey: 'untaxedAmount',
                    columnName: 'untaxedAmount',
                    width: 150,
                    rules: [{
                        rule: function(val) {
                            return val && !reg.rules.test(val);
                        },
                        message: reg.message
                    }],
                    getFieldDecoratored: true,
                    render: (unitPrice, record, index, dataSource, validConfig, requiredFlag, onKeyDown) => {
                        return (
                            <React.Fragment>
                                <Form.Item
                                    {...defaultOptions}
                                    name={[this.dataPrefix, record.key, this.dataName.untaxedAmount]}
                                    initialValue={removeCurrency(formatCurrency(unitPrice, 3, true))}
                                    rules={validConfig}
                                >
                                    <Input onKeyDown={onKeyDown}
                                           maxLength={13}
                                           style={{"textAlign": 'right'}}/>
                                </Form.Item>
                            </React.Fragment>
                        )
                    }
                }, this.props.unTaxedAmountColumns ? this.props.unTaxedAmountColumns : {});
                quaColumns = quaColumns.concat(unTaxedAmountColumns);
            }

            //税率
            let taxRateColumns;
            if (!this.props.hideTaxRateColumn) {
                taxRateColumns = Object.assign({}, {
                    title: intl.get("components.goods.withQuantityAmount.taxRate"),
                    key: this.dataName.taxRate,
                    originalKey: 'taxRate',
                    columnName: 'taxRate',
                    width: 150,
                    align: 'right',
                    render: (text, record, index, dataSource, validConfig, requiredFlag, onKeyDown) => {
                        return <SelectRate showEdit onChange={(value) => this.handleRateChange(record.key, value)}
                                           id={this.dataPrefix+"_"+record.key+"_taxRate"} onKeyDown={onKeyDown}/>
                    }
                }, this.props.taxRateColumns ? this.props.taxRateColumns : {});
                quaColumns = quaColumns.concat(taxRateColumns);
            }

            //税额
            let taxColumns;
            if (!this.props.hideTaxColumn) {
                taxColumns = Object.assign({}, {
                    title: intl.get("components.goods.withQuantityAmount.tax"),
                    key: this.dataName.tax,
                    originalKey: 'tax',
                    columnName: 'tax',
                    width: 150,
                    align: 'right',
                    readOnly: true
                }, this.props.taxColumns ? this.props.taxColumns : {});
                quaColumns = quaColumns.concat(taxColumns);
            }

            //价税合计
            let amountColumns;
            if (!this.props.hideAmountColumn) {
                amountColumns = Object.assign({}, {
                    title: intl.get("components.goods.withQuantityAmount.amount"),
                    key: this.dataName.amount,
                    originalKey: 'amount',
                    maxLength: 13,
                    width: 150,
                    align: 'right',
                    rules: [{
                        rule: function(val) {
                            return val && !reg.rules.test(val);
                        },
                        message: reg.message
                    }],
                    getFieldDecoratored: true,
                    render: (amount, record, index, dataSource, validConfig, requiredFlag, onKeyDown) => {
                        return (
                            <React.Fragment>
                                <Form.Item
                                    {...defaultOptions}
                                    name={[this.dataPrefix, record.key, this.dataName.amount]}
                                    initialValue={removeCurrency(formatCurrency(amount, 3, true))}
                                    rules={validConfig}
                                >
                                    <Input
                                        onBlur={()=>{
                                            let value = getFieldValue([this.dataPrefix, record.key, this.dataName.amount]);
                                            this.handleAmountChange(record.key, value);
                                        }}
                                        onKeyDown={onKeyDown}
                                        maxLength={14}
                                        style={{"textAlign": 'right'}}
                                        suffix={
                                            <Icon
                                                onClick={(e) => {
                                                    e.nativeEvent.stopImmediatePropagation();
                                                    let scrollHeight = document.getElementById('contentWrap').scrollTop;
                                                    let {top, left} = e.target.getBoundingClientRect();
                                                    this.setState({
                                                        tempOffsetTop: top + scrollHeight,
                                                        tempOffsetLeft: left,
                                                        calculateKey: `${this.dataPrefix}[${record.key}].${this.dataName.amount}`
                                                    })
                                                }}
                                                type="icon-calculator"
                                            />
                                        }
                                    />
                                </Form.Item>

                                {
                                    `${this.dataPrefix}[${record.key}].${this.dataName.amount}` === calculateKey && (
                                        <Modal>
                                            <div onClick={(event) => {
                                                event.nativeEvent.stopImmediatePropagation()
                                            }}>
                                                <Calculator
                                                    calculate={(amount) => {
                                                        setFieldsValue({
                                                            [this.dataPrefix]: {
                                                                [record.key]: {
                                                                    [this.dataName.amount]: removeCurrency(formatCurrency(amount, 3, true))
                                                                }
                                                            }
                                                        });
                                                        this.setState({calculateKey: ''});
                                                        this.handleAmountChange(record.key, amount);
                                                    }}
                                                    style={{top: tempOffsetTop-25+'px', left: tempOffsetLeft-110+'px'}}
                                                />
                                            </div>
                                        </Modal>
                                    )
                                }
                            </React.Fragment>
                        )
                    }
                }, this.props.amountColumns ? this.props.amountColumns : {});
                quaColumns = quaColumns.concat(amountColumns);
            }



            return <WrappedComponent
                {...this.props}
                quaColumns={quaColumns}
                setTotalQuantity={this.setTotalQuantity}
                setTotalAmount={this.setTotalAmount}
                setAggregateAmount={this.setAggregateAmount}
                setDiscountAmount={this.setDiscountAmount}
                calcTotal={this.calcTotal}
                carryUnitPrice={this.carryUnitPrice}
                carryQuantity={this.carryQuantity}
                carryUnitPriceToInExistsLine={this.carryUnitPriceToInExistsLine}
                handleQuantityChange={this.handleQuantityChange}
                handleRecQuantityChange={this.handleRecQuantityChange}
                calcTotalQuantity={this.calcTotalQuantity}
                calTotalAmount={this.calTotalAmount}
                loadStock={this.loadStock}
                inverseCalc={this.inverseCalc}
                emptyQuantityAmountVal={this.emptyQuantityAmountVal}
            />
        }
    }

}

