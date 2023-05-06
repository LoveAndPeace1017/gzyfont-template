import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {Link} from 'react-router-dom';
import { Resizable } from 'react-resizable';
import moment from 'moment-timezone';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {
    Table
} from 'antd';

import {asyncFetchPurchaseRecord} from '../actions'
import Pagination from 'components/widgets/pagination';
import authComponent from "utils/authComponent";
import {auth} from 'utils/authComponent';
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';

moment.tz.setDefault("Asia/Shanghai");

import styles from '../styles/index.scss';
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const ResizeableTitle = props => {
    const { onResize, width, ...restProps } = props;

    if (!width) {
        return <th {...restProps} />;
    }

    return (
        <Resizable
            width={width}
            height={0}
            handle={
                <span
                    className="react-resizable-handle"
                    onClick={e => {
                        e.stopPropagation();
                    }}
                />
            }
            onResize={onResize}
            draggableOpts={{ enableUserSelectHack: false }}
        >
            <th {...restProps} />
        </Resizable>
    );
};

export class Record extends Component {

    constructor(props) {
        super(props);
        this.state = {
            columns:[],
        }
    }

    onPageInputChange = (page, perPage) => {
        this.fetchData({page, perPage});
    };
    onShowSizeChange = (current, perPage) => {
        this.fetchData({perPage, page: 1});
    };

    fetchData = ({page, perPage}) => {
        this.props.asyncFetchPurchaseRecord({recordFor: this.props.recordFor, type: this.props.type, page, perPage});
    };

    componentDidMount() {
        this.fetchData({});
        let quantityDecimalNum = getCookie("quantityDecimalNum");
        let priceDecimalNum = getCookie("priceDecimalNum");
        const {type} = this.props;
        //采购记录
        let recordColumns = [];
        if (type === 'prods') {
            recordColumns = [{
                title: intl.get("purchase.index.record.serial"),
                dataIndex: 'serial',
                align: 'center',
                width: 60,
                className: 'ant-table-selection-column'
            }, {
                title: intl.get("purchase.index.record.displayBillNo"),
                dataIndex: 'displayBillNo',
                width: 200,
                render: (text, record) => {
                    return (
                        <span className="txt-clip" title={text}>
                            <Link to={`/purchase/show/${record.billNo}`}>{text}</Link>
                        </span>
                    )
                }
            }, {
                title: intl.get("purchase.index.record.purchaseOrderDate"),
                dataIndex: 'purchaseOrderDate',
                width: 200,
                render: (text) => (
                    <span className="txt-clip">
                        {text ? moment(text).format('YYYY-MM-DD') : null}
                    </span>
                )
            }, {
                title: intl.get("purchase.index.record.supplierName"),
                dataIndex: 'supplierName',
                width: 200
            },
                {
                    title: intl.get("purchase.index.record.quantity"),
                    dataIndex: 'quantity',
                    width: 150,
                    render: (text) => {
                        return (
                            <span className="txt-clip" title={fixedDecimal(text, quantityDecimalNum)}>{fixedDecimal(text, quantityDecimalNum)}</span>
                        )
                    }
                }, {
                    title: intl.get("purchase.index.record.unitPrice"),
                    dataIndex: 'unitPrice',
                    width: 150,
                    className: 'column-money',
                    render: (text) => {

                        const AuthUnitPrice = authComponent(class extends React.Component {
                            render(){
                                return (
                                    <span>{fixedDecimal(text, priceDecimalNum)}</span>
                                )
                            }
                        });
                        return (
                            <AuthUnitPrice module="purchasePrice" option="show" noAuthRender={'**'}/>
                        )
                    }
                }, {
                    title: intl.get("purchase.index.record.aggregateAmount"),
                    dataIndex: 'aggregateAmount',
                    width: 150,
                    className: 'column-money',
                    render: (text) => {
                        const AuthAmount = authComponent(class extends React.Component {
                            render(){
                                return (
                                    <span>
                                    {text}
                                </span>
                                )
                            }
                        });
                        return (
                            <AuthAmount module="purchasePrice" option="show" noAuthRender={'**'}/>
                        )
                    }
                }, {
                    title: intl.get("purchase.index.record.remarks"),
                    dataIndex: 'remarks',
                    width: 200
                }]
        }
        else if (type === 'supplier') {
            recordColumns = [{
                title: intl.get("purchase.index.record.serial"),
                dataIndex: 'serial',
                width: 60,
                className: 'ant-table-selection-column'
            }, {
                title: intl.get("purchase.index.record.displayBillNo"),
                dataIndex: 'displayBillNo',
                width: 200,
                render: (text, record) => {
                    return (
                        <span className="txt-clip" title={text}>
                            <Link to={`/purchase/show/${record.billNo}`}>{text}</Link>
                        </span>
                    )
                }
            }, {
                title: intl.get("purchase.index.record.purchaseOrderDate"),
                dataIndex: 'purchaseOrderDate',
                width: 200,
                render: (text) => (
                    <span className="txt-clip">
                        {text ? moment(text).format('YYYY-MM-DD') : null}
                    </span>
                )
            },
                //     {
                //     title: '交付日期',
                //     dataIndex: 'deliveryDeadlineDate',
                //     width: 200,
                //     render: (text) => (
                //         <span className="txt-clip">
                //             {text ? moment(text).format('YYYY-MM-DD') : null}
                //         </span>
                //     )
                // },
                {
                    title: intl.get("purchase.index.record.aggregateAmount"),
                    dataIndex: 'aggregateAmount',
                    width: 150,
                    className: 'column-money',
                    render: (text) => {
                        const AuthAmount = authComponent(class extends React.Component {
                            render(){
                                return (
                                    <span>
                                    {text}
                                </span>
                                )
                            }
                        });
                        return (
                            <AuthAmount module="purchasePrice" option="show" noAuthRender={'**'}/>
                        )
                    }
                }, {
                    title: intl.get("purchase.index.record.ourName"),
                    dataIndex: 'ourName'
                }]
        }
        this.setState({
            columns: recordColumns
        })
    }

