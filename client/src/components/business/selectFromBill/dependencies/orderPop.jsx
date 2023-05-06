import React, {Component} from 'react';
import intl from 'react-intl-universal';
import { Input, Select, Statistic, Table } from 'antd';

const Option = Select.Option;
const Search = Input.Search;
import SuggestSearch from  'components/business/suggestSearch';

import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import {actions as purchaseActions} from 'pages/purchase/index';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import FilterToolBar from "../../filterToolBar/views";
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import Pagination from 'components/widgets/pagination';
import * as constants from 'utils/constants';
import ListModalTable from 'components/business/listModalTable';
import {formatCurrency} from 'utils/format';

const cx = classNames.bind(styles);

class OrderPop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            dataSource: [],
            selectedRowKeys: [],
            selectedRows: [],
            currentPageData: [],
            currentPageNum: 1,
            condition: {},
        }
    }

    getGoodsList = (params) => {
        params.approveStatus = 1;  // 弹层只显示审批通过的订单
        this.props.asyncFetchPurchaseList(params, (data) => {
            let dataSource = [];
            if (data.retCode == '0') {
                dataSource = data.list || [];
                let selectedRow = [...this.state.selectedRows];
                for (let i = 0; i < dataSource.length; i++) {
                    let item = dataSource[i];
                    for (let j = 0; j < selectedRow.length; j++) {
                        let row = selectedRow[j];
                        if (item.key == row.key) {
                            // 由于item = {...item,...row} 存在bug，因此这里手动赋值;
                            for (let prop in row) {
                                item[prop] = row[prop];
                            }
                            selectedRow.splice(j, 1);
                            break;
                        }
                    }
                }
            }
            this.setState({
                dataSource
            });
        });
    };

    componentDidMount() {
        this.getGoodsList({...this.props.condition});
        this.setState({
            selectedRowKeys: this.props.selectedRowKeys || [],
            selectedRows: this.props.selectedRows || [],
            condition: this.props.condition
        });
        this.props.onSelectRowChange(this.props.selectedRowKeys, this.props.selectedRows);
    }

    onSelectRowChange = (selectedRowKeys, selectedRows) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys, selectedRows);
        this.props.onSelectRowChange && this.props.onSelectRowChange(selectedRowKeys, selectedRows);
        this.setState({
            selectedRowKeys,
            selectedRows,
        });
    };

    onSelectRow = (record)=>{
        let selectedRowKeys = [...this.state.selectedRowKeys];
        let selectedRows = [...this.state.selectedRows];
        const {selectType} = this.props;
        if (selectType === 'radio') {
            selectedRowKeys = [record.key];
            selectedRows = [record];
        } else {
            if (selectedRowKeys.indexOf(record.key) >= 0) {
                let currenctIndex = selectedRowKeys.indexOf(record.key);
                selectedRowKeys.splice(currenctIndex, 1);
                selectedRows.splice(currenctIndex, 1);
            } else {
                selectedRowKeys.push(record.key);
                selectedRows.push(record);
            }
        }
        this.onSelectRowChange(selectedRowKeys, selectedRows);
    }


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
                    let currenctIndex = selectedRowKeys.indexOf(record.key);
                    selectedRowKeys.splice(currenctIndex, 1);
                    selectedRows.splice(currenctIndex, 1);
                } else {
                    selectedRowKeys.push(record.key);
                    selectedRows.push(record);
                }
            }
            this.onSelectRowChange(selectedRowKeys, selectedRows);
        }
    };

    onSelectAll = (selected, _selectedRows, changeRows) => {
        let selectedRowKeys = [...this.state.selectedRowKeys];
        let selectedRows = [...this.state.selectedRows];

        if (selected) {
            let keys = [];
            changeRows.forEach((item) => {
                keys.push(item.key);
            });
            selectedRowKeys = selectedRowKeys.concat(keys);
            selectedRows = selectedRows.concat(changeRows);
        } else {
            changeRows.forEach(item => {
                const index = selectedRowKeys.indexOf(item.key);
                selectedRowKeys.splice(index, 1);
                selectedRows.splice(index, 1);
            });
        }
        this.onSelectRowChange(selectedRowKeys, selectedRows);
    };

    doFilter = (condition, resetFlag) => {
        let params = this.state.condition;
        if (resetFlag) {
            params = condition;
        }
        else {
            params = {
                ...params,
                ...condition
            }
        }
        this.setState({
            condition: params
        });

        for (const key in params) {
            if (!params[key]) {
                delete params[key];
            }
        }
        this.getGoodsList(params);
    };
    onSearch = (value) => {
        this.setState({
            selectedRowKeys: [],
            selectedRows: []
        });
        this.doFilter({key: value}, true);
        this.filterToolBarHanler.reset();
    };

    onPageInputChange = (page,perPage) => {
        this.doFilter({page,perPage},false,true);
    };

    render() {

        const {selectType} = this.props;

        const columns = [
            {title: intl.get("components.selectFromBill.orderPop.serial"), dataIndex: 'serial', key: 'serial', width: constants.TABLE_COL_WIDTH.SERIAL},
            {title: intl.get("components.selectFromBill.orderPop.displayBillNo"), dataIndex: 'displayBillNo',
                render:(text) => <span className="txt-clip" title={text}>{text}</span>},
            {
                title: intl.get("components.selectFromBill.orderPop.state"), dataIndex: 'state',
                render: (state) => (
                    <span className={cx("txt-clip")}>
                        {state === 0 ? (
                            <span className="orange">{intl.get("components.selectFromBill.orderPop.not_finish")}</span>
                        ) : (
                            <span className="gray">{intl.get("components.selectFromBill.orderPop.finish")}</span>
                        )}
                    </span>
                )
            },
            {title: intl.get("components.selectFromBill.orderPop.supplierName"), dataIndex: 'supplierName',
                render:(text) => <span className="txt-clip" title={text}>{text}</span>},
            {
                title: intl.get("components.selectFromBill.orderPop.purchaseOrderDate"), dataIndex: 'purchaseOrderDate', width: constants.TABLE_COL_WIDTH.DATE,
                render: (purchaseOrderDate) => (
                    <span className={cx("txt-clip")}>
                        {purchaseOrderDate ? moment(purchaseOrderDate).format('YYYY-MM-DD') : null}
                    </span>
                )
            },
            /*{
                title: "已入库金额", dataIndex: 'actualEnterAmount', width: constants.TABLE_COL_WIDTH.DATE,
                render: (text) => <span className="txt-clip" title={formatCurrency(text)}><strong>{formatCurrency(text)}</strong></span>
            },*/
            {
                title: intl.get("components.selectFromBill.orderPop.aggregateAmount"), dataIndex: 'aggregateAmount',width: constants.TABLE_COL_WIDTH.DATE,
                render: (text) => <span className="txt-clip" title={formatCurrency(text)}><strong>{formatCurrency(text)}</strong></span>
            },
            {
                title: intl.get("components.selectFromBill.orderPop.payAmount"), dataIndex: 'payAmount', width: constants.TABLE_COL_WIDTH.DATE,
                render: (text) => <span className="txt-clip" title={formatCurrency(text)}><strong>{formatCurrency(text)}</strong></span>
            },
            {
                title: intl.get("components.selectFromBill.orderPop.waitPay"), dataIndex: 'waitPay', width: constants.TABLE_COL_WIDTH.DATE,
                render: (text) => <span className="txt-clip" title={text < 0 ? 0 : formatCurrency(text)}><strong>{text < 0 ? 0 : formatCurrency(text)}</strong></span>
            },
            {
                title: intl.get("components.selectFromBill.orderPop.invoiceAmount"), dataIndex: 'invoiceAmount', width: constants.TABLE_COL_WIDTH.DATE,
                render: (text) => <span className="txt-clip" title={formatCurrency(text)}><strong>{formatCurrency(text)}</strong></span>
            },
            {
                title: intl.get("components.selectFromBill.orderPop.waitInvoiceAmount"), dataIndex: 'waitInvoiceAmount', width: constants.TABLE_COL_WIDTH.DATE,
                render: (text) => <span className="txt-clip" title={text < 0 ? 0 : formatCurrency(text)}><strong>{text < 0 ? 0 : formatCurrency(text)}</strong></span>
            }
        ];

        const {purchaseList} = this.props;
        let dataSource = purchaseList.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];
        let paginationInfo = purchaseList.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};

        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            type: selectType || 'checkbox',
            onSelect: this.onSelectRow,
            onSelectAll: this.onSelectAll,
         /*   onChange: this.onSelectRowChange,*/
        };

        const filterDataSource = {
            prefixComponents: [<div className={cx(["list-search"])}>
                <SuggestSearch
                    placeholder={intl.get("components.selectFromBill.orderPop.placeholder")}
                    onSearch={this.onSearch}
                    url={`/purchases/search/tips`}
                    maxLength={50}
                />
            </div>],
            selectComponents: [
                {
                    label: "components.selectFromBill.orderPop.deliveryState",
                    fieldName: 'deliveryState',
                    showType: 'simple',
                    options: [
                        {label: intl.get("components.selectFromBill.orderPop.deliveryState_0"), value: "0"},
                        {label: intl.get("components.selectFromBill.orderPop.deliveryState_1"), value: "1"}
                    ]
                },
                {
                    label: "components.selectFromBill.orderPop.payState",
                    fieldName: 'payState',
                    showType: 'simple',
                    options: [
                        {label: intl.get("components.selectFromBill.orderPop.payState_0"), value: "0"},
                        {label: intl.get("components.selectFromBill.orderPop.payState_1"), value: "1"}
                    ]
                },
                {
                    label: "components.selectFromBill.orderPop.invoiceState",
                    fieldName: 'invoiceState',
                    showType: 'simple',
                    options: [
                        {label: intl.get("components.selectFromBill.orderPop.invoiceState_0"), value: "0"},
                        {label: intl.get("components.selectFromBill.orderPop.invoiceState_1"), value: "1"}
                    ]
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
                <ListModalTable dataSource={dataSource} columns={columns} rowSelection={rowSelection}
                                onRow={(record) => ({
                                    onClick: (event) => this.selectRow(event, record),
                                })}
                                pagination={false}
                                paginationComponent={true}
                                loading={purchaseList.get('isFetching')}
                />
                <div className="cf">
                    <Pagination {...paginationInfo}
                                size="small"
                                onChange={this.onPageInputChange}
                                /*onShowSizeChange={this.onShowSizeChange}*/
                    />
                </div>
            </React.Fragment>
        )
    }
};

const
    mapStateToProps = (state) => ({
        purchaseList: state.getIn(['purchaseIndex', 'purchaseList'])
    });

const
    mapDispatchToProps = dispatch => {
        return bindActionCreators({
            asyncFetchPurchaseList: purchaseActions.asyncFetchPurchaseList
        }, dispatch)
    };

export default connect(mapStateToProps, mapDispatchToProps)

(
    OrderPop
)