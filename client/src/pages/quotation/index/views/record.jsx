import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {
    Table
} from 'antd';

import {Link} from 'react-router-dom';
import authComponent from "utils/authComponent";
import styles from '../styles/index.scss';
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

import {asyncFetchSaleRecord} from '../actions'
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import {auth} from 'utils/authComponent';
import { Resizable } from 'react-resizable';
import Pagination from 'components/widgets/pagination';
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';

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
        this.props.asyncFetchSaleRecord({recordFor: this.props.recordFor, type: this.props.type, page, perPage});
    };

    componentDidMount() {
        this.fetchData({});
        const {type} = this.props;
        let quantityDecimalNum = getCookie("quantityDecimalNum");
        let priceDecimalNum = getCookie("priceDecimalNum");
        //销售记录
        let recordColumns = [];
        if (type === 'prods') {
            recordColumns = [{
                title: intl.get("sale.index.record.serial"),
                dataIndex: 'serial',
                width: 50,
                className: 'ant-table-selection-column'
            }, {
                title: intl.get("sale.index.record.displayBillNo"),
                dataIndex: 'displayBillNo',
                width: 200,
                render: (text, record) => {
                    return (
                        <span className="txt-clip" title={text}>
                            <Link to={`/sale/show/${record.billNo}`}>{text}</Link>
                        </span>
                    )
                }
            }, {
                title: intl.get("sale.index.record.saleOrderDate"),
                dataIndex: 'saleOrderDate',
                width: 200,
                render: (text) => (
                    <span className="txt-clip">
                        {text ? moment(text).format('YYYY-MM-DD') : null}
                    </span>
                )
            }, {
                title: intl.get("sale.index.record.customerName"),
                dataIndex: 'customerName',
                width: 200,
            }, {
                title: intl.get("sale.index.record.quantity"),
                dataIndex: 'quantity',
                width: 200,
                render: (text) => {
                    return (
                        <span className="txt-clip" title={fixedDecimal(text, quantityDecimalNum)}>{fixedDecimal(text, quantityDecimalNum)}</span>
                    )
                }
            }, {
                title: "币种",
                dataIndex: 'currencyName',
                width: 200,
                render: (text) => {
                    return (
                        <span className="txt-clip" title={text}>{text || 'CNY'}</span>
                    )
                }
            }, {
                title: intl.get("sale.index.record.unitPrice"),
                dataIndex: 'unitPrice',
                width: 200,
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
                        <AuthUnitPrice module="salePrice" option="show" noAuthRender={'**'}/>
                    )
                }
            }, {
                title: intl.get("sale.index.record.aggregateAmount"),
                dataIndex: 'aggregateAmount',
                width: 200,
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
                        <AuthAmount module="salePrice" option="show" noAuthRender={'**'}/>
                    )
                }
            }, {
                title: intl.get("sale.index.record.remarks"),
                dataIndex: 'remarks',
                width: 200,
            }]
    }
    else if (type === 'customer') {
        recordColumns = [{
            title: intl.get("sale.index.record.serial"),
            dataIndex: 'serial',
            width: 200,
            className: 'ant-table-selection-column'
        }, {
            title: intl.get("sale.index.record.displayBillNo"),
            dataIndex: 'displayBillNo',
            width: 200,
            render: (text, record) => {
                return (
                    <span className="txt-clip" title={text}>
                        <Link to={`/sale/show/${record.billNo}`}>{text}</Link>
                    </span>
                )
            }
        }, {
            title: intl.get("sale.index.record.saleOrderDate"),
            dataIndex: 'saleOrderDate',
            width: 200,
            render: (text) => (
                <span className="txt-clip">
                    {text ? moment(text).format('YYYY-MM-DD') : null}
                </span>
            )
        },
            {
                title: intl.get("sale.index.record.aggregateAmount"),
                dataIndex: 'aggregateAmount',
                width: 200,
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
                        <AuthAmount module="salePrice" option="show" noAuthRender={'**'}/>
                    )
                }
            }, {
                title: intl.get("sale.index.record.ourName"),
                dataIndex: 'ourName',
                width: 200,
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
        const {saleRecord} = this.props;

        let paginationInfo = saleRecord.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};



        let recordDataSource = [];
        const saleRecordData = saleRecord && saleRecord.getIn(['data', 'data']);
        if (saleRecordData) {
            recordDataSource = saleRecordData.map((item, index) => {
                return item.set('key', item.get('recId') || index)
                    .set('serial', index + 1)
            }).toJS();
        }

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
                    loading={saleRecord.get('isFetching')}
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
    saleRecord: state.getIn(['saleIndex', 'saleRecord'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchSaleRecord
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(authComponent(Record))