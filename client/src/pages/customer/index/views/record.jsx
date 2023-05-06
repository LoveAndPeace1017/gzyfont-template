import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {
    Table
} from 'antd';

import {Link} from 'react-router-dom';
import { Resizable } from 'react-resizable';
import authComponent from "utils/authComponent";
import styles from '../styles/index.scss';
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

import {asyncFetchCustomerPriceList} from '../actions'
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
        }
    }

    onPageInputChange = (page, perPage) => {
        this.fetchData({page, perPage});
    };
    onShowSizeChange = (current, perPage) => {
        this.fetchData({perPage, page: 1});
    };

    fetchData = ({page, perPage}) => {
        this.props.asyncFetchCustomerPriceList({recordFor: this.props.recordFor, page, perPage});
    };

    componentDidMount() {
        this.fetchData({page:1,perPage:20});
        let priceDecimalNum = getCookie("priceDecimalNum");
        //采购记录
        let recordColumns = [
            {
                title: intl.get("purchase.index.record.serial"),
                dataIndex: 'serial',
                align: 'center',
                width: 60,
                className: 'ant-table-selection-column'
            },
            {
                title: "客户名称",
                dataIndex: 'customerName',
                align: 'center',
                width: 260,
                className: 'ant-table-selection-column'
            },
            {
                title: "联系人",
                dataIndex: 'contacterName',
                align: 'center',
                width: 220,
                className: 'ant-table-selection-column'
            },
            {
                title: "销售价",
                dataIndex: 'salePrice',
                align: 'center',
                width: 120,
                className: 'ant-table-selection-column',
                render: (text) => {
                    return (
                        <span className="txt-clip" title={fixedDecimal(text, priceDecimalNum)}>{fixedDecimal(text, priceDecimalNum)}</span>
                    )
                }
            }
        ];
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
        const {customerPriceList} = this.props;
        let paginationInfo = customerPriceList.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};
        let recordDataSource = customerPriceList && customerPriceList.getIn(['data', 'data']);
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
                    dataSource={recordDataSource && recordDataSource.toJS()}
                    components={this.components}
                    pagination={false}
                    loading={customerPriceList.get('isFetching')}
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
    customerPriceList: state.getIn(['customerIndex', 'customerPriceList'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchCustomerPriceList
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(authComponent(Record))