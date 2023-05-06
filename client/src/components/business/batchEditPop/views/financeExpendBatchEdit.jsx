import React from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, DatePicker, Row, Col } from 'antd';
import {actions as orderActions} from 'pages/purchase/index';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import defaultOptions from 'utils/validateOptions';
import {numberReg} from 'utils/reg';
import intl from 'react-intl-universal';
import SelectIncomeType from "pages/auxiliary/income/views/selectIncomeType";
import {SelectEmployeeFix} from 'pages/auxiliary/employee';
import BatchBaseCompenent from "../dependencies/batchBaseComponent";

import PropTypes from 'prop-types';

class FinanceExpendBatchEdit extends BatchBaseCompenent {

    displayGaName = 'expend';

    static propTypes = {
        /** modal是否可见 */
        visible: PropTypes.bool,
        /** 对话框标题 */
        popTitle: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element
        ]),
        /** 合并表单或批量表单 */
        popType: PropTypes.oneOf(['merge', '']),
        /** 订单id列表 */
        billIds: PropTypes.arrayOf(PropTypes.string).isRequired,
        /**确定取消 callback**/
        onOk: PropTypes.func,
        onCancel: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    initTableColumnInfo = () => {
        const {form: {getFieldDecorator}} = this.props;
        this.columns = [
            this.serialColumn(intl.get("components.batchEditPop.financeExpendBatchEdit.title1")+'：'),
            {
                width: 150,
                title: intl.get("components.batchEditPop.financeExpendBatchEdit.displayBillNo"),
                key: 'displayBillNo',
                dataIndex: 'displayBillNo',
                align: 'center',
                render: this.renderContent
            },
            {
                width: 200,
                title: intl.get("components.batchEditPop.financeExpendBatchEdit.supplierName"),
                key: 'supplierName',
                dataIndex: 'supplierName',
                align: 'center',
                render: this.renderContent
            },
            {
                width: 100,
                title: intl.get("components.batchEditPop.financeExpendBatchEdit.purchaseOrderDate"),
                key: 'purchaseOrderDate',
                dataIndex: 'purchaseOrderDate',
                align: 'center',
                render: (date, record, index) => {
                    const obj = this.renderContent(date, record, index);
                    obj.children = <span>{date && moment(date).format('YYYY-MM-DD')}</span>;
                    return obj;
                }
            },
            {
                width: 100,
                title: intl.get("components.batchEditPop.financeExpendBatchEdit.discountAmount"),
                key: 'discountAmount',
                dataIndex: 'discountAmount',
                align: 'center',
                render: this.renderContent
            },
            {
                width: 100,
                title: intl.get("components.batchEditPop.financeExpendBatchEdit.aggregateAmount"),
                key: 'aggregateAmount',
                dataIndex: 'aggregateAmount',
                align: 'center',
                render: this.renderContent
            },
            {
                width: 100,
                title: intl.get("components.batchEditPop.financeExpendBatchEdit.payedAmount"),
                key: 'payedAmount',
                dataIndex: 'payedAmount',
                align: 'center',
                render: this.renderContent
            },
            {
                width: 150,
                title: intl.get("components.batchEditPop.financeExpendBatchEdit.amount"),
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
                            })(<Input style={{textAlign: 'center'}} onChange={(e) => record.amount = e.target.value}/>)}
                        </Form.Item>
                    );
                    return obj;
                }
            },
            {
                width: 150,
                title: intl.get("components.batchEditPop.financeExpendBatchEdit.outType"),
                key: 'outType',
                dataIndex: 'outType',
                editable: true,
                align: 'center',
                render: (text, record, index) => {
                    const obj = this.renderContent(text, record, index);
                    obj.children = (
                        <Form.Item style={{margin: 0}}>
                            {getFieldDecorator(`outType.${index}`, {
                                initialValue: {},
                                ...defaultOptions,
                            })(
                                <SelectIncomeType type='outType'/>
                            )}
                        </Form.Item>
                    );
                    return obj;
                }
            },
            {
                width: 150,
                title: intl.get("components.batchEditPop.financeExpendBatchEdit.accountName"),
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
            this.datePickerColumn({key: 'paymentDate', title: intl.get("components.batchEditPop.financeExpendBatchEdit.paymentDate")}),
            {
                width: 200,
                title: intl.get("components.batchEditPop.financeExpendBatchEdit.remarks"),
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
            },
        ];

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
            this.columns = this.columns.filter((value) => value.key !== 'supplierName'
                && value.key !== 'accountName'
                && value.key !== 'paymentDate'
                && value.key !== 'outType'
            );
        }
    };

    getPostData = ({merge, values}) => {
        if (merge) {
            return {
                paymentDate: moment(values.paymentDate) && moment(values.paymentDate).format("YYYY-MM-DD"),
                supplierName: this.state.dataSource[0].supplierName || '',
                typeName: values.outType.label,
                typeId: values.outType.key,
                accountId: values.accountName.key,
                accountName: values.accountName.label,
                ourContacterName: values.ourContacterName,
                bindBillType: 1,
                dataList: this.state.dataSource
                    .slice(0, -1)
                    .map((item, index) => {
                        return {
                            remarks: values.remarks[index],
                            amount: values.amount[index],
                            billNo: item.billNo
                        }
                    })
            }
        } else {
            return this.state.dataSource.map((item, index) => {
                return {
                    bindBillType: 1,
                    remarks: values.remarks[index],
                    ourContacterName: values.ourContacterName[index],
                    amount: values.amount[index],
                    accountName: values.accountName[index].label,
                    accountId: values.accountName[index].key,
                    typeName: values.outType[index].label,
                    typeId: values.outType[index].key,
                    billNo: item.billNo,
                    paymentDate: values.paymentDate[index] && moment(values.paymentDate[index]).format("YYYY-MM-DD"),
                    supplierName: item.supplierName
                }
            });
        }
    };
    buildMergeInfo = () => {
        const {form: {getFieldDecorator}} = this.props;
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
            <Row>
                <Col span={4}>
                    <Form.Item>
                        <span>{intl.get("components.batchEditPop.financeExpendBatchEdit.title2")}：{this.state.dataSource[0] && this.state.dataSource[0].supplierName}</span></Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item
                        label={intl.get("components.batchEditPop.financeExpendBatchEdit.outType")}
                        {...formItemLayout}
                    >
                        {getFieldDecorator(`outType`, {
                            initialValue: {},
                            ...defaultOptions,
                        })(
                            <SelectIncomeType type='outType'/>
                        )}
                    </Form.Item>
                </Col>
                <Col span={4}>
                    <Form.Item label={intl.get("components.batchEditPop.financeExpendBatchEdit.accountName")} {...formItemLayout}>
                        {getFieldDecorator(`accountName`, {
                            initialValue: {},
                            ...defaultOptions,
                        })(
                            <SelectIncomeType type='account'/>
                        )}
                    </Form.Item>
                </Col>
                <Col span={4}>
                    <Form.Item label={intl.get("components.batchEditPop.financeExpendBatchEdit.paymentDate")} {...formItemLayout}>
                        {getFieldDecorator(`paymentDate`, {
                            initialValue: moment(new Date()),
                            rules: [
                                {
                                    type: 'object',
                                    required: true,
                                    message: intl.get("components.batchEditPop.financeExpendBatchEdit.rule1")
                                }
                            ]
                        })(
                            <DatePicker/>
                        )}
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label={"经办人"} {...formItemLayout}>
                        {
                            getFieldDecorator(`ourContacterName`)(
                                <SelectEmployeeFix width={180}/>
                            )
                        }
                    </Form.Item>
                </Col>
            </Row>
        )
    }
}

const mapStateToProps = (state) => ({
    billListInfo: state.getIn(['purchaseIndex', 'batchExpandPre'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchPreInfo: orderActions.asyncBatchExpendPreInfo,
        asyncPostData: orderActions.asyncBatchExpend
    }, dispatch)
};


export default Form.create()(
    connect(mapStateToProps, mapDispatchToProps)(FinanceExpendBatchEdit)
);