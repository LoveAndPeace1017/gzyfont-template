import React from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, DatePicker, Row, Col } from 'antd';
import {actions as saleActions} from 'pages/sale/index';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import {numberReg} from 'utils/reg';
import BatchBaseCompenent from "../dependencies/batchBaseComponent";
import {SelectInvoiceType} from "pages/auxiliary/bill";
import {SelectEmployeeFix} from 'pages/auxiliary/employee';
import PropTypes from "prop-types";
import intl from 'react-intl-universal';

class FinanceSaleInvoiceBatchEdit extends BatchBaseCompenent {
    displayGaName = 'saleInvoice';
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
            this.serialColumn(intl.get("components.batchEditPop.financeSaleInvoiceBatchEdit.title1")+'：'),
            {
                width: 150,
                title: intl.get("components.batchEditPop.financeSaleInvoiceBatchEdit.displayBillNo"),
                key: 'displayBillNo',
                dataIndex: 'displayBillNo',
                align: 'center',
                render: this.renderContent
            },
            {
                width: 200,
                title: intl.get("components.batchEditPop.financeSaleInvoiceBatchEdit.customerName"),
                key: 'customerName',
                dataIndex: 'customerName',
                align: 'center',
                render: this.renderContent
            },
            {
                width: 100,
                title: intl.get("components.batchEditPop.financeSaleInvoiceBatchEdit.saleOrderDate"),
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
                title: intl.get("components.batchEditPop.financeSaleInvoiceBatchEdit.discountAmount"),
                key: 'discountAmount',
                dataIndex: 'discountAmount',
                align: 'center',
                render: this.renderContent
            },
            {
                width: 100,
                title: intl.get("components.batchEditPop.financeSaleInvoiceBatchEdit.aggregateAmount"),
                key: 'aggregateAmount',
                dataIndex: 'aggregateAmount',
                align: 'center',
                render: this.renderContent
            },
            {
                width: 100,
                title: intl.get("components.batchEditPop.financeSaleInvoiceBatchEdit.invoicedAmount"),
                key: 'invoicedAmount',
                dataIndex: 'invoicedAmount',
                align: 'center',
                render: this.renderContent
            },
            {
                width: 150,
                title: intl.get("components.batchEditPop.financeSaleInvoiceBatchEdit.amount"),
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
                title: intl.get("components.batchEditPop.financeSaleInvoiceBatchEdit.invoiceCustomNo"),
                key: 'invoiceCustomNo',
                dataIndex: 'invoiceCustomNo',
                align: 'center',
                render: (text, record, index) => {
                    const obj = this.renderContent(text, record, index);
                    obj.children = (
                        <Form.Item style={{margin: 0}}>
                            {getFieldDecorator(`invoiceCustomNo.${index}`, {
                                initialValue: record.invoiceCustomNo,
                            })(<Input maxLength={50}/>)}
                        </Form.Item>
                    );

                    return obj;
                }

            },
            {
                width: 150,
                title: intl.get("components.batchEditPop.financeSaleInvoiceBatchEdit.invoiceType"),
                key: 'invoiceType',
                dataIndex: 'invoiceType',
                editable: true,
                align: 'center',
                render: (text, record, index) => {
                    const obj = this.renderContent(text, record, index);
                    obj.children = (
                        <Form.Item style={{margin: 0}}>
                            {
                                getFieldDecorator(`invoiceType.${index}`)(
                                    <SelectInvoiceType placeholder={' '}/>
                                )
                            }
                        </Form.Item>
                    );
                    return obj;
                }
            },
            this.datePickerColumn({key: 'invoiceDate', title: intl.get("components.batchEditPop.financeSaleInvoiceBatchEdit.invoiceDate")}),
            {
                width: 200,
                title: intl.get("components.batchEditPop.financeSaleInvoiceBatchEdit.remarks"),
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
            this.columns = this.columns.filter((value) => value.key !== 'customerName'
                && value.key !== 'invoiceCustomNo'
                && value.key !== 'invoiceDate'
                && value.key !== 'invoiceType'
            );
        }
    };

    getPostData = ({merge, values}) => {
        if (merge) {
            return {
                invoiceDate: values.invoiceDate && moment(values.invoiceDate).format("YYYY-MM-DD"),
                customerName: this.state.dataSource[0].customerName || '',
                invoiceCustomNo: values.invoiceCustomNo,
                invoiceType: values.invoiceType,
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
                    remarks: values.remarks[index],
                    ourContacterName: values.ourContacterName[index],
                    amount: values.amount[index],
                    bindBillType: 1,
                    billNo: item.billNo,
                    invoiceDate: values.invoiceDate[index] && moment(values.invoiceDate[index]).format("YYYY-MM-DD"),
                    invoiceCustomNo: values.invoiceCustomNo[index],
                    invoiceType: values.invoiceType[index],
                    customerName: item.customerName
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
                        <span>{intl.get("components.batchEditPop.financeSaleInvoiceBatchEdit.title2")}：{this.state.dataSource[0] && this.state.dataSource[0].customerName}</span>
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item
                        label={intl.get("components.batchEditPop.financeSaleInvoiceBatchEdit.invoiceCustomNo")}
                        {...formItemLayout}
                    >
                        {getFieldDecorator(`invoiceCustomNo`)(<Input maxLength={50}/>)}

                    </Form.Item>
                </Col>
                <Col span={4}>
                    <Form.Item
                        label={intl.get("components.batchEditPop.financeSaleInvoiceBatchEdit.invoiceType")}
                        {...formItemLayout}
                    >
                        {
                            getFieldDecorator("invoiceType")(
                                <SelectInvoiceType placeholder={' '}/>
                            )
                        }
                    </Form.Item>
                </Col>
                <Col span={4}>
                    <Form.Item label={intl.get("components.batchEditPop.financeSaleInvoiceBatchEdit.invoiceDate")} {...formItemLayout}>
                        {getFieldDecorator(`invoiceDate`, {
                            initialValue: moment(new Date()),
                            rules: [
                                {
                                    type: 'object',
                                    required: true,
                                    message: intl.get("components.batchEditPop.financeSaleInvoiceBatchEdit.rule1")
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
        );
    }
}

const mapStateToProps = (state) => ({
    billListInfo: state.getIn(['saleIndex', 'batchSaleInvoicePre'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchPreInfo: saleActions.asyncBatchSaleInvoicePre,
        asyncPostData: saleActions.asyncBatchSaleInvoice
    }, dispatch)
};


export default Form.create()(connect(mapStateToProps,
    mapDispatchToProps)(FinanceSaleInvoiceBatchEdit)
);
