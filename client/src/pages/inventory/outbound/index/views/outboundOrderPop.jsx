import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as constants from 'utils/constants';
import {getCookie} from 'utils/cookie';
import { Dropdown, Button, Form, message, Menu, Spin } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import ListModalTable from 'components/business/listModalTable';
import Pagination from 'components/widgets/pagination';
import FilterToolBar from "components/business/filterToolBar";
import SuggestSearch from 'components/business/suggestSearch';
import {asyncFetchOutboundOrderList,asyncFetchProdAbstractByBillNo} from "../actions";
import moment from "moment-timezone/index";
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

/**
 *
 * @visibleName OutboundOrderPop（出库单弹层列表）
 * @author jinb
 * @date 2021-12-20
 */
const mapStateToProps = (state) => ({
    outboundOrderList: state.getIn(['outboundOrderIndex', 'outboundOrderList']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchOutboundOrderList,
        asyncFetchProdAbstractByBillNo
    }, dispatch)
};

@connect(mapStateToProps, mapDispatchToProps)
export default class OutboundOrderPop extends Component{
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            selectedRows: [],
            originCondition: {},
            condition: {}
        }
    }
    componentDidMount(){
        this.fetchData();
    }

    fetchData = (params, callback)=>{
        this.props.asyncFetchOutboundOrderList(params, callback);
    };

    // 点击多选框
    onRowSelect = (record, selected) => {
        let {selectType} = this.props;
        let selectedRowKeys = [...this.state.selectedRowKeys];
        let selectedRows = [...this.state.selectedRows];
        if (selectType === 'radio') {
            selectedRowKeys = [record.key];
            selectedRows = [record];
        } else {
            if (selected) {
                selectedRowKeys.push(record.key);
                selectedRows.push(record);
            } else {
                let index = _.indexOf(selectedRowKeys, record.key);
                selectedRowKeys.splice(index, 1);
                selectedRows.splice(index, 1);
            }
        }
        this.updateSelectRows(selectedRowKeys, selectedRows);
    };

    // 全选
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
        this.updateSelectRows(selectedRowKeys, selectedRows);
    };

    updateSelectRows = (selectedRowKeys, selectedRows) => {
        console.log('updateSelectRows:', selectedRowKeys, selectedRows);
        this.setState({
            selectedRowKeys,
            selectedRows
        });
    };

    onPageInputChange = (page,perPage) => {
        this.doFilter({page,perPage});
    };
    onShowSizeChange = (current, perPage) => {
        this.doFilter({perPage, page: 1});
    };

    doFilter = (condition, resetFlag) => {
        let params = this.state.condition;
        if (resetFlag) {
            params = this.state.originCondition;
        }
        params = {
            ...params,
            ...condition
        };
        this.setState({
            condition: params
        });

        for (const key in params) {
            if (!params[key]) {
                delete params[key];
            }
        }
        this.fetchData(params)
    };

    onSearch = (value) => {
        this.doFilter({key: value}, true);
        this.filterToolBarHanler.reset();
    };

    onOk = ()=>{
        let list = this.state.selectedRows;
        if(!list || list.length===0){
            message.error('请选择单据');
            return;
        }
        this.props.onOk(list);
        this.props.onCancel();
    };

    //加载当前物品概要数据
    loadWare = (visible, billNo) => {
        const {outboundOrderList} = this.props;
        const dataSource = outboundOrderList.getIn(['data', 'list']);
        const hasCache = dataSource.filter(item => {
            return item.get('billNo') === billNo && item.get('prodAbstractList')
        }).size > 0;
        if (visible && !hasCache) {
            this.props.asyncFetchProdAbstractByBillNo(billNo)
        }
    };

    render(){
        let { outboundOrderList, selectType } = this.props;
        let dataSource = outboundOrderList.getIn(['data','list']);
        dataSource = dataSource? dataSource.toJS():[];
        let paginationInfo = outboundOrderList.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};

        let columns = [
            {title: "序号",dataIndex: 'serial', width: 70},
            {title: "出库单号",dataIndex: 'displayBillNo', width: 110},
            {title: "出库类型",dataIndex: 'outType', width: 100,
                render: (outType) => {
                    if(outType){
                        return intl.get(outType)
                    }
                }
            },
            {title: "上游单号",dataIndex: 'billNo', width: 150,
                render: (billNo, data) => {
                    return data.displaySaleOrderNo || data.displayOrderNo || data.wwBillNo || data.fkProduceNo
                }
            },
            {title: "客户订单号",dataIndex: 'customerOrderNo', width: 150},
            {title: "出库日期",dataIndex: 'outDate', width: 150,
                render: (outDate) => (<span>{moment(outDate).format('YYYY-MM-DD')}</span>)
            },
            {title: "物品概要",dataIndex: 'prodAbstract', width: 200,
                render: (prodAbstract, data) => (
                    <Dropdown
                        onVisibleChange={(visible) => this.loadWare(visible, data.billNo)}
                        overlay={() => (
                            <Menu className={cx('abstract-drop-menu')}>
                                <Menu.Item>
                                    <Spin
                                        spinning={data.prodAbstractIsFetching}
                                    >
                                        <div className={cx("abstract-drop")}>
                                            <div className={cx("tit")}>物品概要</div>
                                            <ul>
                                                {
                                                    data.prodAbstractList && data.prodAbstractList.map((item, index) =>
                                                        <li key={index}>
                                                            <span className={cx('prod-tit')}>{item.prodName}</span>
                                                            <span className={cx('prod-desc')}>{item.descItem}</span>
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
                                <span className={cx("txt-desc-no") + ' txt-clip'} title={prodAbstract}>{prodAbstract}</span>
                                <DownOutlined className="ml5" />
                            </span>
                    </Dropdown>)
            },
        ];

        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            type: selectType || 'checkbox',
            onSelect: this.onRowSelect,
            onSelectAll: this.onSelectAll,
            columnWidth: constants.TABLE_COL_WIDTH.SELECTION
        };

        const filterDataSource = {
            prefixComponents: [
                <div className={cx(["list-search"])}>
                    <SuggestSearch
                        placeholder={"出库单号/出库方/物品编号/物品名称"}
                        onSearch={this.onSearch}
                        urlPrefix={`/pc/v1/`}
                        url={`/outwares/search/tips`}
                    />
                </div>
            ],
            selectComponents: [
                {
                    label: "node.inventory.out.outType",
                    fieldName: 'outType',
                    options:[
                        {label:'node.inventory.out.outTypeOption1',value:'0'},
                        {label:'node.inventory.out.outTypeOption2',value:'1'},
                        {label:'node.inventory.out.outTypeOption3',value:'2'},
                        {label:'node.inventory.out.outTypeOption4',value:'3'},
                        {label:'node.inventory.out.outTypeOption5',value:'5'},
                        {label:'node.inventory.out.outTypeOption6',value:'4'},
                        {label:'node.inventory.out.outTypeOption7',value:'6'},
                        {label:'node.inventory.out.outTypeOption8',value:'7'},
                    ],
                }
            ],
            inputComponents: [
                {
                    label:"node.inventory.out.saleBillNo",
                    fieldName: 'saleBillNo',
                    width:'150',
                    placeholder:'上游订单'
                },
                {
                    label:"node.inventory.out.customerOrderNo",
                    fieldName: 'customerOrderNo',
                    width:'150',
                    placeholder:'客户订单号'
                }
            ],
            datePickerComponents: [
                {
                    label:"node.inventory.out.outDate",
                    fieldName:'out',
                }
            ]
        };

        return(
            <Form style={{overflow: 'hidden'}}>
                <div className={cx("ope-bar-lst")}>
                    <FilterToolBar
                        dataSource={filterDataSource}
                        doFilter={this.doFilter}
                        ref={(child) => {
                            this.filterToolBarHanler = child;
                        }}
                    />
                </div>
                <div className="mt10">
                    <ListModalTable dataSource={dataSource} columns={columns}
                                    isNeedDrag={true}
                                    className={cx('sale-order-pop')}
                                    rowSelection={rowSelection}
                                    pagination={false}
                                    loading={outboundOrderList.get('isFetching')}
                    />
                </div>
                <div className="cf">
                    <Pagination {...paginationInfo}
                                size="small"
                                onChange={this.onPageInputChange}
                                onShowSizeChange={this.onShowSizeChange}
                    />
                </div>
                <div style={{ float: 'right', paddingTop: '20px'}}>
                    <Button type="primary" onClick={this.onOk}>
                        确定
                    </Button>
                    <Button onClick={this.props.onCancel} style={{marginLeft: 10}}>
                        取消
                    </Button>
                </div>
            </Form>

        )
    }
}



