import React from 'react';
import PropTypes from 'prop-types';
import { Input, Table, Form } from 'antd';
import {PlusOutlined,MinusOutlined,EllipsisOutlined} from '@ant-design/icons';
import _ from "lodash";
import 'url-search-params-polyfill';
import defaultOptions from 'utils/validateOptions';
import {formatCurrency, removeCurrency} from 'utils/format';
import {numberReg} from 'utils/reg';
import {PRICE_NO_AUTH_RENDER} from 'utils/constants';
import {AuthInput} from 'components/business/authMenu';
import {SelectUnit} from 'pages/auxiliary/goodsUnit';

import Base from '../dependencies/base';
import withFormOperate from '../dependencies/withFormOperate';
import withQuantityAmount from '../dependencies/withQuantityAmount';
import withOrderPop from '../dependencies/withOrderPop';
import withFooter from "../dependencies/withFooter";

import styles from "../styles/index.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);


/**
 *
 * @visibleName Income（收入列表）
 * @author jinb
 */
@withFormOperate
@withFooter
@withQuantityAmount
@withOrderPop
export default class Income extends Base {
        static propTypes = {
            currencyVipFlag : PropTypes.string,   // 多币种服务状态 false: 未开启或者已到期  true: 试用中或者已续费
            quotation: PropTypes.number, // 牌价
            getFormField: PropTypes.func,
            setFormField: PropTypes.func,  // 操作单行数据
            calcTotalForOneRow: PropTypes.func, // 当某一行的数据发生改变时，通过改方法计算合计
            setTotalForm: PropTypes.func
        };

        componentDidMount() {
            this.props.getRef && this.props.getRef(this);
        }

        /** 删除一行*/
        removeOneRow = (key) => {
            let {getFormField, removeOneRow, calcTotalForOneRow} = this.props;
            let {amount=0} = getFormField(key) || {};
            removeOneRow(key, () => {
                calcTotalForOneRow(_.divide(amount, -1)); // 计算合计
            })
        };

        /** 收入金额发生变化 */
        handleAmountChange = (e, key) => {
            let amount = e.target.value;
            let { currencyVipFlag, setFormField, calTotalAmount } = this.props;
            if(currencyVipFlag === 'true'){
                const {getFieldValue} = this.props.formRef.current;
                let quotation = getFieldValue('quotation') || 100;
                setFormField(key, {currencyAmount: removeCurrency(formatCurrency(amount * quotation / 100), 2, true)});
            }
            calTotalAmount();
        };

        /** 牌价发生变化 */
        handleQuotationOnChange = (quotation) => {
            let {getFormField, setFormField, setTotalForm} = this.props;
            setTimeout(()=>{
                let totalCurrencyAmount = 0;
                let dataSource = getFormField();
                _.forIn(dataSource, (data, key) =>{
                    if (data){
                        let currencyAmount = 0;
                        if(data.amount) currencyAmount = data.amount*quotation/100;
                        setFormField(key, {currencyAmount:  removeCurrency(formatCurrency(currencyAmount), 2, true)});
                        totalCurrencyAmount += currencyAmount;
                    }
                });
                setTotalForm({totalCurrencyAmount});
            },50)
        };

