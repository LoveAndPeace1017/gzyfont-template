import React from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, DatePicker, Row, Col } from 'antd';
import {actions as saleActions} from 'pages/sale/index';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import {formatCurrency, removeCurrency} from 'utils/format';
import {numberReg} from 'utils/reg';
import defaultOptions from 'utils/validateOptions';
import {getCookie} from 'utils/cookie';
import SelectIncomeType from "pages/auxiliary/income/views/selectIncomeType";
import BatchBaseCompenent from "../dependencies/batchBaseComponent";
import {SelectEmployeeFix} from 'pages/auxiliary/employee';
import PropTypes from "prop-types";
import intl from 'react-intl-universal';
class FinanceIncomeBatchEdit extends BatchBaseCompenent {
    displayGaName = 'income';
    static propTypes = {
        /** 本页合计金额 */
        pageAmount: PropTypes.number,
        /** 全部合计金额 */
        totalAmount: PropTypes.number,
        /** 权限对应的模块名称，
         * 如采购列表页需要有采购价格的查看权则module="purchasePrice"，
         * 如入库列表页需要同时具有采购价和销售价的查看权则module=["purchasePrice", "salePrice"]
         **/
        module: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.arrayOf(PropTypes.string)
        ])
    };

    constructor(props) {
        super(props);
    }

    initTableColumnInfo = () => {
        let priceDecimalNum = getCookie("priceDecimalNum");
        const {form: {getFieldDecorator}, popType, currencyVipFlag} = this.props;
        this.columns = [
            this.serialColumn(intl.get("components.batchEditPop.financeIncomeBatchEdit.title1")+'：'),
            {
                width: 150,
                title: intl.get("components.batchEditPop.financeIncomeBatchEdit.displayBillNo"),
                key: 'displayBillNo',
                dataIndex: 'displayBillNo',
                align: 'center',
                render: this.renderContent
            },
            {
                width: 200,
                title: intl.get("components.batchEditPop.financeIncomeBatchEdit.customerName"),
                key: 'customerName',
                dataIndex: 'customerName',
                align: 'center',
                render: this.renderContent
            },
            {
                width: 100,
                title: intl.get("components.batchEditPop.financeIncomeBatchEdit.saleOrderDate"),
                key: 'saleOrderDate',
                dataIndex: 'saleOrderDate',
                align: 'center',
                render: (date, record, index) => {
                    const obj = this.renderContent(date, record, index);
                    obj.children = <span>{date && moment(date).format('YYYY-MM-DD')}</span>;
                    return obj;
                }
            },
            {
                width: 100,
                title: intl.get("components.batchEditPop.financeIncomeBatchEdit.discountAmount"),
                key: 'discountAmount',
                dataIndex: 'discountAmount',
                align: 'center',
                render: this.renderContent
            },
            {
                width: 100,
                title: intl.get("components.batchEditPop.financeIncomeBatchEdit.aggregateAmount"),
                key: 'aggregateAmount',
                dataIndex: 'aggregateAmount',
                align: 'center',
                render: this.renderContent
            },
            {
                width: 100,
                title: intl.get("components.batchEditPop.financeIncomeBatchEdit.receivedAmount"),
                key: 'receivedAmount',
                dataIndex: 'receivedAmount',
                align: 'center',
                render: this.renderContent
            },
            {
                width: 150,
                title: intl.get("components.batchEditPop.financeIncomeBatchEdit.amount"),
                key: 'amount',
                dataIndex: 'amount',
                align: 'center',
                render: (text, record, index) => {
                    const obj = this.renderContent(text, record, index);
                    obj.children = (
                        <Form.Item style={{margin: 0}}>
                            {getFieldDecorator(`amount.${index}`, {
                                rules: [{
                                    validator: (rules, value, callback) => {
                                        const reg = numberReg.numberOnlyTwo;
                                        if (value && !reg.rules.test(value)) {
                                            callback(reg.message)
                                        }
                                        callback();
                                    }
                                }],
                                initialValue: record.amount,
                            })(<Input style={{textAlign: 'center'}} onChange={(e) => {
                                record.amount = e.target.value;
                                if(currencyVipFlag === 'true') {
                                    record.currencyAmount = removeCurrency(formatCurrency(record.amount * record.quotation / 100, 2, true));
                                }
                            }}/>)}
                        </Form.Item>

                    );
                    return obj;
                }
            }
        ];

        if(currencyVipFlag === 'true' && popType!=='merge'){
            this.columns.push(
                {
                    width: 150,
                    title: "币种",
                    key: 'currencyName',
                    dataIndex: 'currencyName',
                    align: 'center',
                    render: this.renderContent
                },
                {
                    width: 100,
                    title: "牌价",
                    key: 'quotation',
                    dataIndex: 'quotation',
                    align: 'center',
                    render: (text, record, index) => {
                        const obj = this.renderContent(text, record, index);
                        if(!record.currencyFlag){  // 如果非本币币种，可以修改牌价
                            obj.children = (
                                <Form.Item style={{margin: 0}}>
                                    {getFieldDecorator(`quotation.${index}`, {
                                        rules: [{
                                            validator: (rules, value, callback) => {
                                                let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+ priceDecimalNum +'})?$/');
                                                if(!value) {
                                                    callback('该项为必填项')
                                                } else if (value && !reg.test(value)) {
                                                    callback(`整数部分不能超过10位，小数点后不能超过${priceDecimalNum}位`);
                                                }
                                                callback();
                                            }
                                        }],
                                        initialValue: record.quotation,
                                    })(<Input style={{textAlign: 'center'}} onChange={(e) => {
                                        record.quotation = e.target.value;
                                        record.currencyAmount = removeCurrency(formatCurrency(record.amount*record.quotation/100, 2, true));
                                    }}/>)}
                                </Form.Item>

                            );
                        }
                        return obj;
                    }
                }
            )
        }

        if(currencyVipFlag === 'true'){
            this.columns.push(
                {
                    width: 150,
                    title: "本币金额",
                    key: 'currencyAmount',
                    dataIndex: 'currencyAmount',
                    align: 'center',
                    render: this.renderContent
                }
            )
        }

        this.columns.push(
            {
                width: 150,
                title: intl.get("components.batchEditPop.financeIncomeBatchEdit.inType"),
                key: 'inType',
                dataIndex: 'inType',
                editable: true,
                align: 'center',
                render: (text, record, index) => {
                    const obj = this.renderContent(text, record, index);
                    obj.children = (
                        <Form.Item style={{margin: 0}}>
                            {
                                getFieldDecorator(`inType.${index}`, {
                                    initialValue: {},
                                    ...defaultOptions,
                                })(
                                    <SelectIncomeType type='inType' style={{width: '120px'}}/>
                                )}
                        </Form.Item>
                    );
                    return obj;
                }
            },
            {
                width: 150,
                title: intl.get("components.batchEditPop.financeIncomeBatchEdit.accountName"),
                key: 'accountName',
                dataIndex: 'accountName',
                align: 'center',
                render: (text, record, index) => {
                    const obj = this.renderContent(text, record, index);
                    obj.children = (
                        <Form.Item style={{margin: 0}}>
                            {getFieldDecorator(`accountName.${index}`, {
                                initialValue: {},
                                ...defaultOptions,
                            })(
                                <SelectIncomeType type='account'/>
                            )}
                        </Form.Item>
                    );
                    return obj;
                }
            },
            this.datePickerColumn({key: 'paymentDate', title: intl.get("components.batchEditPop.financeIncomeBatchEdit.paymentDate")}),
            {
                width: 200,
                title: intl.get("components.batchEditPop.financeIncomeBatchEdit.remarks"),
                key: 'remarks',
                dataIndex: 'remarks',
                editable: true,
                align: 'center',
                render: (text, record, index) => {
                    const obj = this.renderContent(text, record, index);
                    obj.children = (
                        <Form.Item style={{margin: 0}}>
                            {getFieldDecorator(`remarks.${index}`, {
                                initialValue: record.remarks,
                            })(<Input maxLength={2000}/>)}
                        </Form.Item>
                    );
                    return obj;
                }
            }
        );

        if (this.props.popType !== 'merge') {
            this.columns.splice(11,0,{
                width: 200,
                title: "经办人",
                key: 'ourContacterName',
                dataIndex: 'ourContacterName',
                editable: true,
                align: 'center',
                render: (text, record, index) => {
                    const obj = this.renderContent(text, record, index);
                    obj.children = (
                        <Form.Item style={{margin: 0}}>
                            {getFieldDecorator(`ourContacterName.${index}`, {
                                initialValue: record.ourContacterName,
                            })(
                                <SelectEmployeeFix width={250}/>
                            )}
                        </Form.Item>
                    );
                    return obj;
                }
            })
        }

        if (this.props.popType === 'merge') {
            this.columns = this.columns.filter((value) => value.key !== 'customerName'
                && value.key !== 'accountName'
                && value.key !== 'paymentDate'
                && value.key !== 'inType'
            );
        }
    };

    getPostData = ({merge, values}) => {
        let { currencyVipFlag } = this.props;
        if (merge) {
            return {
                paymentDate: moment(values.paymentDate).format("YYYY-MM-DD"),
                customerName: this.state.dataSource[0].customerName || '',
                typeName: values.inType.label,
                typeId: values.inType.key,
                accountId: values.accountName.key,
                accountName: values.accountName.label,
                ourContacterName: values.ourContacterName,
                bindBillType: 1,
                currencyId: this.state.dataSource[0].currencyId,
                quotation: this.state.dataSource[0].quotation,
                dataList: this.state.dataSource
                    .slice(0, -1)
                    .map((item, index) => {
                        return {
                            remarks: values.remarks[index],
                            amount: values.amount[index],
                            billNo: item.billNo,
                            currencyAmount: item.currencyAmount
                        }
                    })
            }
        } else {
            return this.state.dataSource.map((item, index) => {
                let out = {
                    remarks: values.remarks[index],
                    ourContacterName: values.ourContacterName[index],
                    amount: values.amount[index],
                    bindBillType: 1,
                    billNo: item.billNo,
                    accountName: values.accountName[index].label,
                    accountId: values.accountName[index].key,
                    typeName: values.inType[index].label,
                    typeId: values.inType[index].key,
                    paymentDate: values.paymentDate[index] && moment(values.paymentDate[index]).format("YYYY-MM-DD"),
                    customerName: item.customerName
                };
                if(currencyVipFlag === 'true'){
                    out.currencyAmount = item.currencyAmount;
                    out.quotation = item.quotation;
                    out.currencyId = item.currencyId;
                }
                return out;
            });
        }
    };

    buildMergeInfo = () => {
        let priceDecimalNum = getCookie("priceDecimalNum");
        const {form: {getFieldDecorator}, currencyVipFlag} = this.props;
        const formItemLayout = {
            labelCol: {
                xs: {span: 16},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 16},
                sm: {span: 16},
            }
        };
        return (
            <>
                <Row>
                    <Col span={8}>
                        <Form.Item label={'客户'} {...formItemLayout}>
                            <span>{this.state.dataSource[0] && this.state.dataSource[0].customerName}</span>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label={intl.get("components.batchEditPop.financeIncomeBatchEdit.inType")}
                            {...formItemLayout}
                        >
                            {getFieldDecorator(`inType`, {
                                initialValue: {},
                                ...defaultOptions,
                            })(
                                <SelectIncomeType type='inType'/>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label={intl.get("components.batchEditPop.financeIncomeBatchEdit.accountName")} {...formItemLayout}>
                            {getFieldDecorator(`accountName`, {
                                initialValue: {},
                                ...defaultOptions,
                            })(
                                <SelectIncomeType type='account'/>
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={8}>
                        <Form.Item label={intl.get("components.batchEditPop.financeIncomeBatchEdit.paymentDate")} {...formItemLayout}>
                            {getFieldDecorator(`paymentDate`, {
                                initialValue: moment(new Date()),
                                rules: [
                                    {
                                        type: 'object',
                                        required: true,
                                        message: intl.get("components.batchEditPop.financeIncomeBatchEdit.rule1")
                                    }
                                ]
                            })(
                                <DatePicker/>
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label={"经办人"} {...formItemLayout}>
                            {
                                getFieldDecorator(`ourContacterName`)(
                                    <SelectEmployeeFix width={180}/>
                                )
                            }
                        </Form.Item>
                    </Col>
                    {
                        currencyVipFlag === 'true' && (
                            <>
                                <Col span={8}>
                                    <Form.Item label={'币种'} {...formItemLayout}>
                                        <span>{this.state.dataSource[0] && this.state.dataSource[0].currencyName}</span>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    {
                                        (this.state.dataSource[0] && this.state.dataSource[0].currencyFlag) ?  (
                                            <Form.Item label={'牌价'} {...formItemLayout}>
                                                <span>{this.state.dataSource[0] && this.state.dataSource[0].quotation}</span>
                                            </Form.Item>
                                        ) : (
                                            <Form.Item label={'牌价'} {...formItemLayout}>
                                                {getFieldDecorator('quotation', {
                                                    rules: [{
                                                        validator: (rules, value, callback) => {
                                                            let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+ priceDecimalNum +'})?$/');
                                                            if(!value){
                                                                callback('该项为必填项');
                                                            } else if (value && !reg.test(value)) {
                                                                callback(`整数部分不能超过10位，小数点后不能超过${priceDecimalNum}位`);
                                                            }
                                                            callback();
                                                        }
                                                    }],
                                                    initialValue: this.state.dataSource[0] && this.state.dataSource[0].quotation
                                                })(
                                                    <Input onChange={(e) => {
                                                        let quotation = e.target.value;
                                                        let {dataSource} = this.state;
                                                        dataSource = dataSource.map(item => {
                                                            item.currencyAmount = removeCurrency(formatCurrency(item.amount * quotation / 100, 2, true));
                                                            return item;
                                                        });
                                                        this.setState({ dataSource });
                                                    }}/>
                                                )}
                                            </Form.Item>
                                        )
                                    }
                                </Col>
                            </>
                        )
                    }
                </Row>
            </>
        )
    };
}

const mapStateToProps = (state) => ({
    billListInfo: state.getIn(['saleIndex', 'batchSaleIncomePre'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchPreInfo: saleActions.asyncBatchIncomePre,
        asyncPostData: saleActions.asyncBatchIncome
    }, dispatch)
};


export default Form.create()(connect(mapStateToProps,
    mapDispatchToProps)(FinanceIncomeBatchEdit));
