import React from "react";
import intl from 'react-intl-universal';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Table, DatePicker, Modal, message, Spin } from 'antd';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import {formatCurrency} from 'utils/format';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);
const Decimal = require('decimal.js');

export default class BatchBaseComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dataSource: [],
            isLoading: true
        };
    }

    componentDidMount() {
        this.initTableColumnInfo();
        this.props.asyncFetchPreInfo(this.props.billIds, this.onPreCreateResponse);
    }

    initTableColumnInfo = () => {
    };

    // 合计金额
    aggregateAmount = () => {
        return this.state.dataSource.reduce((aggregate, item) => {
            let itemAmout;
            try {
                itemAmout = new Decimal(item.amount || '0');
            } catch (e) {
                itemAmout = 0;
            }

            return new Decimal(aggregate).add(itemAmout).toString();
        }, 0);
    };

    // 合计本币总金额
    totalCurrentAmount = () => {
        return this.state.dataSource.reduce((currencyAmount, item) => {
            let itemAmout;
            try {
                itemAmout = new Decimal(item.currencyAmount || '0');
            } catch (e) {
                itemAmout = 0;
            }

            return new Decimal(currencyAmount).add(itemAmout).toString();
        }, 0);
    };

    // 是否是合计行
    isAggregateRow = (index) => {
        return this.props.popType === 'merge' && index === this.state.dataSource.length - 1;
    };

    renderContent = (text, row, index) => {
        const obj = {
            props: {colSpan: 1},
        };
        if (this.isAggregateRow(index)) {
            obj.props.colSpan = 0;
        } else {
            obj.children = <span className="txt-clip" title={text}>{text}</span>;
        }

        return obj;
    };

    serialColumn = (amountTitle) => {
        let { currencyVipFlag } = this.props;
        return {
            width: 50,
            title: intl.get("components.batchEditPop.batchBaseComponent.serial"),
            key: 'serial',
            dataIndex: 'serial',
            align: 'center',
            render: (text, _, index) => {
                const obj = {
                    children: text,
                    props: {},
                };
                if (this.isAggregateRow(index)) {
                    const aggregateAmount = this.aggregateAmount();
                    const totalCurrentAmount = this.totalCurrentAmount();
                    obj.props.colSpan = 7;
                    if(currencyVipFlag){
                        obj.props.colSpan = 8;
                    }
                    obj.children = (
                        <div style={{float: 'right'}}>
                            <span>{amountTitle}</span>
                            <span className={cx('red')}>{aggregateAmount && formatCurrency(aggregateAmount)}</span>{intl.get("components.batchEditPop.batchBaseComponent.yuan")}
                            {
                                currencyVipFlag === 'true' && (
                                    <>
                                        <span className={cx('ml20')}>本币合并收款总金额</span>
                                        <span className={cx('red')}>{totalCurrentAmount && formatCurrency(totalCurrentAmount)}</span>元
                                    </>
                                )
                            }
                        </div>
                    )
                }
                return obj;
            }
        };
    };

    datePickerColumn = ({key, title}) => {
        const {form: {getFieldDecorator}} = this.props;
        return {
            width: 150,
            title: title,
            key: key,
            dataIndex: key,
            editable: true,
            align: 'center',
            render: (text, record, index) => {
                const obj = this.renderContent(text, record, index);
                obj.children = (
                    <Form.Item style={{margin: 0}}>
                        {getFieldDecorator(`${key}.${index}`, {
                            initialValue: moment(new Date()),
                            rules: [
                                {
                                    type: 'object',
                                },
                                {
                                    validator: (rules, value, callback) => {
                                        let amount = record.amount ? record.amount.toString() : '';
                                        if (!value && amount.length > 0 && amount !== '0') {
                                            callback(`${title} ${intl.get("components.batchEditPop.batchBaseComponent.message1")}`)
                                        } else {
                                            callback();
                                        }
                                    }
                                }
                            ]
                        })(
                            <DatePicker onChange={(date, dateString) => {
                                record[key] = dateString
                            }}/>
                        )}
                    </Form.Item>
                );

                return obj;
            }
        };
    };

    onSubmitResult = (data) => {
        this.setState({
            isLoading: false
        });
        if (data.retCode == 0) {
            message.info(intl.get("components.batchEditPop.batchBaseComponent.operateMessageSuccess"));
            this.props.onOk();
        } else {
            message.error(data.retMsg || intl.get("components.batchEditPop.batchBaseComponent.operateMessageFailure"));
        }
    };

    onPreCreateResponse = (resData) => {
        if (resData.retCode == 0) {
            let dataSet = resData.data;
            if (this.props.popType === 'merge') {
                dataSet.push({
                    key: dataSet.length
                });
            }
            this.setState({
                dataSource: dataSet,
                isLoading: false
            })
        } else {
            this.props.onCancel();
            message.info(resData.retMsg || intl.get("components.batchEditPop.batchBaseComponent.requestMessageFailure"));
        }
    };

    onOk = () => {
        this.props.form.validateFields({force: true}, (err, values) => {
            if (!err) {
                if (this.state.isLoading) {
                    return;
                }
                console.log(values);
                this.setState({
                    isLoading: true
                });
                this.onSubmitData(values);

            }
        });
    };

    getPostData = ({merge, values}) => {
        return {};
    };

    onSubmitData = (values) => {
        this.props.asyncPostData(this.getPostData({
            merge: this.props.popType === 'merge',
            values
        }), this.onSubmitResult);
    };

    buildMergeInfo = () => {

    };

    render() {
        const {popType, popTitle} = this.props;
        const {dataSource} = this.state;
        const tableWidth = this.columns && this.columns.reduce((width, item) => {
            return width + (item.width ? item.width : 150);
        }, 0);

        return (
            <Modal
                {...this.props}
                title={popTitle}
                width={''}
                destroyOnClose={true}
                maskClosable={false}
                onOk={this.onOk}
                className={cx("batch-edit-pop") + " list-pop"}
                okButtonProps={{
                    'ga-data':'batch-' + this.displayGaName + '-ok'
                }}
                cancelButtonProps={{
                    'ga-data':'batch-' + this.displayGaName + '-cancel'
                }}
            >
                <div className={cx('content-height')}>
                    <Spin
                        spinning={this.state.isLoading}
                    >
                        {popType === 'merge' && this.buildMergeInfo()}
                        {/*<EditableContext.Provider value={this.props.form}>*/}
                        <Table
                            bordered
                            scroll={{x: tableWidth}}
                            dataSource={dataSource}
                            pagination={false}
                            columns={this.columns}
                        />

                        {/*</EditableContext.Provider>*/}
                    </Spin>
                </div>
            </Modal>
        );
    }
}