        render() {
            let { dataPrefix, formData, footer, currencyVipFlag } = this.props;

            let columns = [
                {
                    title: '',
                    key: 'ope',
                    dataIndex: 'ope',
                    width: 60,
                    fixed: "left",
                    render: (value, record, index) => {
                        return (
                            <React.Fragment>
                                <a href="#!" className={cx('add-item')} onClick={() => this.props.addOneRow(index)}>
                                    <PlusOutlined style={{fontSize: "16px"}}/>
                                </a>
                                {
                                    formData.length > 1 ? (
                                        <a href="#!" className={cx('delete-item')} onClick={() => this.removeOneRow(record.key)}>
                                            <MinusOutlined style={{fontSize: "16px"}}/>
                                        </a>
                                    ) : null
                                }
                            </React.Fragment>
                        )
                    }
                }, {
                    title: '序号',
                    dataIndex: 'serial',
                    key: 'serial',
                    width: 50,
                    align: 'center',
                    render: (text, record, index) => index + 1
                }, {
                    title: '上游单号',
                    dataIndex: 'displayBillNo',
                    key: 'displayBillNo',
                    width: 250,
                    maxLength: 50,
                    required: true,
                    render: (text, record, index) =>
                        <React.Fragment>
                            <Form.Item name={[dataPrefix, record.key, 'displayBillNo']} style={{display: 'inline-block', width: '80%'}}>
                                <Input disabled={true}/>
                            </Form.Item>
                            <div className={cx("select-goods-trigger")}>
                                <a href="#!" onClick={() => this.props.selectGoods(record.key)}>
                                    <EllipsisOutlined style={{fontSize: "16px"}}/>
                                </a>
                            </div>
                        </React.Fragment>
                }, {
                    title: '优惠后金额',
                    dataIndex: 'aggregateAmount',
                    key: 'aggregateAmount',
                    maxLength: 30,
                    width: 150
                }, {
                    title: '已收入金额',
                    dataIndex: 'payAmount',
                    key: 'payAmount',
                    maxLength: 100,
                    width: 150
                }, {
                    title: '收入金额',
                    key: 'amount',
                    dataIndex: 'amount',
                    maxLength: 14,
                    width: 150,
                    required: true,
                    render: (text, record, index) => {
                        return (
                            <Form.Item
                                {...defaultOptions}
                                name={[dataPrefix, record.key, 'amount']}
                                rules={[
                                    {
                                        validator: (rules, value, callback) => {
                                            const reg = numberReg.numberOnlyTwo;
                                            if(!value) {
                                                callback('该项为必填项');
                                            } else if (value && !reg.rules.test(value)) {
                                                callback(reg.message)
                                            } else if (value && value == 0) {
                                                callback("数量不能为0！")
                                            }
                                            callback();
                                        }
                                    }
                                ]}
                            >
                                <Input style={{"textAlign": 'right'}} onBlur={(e) => this.handleAmountChange(e, record.key)}/>
                            </Form.Item>
                        )
                    }
                }
            ];

            // 多币种服务状态开启时
            if(currencyVipFlag === 'true'){
                columns = columns.concat({
                    title: '本币金额',
                    dataIndex: 'currencyAmount',
                    key: 'currencyAmount',
                    maxLength: 100,
                    width: 150,
                    align: 'right',
                    readOnly: true,
                    type: 'INPUT'
                });
            }

            columns = columns.concat({
                title: '备注',
                key: 'remarks',
                dataIndex: 'remarks',
                maxLength: 2000,
                width: 300,
                type: 'INPUT'
            });

            columns = columns.map(item => {
                return {
                    ...item,
                    title: () => {
                        return (
                            <React.Fragment>
                                {
                                    item.required ? (<span className="required">*</span>) : null
                                }
                                {item.title}
                            </React.Fragment>
                        )
                    },
                    align: item.align || 'left',
                    render: (text, record, index) => {
                        if(item.render){
                            return (
                                <React.Fragment>
                                    {
                                        //  校验价格权限 & 没有对应的价格权限
                                        (item.isValidatePriceAuth && !item.priceAuthFlag) ? PRICE_NO_AUTH_RENDER : (
                                            <Form.Item>
                                                {item.render(text, record, index)}
                                            </Form.Item>
                                        )
                                    }
                                </React.Fragment>
                            )
                        } else if(item.type === 'INPUT') {
                            let inputProps = {
                                maxLength: item.maxLength,
                                placeholder: item.placeholder
                            };
                            if (item.readOnly) {
                                inputProps = {
                                    className: cx("readOnly"),
                                    readOnly: true,
                                    title: text,
                                    style: {"textAlign": item.align}
                                }
                            }
                            return (
                                <React.Fragment>
                                    {
                                        //  校验价格权限 & 没有对应的价格权限
                                        (item.isValidatePriceAuth && !item.priceAuthFlag) ? PRICE_NO_AUTH_RENDER : (
                                            <Form.Item name={[dataPrefix, record.key, item.key]}>
                                                <Input {...inputProps}/>
                                            </Form.Item>
                                        )
                                    }
                                </React.Fragment>
                            )
                        } else {
                            return <span className="txt-clip" title={text}>{text}</span>
                        }
                    }
                };
            });

            //计算宽度
            const tableWidth = columns.reduce(function(width, item) {
                return width + (item.width ? item.width : 200) / 1;
            }, 0);

            return (
                <React.Fragment>
                    <Table
                        bordered
                        dataSource={formData}
                        pagination={false}
                        footer={() => footer}
                        columns={columns}
                        className={cx("goods-table")}
                        scroll={{x: tableWidth}}
                    />
                </React.Fragment>
            )
        }
}


