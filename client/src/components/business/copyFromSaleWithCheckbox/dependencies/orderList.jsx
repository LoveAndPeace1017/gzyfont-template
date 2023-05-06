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
            prodList: {}
        }
    }

    componentDidMount() {
        // selectedKeys 为从物品栏中带出的productCode
        const {selectedRows,selectedRowKeys,innerSelectedRows, condition, selectedKeys} = this.props;
        this.props.asyncFetchSaleList({approveStatus: 1, state: 0, ...this.props.condition});  //approveStatus 弹层只显示审批通过的订单
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
    //数组合并去重
    uq = (array,array1)=>{
        let setObj = new Set(array)
        for(let i = 0; i < array1.length; i++) {
            setObj.add(array1[i]);
        }
        return Array.from(setObj).sort();
    }

    //获取2个数组不一样的元素
    diff = (arr1, arr2) =>{
        var arr3 =[];
        for (let key in arr1) {
            var stra = arr1[key];
            var count = 0;
            for(var j= 0; j < arr2.length; j++){
                var strb = arr2[j];
                if(stra == strb) {
                    count++;
                }
            }
            if(count===0) {//表示数组1的这个值没有重复的，放到arr3列表中
                arr3.push(stra);
            }
        }
        for (let key in arr2) {
            var stra = arr2[key];
            var count = 0;
            for(var j= 0; j < arr1.length; j++){
                var strb = arr1[j];
                if(stra == strb) {
                    count++;
                }
            }
            if(count===0) {//表示数组1的这个值没有重复的，放到arr3列表中
                arr3.push(stra);
            }
        }
        return arr3;
    }


    onSelectRowChange = (selectedRowKeys, selectedRows) => {

        /*let oldSelectedRowKeys = this.state.selectedRowKeys||[];
        let oldSelectedRows = this.state.selectedRows||[];

        let newSelectedRows = [];
        let contactSelectedRows = oldSelectedRows.concat(selectedRows||[]);
        let newSelectedRowKeys = this.uq(oldSelectedRowKeys,selectedRowKeys||[]);
        for(let j=0;j<newSelectedRowKeys.length;j++){
            let billNo = newSelectedRowKeys[j];
            for(let m=0;m<contactSelectedRows.length;m++){
                if(contactSelectedRows[m].billNo === billNo){
                    newSelectedRows.push(contactSelectedRows[m]);
                    break;
                }
            }
        }*/

        this.setState({
            selectedRowKeys:selectedRowKeys,
            selectedRows:selectedRows,
        });
        this.props.onSelectRowChange(selectedRowKeys, selectedRows);
        if(selectedRows && selectedRows.length > 0){
            this.backSelectProdList(selectedRows);
        }else{
            this.props.onSelectInnerRowChange([]);
            this.setState({prodList: {},innerSelectedRows:[]});
        }
    };

    //返回当前选中的销售单号所对应的产品信息
    backSelectProdList = (selectedRows, existKeys) => {
        let oldProdList = this.state.prodList;
        let billNo;
        let newProdList = {};
        for(let j=0;j<selectedRows.length;j++){
            let billNos = selectedRows[j].billNo;
            if(!oldProdList[billNos]){
                billNo = billNos;
            }else{
                newProdList[billNos] = oldProdList[billNos];
            }
        }

        if(billNo){
            this.props.asyncFetchSaleById(billNo, this.props.unitPriceSource, res=>{
                if(res && res.retCode === '0'){
                    let prodList = res.data.prodList;
                    let selectProductCodeArr = [];

                    prodList = prodList.map((item, index) => {
                        item.serial = index + 1;
                        item.displayCode = item.prodCustomNo;
                        item.billNoDisplayCode = item.productCode+"-&-"+billNo;
                        item.quantity = new Decimal(item.quantity);
                        item.unStockOut =  Math.max(0, item.quantity - item.receiverQuantity);
                        if(existKeys && existKeys.indexOf(item.productCode)!== -1){
                            selectProductCodeArr.push(item.billNoDisplayCode);
                        }
                        if(!existKeys){
                            selectProductCodeArr.push(item.billNoDisplayCode);
                        }
                        return item;
                    });

                    oldProdList[billNo] = prodList;

                    //通过单选按钮改变列表数据，需要重新设置innerSelectedRows，并回调给父组件
                    if(selectProductCodeArr.length === 0){
                        //选择的长度为0时，去除当前的单选
                        this.setState({selectedRowKeys: [], selectedRows: []});
                        this.onSelectRowChange([], []);
                    } else {
                        let innerSelectedRows = this.state.innerSelectedRows;
                        let uqAry = this.uq(innerSelectedRows,selectProductCodeArr);
                        this.setState({innerSelectedRows: uqAry});
                        this.props.onSelectInnerRowChange(uqAry);
                        this.setState({prodList: oldProdList});
                    }
                }
            });
        }else{
            //需要处理掉取消选中的订单单号下的物品
            let innerSelectedRows = this.state.innerSelectedRows;
            let changeInnerSelectedRows = [];
            if(JSON.stringify(newProdList) !== {}){
                for(let k in newProdList){
                    let productAry = newProdList[k];
                    for(let m=0;m<productAry.length;m++){
                        let displayCode = productAry[m].billNoDisplayCode;
                        if(innerSelectedRows.indexOf(displayCode) !== -1){
                            changeInnerSelectedRows.push(displayCode);
                        }
                    }
                }
            }
            this.props.onSelectInnerRowChange(changeInnerSelectedRows);
            this.setState({prodList: newProdList,innerSelectedRows:changeInnerSelectedRows});
        }
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
    expandedRowRender = (record,prodList,isFetching) => {
        let billNo = record.billNo;
        prodList = prodList[billNo] || [];
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


        const innerRowSelection = {
            selectedRowKeys: innerSelectedRows,
            onChange: (selectedRowKeys, selectedRows) => {
                let allProdList = this.state.prodList;
                let newSelectedRowKeys = [];
                for(let k in allProdList){
                    if(k === billNo){
                        let productAry = allProdList[k];
                        for(let m=0;m<productAry.length;m++){
                            newSelectedRowKeys.push(productAry[m].billNoDisplayCode)
                        }
                    }
                };

                let needDeleteRowKeys = this.diff(newSelectedRowKeys,selectedRowKeys);
                let lastSelectedRowKeys = [];
                let innerSelectedRows = this.uq(this.state.innerSelectedRows,newSelectedRowKeys);
                for(let t=0;t<innerSelectedRows.length;t++){
                    if(needDeleteRowKeys.indexOf(innerSelectedRows[t]) === -1){
                        lastSelectedRowKeys.push(innerSelectedRows[t]);
                    }
                }
                this.setState({innerSelectedRows: lastSelectedRowKeys});
                this.props.onSelectInnerRowChange(lastSelectedRowKeys);

                if(lastSelectedRowKeys.length === 0){
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
                        rowKey={row=>row.billNoDisplayCode}
                        className={cx(['inner-table','copy-sale'])}
                        rowSelection={ innerRowSelection }
                    />
                </Spin>
            </React.Fragment>
        )
    };

    render() {
        let {prodList, selectedRowKeys} = this.state;
        const {selectType, saleInfoIsFetching} = this.props;

        console.log(selectedRowKeys,'selectedRowKeys');

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
                title: "采购状态", dataIndex: 'purchaseState', width: 150,
                render:(purchaseState) => <span className="txt-clip" title={purchaseStateMap[purchaseState]}>{purchaseStateMap[purchaseState]}</span>
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


        const {saleList} = this.props;
        let dataSource = saleList.getIn(['data', 'list']);
        dataSource = dataSource ? dataSource.toJS() : [];
        let paginationInfo = saleList.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};

        const rowSelection = {
            selectedRowKeys: selectedRowKeys,
            type: selectType || 'checkbox',
            hideSelectAll: true,
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
                {
                    label: "components.copyFromSale.orderList.state",
                    fieldName: 'state',
                    showType: 'simple',
                    options: [
                        {label: intl.get("components.copyFromSale.orderList.state_1"), value: "0"},
                        {label: intl.get("components.copyFromSale.orderList.state_2"), value: "1"}
                    ],
                    defaultValue: '0'
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
                                loading={saleList.get('isFetching')}
                                expandedRowKeys = {this.state.selectedRowKeys} //checkbox选中的列表单号的组合
                                expandedRowRender={(record) => this.expandedRowRender(record,prodList,saleInfoIsFetching)}
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