import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {fromJS, is} from 'immutable'
import {withRouter} from 'react-router-dom'
import PropTypes from 'prop-types';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Table, Spin, Select } from 'antd';
import {PlusOutlined,MinusOutlined,EllipsisOutlined} from '@ant-design/icons';
import 'url-search-params-polyfill';
import defaultOptions from 'utils/validateOptions';
import {formatCurrency, removeCurrency} from 'utils/format';
import {numberReg} from 'utils/reg';
import {AuthInput} from 'components/business/authMenu';
import Icon from 'components/widgets/icon';
import {SelectUnit} from 'pages/auxiliary/goodsUnit';

import base from '../dependencies/base';
import withQuantityAmount from '../dependencies/withQuantityAmount'
import withOrdersPop from '../dependencies/withOrdersPop';

import styles from "../styles/index.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);



export default withRouter(base(withQuantityAmount(withOrdersPop(
    class FinanceTable extends Component {

        static propTypes = {
            billType: PropTypes.string,
            goodsPopCondition: PropTypes.object,
            dataPrefix: PropTypes.string,
            dataName: PropTypes.object,
            hideQuantityColumn: PropTypes.bool,
            hideUnitPriceColumn: PropTypes.bool,
            hideAmountColumn: PropTypes.bool,
            quantityColumns: PropTypes.object,
            unTaxedPriceColumns: PropTypes.object,
            unitPriceColumns: PropTypes.object,
            amountColumns: PropTypes.object,
            onInsertGoods: PropTypes.func,
            prodCodeSuggestSelect: PropTypes.func,
            prodNameSuggestSelect: PropTypes.func,
            carryOrderPriceToUnitPrice: PropTypes.bool,
            carrySalePriceToUnitPrice: PropTypes.bool,
            showStockInfo: PropTypes.bool,
            goodsPopCarryFields: PropTypes.object,
            /**
             *   单价权限对应模块
             **/
            unitPriceAuthModule: PropTypes.string,
            /**
             *   金额权限对应模块
             **/
            amountAuthModule: PropTypes.string,
            /**
             *   默认权限类型
             **/
            defaultAuthType: PropTypes.string,
            /**
             *   默认无权限渲染的内容
             **/
            defaultNoAuthRender: PropTypes.string,
        };

        static defaultProps = {
            defaultAuthType: 'show',
            defaultNoAuthRender: '**'
        };

        handleRemoveItem = (index, key) => {
            this.props.removeGoodsItem(index);
            this.props.calTotalAmount([0], [key])
        };

        clearAllGoods = () => {
            const {form: {setFieldsValue}, ordersInfo} = this.props;
            const dataSource = ordersInfo.get('data').toJS();

            dataSource.forEach((item, index) => {
                setFieldsValue({
                    [`${this.props.dataPrefix}[${item.key}].${this.props.dataName.billNo}`]: '',
                    [`${this.props.dataPrefix}[${item.key}].${this.props.dataName.displayBillNo}`]: '',
                    [`${this.props.dataPrefix}[${item.key}].${this.props.dataName.aggregateAmount}`]: '',
                    [`${this.props.dataPrefix}[${item.key}].${this.props.dataName.payAmount}`]: '',
                    [`${this.props.dataPrefix}[${item.key}].${this.props.dataName.waitPay}`]: '',
                    [`${this.props.dataPrefix}[${item.key}].${this.props.dataName.remarks}`]: ''
                });
                // this.props.onClearAllGoods && this.props.onClearAllGoods(item.key);
                this.props.setFieldReadOnlyStatus(false, item.key);
                this.props.calTotalAmount([0], [item.key])
            });
        };

        componentDidMount() {
            //从物品详情页进入单据新增页，通过物品code带入物品信息
            let recId = this.props.match.params.id;
            if (recId) {
                // this.props.asyncFetchIncomeById(recId, res => {
                //     if (res.get('retCode') === '0') {
                //         const ordersInfoData = res.get('data').get('data');
                //         console.log(ordersInfoData && ordersInfoData.toJS(), 'ordersInfoData');
                //         let ordersInfo = fromJS({});
                //         let newGoodsInfo = ordersInfo.set('billNo', ordersInfoData.get('billNo'))
                //             .set('displayBillNo', ordersInfoData.get('displayBillNo'))
                //             .set('aggregateAmount', ordersInfoData.get('aggregateAmount'))
                //             .set('payment', ordersInfoData.get('payment'))
                //             .set('waitPay', ordersInfoData.get('waitPay'))
                //             .set('remarks', item.get(this.props.dataName.remarks));
                //         this.props.initGoodsItem(fromJS([newGoodsInfo]));
                //     }
                //     else {
                //         alert(res.get('resMsg'))
                //     }
                // })
            }
        }

        UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
            const hasProdCode = nextProps.ordersInfo.get('data').some(item => {
                return item.get('ope')
            });
            // //没有物品编号就说明没有物品，则加载初始物品数据
            if ((this.props.match.params.id || this.props.match.params.copyId || this.props.location.search.indexOf('billNo') !== -1) && nextProps.initGoodsTableData && nextProps.initGoodsTableData.size > 0 &&  !hasProdCode) {
                //修改页赋初始值，后端给的字段名称转成组件里统一的字段名称
                console.log(nextProps.initGoodsTableData.toJS(), 'nextProps.initGoodsTableData');
                //修改页赋初始值，后端给的字段名称转成组件里统一的字段名称
                const initGoodsTableData = nextProps.initGoodsTableData.map(item => {
                    return item.set('billNo', item.get(this.props.dataName.billNo))
                        .set('displayBillNo', item.get(this.props.dataName.displayBillNo))
                        .set('aggregateAmount', item.get(this.props.dataName.aggregateAmount))
                        .set('payAmount', item.get(this.props.dataName.payAmount))
                        .set('waitPay', item.get(this.props.dataName.waitPay))
                        .set('remarks', item.get(this.props.dataName.remarks))
                });
                this.props.initGoodsItem(initGoodsTableData);
                //初始化总金额
                  if ('initTotalAmount' in nextProps && nextProps.initTotalAmount) {
                      this.props.setTotalAmount(nextProps.initTotalAmount)
                  }
            }
        }

        componentWillUnmount() {
            this.props.emptyDetailData();
        }

        render() {

            const {form: {getFieldDecorator}, ordersInfo, financeType} = this.props;

            const dataSource = ordersInfo.get('data').toJS();

            const prefixColumn = [{
                // fixed: 'left',
                title: '',
                dataIndex: 'ope',
                key: 'ope',
                width: 60,
                align: 'center',
                fixed: "left",
                render: (billNo, record, index) => {
                    return (
                        <React.Fragment>
                            <a href="#!" className={cx('add-item')}
                               onClick={() => this.props.addGoodsItem(index + 1)}><PlusOutlined style={{fontSize: "16px"}}/></a>
                            {
                                dataSource.length > 1 ? (
                                    <a href="#!" className={cx('delete-item')}
                                       onClick={() => this.handleRemoveItem(index, record.key)}><MinusOutlined style={{fontSize: "16px"}}/></a>
                                ) : null
                            }
                            {
                                getFieldDecorator(`${this.props.dataPrefix}[${record.key}].${this.props.dataName.billNo}`, {
                                    initialValue: billNo
                                })(<Input type="hidden"/>)
                            }
                        </React.Fragment>
                    )
                }
            }, {
                // fixed: 'left',
                title: intl.get("components.finance.financeTable.serial"),
                dataIndex: 'serial',
                key: 'serial',
                width: 50,
                render: (text, record, index) => index + 1
            }];

            //物品固定字段
            let goodsColumns = [
                {
                    title: intl.get("components.finance.financeTable.displayBillNo"),
                    key: this.props.dataName.displayBillNo,
                    originalKey: 'displayBillNo',
                    maxLength: 50,
                    width: 250,
                    required: true,
                    render: (displayBillNo, record, index) =>
                        <React.Fragment>
                            {
                                getFieldDecorator(`${this.props.dataPrefix}[${record.key}].${this.props.dataName.displayBillNo}`, {
                                    initialValue: displayBillNo
                                })(<Input style={{ width: '80%' }} disabled={record['displayBillNoReadOnly']}/>)
                            }
                            <div style={{ width: '20%' }}
                                 className={cx("select-goods-trigger")}
                            >
                                <a href="#!" onClick={() => this.props.selectGoods(record.key)}><EllipsisOutlined style={{fontSize: "16px"}}/></a>
                            </div>
                        </React.Fragment>,
                },
                {
                    title: intl.get("components.finance.financeTable.aggregateAmount"),
                    key: this.props.dataName.aggregateAmount,
                    originalKey: 'aggregateAmount',
                    maxLength: 30,
                    width: 150,
                }
            ];

            //财务部分价格字段处理
            let payTitle, waitPayTitle;

            switch (financeType) {
                case 'income':
                    payTitle = intl.get("components.finance.financeTable.payIncome");
                    waitPayTitle = intl.get("components.finance.financeTable.waitPayIncome");
                    break;
                case 'expend':
                    payTitle = intl.get("components.finance.financeTable.payExpend");
                    waitPayTitle = intl.get("components.finance.financeTable.waitPayExpend");
                    break;
                case 'saleInvoice':
                    payTitle = intl.get("components.finance.financeTable.paySaleInvoice");
                    waitPayTitle = intl.get("components.finance.financeTable.waitPaySaleInvoice");
                    break;
                case 'invoice':
                    payTitle = intl.get("components.finance.financeTable.payInvoice");
                    waitPayTitle = intl.get("components.finance.financeTable.waitPayInvoice");
                    break;
            }

            const priceColumns = [{
                title: payTitle,
                key: this.props.dataName.payAmount,
                originalKey: 'payAmount',
                maxLength: 100,
                width: 150,
            },
                {
                    title: waitPayTitle,
                    key: this.props.dataName.waitPay,
                    originalKey: 'waitPay',
                    maxLength: 100,
                    width: 150,
                    required: true,
                    getFieldDecoratored: true,
                    render: (waitPay, record, index, dataSource, validConfig, requiredFlag, onKeyDown) => {
                        validConfig.push({
                            validator: (rules, value, callback) => {
                                const reg = numberReg.numberOnlyTwo;
                                if (value && !reg.rules.test(value)) {
                                    callback(reg.message)
                                }
                                else if (value && value == 0) {
                                    callback(intl.get("components.finance.financeTable.message1"))
                                }
                                callback();
                            }
                        });
                        const inputStr = getFieldDecorator(`${this.props.dataPrefix}[${record.key}].${this.props.dataName.waitPay}`, {
                            ...defaultOptions,
                            initialValue: removeCurrency(formatCurrency(waitPay, 2, true)),
                            rules: validConfig
                        })(<Input onChange={(e) => {this.props.calTotalAmount([{waitPay: e.target.value}], [record.key])}}
                                  maxLength={14}
                                  onKeyDown={onKeyDown}
                                  style={{"textAlign": 'right'}}
                        />);

                        return (
                            <React.Fragment>
                                {inputStr}
                            </React.Fragment>
                        )
                    }
                }
            ];

            goodsColumns = goodsColumns.concat(priceColumns);


            //其它自己设置的字段
            const receiptColumns = this.props.receiptColumns ? this.props.receiptColumns : [];

            //备注
            const remarksColumns = [{
                title: intl.get("components.finance.financeTable.remarks"),
                key: this.props.dataName.remarks,
                originalKey: 'remarks',
                maxLength: 2000,
            }];

            const allFieldsColumns = goodsColumns.concat(receiptColumns, remarksColumns);


            const allResolvedColumns = allFieldsColumns.map(item => {

                return {
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
                    dataIndex: item.key,
                    key: item.key,
                    width: item.width,
                    align: item.align || 'left',
                    render: (text, record, index) => {

                        let validConfig = [];
                        if (item.rules && item.rules.length > 0) {
                            validConfig = item.rules;
                        }
                        //（有必填项 && （当前行不为空行则校验 || 如果全部为空行，则第一行校验））
                        const requiredFlag = item.required && (!this.props.isEmptyLine(record.key) || (this.props.findKeyWithEmptyLine(dataSource).length === dataSource.length && index === 0))
                        validConfig.push({
                            required: requiredFlag,
                            message: `${item.title} ${intl.get("components.finance.financeTable.message2")}`
                        });

                        if (item.maxLength) {
                            validConfig.push({
                                // max: item.maxLength,
                                // message: `${item.title}不能超过${item.maxLength}个字符!`
                                validator: (rules, val, callback) => {
                                    if (val && val.length > item.maxLength) {
                                        callback(`${item.title} ${intl.get("components.finance.financeTable.message3")} ${item.maxLength} ${intl.get("components.finance.financeTable.message4")}`)
                                    }
                                    callback();
                                },
                            })
                        }

                        let str = null;
                        let onKeyDown = (e) => this.props.tabMove(e.keyCode, index, item.key, allFieldsColumns);

                        //直接有render方法的
                        let componentStr;
                        if (item.render) {
                            componentStr = item.render(text, record, index, dataSource, validConfig, requiredFlag, onKeyDown);
                        }
                        else {
                            let inputProps = {
                                placeholder: item.placeholder,
                                maxLength: item.maxLength,
                                disabled: record[item.originalKey + 'ReadOnly'],
                                style: {"textAlign": item.align},
                                onKeyDown: onKeyDown,
                                onChange: item.onChange ? (e) => item.onChange(e, record.key, dataSource) : null
                            };

                            if(item.readOnly){
                                inputProps = {
                                    className: cx("readOnly"),
                                    readOnly: true,
                                    style: {"textAlign": item.align}
                                }
                            }

                            if(this.props[`${item.originalKey}AuthModule`]){
                                componentStr = <AuthInput {...inputProps}
                                                          module={this.props[`${item.originalKey}AuthModule`]}
                                                          option={this.props[`${item.originalKey}AuthType`]?this.props[`${item.originalKey}AuthType`]:this.props.defaultAuthType}
                                                          noAuthRender={this.props[`${item.originalKey}NoAuthRender`]?this.props[`${item.originalKey}NoAuthRender`]:this.props.defaultNoAuthRender}
                                />
                            }else{
                                componentStr = <Input {...inputProps}/>
                            }

                        }
                        //处理单价和金额格式化
                        let initialValue = text;
                        if (item.key === this.props.dataName.payAmount || item.key === this.props.dataName.aggregateAmount) {
                            initialValue = removeCurrency(formatCurrency(text, 2, true))
                        }

                        str = (
                            <React.Fragment>
                                <Form.Item>
                                    {
                                        item.getFieldDecoratored ? (
                                            <React.Fragment>
                                                {componentStr}
                                            </React.Fragment>
                                        ) : (
                                            <React.Fragment>
                                                {
                                                    getFieldDecorator(`${this.props.dataPrefix}[${record.key}].${item.key}`, {
                                                        ...defaultOptions,
                                                        initialValue: initialValue,
                                                        rules: validConfig
                                                    })(componentStr)
                                                }
                                            </React.Fragment>
                                        )
                                    }

                                </Form.Item>
                            </React.Fragment>
                        )
                        // }

                        return (
                            <React.Fragment>
                                {str}
                            </React.Fragment>
                        )
                    }
                }
            });

            const columns = prefixColumn.concat(allResolvedColumns);

            let footerStr = null;

            const footTitle = (financeType === 'income') ? intl.get("components.finance.financeTable.incomeAmount"):
                (financeType === 'expend') ? intl.get("components.finance.financeTable.expendAmount"):
                    (financeType === 'saleInvoice') ? intl.get("components.finance.financeTable.saleInvoiceAmount"):
                        (financeType === 'invoice') ? intl.get("components.finance.financeTable.invoiceAmount") : '';

            footerStr = (
                <div className={cx("tb-footer-wrap")+ " cf"}>
                    <div className={cx('total')}>
                        <span>{footTitle}: <b>{formatCurrency(this.props.totalAmount, 2)}</b> {intl.get("components.goods.goodsTable.yuan")}</span>
                    </div>
                </div>
            )

            //计算宽度
            const tableWidth = columns.reduce(function(width, item) {
                return width + (item.width ? item.width : 200) / 1;
            }, 0);

            return (
                <React.Fragment>
                    <Spin
                        spinning={ordersInfo.get('isFetching')}
                    >
                        <Table
                            bordered
                            dataSource={dataSource}
                            pagination={false}
                            footer={footerStr?() => footerStr:null}
                            columns={columns}
                            className={cx("goods-table")}
                            scroll={{x: tableWidth}}
                        />
                    </Spin>
                </React.Fragment>
            )
        }
    }
))));

