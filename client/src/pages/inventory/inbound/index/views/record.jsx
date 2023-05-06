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
import { Resizable } from 'react-resizable';

const cx = classNames.bind(styles);
import {formatCurrency} from 'utils/format';
import {asyncFetchInboundRecord} from '../actions'
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


    onPageInputChange = (page, perPage) => {
        this.fetchData({page, perPage});
    };
    onShowSizeChange = (current, perPage) => {
        this.fetchData({perPage, page: 1});
    };

    fetchData = ({page, perPage}) => {
        this.props.asyncFetchInboundRecord({recordFor: this.props.recordFor, type: this.props.type, page, perPage});
    };

    componentDidMount() {
        const {type} = this.props;
        this.fetchData({});
        this.props.onRef && this.props.onRef(this);
        let quantityDecimalNum = getCookie("quantityDecimalNum");
        let priceDecimalNum = getCookie("priceDecimalNum");
        if (type === 'prods') {
            this.setState({columns:[{
                    title: intl.get("inbound.index.record.serial"),
                    dataIndex: 'serial',
                    width: 50,
                    className: 'ant-table-selection-column'
                }, {
                    title: intl.get("inbound.index.record.displayBillNo"),
                    dataIndex: 'displayBillNo',
                    width: 200,
                    render: (text, record) => {
                        return (
                            <span className="txt-clip" title={text}>
                            <Link to={`/inventory/inbound/show/${record.billNo}`}>{text}</Link>
                        </span>
                        )
                    }
                }, {
                    title: intl.get("inbound.index.record.warehouseName"),
                    dataIndex: 'warehouseName',
                    width: 200,
                }, {
                    title: intl.get("inbound.index.record.enterType"),
                    dataIndex: 'enterType',
                    width: 200,
                    render: (enterType) => {
                        return intl.get(enterType)
                    }
                }, {
                    title: intl.get("inbound.index.record.enterDate"),
                    dataIndex: 'enterDate',
                    width: 200,
                    render: (text) => (
                        <span className="txt-clip">
                        {text ? moment(text).format('YYYY-MM-DD') : null}
                    </span>
                    )
                }, {
                    title: intl.get("inbound.index.record.warehousingParty"),
                    dataIndex: 'supplierName',
                    width: 200,
                },{
                    title: intl.get("inbound.index.record.quantity"),
                    dataIndex: 'quantity',
                    width: 200,
                    render: (text) => {
                        return (
                            <span className="txt-clip" title={fixedDecimal(text, quantityDecimalNum)}>{fixedDecimal(text, quantityDecimalNum)}</span>
                        )
                    }
                }, {
                    title: intl.get("inbound.index.record.unitPrice"),
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
                            <AuthUnitPrice module="purchasePrice" option="show" noAuthRender={'**'}/>
                        )
                    }
                }, {
                    title: intl.get("inbound.index.record.aggregateAmount"),
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
                            <AuthAmount module="purchasePrice" option="show" noAuthRender={'**'}/>
                        )
                    }
                }, {
                    title: intl.get("inbound.index.record.remarks"),
                    dataIndex: 'remarks',
                    width: 200,
                }]})
        }
        else if (type === 'supplier') {
            this.setState({
                columns:[{
                    title: intl.get("inbound.index.record.serial"),
                    dataIndex: 'serial',
                    width: 50,
                    className: 'ant-table-selection-column'
                }, {
                    title: intl.get("inbound.index.record.displayBillNo"),
                    dataIndex: 'displayBillNo',
                    width: 200,
                    render: (text, record) => {
                        return (
                            <span className="txt-clip" title={text}>
                            <Link to={`/inventory/inbound/show/${record.billNo}`}>{text}</Link>
                        </span>
                        )
                    }
                },{
                    title: intl.get("inbound.index.record.warehouseName"),
                    dataIndex: 'wareName',
                    width: 200
                }, {
                    title: intl.get("inbound.index.record.enterDate"),
                    dataIndex: 'wareEnterDate',
                    width: 200,
                    render: (text) => (
                        <span className="txt-clip">
                        {text ? moment(text).format('YYYY-MM-DD') : null}
                    </span>
                    )
                }, {
                    title: intl.get("inbound.index.record.aggregateAmount"),
                    dataIndex: 'wareEnterAggregateAmount',
                    className: 'column-money',
                    width: 200,
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
                }]
            })
        } else {
            this.setState({
                columns:[{
                    title: intl.get("inbound.index.record.serial"),
                    dataIndex: 'serial',
                    width: 50,
                    className: 'ant-table-selection-column'
                }, {
                    title: intl.get("inbound.index.record.warehouseName") ,
                    dataIndex: 'wareName',
                    width: 200
                }, {
                    title: intl.get("inbound.index.record.displayBillNo"),
                    dataIndex: 'displayBillNo',
                    width: 200,
                    sorter: (a, b) => a.displayBillNo.localeCompare(b.displayBillNo),
                    render: (text, record) => {
                        return (
                            <span className="txt-clip" title={text}>
                            <Link to={`/inventory/inbound/show/${record.billNo}`}>{text}</Link>
                        </span>
                        )
                    }
                }, {
                    title: intl.get("inbound.index.record.enterDate"),
                    dataIndex: 'enterDate',
                    width: 200,
                    sorter: (a, b) => a.enterDate - b.enterDate,
                    render: (text) => (
                        <span className="txt-clip">
                        {text ? moment(text).format('YYYY-MM-DD') : null}
                    </span>
                    )
                },{
                    title: intl.get("inbound.index.record.supplierName"),
                    dataIndex: 'supplierName',
                    width: 200
                }, {
                    title: intl.get("inbound.index.record.aggregateAmount"),
                    dataIndex: 'aggregateAmount',
                    className: 'column-money',
                    width: 200,
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
                            <AuthAmount module="purchasePrice" option="show" noAuthRender={'**'}/>
                        )
                    }
                },{
                    title: intl.get("inbound.index.record.ourContacterName"),
                    dataIndex: 'ourContacterName',
                    width: 200
                },{
                    title: intl.get("inbound.index.record.remarks2"),
                    dataIndex: 'remarks',
                    width: 200
                }]
            })
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if(this.props.recordFor!=this.state.setId) {
            this.setState({setId: this.props.recordFor})
            this.fetchData({})
        }
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
        const {inboundRecord, type} = this.props;
        let paginationInfo = inboundRecord.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};

        //入库记录
        let recordDataSource = [];
        const inboundRecordData = inboundRecord && inboundRecord.getIn(['data', 'data']);
        if (inboundRecordData) {
            recordDataSource = inboundRecordData.map((item, index) => {
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
                    dataSource={recordDataSource}
                    components={this.components}
                    pagination={false}
                    scroll={{x: tableWidth}}
                    loading={inboundRecord.get('isFetching')}
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
    inboundRecord: state.getIn(['inboundOrderIndex', 'inboundRecord'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchInboundRecord
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(authComponent(Record))