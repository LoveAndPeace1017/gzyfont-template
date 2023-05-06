import React, {Component} from 'react';
import { Resizable } from 'react-resizable';
import {Link} from 'react-router-dom';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Table} from 'antd';

import authComponent from "utils/authComponent";
import Pagination from 'components/widgets/pagination';

import {asyncFetchProduceRecord} from '../actions'
import moment from 'moment-timezone';
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
            setId: ''
        }
    }

    componentDidMount() {
        this.fetchData({});
        this.props.onRef && this.props.onRef(this);
        let recordColumns = [{
            title: "序号",
            width: 50,
            dataIndex: 'serial',
            className: 'ant-table-selection-column'
        }, {
            title: "生产单号",
            width: 200,
            dataIndex: 'billNo'/*,
            render: (billNo) => {
                return (
                    <Link to={`/produceOrder/show/${billNo}`}>{billNo}</Link>
                )
            }*/
        }, {
            title: "单据日期",
            width: 200,
            dataIndex: 'orderDate',
            render: (text) => (
                <span className="txt-clip">
                    {text ? moment(text).format('YYYY-MM-DD') : null}
                 </span>
            )
        }, {
            title: "生产部门",
            width: 150,
            dataIndex: 'departmentName',
        }, {
            title: "生产人",
            width: 150,
            dataIndex: 'employeeName',
        }, {
            title: "状态",
            width: 150,
            dataIndex: 'orderStatus',
            render: (orderStatus) => (
                <span className="txt-clip">
                    {orderStatus===1 ? '未完成' : '已完成'}
                 </span>
            )
        }];

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
        this.props.asyncFetchProduceRecord({recordFor: this.props.recordFor, page, perPage});
    };

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if(this.props.recordFor!=this.state.setId) {
            this.setState({setId: this.props.recordFor});
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
    recordList: state.getIn(['traceShow', 'produceRecord'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchProduceRecord
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(authComponent(Record))