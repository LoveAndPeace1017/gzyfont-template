import React, {Component} from 'react';
import intl from 'react-intl-universal';
import { DownOutlined } from '@ant-design/icons';
import { Input, Select, Statistic, Table, Dropdown, Menu, Spin } from 'antd';
import moment from 'moment-timezone';
import {getCookie} from 'utils/cookie';
import {fixedDecimal} from "utils/Decimal";
moment.tz.setDefault("Asia/Shanghai");

const Option = Select.Option;
const Search = Input.Search

import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import {actions as saleActions} from 'pages/sale/index';
import SuggestSearch from  'components/business/suggestSearch';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import FilterToolBar from "../../filterToolBar/views";
import Pagination from 'components/widgets/pagination';
import * as constants from 'utils/constants';
import ListModalTable from 'components/business/listModalTable'
import {Decimal} from "decimal.js/decimal";
import {asyncFetchSaleById} from "../../copyFromSale/actions";
const cx = classNames.bind(styles);

const purchaseStateMap = {
    0: '未完成',
    1: '已完成'
};

const outboundStateMap = {
    0: '未完成',
    1: '已完成'
};

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
        let initStatus = {approveStatus: 1, state: 0, ...this.props.condition};
        this.props.copySource === "inbound"?delete initStatus.state:null;
        this.props.asyncFetchSaleList(initStatus);  //approveStatus 弹层只显示审批通过的订单
        if(selectedRows && selectedRows.length > 0){
            this.backSelectProdList(selectedRows, selectedKeys);
        }
        this.setState({
            selectedRowKeys: selectedRowKeys,
            selectedRows: selectedRows,
            innerSelectedRows: innerSelectedRows,
            condition: {...condition,state: 0}
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

    //返回当前选中的销售单号所对应的产品信息
    backSelectProdList = (selectedRows, existKeys) => {
        const billNo = selectedRows[0].billNo;
        this.props.asyncFetchSaleById(billNo, this.props.unitPriceSource, res=>{
            if(res && res.retCode === '0'){
                let prodList = res.data.prodList;
                let selectProductCodeArr = [];

                prodList = prodList.map((item, index) => {
                    item.serial = index + 1;
                    item.displayCode = item.displayCode || item.prodCustomNo;
                    item.quantity = new Decimal(item.quantity);
                    item.unStockOut =  Math.max(0, item.quantity - item.receiverQuantity);
                    if(existKeys && existKeys.indexOf(item.productCode)!== -1){
                        selectProductCodeArr.push(item.id);
                    }
                    if(!existKeys){
                        selectProductCodeArr.push(item.id);
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
        params.approveStatus = 1;  //approveStatus 弹层只显示审批通过的订单
        this.props.asyncFetchSaleList(params);
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
        const {saleList} = this.props;
        const dataSource = saleList.getIn(['data', 'list']);
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
        let {copySource} = this.props;
        //数量精度
        let quantityDecimalNum = Number(getCookie("quantityDecimalNum")||3);

        let columns = [
            {
                title: intl.get("components.copyFromSale.orderList.serial"),
                key: 'serial',
                dataIndex: 'serial',
                width: 70
            },
            {
                title: intl.get("components.copyFromSale.orderList.displayCode"),
                key: 'displayCode',
                dataIndex: 'displayCode',
                width: 110
            },
            {
                title: intl.get("components.copyFromSale.orderList.prodName"),
                key: 'prodName',
                dataIndex: 'prodName',
                width: 300
            },
            {
                title: intl.get("components.copyFromSale.orderList.descItem"),
                key: 'descItem',
                dataIndex: 'descItem',
                width: 300
            },
            {
                title: intl.get("components.copyFromSale.orderList.unit"),
                key: 'unit',
                dataIndex: 'unit',
                width: 70
            },
            {
                title: intl.get("components.copyFromSale.orderList.quantity"),
                key: 'quantity',
                dataIndex: 'quantity',
                align: 'right',
                width: 80,
                render:(text) =>{
                    let quantity = fixedDecimal(text,quantityDecimalNum);
                    return <span>{quantity}</span>
                }
            },
        ];

        const inboundColumns = [
            {
                title: intl.get("components.copyFromSale.orderList.outNum"),
                key: 'receiverQuantity',
                dataIndex: 'receiverQuantity',
                align: 'right',
                width: 80,
                render:(text) =>{
                    let quantity = fixedDecimal(text,quantityDecimalNum);
                    return <span>{quantity}</span>
                }
            },
            {
                title: intl.get("components.copyFromSale.orderList.unStockOut"),
                key: 'unStockOut',
                dataIndex: 'unStockOut',
                align: 'right',
                render:(text) =>{
                    let quantity = fixedDecimal(text,quantityDecimalNum);
                    return <span>{quantity}</span>
                }
            },
        ];

        const purchaseColumns = [
            {
                title: intl.get("components.copyFromSale.orderList.purchaseNum"),
                key: 'purchaseNum',
                dataIndex: 'purchaseNum',
                align: 'right',
                width: 80,
                render:(text) =>{
                    let quantity = fixedDecimal(text,quantityDecimalNum);
                    return <span>{quantity}</span>
                }
            },
            {
                title: intl.get("components.copyFromSale.orderList.unPurchaseNum"),
                key: 'unPurchaseNum',
                dataIndex: 'unPurchaseNum',
                align: 'right',
                render:(text) =>{
                    let quantity = fixedDecimal(text,quantityDecimalNum);
                    return <span>{quantity}</span>
                }
            }
        ];

        if(copySource === 'purchase'){
            columns = columns.concat(purchaseColumns);
        } else {
            columns = columns.concat(inboundColumns); //默认是从出库那边选择
        }

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
                        rowKey={row=>row.id}
                        className={cx(['inner-table','copy-sale'])}
                        rowSelection={ innerRowSelection }
                    />
                </Spin>
            </React.Fragment>
        )
    };

    render() {
        let {prodList, selectedRowKeys} = this.state;
        const {selectType, saleInfoIsFetching, copySource} = this.props;

        const columns = [
            {title: intl.get("components.copyFromSale.orderList.displayBillNo"), dataIndex: 'displayBillNo', width: 300,
                render:(text) => <span className="txt-clip" title={text}>{text}</span>},
            {title: intl.get("components.copyFromSale.orderList.customerName"), dataIndex: 'customerName', width: 200,
                render:(text) => <span className="txt-clip" title={text}>{text}</span>},
            {title: intl.get("components.copyFromSale.orderList.customerOrderNo"), dataIndex: 'customerOrderNo', width: 200,
                render:(text) => <span className="txt-clip" title={text}>{text}</span>},
            {title: intl.get("components.copyFromSale.orderList.saleOrderDate"), dataIndex: 'saleOrderDate', width: constants.TABLE_COL_WIDTH.DATE,
                render: (text) => (
                    <span>
                        {text ? moment(text).format('YYYY-MM-DD') : null}
                    </span>
                )
            },
            {
                title: intl.get("components.copyFromSale.orderList.prodAbstract"), dataIndex: 'prodAbstract',
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
                                            <div className={cx("tit")}>{intl.get("components.copyFromSale.orderList.prodAbstract")}</div>
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

        if(copySource === 'outbound'){
            columns.splice(5, 1, {
                title: "出库状态", dataIndex: 'state', width: 150,
                render:(state) => <span className="txt-clip" title={outboundStateMap[state]}>{outboundStateMap[state]}</span>
            });
        }
        if(copySource === 'purchase'){
            columns.splice(5, 1, {
                title: "采购状态", dataIndex: 'purchaseState', width: 150,
                render:(purchaseState) => <span className="txt-clip" title={purchaseStateMap[purchaseState]}>{purchaseStateMap[purchaseState]}</span>
            });
        }


        const {saleList} = this.props;
        let dataSource = saleList.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];
        let paginationInfo = saleList.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};

        const rowSelection = {
            selectedRowKeys: selectedRowKeys,
            type: selectType || 'checkbox',
            onChange: this.onSelectRowChange,
        };

        const filterDataSource = {
            prefixComponents: [<div className={cx(["list-search"])}>
                <SuggestSearch
                    placeholder={intl.get("components.copyFromSale.orderList.placeholder")}
                    onSearch={this.onSearch}
                    maxLength={50}
                    url={`/saleorders/search/tips`}
                />
            </div>],
            selectComponents: [

            ]
        };

        if(copySource === 'outbound'){
            filterDataSource.selectComponents.push({
                label: "components.copyFromSale.orderList.state",
                fieldName: 'state',
                showType: 'simple',
                options: [
                    {label: intl.get("components.copyFromSale.orderList.state_1"), value: "0"},
                    {label: intl.get("components.copyFromSale.orderList.state_2"), value: "1"}
                ],
                defaultValue: '0'
            })
        }

        // if(copySource === 'purchase'){
        //     filterDataSource.selectComponents.push({
        //         label: "components.copyFromSale.orderList.purchaseState",
        //         fieldName: 'purchaseState',
        //         showType: 'simple',
        //         options: [
        //             {label: "未完成", value: "0"},
        //             {label: "已完成", value: "1"}
        //         ],
        //         defaultValue: '0'
        //     })
        // }

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
                                loading={saleList.get('isFetching')}
                                expandedRowKeys = {this.state.selectedRowKeys} //checkbox选中的列表单号的组合
                                expandedRowRender={() => this.expandedRowRender(prodList, saleInfoIsFetching)}
                />
                <div className="cf">
                    <Pagination {...paginationInfo}
                                size="small"
                                onChange={this.onPageInputChange}
                              /*  onShowSizeChange={this.onShowSizeChange}*/
                    />
                </div>
            </React.Fragment>
        )
    }
}
const mapStateToProps = (state) => ({
    saleInfoIsFetching: state.getIn(['copyFromSale', 'saleInfo', 'isFetching']),
    saleList: state.getIn(['saleIndex', 'saleList'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchSaleById,
        asyncFetchSaleList: saleActions.asyncFetchSaleList,
        asyncFetchProdAbstractByBillNo: saleActions.asyncFetchProdAbstractByBillNo
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderList)