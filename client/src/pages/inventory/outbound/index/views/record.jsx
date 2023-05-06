import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {
    Table
} from 'antd';
import {Link} from 'react-router-dom';
import authComponent from "utils/authComponent";
import {formatCurrency} from 'utils/format';
import { Resizable } from 'react-resizable';
import styles from '../styles/index.scss';
import classNames from "classnames/bind";


const cx = classNames.bind(styles);

import {asyncFetchOutboundRecord} from '../actions'
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import {auth} from 'utils/authComponent';
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
            setId: ''
        }
    }
    componentDidMount() {
        this.fetchData({});
        let quantityDecimalNum = getCookie("quantityDecimalNum");
        let priceDecimalNum = getCookie("priceDecimalNum");
        this.props.onRef && this.props.onRef(this);
        const {type} = this.props;
        let recordColumns;
        if (type === 'prods') {
            recordColumns = [{
                title: intl.get("outbound.index.record.serial"),
                dataIndex: 'serial',
                width: 50,
                className: 'ant-table-selection-column'
            }, {
                title: intl.get("outbound.index.record.displayBillNo"),
                width: 200,
                dataIndex: 'displayBillNo',
                render: (text, record) => {
                    return (
                        <span className="txt-clip" title={text}>
                            <Link to={`/inventory/outbound/show/${record.billNo}`}>{text}</Link>
                        </span>
                    )
                }
            }, {
                title: intl.get("outbound.index.record.warehouseName"),
                dataIndex: 'warehouseName',
                width: 200,
            }, {
                title: intl.get("outbound.index.record.outType"),
                dataIndex: 'outType',
                width: 200,
                render: (outType) => {
                    return intl.get(outType)
                }
            }, {
                title: intl.get("outbound.index.record.outDate"),
                dataIndex: 'outDate',
                width: 200,
                render: (text) => (
                    <span className="txt-clip">
                        {text ? moment(text).format('YYYY-MM-DD') : null}
                    </span>
                )
            }, {
                title: intl.get("outbound.index.record.outParty"),
                dataIndex: 'customerName',
                width: 200,
            },{
                title: intl.get("outbound.index.record.quantity"),
                dataIndex: 'quantity',
                width: 200,
                render: (text) => {
                    return (
                        <span className="txt-clip" title={fixedDecimal(text, quantityDecimalNum)}>{fixedDecimal(text, quantityDecimalNum)}</span>
                    )
                }
            }, {
                title: intl.get("outbound.index.record.unitPrice"),
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
                title: intl.get("outbound.index.record.aggregateAmount"),
                dataIndex: 'aggregateAmount',
                width: 200,
                className:'column-money',
                render: (text) => {
                    const AuthAmount = authComponent(class extends React.Component {
                        render(){
                            return (
                                <span>
                                    {formatCurrency(text)}
                                </span>
                            )
                        }
                    });
                    return (
                        <AuthAmount module="salePrice" option="show" noAuthRender={'**'}/>
                    )
                }
            }, {
                title: intl.get("outbound.index.record.remarks"),
                dataIndex: 'remarks',
                width: 200,
            }];
        }
        else if (type === 'customer') {
            recordColumns = [{
                title: intl.get("outbound.index.record.serial"),
                dataIndex: 'serial',
                width: 50,
                className: 'ant-table-selection-column'
            }, {
                title: intl.get("outbound.index.record.displayBillNo"),
                dataIndex: 'displayBillNo',
                width: 200,
                render: (text, record) => {
                    return (
                        <span className="txt-clip" title={text}>
                            <Link to={`/inventory/outbound/show/${record.billNo}`}>{text}</Link>
                        </span>
                    )
                }
            }, {
                title: intl.get("outbound.index.record.warehouseName"),
                dataIndex: 'wareName',
                width: 200,
            }, {
                title: intl.get("outbound.index.record.outDate"),
                dataIndex: 'wareOutDate',
                width: 200,
                render: (text) => (
                    <span className="txt-clip">
                        {text ? moment(text).format('YYYY-MM-DD') : null}
                    </span>
                )
            }, {
                title: intl.get("outbound.index.record.aggregateAmount"),
                dataIndex: 'wareOutAggregateAmount',
                width: 200,
                className:'column-money',
                render: (text) => {
                    const AuthAmount = authComponent(class extends React.Component {
                        render(){
                            return (
                                <span>
                                    {formatCurrency(text)}
                                </span>
                            )
                        }
                    });
                    return (
                        <AuthAmount module="salePrice" option="show" noAuthRender={'**'}/>
                    )
                }
            }, {
                title: intl.get("outbound.index.record.ourName"),
                dataIndex: 'ourName',
                width: 200,
            }];
        } else {
            recordColumns = [{
                title: intl.get("outbound.index.record.serial"),
                dataIndex: 'serial',
                width: 50,
                className: 'ant-table-selection-column'
            }, {
                title: intl.get("outbound.index.record.warehouseName"),
                dataIndex: 'wareName',
                width: 200,
            }, {
                title: intl.get("outbound.index.record.displayBillNo"),
                dataIndex: 'displayBillNo',
                width: 200,
                sorter: (a, b) => a.displayBillNo.localeCompare(b.displayBillNo),
                render: (text, record) => {
                    return (
                        <span className="txt-clip" title={text}>
                            <Link to={`/inventory/outbound/show/${record.billNo}`}>{text}</Link>
                        </span>
                    )
                }
            }, {
                title: intl.get("outbound.index.record.outDate"),
                dataIndex: 'outDate',
                width: 200,
                sorter: (a, b) => a.outDate - b.outDate,
                render: (text) => (
                    <span className="txt-clip">
                        {text ? moment(text).format('YYYY-MM-DD') : null}
                    </span>
                )
            }, {
                title: intl.get("outbound.index.record.customerName"),
                dataIndex: 'customerName',
                width: 200,
            }, {
                title: intl.get("outbound.index.record.aggregateAmount"),
                dataIndex: 'aggregateAmount',
                width: 200,
                className:'column-money',
                sorter: (a, b) => a.aggregateAmount - b.aggregateAmount,
                render: (text) => {
                    const AuthAmount = authComponent(class extends React.Component {
                        render(){
                            return (
                                <span>
                                    {formatCurrency(text)}
                                </span>
                            )
                        }
                    });
                    return (
                        <AuthAmount module="salePrice" option="show" noAuthRender={'**'}/>
                    )
                }
            }, {
                title: intl.get("outbound.index.record.ourName"),
                dataIndex: 'ourContacterName',
                width: 200,
            }, {
                title: "物流公司",
                dataIndex: 'logistics',
                width: 200,
            }, {
                title: "物流单号",
                dataIndex: 'waybillNo',
                width: 200,
            }, {
                title: intl.get("outbound.index.record.remarks_1"),
                dataIndex: 'remarks',
                width: 200,
            }];
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

    onPageInputChange = (page, perPage) => {
        this.fetchData({perPage, page});
    };
    onShowSizeChange = (current, perPage) => {
        console.log(current, perPage, 'current, perPage');
        this.fetchData({perPage, page: 1});
    };

    fetchData = ({page, perPage}) => {
        this.props.asyncFetchOutboundRecord({recordFor: this.props.recordFor, type: this.props.type, page, perPage});
    };

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if(this.props.recordFor!=this.state.setId) {
            this.setState({setId: this.props.recordFor})
            this.fetchData({})
        }
    }


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
        const {outboundRecord} = this.props;

        let paginationInfo = outboundRecord.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};

        let recordDataSource = [];
        const outboundRecordData = outboundRecord && outboundRecord.getIn(['data', 'data']);
        if (outboundRecordData) {
            recordDataSource = outboundRecordData.map((item, index) => {
                return item.set('key', item.get('recId') || index)
                    .set('serial', index + 1)
            }).toJS();
        }

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
                    components={this.components}
                    dataSource={recordDataSource}
                    pagination={false}
                    loading={outboundRecord.get('isFetching')}
                    scroll={{x: tableWidth}}
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
    outboundRecord: state.getIn(['outboundOrderIndex', 'outboundRecord'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchOutboundRecord
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(authComponent(Record))