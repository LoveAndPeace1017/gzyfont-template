import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {Table, Button, Modal} from 'antd';

import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import {asyncFetchQuoteList} from '../actions';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import CompareQuotation from "./compare";

const cx = classNames.bind(styles);

class QuoteListPop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            selectedRowKeys: [],
            selectedRows: [],
            currentPageData: [],
            currentPageNum: 1,
            comparedVisible:false,
            condition: {},
            showSingleQuoteInfo: ''
        }
    }

    componentDidMount() {
        this.props.asyncFetchQuoteList(this.props.inquiryId);
    }

    // 点击多选框
    onRowSelect = (selectedRowKeys,selectedRows) => {
        this.setState({
            selectedRowKeys,
            selectedRows
        });
        // this.updateSelectRows(selectedRowKeys,selectedRows);
    };

    updateArray = (target,array)=>{
        const index = array.findIndex(item => target.key === item.key);
        const item = array[index];
        array.splice(index, 1, {
            ...item,
            ...target,
        });
        return array;
    };

    updateSelectRows = (selectedRowKeys,selectedRows) => {
        console.log('updateSelectRows:',selectedRowKeys,selectedRows);
       this.setState({
           selectedRowKeys,
           selectedRows
       })

    };

    // 更新当前选中行的数据
    // 为了解决setState异步跟新问题，必须返回计算后的值
    updateSelectedRow = (row)=>{
        let selectedRows = [...this.state.selectedRows];
        selectedRows = this.updateArray(row,selectedRows);
        this.setState({ selectedRows: selectedRows });
        return selectedRows;
    };

    onPageInputChange = (page) => {
        this.doFilter({page});
    };

    onShowSizeChange = (current, perPage) => {
        this.doFilter({perPage, page: 1});
    };

    showComparePop = (showSingleQuote)=>{
        this.setState({
            comparedVisible:true,
            showSingleQuoteInfo: showSingleQuote
        });
    };
    closeComparePop = ()=>{
        this.setState({
            comparedVisible:false
        });
    };

    render() {
        const {selectType} = this.props;
        const columns = [{
            title: intl.get("inquiry.index.quoteList.serial"),
            key: 'serial',
            dataIndex: 'serial',
            width: 60
        }, {
            title: intl.get("inquiry.index.quoteList.addedTime"),
            key: 'addedTime',
            dataIndex: 'addedTime',
            render: (date) => (<span>{moment(date).format('YYYY-MM-DD')}</span>)
        }, {
            title: intl.get("inquiry.index.quoteList.comName"),
            key: 'comName',
            dataIndex: 'comName',
        }, {
            title: intl.get("inquiry.index.quoteList.totalPrice"),
            key: 'totalPrice',
            dataIndex: 'totalPrice',
            align: 'right',
            className: 'column-money',
            render: (price, item) => (<a onClick={() => {this.showComparePop([item.quotationId])}}>{price}</a>)
        }, {
            title: intl.get("inquiry.index.quoteList.effectiveTime"),
            key: 'effectiveTime',
            dataIndex: 'effectiveTime',
            render: (date) => (<span>{moment(date).format('YYYY-MM-DD')}</span>),
        }];

        const {quoteList} = this.props;
        let dataSource = quoteList.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];
        // let paginationInfo = quoteList.getIn(['data', 'pagination']);
        // paginationInfo = paginationInfo ? paginationInfo.toJS() : {};

        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            type: selectType || 'check',
            onChange: this.onRowSelect
        };

        return (
            <React.Fragment>
                <div className={cx("quote-ope")}>
                    {this.state.selectedRows.length > 0 && <Button type="primary" onClick={() => this.showComparePop()} style={{marginRight: '20px'}}>{intl.get("inquiry.index.quoteList.compareOrder")}</Button>}
                    <span style={{paddingRight: '20px', color: "black"}}>{intl.get("inquiry.index.quoteList.chooseOrder")}: </span>
                    <span>{this.state.selectedRows.map((item)=>item.comName).join(',  ')}</span>
                </div>
                <Table dataSource={dataSource}
                       columns={columns}
                       rowSelection={rowSelection}
                       loading={quoteList.get('isFetching')}
                       pagination={true}
                />
                <Modal {...this.props}
                       visible={this.state.comparedVisible}
                       onCancel={this.closeComparePop}
                       title={intl.get("inquiry.index.quoteList.compareOrderList")}
                       width={1000}
                       className={cx("goods-pop")}
                       destroyOnClose={true}
                >
                    <CompareQuotation
                        inquiryId={this.props.inquiryId}
                        selectedRowKeys={this.state.showSingleQuoteInfo || this.state.selectedRowKeys}
                    />
                </Modal>
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    quoteList: state.getIn(['inquiryIndex', 'quoteList'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchQuoteList
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(QuoteListPop);
