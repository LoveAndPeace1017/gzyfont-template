import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {
    Input, Table
} from 'antd';

const Search = Input.Search;

import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import {actions as orderActions} from 'pages/purchase/index';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import FilterToolBar from "../../filterToolBar/views";
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import Pagination from 'components/widgets/pagination';
import * as constants from 'utils/constants';
import ListModalTable from 'components/business/listModalTable'

const cx = classNames.bind(styles);

class OrderPop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            selectedRowKeys: [],
            selectedRows: [],
            currentPageData: [],
            currentPageNum: 1,
            condition: {}
        }
    }

    componentDidMount() {
        this.props.asyncFetchPurchaseList(this.props.condition);
        this.setState({
            selectedRowKeys: this.props.selectedRowKeys,
            selectedRows: this.props.selectedRows
        });
    }

    onSelectRowChange = (selectedRowKeys, selectedRows) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys, selectedRows);
        this.props.onSelectRowChange(selectedRowKeys, selectedRows);
        this.setState({
            selectedRowKeys,
            selectedRows,
        });
    };

    selectRow = (event, record) => {
        if (event.target && event.target.nodeName !== "INPUT") {
            let selectedRowKeys = [...this.state.selectedRowKeys];
            let selectedRows = [...this.state.selectedRows];
            const {selectType} = this.props;
            if (selectType === 'radio') {
                selectedRowKeys = [record.key];
                selectedRows = [record];
            } else {
                if (selectedRowKeys.indexOf(record.key) >= 0) {
                    selectedRowKeys.splice(selectedRowKeys.indexOf(record.id), 1);
                    selectedRows.splice(selectedRowKeys.indexOf(record.id), 1);
                } else {
                    selectedRowKeys.push(record.key);
                    selectedRows.push(record);
                }
            }
            this.onSelectRowChange(selectedRowKeys, selectedRows);
        }
    };

    doFilter = (condition,resetFlag)=>{
        let params = this.state.condition;
        if(resetFlag){
            params = {};
        }
        params = {
            ...params,
            ...condition
        };
        this.setState({
            condition:params
        });

        for (const key in params) {
            if (!params[key]) {
                delete params[key];
            }
        }
        this.props.asyncFetchPurchaseList(params);
    };
    onSearch = (value)=>{
        this.doFilter({key:value},true);
        this.filterToolBarHanler.reset();
    };
    onPageInputChange = (page)=>{
        this.doFilter({page});
    };
    onShowSizeChange = (current, perPage)=> {
        this.doFilter({perPage,page:1});
    };

    render() {
        const {selectType} = this.props;
        const columns = [
            {title: intl.get("components.billPop.orderPop.serial"), dataIndex: 'serial', key: 'serial', width: constants.TABLE_COL_WIDTH.SERIAL},
            {title: intl.get("components.billPop.orderPop.displayBillNo"), dataIndex: 'displayBillNo', key: 'billNo',
                render:(text)=><span className={cx("txt-clip")} title={text}>{text}</span>
            },
            {
                title: intl.get("components.billPop.orderPop.state"), dataIndex: 'state', key: 'state', align: 'center',
                render: (state) => (
                    <span className={cx("txt-clip")}
                          title={state}>
                            {
                                state === 0 ?
                                    <span className="orange">{intl.get("components.billPop.orderPop.not_finish")}</span>
                                    :
                                    <span className="gray">{intl.get("components.billPop.orderPop.finish")}</span>
                            }
                    </span>
                )
            },
            {title: intl.get("components.billPop.orderPop.supplierName"), dataIndex: 'supplierName', key: 'supplierName'},
            {
                title: intl.get("components.billPop.orderPop.purchaseOrderDate"),
                dataIndex: 'purchaseOrderDate',
                key: 'purchaseOrderDate',
                width: constants.TABLE_COL_WIDTH.DATE,
                align: 'center',
                /*defaultSortOrder: 'descend',*/
                render: (date) => (<span>{moment(date).format('YYYY-MM-DD')}</span>),
                sorter: (a, b) => a.purchaseOrderDate - b.purchaseOrderDate
            },
            {
                title: intl.get("components.billPop.orderPop.deliveryDeadlineDate"),
                dataIndex: 'deliveryDeadlineDate',
                key: 'deliveryDeadlineDate',
                align: 'center',
                width: constants.TABLE_COL_WIDTH.DATE,
                render: (date) => (<span>{moment(date).format('YYYY-MM-DD')}</span>),
                sorter: (a, b) => a.deliveryDeadlineDate - b.deliveryDeadlineDate
            },
            {
                title: intl.get("components.billPop.orderPop.aggregateAmount"),
                key: 'aggregateAmount',
                dataIndex: 'aggregateAmount',
                align: 'right',
                render: (text) => (<span className={cx("txt-clip")} title={text}><b>{text}</b></span>)
            }
        ];

        const {purchaseList} = this.props;
        let dataSource = purchaseList.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];
        let paginationInfo = purchaseList.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};

        const rowSelection = {
            selectedRowKeys: this.props.selectedRowKeys,
            type: selectType || 'radio',
            onChange: this.onSelectRowChange,
            columnWidth: constants.TABLE_COL_WIDTH.SELECTION
        };

        const filterDataSource = {
            prefixComponents: [<div className={cx(["list-search"])}>
                <Search
                    placeholder={intl.get("components.billPop.orderPop.placeholder")}
                    onSearch={this.onSearch}
                    enterButton
                />
            </div>],
            selectComponents: [
                {
                    label: intl.get("components.billPop.orderPop.deliveryState"),
                    fieldName: 'deliveryState',
                    //showType:'simple',
                    style: {zIndex: '2000'},
                    options: [{value: '0', label: intl.get("components.billPop.orderPop.deliveryState_0")}, {value: '1', label: intl.get("components.billPop.orderPop.deliveryState_1")}]
                },
                {
                    label: intl.get("components.billPop.orderPop.payState"),
                    fieldName: 'payState',
                    //showType:'simple',
                    style: {zIndex: '2000'},
                    options: [{value: '0', label: intl.get("components.billPop.orderPop.payState_0")}, {value: '1', label: intl.get("components.billPop.orderPop.payState_1")}]
                },
                {
                    label: intl.get("components.billPop.orderPop.invoiceState"),
                    //showType:'simple',
                    fieldName: 'invoiceState',
                    style: {zIndex: '2000'},
                    options: [{label: intl.get("components.billPop.orderPop.invoiceState_0"), value: "0"}, {label: intl.get("components.billPop.orderPop.invoiceState_1"), value: "1"}]
                }
            ]
        };
        return (
            <React.Fragment>
                <div className={cx("ope-bar")}>
                    <FilterToolBar
                        dataSource={filterDataSource}
                        doFilter={this.doFilter}
                        ref={(child) => {
                            this.filterToolBarHanler = child;
                        }}
                    />
                </div>
                <ListModalTable dataSource={dataSource}
                       columns={columns}
                       rowSelection={rowSelection}
                       loading={purchaseList.get('isFetching')}
                       onRow={(record) => ({
                           onClick: (event) => this.selectRow(event, record)
                       })}
                       pagination={false}
                        paginationComponent={true}
                />
                <div className="cf">
                    <Pagination {...paginationInfo}
                                size="small"
                                onChange={this.onPageInputChange}
                                onShowSizeChange={this.onShowSizeChange}
                    />
                </div>
            </React.Fragment>
        )
    }
};
const mapStateToProps = (state) => ({
    purchaseList: state.getIn(['purchaseIndex', 'purchaseList'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchPurchaseList: orderActions.asyncFetchPurchaseList,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderPop)
