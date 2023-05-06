import React, {Component} from 'react';
import intl from 'react-intl-universal';
import { DownOutlined } from '@ant-design/icons';
import {getCookie} from 'utils/cookie';
import {fixedDecimal} from "utils/Decimal";
import { Input, Select, Statistic, Table, Spin, Menu, Dropdown } from 'antd';

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
import ListModalTable from 'components/business/listModalTable'
import {asyncFetchSaleById} from "../actions";
import {Decimal} from 'decimal.js';

const cx = classNames.bind(styles);

class OrderList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            selectedRowKeys: [],
            selectedRows: [],
            innerSelectedRows: [],
            currentPageData: [],
            currentPageNum: 1,
            condition: {},
            prodList: []
        }
    }

    componentDidMount() {
        // selectedKeys 为从物品栏中带出的productCode
        const {selectedRows,selectedRowKeys,innerSelectedRows, condition, selectedKeys} = this.props;
        this.props.asyncFetchPurchaseList({approveStatus: 1, deliveryState: 0,  ...this.props.condition});  //approveStatus 弹层只显示审批通过的订单
        if(selectedRows && selectedRows.length > 0){
            this.backSelectProdList(selectedRows, selectedKeys);
        }
        this.setState({
            selectedRowKeys: selectedRowKeys,
            selectedRows: selectedRows,
            innerSelectedRows: innerSelectedRows,
            condition: {...condition,deliveryState: 0}
        });
    }

    onSelectRowChange = (selectedRowKeys, selectedRows) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys, selectedRows);
        this.setState({
            selectedRowKeys,
            selectedRows,
        });
        this.props.onSelectRowChange(selectedRowKeys, selectedRows);
        if(selectedRows && selectedRows.length > 0){
            this.backSelectProdList(selectedRows);
        }
    };

    //返回当前选中的采购单号所对应的产品信息
    backSelectProdList = (selectedRows, existKeys) => {
        const billNo = selectedRows[0].billNo;
        this.props.asyncFetchSaleById(billNo, res=>{
            if(res && res.retCode === '0'){
                let prodList = res.data.prodList;
                let selectProductCodeArr = [];

                prodList = prodList.map((item, index) => {
                    item.serial = index + 1;
                    item.displayCode = item.displayCode || item.prodCustomNo;
                    item.unStockIn = new Decimal(item.quantity);
                    item.unStockIn = Math.max(0, item.unStockIn.minus(item.quantityDelivered)).toString();
                    if(existKeys && existKeys.indexOf(item.productCode)!== -1){
                        selectProductCodeArr.push(item.displayCode);
                    }
                    if(!existKeys){
                        selectProductCodeArr.push(item.displayCode);
                    }
                    return item;
                });

                //通过单选按钮改变列表数据，需要重新设置innerSelectedRows，并回调给父组件
                if(selectProductCodeArr.length === 0){
                    //选择的长度为0时，去除当前的单选
                    this.setState({selectedRowKeys: [], selectedRows: []});
                    this.onSelectRowChange([], []);
                } else {
                    this.setState({innerSelectedRows: selectProductCodeArr});
                    this.props.onSelectInnerRowChange(selectProductCodeArr);
                    this.setState({prodList: prodList});
                }
            }
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
            }
            else {
                if (selectedRowKeys.indexOf(record.key) >= 0) {
                    selectedRowKeys.splice(selectedRowKeys.indexOf(record.id), 1);
                    selectedRows.splice(selectedRowKeys.indexOf(record.id), 1);
                }
                else {
                    selectedRowKeys.push(record.key);
                    selectedRows.push(record);
                }
            }
            this.onSelectRowChange(selectedRowKeys, selectedRows);
        }
    };

    onSearch = (value) => {
        this.doFilter({key: value});
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

        /*for (const key in params) {
            if (!params[key]) {
                delete params[key];
            }
        }*/

        params.approveStatus = 1;  //approveStatus 弹层只显示审批通过的订单
        this.props.asyncFetchPurchaseList(params);
    };
    onSearch = (value) => {
        this.doFilter({key: value}, true);
        this.filterToolBarHanler.reset();
    };
    onPageInputChange = (page,perPage)=>{
        this.doFilter({page,perPage});
    };
    onShowSizeChange = (current, perPage)=> {
        this.doFilter({perPage,page:1});
    };
    //加载当前物品概要数据
    loadWare = (visible, billNo) => {
        const {purchaseList} = this.props;
        const dataSource = purchaseList.getIn(['data', 'list']);
        const hasCache = dataSource.filter(item => {
            return item.get('billNo') === billNo && item.get('prodAbstractList')
        }).size > 0;
        if (visible && !hasCache) {
            this.props.asyncFetchProdAbstractByBillNo(billNo)
        }
    };


    //单选展开产品列表的内容
    expandedRowRender = (prodList, isFetching) => {
        console.log('prodList' + prodList);
        let {innerSelectedRows} = this.state;
        //数量精度
        let quantityDecimalNum = Number(getCookie("quantityDecimalNum")||3);
        const columns = [
            {
                title: intl.get("components.copyFromOrder.orderList.serial"),
                key: 'serial',
                dataIndex: 'serial',
                width: 70
            },
            {
                title: intl.get("components.copyFromOrder.orderList.displayCode"),
                key: 'displayCode',
                dataIndex: 'displayCode',
                width: 110
            },
            {
                title: intl.get("components.copyFromOrder.orderList.prodName"),
                key: 'prodName',
                dataIndex: 'prodName',
                width: 300
            },
            {
                title: intl.get("components.copyFromOrder.orderList.descItem"),
                key: 'descItem',
                dataIndex: 'descItem',
                width: 300
            },
            {
                title: intl.get("components.copyFromOrder.orderList.unit"),
                key: 'unit',
                dataIndex: 'unit',
                width: 70
            },
            {
                title: intl.get("components.copyFromOrder.orderList.quantity"),
                key: 'quantity',
                dataIndex: 'quantity',
                align: 'right',
                width: 80,
                render:(text) =>{
                    let quantity = fixedDecimal(text,quantityDecimalNum);
                    return <span>{quantity}</span>
                }
            },
            {
                title: intl.get("components.copyFromOrder.orderList.quantityDelivered"),
                key: 'quantityDelivered',
                dataIndex: 'quantityDelivered',
                align: 'right',
                width: 80,
                render:(text) =>{
                    let quantity = fixedDecimal(text,quantityDecimalNum);
                    return <span>{quantity}</span>
                }
            },
            {
                title: intl.get("components.copyFromOrder.orderList.unStockIn"),
                key: 'unStockIn',
                dataIndex: 'unStockIn',
                align: 'right',
                render:(text) =>{
                    let quantity = fixedDecimal(text,quantityDecimalNum);
                    return <span>{quantity}</span>
                }
            }
        ];

        const innerRowSelection = {
            selectedRowKeys: innerSelectedRows,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({innerSelectedRows: selectedRowKeys});
                this.props.onSelectInnerRowChange(selectedRowKeys);
                if(selectedRowKeys.length === 0){
                    //选择的长度为0时，去除当前的单选
                    this.setState({selectedRowKeys: [], selectedRows: []});
                    this.onSelectRowChange([], []);
                }
            }
        };

        return (
            <React.Fragment>
                <Spin
                    spinning={isFetching}
                >
                    <ListModalTable
                        isNeedDrag={true}
                        columns={columns}
                        dataSource={prodList}
                        pagination={false}
                        rowKey={row=>row.displayCode}
                        className={cx(['inner-table','copy-order'])}
                        rowSelection={ innerRowSelection }
                    />
                </Spin>
            </React.Fragment>
        )
    };

    render() {
        const {prodList, selectedRowKeys} = this.state;
        const {selectType, purchaseInfoIsFetching} = this.props;

        const columns = [
            {title: intl.get("components.copyFromOrder.orderList.displayBillNo"), dataIndex: 'displayBillNo', width: 300,
                render:(text) => <span className="txt-clip" title={text}>{text}</span>},
            {title: intl.get("components.copyFromOrder.orderList.supplierName"), dataIndex: 'supplierName', width: 200,
                render:(text) => <span className="txt-clip" title={text}>{text}</span>},
            {
                title: intl.get("components.copyFromOrder.orderList.purchaseOrderDate"), dataIndex: 'purchaseOrderDate', width: constants.TABLE_COL_WIDTH.DATE,
                render: (purchaseOrderDate) => (
                    <span className={cx("txt-clip")}>
                        {purchaseOrderDate ? moment(purchaseOrderDate).format('YYYY-MM-DD') : null}
                    </span>
                )
            },{
                title: intl.get("components.copyFromOrder.orderList.prodAbstract"), dataIndex: 'prodAbstract',
                render:(prodAbstract, data) => (
                    <Dropdown
                        onVisibleChange={(visible) => this.loadWare(visible, data.billNo)}
                        overlay={() => (
                            <Menu className={cx('abstract-drop-menu')}>
                                <Menu.Item>
                                    <Spin
                                        spinning={data.prodAbstractIsFetching}
                                    >
                                        <div className={cx("abstract-drop")}>
                                            <div className={cx("tit")}>{intl.get("components.copyFromOrder.orderList.prodAbstract")}</div>
                                            <ul>
                                                {
                                                    data.prodAbstractList && data.prodAbstractList.map((item, index) =>
                                                        <li key={index}>
                                                            <span className={cx('prod-tit')}>{item.prodName}</span>
                                                            <span className={cx('amount')}>x{item.quantity}</span>
                                                        </li>
                                                    )
                                                }
                                            </ul>
                                        </div>
                                    </Spin>
                                </Menu.Item>

                            </Menu>
                        )}>
                         <span>
                            <span className={cx("txt-desc-no") + ' txt-clip'} title={prodAbstract}>
                                {prodAbstract}</span>
                            <DownOutlined className="ml5" />
                        </span>
                    </Dropdown>
                )
            }
        ];

        const {purchaseList} = this.props;
        let dataSource = purchaseList.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];
        let paginationInfo = purchaseList.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};

        const rowSelection = {
            selectedRowKeys: selectedRowKeys,
            type: selectType || 'checkbox',
            onChange: this.onSelectRowChange,
        };

        const filterDataSource = {
            prefixComponents: [<div className={cx(["list-search"])}>
                <SuggestSearch
                    placeholder={intl.get("components.copyFromOrder.orderList.placeholder")}
                    onSearch={this.onSearch}
                    url={`/purchases/search/tips`}
                    maxLength={50}
                />
            </div>],
            selectComponents: [
                {
                    label: "components.copyFromOrder.orderList.deliveryState",
                    fieldName: 'deliveryState',
                    showType: 'simple',
                    options: [
                        {label: intl.get("components.copyFromOrder.orderList.deliveryState_0"), value: "0"},
                        {label: intl.get("components.copyFromOrder.orderList.deliveryState_1"), value: "1"}
                    ],
                    defaultValue: '0'
                },
                {
                    label: "components.copyFromOrder.orderList.payState",
                    fieldName: 'payState',
                    showType: 'simple',
                    options: [
                        {label: intl.get("components.copyFromOrder.orderList.payState_0"), value: "0"},
                        {label: intl.get("components.copyFromOrder.orderList.payState_1"), value: "1"}
                    ]
                },
                {
                    label: "components.copyFromOrder.orderList.invoiceState",
                    fieldName: 'invoiceState',
                    showType: 'simple',
                    options: [
                        {label: intl.get("components.copyFromOrder.orderList.invoiceState_0"), value: "0"},
                        {label: intl.get("components.copyFromOrder.orderList.invoiceState_1"), value: "1"}
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
                                isNeedDrag={true}
                                pagination={false}
                                paginationComponent={true}
                                loading={purchaseList.get('isFetching')}
                                expandedRowKeys = {this.state.selectedRowKeys} //checkbox选中的列表单号的组合
                                expandedRowRender={() => this.expandedRowRender(prodList, purchaseInfoIsFetching)}
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
}

const
    mapStateToProps = (state) => ({
        purchaseInfoIsFetching: state.getIn(['copyFromOrder', 'saleInfo', 'isFetching']),
        purchaseList: state.getIn(['purchaseIndex', 'purchaseList'])
    });

const
    mapDispatchToProps = dispatch => {
        return bindActionCreators({
            asyncFetchSaleById,
            asyncFetchPurchaseList: purchaseActions.asyncFetchPurchaseList,
            asyncFetchProdAbstractByBillNo: purchaseActions.asyncFetchProdAbstractByBillNo
        }, dispatch)
    };

export default connect(mapStateToProps, mapDispatchToProps)

(
    OrderList
)