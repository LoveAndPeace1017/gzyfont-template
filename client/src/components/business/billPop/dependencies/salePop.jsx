import React, {Component} from 'react';
import intl from 'react-intl-universal';
import { Input, Select, Table } from 'antd';

const Option = Select.Option;
const Search = Input.Search

import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import {actions as saleActions} from 'pages/sale/index';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import FilterToolBar from "../../filterToolBar/views";
import Pagination from 'components/widgets/pagination';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import * as constants from 'utils/constants';
import ListModalTable from 'components/business/listModalTable'
const cx = classNames.bind(styles);

class SalePop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:{},
            selectedRowKeys: [],
            selectedRows: [],
            currentPageData:[],
            currentPageNum:1,
            condition:{}
        }
    }

    componentDidMount() {
        this.props.asyncFetchSaleList(this.state.condition);
        this.setState({
            selectedRowKeys:this.props.selectedRowKeys,
            selectedRows:this.props.selectedRows
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


    // onCountChange = (e, record) => {
    //     let count = e.target.value;
    //     const newData = [...this.state.data];
    //     const index = newData.findIndex(item => key === item.key);
    //     if (index > -1) {
    //         const item = newData[record.key];
    //         newData.splice(index, 1, {
    //             ...item,
    //             count,
    //         });
    //         this.setState({data: newData});
    //     } else {
    //         newData.push(row);
    //         this.setState({data: newData, editingKey: ''});
    //     }
    // };

    doFilter = (condition,resetFlag)=>{
        let params = this.state.condition;
        if(resetFlag){
            params = {page:1};
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
        this.props.asyncFetchSaleList(params);
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
            {title: intl.get("components.billPop.salePop.serial"), dataIndex: 'serial', key: 'serial', width: constants.TABLE_COL_WIDTH.SERIAL},
            {title: intl.get("components.billPop.salePop.displayBillNo"), dataIndex: 'displayBillNo', key: 'billNo',
                render:(text) => <span className="txt-clip" title={text}>{text}</span>},
            {
                title: intl.get("components.billPop.salePop.state"), dataIndex: 'state', key: 'state', align: 'center',
                render: (state) => (
                    <span className={cx("txt-clip")}
                          title={state}>
                            {
                                state === 0 ?
                                    <span className="orange">{intl.get("components.billPop.salePop.not_finish")}</span>
                                    :
                                    <span className="gray">{intl.get("components.billPop.salePop.finish")}</span>
                            }
                    </span>
                )
            },
            {title: intl.get("components.billPop.salePop.customerName"), dataIndex: 'customerName', key: 'customerName',
                render:(text) => <span className="txt-clip" title={text}>{text}</span>},
            {
                title: intl.get("components.billPop.salePop.saleOrderDate"),
                dataIndex: 'saleOrderDate',
                key: 'saleOrderDate',
                width: constants.TABLE_COL_WIDTH.DATE,
                align: 'center',
                /*defaultSortOrder: 'descend',*/
                render: (date) => (<span>{moment(date).format('YYYY-MM-DD')}</span>),
                sorter: (a, b) => a.saleOrderDate - b.saleOrderDate,
            },
            {
                title: intl.get("components.billPop.salePop.deliveryDate"),
                dataIndex: 'deliveryDate',
                key: 'deliveryDate',
                width: constants.TABLE_COL_WIDTH.DATE,
                align: 'center',
                render: (date) => (<span>{moment(date).format('YYYY-MM-DD')}</span>),
                // defaultSortOrder: 'descend',
                sorter: (a, b) => a.deliveryDate - b.deliveryDate,
            },
            {title: intl.get("components.billPop.salePop.aggregateAmount"), key: 'aggregateAmount', dataIndex: 'aggregateAmount', align: 'right', render: (text) => (<span className="txt-clip" title={text}><b>{text}</b></span>)},
            {title: intl.get("components.billPop.salePop.projectName"), dataIndex: 'projectName', key: 'projectName',
                render:(text) => <span className="txt-clip" title={text}>{text}</span>},
        ];
        // if(selectType!=="radio"){
        //     columns.splice(6,0,{title: '数量',dataIndex: 'count',width:200,
        //         render:(count,record)=>(<Input defaultValue={count} onKeyUp={(e)=>this.onCountChange(e,record)}/>)
        //         ,})
        // }

        const {saleList} = this.props;
        let dataSource = saleList.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];
        let paginationInfo = saleList.getIn(['data', 'pagination']);
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
                    placeholder={intl.get("components.billPop.salePop.placeholder")}
                    onSearch={this.onSearch}
                    enterButton
                />
            </div>],
            selectComponents: [
                {
                    label: intl.get("components.billPop.salePop.state"),
                    fieldName: 'state',
                    //showType:'simple',
                    style: {zIndex: '2000'},
                    options: [{value: '0', label: intl.get("components.billPop.salePop.state_0")}, {value: '1', label: intl.get("components.billPop.salePop.state_1")}]
                },
                {
                    label: intl.get("components.billPop.salePop.payState"),
                    fieldName: 'payState',
                    //showType:'simple',
                    style: {zIndex: '2000'},
                    options: [{value: '0', label: intl.get("components.billPop.salePop.payState_0")}, {value: '1', label: intl.get("components.billPop.salePop.payState_1")}]
                },
                {
                    label: intl.get("components.billPop.salePop.invoiceState"),
                    fieldName: 'invoiceState',
                    //showType:'simple',
                    style: {zIndex: '2000'},
                    options: [{value: '0', label: intl.get("components.billPop.salePop.invoiceState_0")}, {value: '1', label: intl.get("components.billPop.salePop.invoiceState_1")}]
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
                       loading={this.props.saleList.get('isFetching')}
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
    saleList: state.getIn(['saleIndex', 'saleList'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchSaleList: saleActions.asyncFetchSaleList,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(SalePop)
