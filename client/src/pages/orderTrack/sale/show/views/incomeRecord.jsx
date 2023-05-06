import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {
    Table
} from 'antd';

import {Link} from 'react-router-dom';
import authComponent from "utils/authComponent";
import { Resizable } from 'react-resizable';
import styles from '../styles/index.scss';
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

import {asyncFetchIncomeRecord} from '../actions';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import Pagination from 'components/widgets/pagination';

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
        //收款记录
        let recordColumns;
        if (this.props.type === 'customer') {
            recordColumns = [{
                title: intl.get("income.index.record.serial"),
                width: 50,
                dataIndex: 'serial',
                className: 'ant-table-selection-column'
            },
            {
                title: intl.get("income.index.record.billNo"),
                width: 200,
                dataIndex: 'billNo'/*,
                render: (text, record) => {
                    return (
                        <Link to={`/finance/income/show/${record.id}`}>{text}</Link>
                    )
                }*/
            }, {
                title: intl.get("income.index.record.paymentDate"),
                width: 200,
                dataIndex: 'paymentDate',
                render: (text) => (
                    <span className="txt-clip">
                {text ? moment(text).format('YYYY-MM-DD') : null}
            </span>
                )
            }, {
                title: intl.get("income.index.record.allAmount"),
                width: 150,
                dataIndex: 'amount',
                className:'column-money',
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
                        <AuthAmount module="salePrice" option="show" noAuthRender={'**'}/>
                    )
                }
            }, {
                title: intl.get("income.index.record.remarks"),
                dataIndex: 'remarks'
            }];
        } else if (this.props.type === 'saleOrder'){
            recordColumns = [{
                title: intl.get("income.index.record.serial"),
                width: 50,
                dataIndex: 'serial',
                className: 'ant-table-selection-column'
            }, {
                title: intl.get("income.index.record.billNo"),
                width: 200,
                dataIndex: 'billNo',
                sorter: (a, b) => a.billNo.localeCompare(b.billNo),
                /*render: (text, record) => {
                    return (
                        <Link to={`/finance/income/show/${record.id}`}>{text}</Link>
                    )
                }*/
            }, {
                title: intl.get("income.index.record.paymentDate"),
                width: 200,
                dataIndex: 'paymentDate',
                sorter: (a, b) => a.paymentDate - b.paymentDate,
                render: (text) => (
                    <span className="txt-clip">
                    {text ? moment(text).format('YYYY-MM-DD') : null}
                </span>
                )
            }, {
                title: intl.get("income.index.record.customerName"),
                width: 200,
                dataIndex: 'customerName'
            }, {
                title: intl.get("income.index.record.amount"),
                width: 150,
                dataIndex: 'amount',
                className:'column-money',
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
                        <AuthAmount module="salePrice" option="show" noAuthRender={'**'}/>
                    )
                }
            }, {
                title: intl.get("income.index.record.accountName"),
                width: 200,
                dataIndex: 'accountName'
            }];
        }
        console.log(recordColumns,'recordColumns');
        this.setState({
            columns: recordColumns
        })
    }


    components = {
        header: {
            cell: ResizeableTitle,
        },
    };

    onPageInputChange = (page) => {
        this.fetchData({page});
    };

    onShowSizeChange = (current, perPage) => {
        this.fetchData({perPage, page: 1});
    };

    fetchData = ({page, perPage}) => {
        this.props.asyncFetchIncomeRecord({type: this.props.type, recordFor: this.props.recordFor, page, perPage});
    };

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if(this.props.recordFor!=this.state.setId) {
            this.setState({setId: this.props.recordFor})
            this.fetchData({})
        }
    }


    handleResize = index => (e, { size }) => {
        console.log(6);
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

        const recordDataSource = (recordList && recordList.getIn(['data', 'data'])) || [];

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
                    loading={recordList.get('isFetching')}
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
    recordList: state.getIn(['traceShow', 'incomeRecord']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchIncomeRecord
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(authComponent(Record))