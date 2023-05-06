import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Table} from 'antd';

import {Link} from 'react-router-dom';
import authComponent from "utils/authComponent";
import {asyncFetchInvoiceRecord} from '../actions'
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import Pagination from 'components/widgets/pagination';
import { Resizable } from 'react-resizable';

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
        this.props.onRef && this.props.onRef(this);
        const {type} = this.props;
        let recordColumns = [];
        if (type === 'supplier') {
            recordColumns = [
                {
                    title: intl.get("invoice.index.record.serial"),
                    width: 60,
                    dataIndex: 'serial',
                    className: 'ant-table-selection-column'
                },
                /*{
                    title: '采购单号',
                    width: 200,
                    dataIndex: 'purchaseDisplayBillNo',
                    render: (text, record) => {
                        return (
                            <Link to={`/purchase/show/${record.purchaseBillNo}`}>{text}</Link>
                        )
                    }
                },
                {
                    title: '采购日期',
                    width: 200,
                    dataIndex: 'purchaseDate',
                    render: (text) => (
                        <span className="txt-clip">
                        {text ? moment(text).format('YYYY-MM-DD') : null}
                    </span>
                    )
                },*/
                {
                    title: intl.get("invoice.index.record.billNo"),
                    width: 200,
                    dataIndex: 'billNo',
                    render: (text, record) => {
                        return (
                            <Link to={`/finance/invoice/show/${record.id}`}>{text}</Link>
                        )
                    }
                },
                {
                    title: intl.get("invoice.index.record.invoiceNo"),
                    width: 200,
                    dataIndex: 'invoiceNo',
                },
                {
                    title: intl.get("invoice.index.record.invoiceDate"),
                    width: 200,
                    dataIndex: 'invoiceDate',
                    render: (text) => (
                        <span className="txt-clip">
                        {text ? moment(text).format('YYYY-MM-DD') : null}
                    </span>
                    )
                },
                {
                    title: intl.get("invoice.index.record.amount"),
                    width: 150,
                    dataIndex: 'amount',
                    className:  'column-money',
                    render: (text) => {
                        const AuthAmount = authComponent(class extends React.Component {
                            render() {
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
                },
                {
                    title: intl.get("invoice.index.record.remarks"),
                    width: 200,
                    dataIndex: 'remarks'
                }
            ];
        } else if (type === 'purchase') {
            recordColumns = [
                {
                    title: intl.get("invoice.index.record.serial"),
                    width: 50,
                    dataIndex: 'serial',
                    className: 'ant-table-selection-column'
                },
                {
                    title: intl.get("invoice.index.record.billNo"),
                    width: 200,
                    dataIndex: 'billNo',
                    sorter: (a, b) => a.addedTime - b.addedTime,
                    render: (text, record) => {
                        return (
                            <Link to={`/finance/invoice/show/${record.id}`}>{text}</Link>
                        )
                    }
                },
                {
                    title: intl.get("invoice.index.record.invoiceDate"),
                    width: 200,
                    dataIndex: 'invoiceDate',
                    sorter: (a, b) => a.invoiceDate - b.invoiceDate,
                    render: (text) => (
                        <span className="txt-clip">
                        {text ? moment(text).format('YYYY-MM-DD') : null}
                    </span>
                    )
                },
                {
                    title: intl.get("invoice.index.record.supplierName"),
                    width: 200,
                    dataIndex: 'supplierName',
                },
                {
                    title: intl.get("invoice.index.record.amount"),
                    width: 150,
                    dataIndex: 'amount',
                    className: 'column-money',
                    sorter: (a, b) => a.amount - b.amount,
                    render: (text) => {
                        const AuthAmount = authComponent(class extends React.Component {
                            render() {
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
                },
                {
                    title: intl.get("invoice.index.record.invoiceNo"),
                    width: 200,
                    dataIndex: 'invoiceCustomNo',
                },
                {
                    title: intl.get("invoice.index.record.remarks"),
                    dataIndex: 'remarks'
                }
            ];
        }
        this.setState({
            columns: recordColumns
        })
    }

    onPageInputChange = (page) => {
        this.fetchData({page});
    };

    onShowSizeChange = (current, perPage) => {
        this.fetchData({perPage, page: 1});
    };

    fetchData = ({page, perPage}) => {
        this.props.asyncFetchInvoiceRecord({type: this.props.type, recordFor: this.props.recordFor, page, perPage});
    };

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
        const {recordList} = this.props;

        let paginationInfo = recordList.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo || {};

        //收款记录


        const recordDataSource = (recordList && recordList.getIn(['data', 'data'])) || [];

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
                    loading={recordList.get('isFetching')}
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
    recordList: state.getIn(['invoiceIndex', 'invoiceRecord']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchInvoiceRecord
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(authComponent(Record))