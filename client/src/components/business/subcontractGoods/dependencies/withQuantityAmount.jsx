import React, {Component} from 'react';
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
import Icon from 'components/widgets/icon';
import Calculator from 'components/business/calculator';
import {SelectRate} from 'pages/auxiliary/rate';
import Base from './base';
import Modal from './modal';

const cx = classNames.bind(styles);

export default function withSubcontractQuantityAmount(WrappedComponent) {

    return class withSubcontractQuantityAmount extends Base {

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

        // 总数量
        setTotalQuantity = (totalQuantity) => {
            let {setFieldsValue} = this.props.formRef.current;
            let priceDecimalNum = getCookie("priceDecimalNum");
            setFieldsValue({
                [this.props.prodType+'TotalQuantity']: fixedDecimal(totalQuantity, priceDecimalNum)
            });
        };

        // 原料成本
        setTotalCost = (totalCost) => {
            let {setFieldsValue} = this.props.formRef.current;
            setFieldsValue({
                [this.props.prodType+'TotalCost']: formatCurrency(totalCost)
            });
        };

        // 加工费
        setProcessCost = (processCost) => {
            let {setFieldsValue} = this.props.formRef.current;
            setFieldsValue({
                [this.props.prodType+'ProcessCost']: formatCurrency(processCost)
            });
        };

        // 总金额
        setTotalAmount = (totalAmount) => {
            let {setFieldsValue} = this.props.formRef.current;
            setFieldsValue({
                [this.props.prodType+'TotalAmount']: formatCurrency(totalAmount)
            });
        };

        //选择物品后计算总数量总金额
        calcTotal = (goods, emptyKeys, otherQuantityKey) => {
            //计算总数量：
            // 先把数量放到一个数组里
            const quantities = goods.map(item => {
                let quantity = item.quantity;
                if(item[otherQuantityKey] === 0 || item[otherQuantityKey]){
                    quantity = item[otherQuantityKey];
                }
                return quantity || 0;
            });
            this.calcTotalQuantity(quantities, emptyKeys);
            // this.calTotalAmount()
        };


        /**
         * 反算规则
         * **/
        inverseCalc = (key, quantity, unitCost, amount) => {
            let {setFieldsValue, getFieldValue} = this.props.formRef.current;
            let priceDecimalNum = getCookie("priceDecimalNum");

            quantity = quantity !== undefined ? parseFloat(quantity) : quantity;
            unitCost = unitCost !== undefined ? parseFloat(unitCost) : unitCost;
            amount = amount !== undefined ? parseFloat(amount) : amount;
            if (quantity === undefined) return;

            if (unitCost !== undefined) {
                amount = removeCurrency(formatCurrency(quantity * unitCost, 3, true));
                if(this.props.prodType==='preform'){
                    setFieldsValue({[this.dataPrefix]: {[key]: {
                        ...getFieldValue([this.dataPrefix, key]), amount,
                        allocatedPrice: fixedDecimal(unitCost, priceDecimalNum), allocatedAmount: amount}}});
                } else {
                    setFieldsValue({[this.dataPrefix]: {[key]: {...getFieldValue([this.dataPrefix, key]), amount}}});
                }
            } else if(amount != undefined){
                unitCost = fixedDecimal(amount / quantity, priceDecimalNum);
                if(this.props.prodType==='preform'){
                    setFieldsValue({[this.dataPrefix]: {[key]: {
                        ...getFieldValue([this.dataPrefix, key]), unitCost,
                        allocatedPrice: unitCost, allocatedAmount: amount
                    }}});
                } else {
                    setFieldsValue({[this.dataPrefix]: {[key]: {...getFieldValue([this.dataPrefix, key]), unitCost}}});
                }
            }
        };

        /**
         * 处理数量变化
         * **/
        handleQuantityChange = (key, value) => {
            let {getFieldValue} = this.props.formRef.current;
            //计算金额
            const unitCost = getFieldValue([this.dataPrefix, key, 'unitCost']);
            const amount = getFieldValue([this.dataPrefix, key, 'amount']);

            const val = value && value !== '' ? value : 0;
            this.inverseCalc(key, val, unitCost, amount);

            this.calcTotalQuantity([val], [key]);
            this.calTotalAmount()
        };

        /**
         * 处理单位成本变化
         * **/
        handleUnitCostChange = (key, value) => {
            let {getFieldValue} = this.props.formRef.current;

            const quantity = getFieldValue([this.dataPrefix, key, 'quantity']);

            const val = value && value !== '' ? value : 0;
            this.inverseCalc(key, quantity, val, undefined);

            this.calTotalAmount();
        };

        /**
         * 处理金额变化
         * **/
        handleAmountChange = (key, value) => {
            let {getFieldValue} = this.props.formRef.current;

            const quantity = getFieldValue([this.dataPrefix, key, 'quantity']);

            const val = value && value !== '' ? value : 0;
            this.inverseCalc(key, quantity, undefined, val);

            this.calTotalAmount();
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
                [this.props.prodType+'TotalQuantity']: fixedDecimal(totalQuantity, quantityDecimalNum)
            });
        };
        /**
         * 计算总金额
         * **/
        calTotalAmount = () => {
            const dataSource = this.props.goodsInfo.get('data').toJS();
            const allKeys= dataSource.map(item => item.key);
            let prodType = this.props.prodType;
            prodType = prodType.charAt(0).toUpperCase() + prodType.slice(1);
            this['calTotalAmountFor'+prodType](allKeys);
        };

        // 加工成品列表计算金额
        calTotalAmountForPreform = (allKeys) => {
            let {getFieldValue, setFieldsValue} = this.props.formRef.current;
            let totalCost = 0, totalAmount = 0;
            allKeys.forEach(key => {
                let cost = getFieldValue([this.dataPrefix, key, this.dataName.amount]);
                let amount = getFieldValue([this.dataPrefix, key, this.dataName.allocatedAmount]);
                cost = cost ? parseFloat(cost) : 0;
                amount = amount ? parseFloat(amount) : 0;
                totalCost += cost;
                totalAmount += amount;
            });
            setFieldsValue({
                [this.props.prodType+'TotalCost']: formatCurrency(totalCost),
                [this.props.prodType+'TotalAmount']: formatCurrency(totalAmount),
            });
        };

        // 消耗原料列表计算金额
        calTotalAmountForConsume = (allKeys) => {
            let {getFieldValue, setFieldsValue} = this.props.formRef.current;
            let totalAmount = 0;
            allKeys.forEach(key => {
                let amount = getFieldValue([this.dataPrefix, key, this.dataName.amount]);
                amount = amount ? parseFloat(amount) : 0;
                totalAmount += amount;
            });
            setFieldsValue({[this.props.prodType+'TotalCost']: formatCurrency(totalAmount)});
        };

        emptyQuantityAmountVal = (recordKey)=>{
            let {setFieldsValue} = this.props.formRef.current;

            setFieldsValue({
                [this.dataPrefix]: {
                    [recordKey]: {
                        quantity: '',
                        unitCost: '',
                        amount: '',
                        allocatedPrice: '',  //分摊后单价
                        allocatedAmount: '',  // 分摊后金额
                    }
                }
            });
        };


        render() {
            let quaColumns = [];
            //数量
            let quantityColumns;
            const reg = numberReg.numberOnlyThree;
            let {setFieldsValue, getFieldValue} = this.props.formRef.current;

            let {tempOffsetTop, tempOffsetLeft, calculateKey} = this.state;
            let quantityDecimalNum = getCookie("quantityDecimalNum");
            let priceDecimalNum = getCookie("priceDecimalNum");
            // 数量
            quantityColumns = Object.assign({}, {
                title: "数量",
                key: 'quantity',
                originalKey: 'quantity',
                required: true,
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
                            return val && val == 0;
                        },
                        message: intl.get("components.goods.withQuantityAmount.quantityMessage")
                    }
                ],
                getFieldDecoratored: true,
                render: (quantity, record, index, dataSource, validConfig, requiredFlag, onKeyDown) => {
                    return (
                        <React.Fragment>
                            <Form.Item
                                {...defaultOptions}
                                name={[this.dataPrefix, record.key, 'quantity']}
                                initialValue={fixedDecimal(quantity, quantityDecimalNum)}
                                rules={validConfig}
                            >
                                <Input
                                    onBlur={()=>{
                                        let value = getFieldValue([this.dataPrefix, record.key, 'quantity']);
                                        this.handleQuantityChange(record.key, value)
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
                                                    calculateKey: `${this.dataPrefix}[${record.key}].quantity`
                                                })
                                            }}
                                            type="icon-calculator"
                                        />
                                    }
                                />
                            </Form.Item>
                            {
                                `${this.dataPrefix}[${record.key}].quantity` === calculateKey && (
                                    <Modal>
                                        <div onClick={(event) => {
                                            event.nativeEvent.stopImmediatePropagation()
                                        }}>
                                            <Calculator
                                                key={record.key}
                                                calculate={(quantity) => {
                                                    setFieldsValue({[this.dataPrefix]: {[record.key]: {quantity: fixedDecimal(quantity, quantityDecimalNum)}}});
                                                    this.setState({calculateKey: ''});
                                                    this.handleQuantityChange(record.key, quantity);
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
            }, this.props.quantityColumns ? this.props.quantityColumns : {});

            quaColumns = quaColumns.concat(quantityColumns);

            // 单位成本
            let unitCostColumns;

            unitCostColumns = Object.assign({}, {
                title: "单位成本",
                key: 'unitCost',
                originalKey: 'unitCost',
                width: 150,
                align: 'right',
                required: true,
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
                render: (unitCost, record, index, dataSource, validConfig, requiredFlag, onKeyDown) => {
                    return (
                        <React.Fragment>
                            <Form.Item
                                {...defaultOptions}
                                name={[this.dataPrefix, record.key, 'unitCost']}
                                initialValue={fixedDecimal(unitCost, priceDecimalNum)}
                                rules={validConfig}
                            >
                                <Input
                                    onBlur={()=>{
                                        let value = getFieldValue([this.dataPrefix, record.key, 'unitCost']);
                                        this.handleUnitCostChange(record.key, value);
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
                                                    calculateKey: `${this.dataPrefix}[${record.key}].unitCost`
                                                })
                                            }}
                                            type="icon-calculator"
                                        />
                                    }
                                />
                            </Form.Item>

                            {
                                `${this.dataPrefix}[${record.key}].${this.dataName.unitCost}` === calculateKey && (
                                    <Modal>
                                        <div onClick={(event) => {
                                            event.nativeEvent.stopImmediatePropagation()
                                        }}>
                                            <Calculator
                                                calculate={(unitCost) => {
                                                    setFieldsValue({[this.dataPrefix]: {[record.key]: {unitCost: fixedDecimal(unitCost, priceDecimalNum)}}});
                                                    this.setState({calculateKey: ''});
                                                    this.handleUnitCostChange(record.key, unitCost);
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
            }, this.props.unitCostColumns ? this.props.unitCostColumns : {});
            quaColumns = quaColumns.concat(unitCostColumns);

            // 金额
            let amountColumns;
            amountColumns = Object.assign({}, {
                title: '金额',
                key: 'amount',
                originalKey: 'amount',
                maxLength: 14,
                width: 150,
                align: 'right',
                required: true,
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
                                name={[this.dataPrefix, record.key, 'amount']}
                                initialValue={removeCurrency(formatCurrency(unitPrice, 3, true))}
                                rules={validConfig}
                            >
                                <Input
                                    onBlur={()=>{
                                        let value = getFieldValue([this.dataPrefix, record.key, 'amount']);
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
                                `${this.dataPrefix}[${record.key}].amount` === calculateKey && (
                                    <Modal>
                                        <div onClick={(event) => {
                                            event.nativeEvent.stopImmediatePropagation()
                                        }}>
                                            <Calculator
                                                calculate={(amount) => {
                                                    setFieldsValue({[this.dataPrefix]: {[record.key]: {amount: removeCurrency(formatCurrency(amount, 3, true))}}});
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

            if (this.props.prodType==='preform') {
                quaColumns = quaColumns.concat([{
                    title: "分摊后单价",
                    key: this.dataName.allocatedPrice,
                    originalKey: 'allocatedPrice',
                    columnName: 'allocatedPrice',
                    width: 150,
                    align: 'right',
                    readOnly: true
                }, {
                    title: "分摊后金额",
                    key: this.dataName.allocatedAmount,
                    originalKey: 'allocatedAmount',
                    columnName: 'allocatedAmount',
                    width: 150,
                    align: 'right',
                    readOnly: true
                }]);
            }

            return <WrappedComponent
                {...this.props}
                quaColumns={quaColumns}
                setTotalQuantity={this.setTotalQuantity}
                setProcessCost={this.setProcessCost}
                setTotalCost={this.setTotalCost}
                setTotalAmount={this.setTotalAmount}
                calcTotal={this.calcTotal}
                handleQuantityChange={this.handleQuantityChange}
                handleUnitCostChange={this.handleUnitCostChange}
                handleAmountChange={this.handleAmountChange}
                calcTotalQuantity={this.calcTotalQuantity}
                calTotalAmount={this.calTotalAmount}
                loadStock={this.loadStock}
                emptyQuantityAmountVal={this.emptyQuantityAmountVal}
            />
        }
    }

}