    components = {
        header: {
            cell: ResizeableTitle,
        },
    };

    handleResize = index => (e, { size }) => {
        this.setState(({ columns }) => {
            const nextColumns = [...columns];
            nextColumns[index] = {
                ...nextColumns[index],
                width: size.width,
            };
            return { columns: nextColumns };
        });
    };

    render() {
        const {purchaseRecord} = this.props;

        let paginationInfo = purchaseRecord.getIn(['data', 'pagination']) || {};

        let recordDataSource = purchaseRecord && purchaseRecord.getIn(['data', 'data']);
        // if (purchaseRecordData) {
        //     recordDataSource = purchaseRecordData.map((item, index) => {
        //         return item.set('key', item.get('recId') || index)
        //             .set('serial', index + 1)
        //     }).toJS();
        // }

        let tableWidth = this.state.columns && this.state.columns.reduce(function(width, item) {
            return width + item.width;
        }, 0);

        const columns = this.state.columns.map((col, index) => ({
            ...col,
            onHeaderCell: column => ({
                width: column.width,
                onResize: this.handleResize(index),
            }),
        }));

        return (
            <React.Fragment>
                <Table
                    bordered
                    columns={columns}
                    dataSource={recordDataSource}
                    components={this.components}
                    pagination={false}
                    scroll={{x: tableWidth}}
                    loading={purchaseRecord.get('isFetching')}
                />
                <Pagination {...paginationInfo}
                            onChange={this.onPageInputChange}
                            onShowSizeChange={this.onShowSizeChange}
                />
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    purchaseRecord: state.getIn(['purchaseIndex', 'purchaseRecord'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchPurchaseRecord
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(authComponent(Record))