import React, {Component} from 'react';
import intl from 'react-intl-universal';
import { DownOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Statistic, Table, InputNumber, Dropdown, Menu, Spin } from 'antd';

const Search = Input.Search;

import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import SelectGoodsCate from "pages/auxiliary/category/views/selectGoodsCate";
import Tooltip from 'components/widgets/tooltip';
import {reducer as goodsIndex} from 'pages/goods/index';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import Pagination from 'components/widgets/pagination';
import FilterToolBar from "../../filterToolBar/views";
import {getCookie} from 'utils/cookie';
import {fixedDecimal} from "utils/Decimal";
import * as constants from 'utils/constants';
import ListModalTable from 'components/business/listModalTable'
import {formatCurrency, removeCurrency} from 'utils/format';
import {asyncFetchGoodsList, asyncPopFetchWareByCode} from "pages/goods/index/actions";
import {fromJS} from "immutable";

const cx = classNames.bind(styles);

const FormItem = Form.Item;
const EditableContext = React.createContext();

const EditableRow = ({form, index, ...props}) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {

    save = (e) => {
        const {record, handleSave, dataIndex} = this.props;
        this.form.validateFields((error, values) => {
            if(dataIndex === 'quantity' && !values.quantity){
                handleSave({...record, ...values});
            }
            if (error && error[e.currentTarget.id]) {
                return;
            }
            handleSave({...record, ...values});
        });
    };

    render() {
        const {
            editable,
            nullEditable,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            ...restProps
        } = this.props;

        return (
            <td {...restProps}>
                {dataIndex && (nullEditable && record.editable || editable) ? (
                    <EditableContext.Consumer>
                        {(form) => {
                            this.form = form;
                            record.form = form;
                            return (
                                <div className="tb-input-wrap">
                                    <FormItem style={{margin: 0}}>
                                        {form.getFieldDecorator(dataIndex, {
                                            initialValue: record[dataIndex],
                                            rules: [{
                                                validator: (rules, value, callback) => {
                                                    const reg = /^(0|[1-9]\d{0,9})(\.\d{1,3})?$/;
                                                    if(value === '' || value === undefined){
                                                        if(dataIndex === 'quantity'){ //这边一开始是写死的，暂时这么改
                                                            callback(intl.get("components.goodsPop.goodsTab.quantityMessage1"));
                                                        } else {
                                                            callback(intl.get("components.goodsPop.goodsTab.quantityMessage2"))
                                                        }
                                                    }else if (Number.isNaN(value) || !reg.test(value)) {
                                                        callback(intl.get("components.goodsPop.goodsTab.quantityMessage3"))
                                                    }
                                                    callback();
                                                }
                                            }],
                                        })(
                                            <Input
                                                ref={node => (this.input = node)}
                                                onPressEnter={this.save}
                                                onBlur={this.save}
                                            />
                                        )}
                                    </FormItem>
                                </div>
                            );
                        }}
                    </EditableContext.Consumer>
                ) : restProps.children}
            </td>
        );
    }
}


class GoodsTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            selectedRowKeys: [],
            selectedRows: [],
            currentPageData: [],
            currentPageNum: 1,
            condition: {},
            salePriceEditable: this.props.salePriceEditable || false,
        }
    }

    getGoodsList = (params) => {
        console.log(params,'params');
        this.props.asyncFetchGoodsList({...params, scene: 'pop'}, (data) => {
            let dataSource = [];
            if (data.retCode == '0') {
                dataSource = data.list || [];
                let selectedRow = [...this.state.selectedRows];
                for (let i = 0; i < dataSource.length; i++) {
                    let item = dataSource[i];
                    item.wareIsFetching = true;
                    item.editable = !item.salePrice;
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
        this.props.display?this.props.condition.disableFlag = "0":null;
        console.log('componentDidMount:', this.props.selectedRowKeys, this.props.selectedRows);
        this.setState({
            selectedRowKeys: this.props.selectedRowKeys || [],
            selectedRows: this.props.selectedRows || [],
            condition: this.props.condition,
            originCondition: this.props.condition,
            salePriceEditable: this.props.salePriceEditable || false
        }, () => {
            this.getGoodsList(this.props.condition);
        });
        // 强制更新父组件中的默认数据
        this.props.onSelectRowChange(this.props.selectedRowKeys, this.props.selectedRows);
    }

    onCategoryChange = (value) => {
        this.doFilter({catCode: value.value});
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
        this.getGoodsList(params);
    };
    onSearch = (value) => {
        this.doFilter({key: value}, false);
        //this.filterToolBarHanler.reset();
    };
    onPageInputChange = (page,perPage) => {
        this.doFilter({page,perPage});
    };
    onShowSizeChange = (current, perPage) => {
        this.doFilter({perPage, page: 1});
    };

    updateSelectRows = (selectedRowKeys, selectedRows) => {
        console.log('updateSelectRows:', selectedRowKeys, selectedRows);
        this.setState({
            selectedRowKeys,
            selectedRows
        });
        this.props.onSelectRowChange(selectedRowKeys, selectedRows);
    };

    // 点击多选框
    onRowSelect = (record, selected, _selectedRows, nativeEvent) => {
        console.log('onRowSelect:', record, selected, _selectedRows, nativeEvent);
        if (selected && !record.salePrice && this.state.salePriceEditable) {
            if(record.form){
                record.form.validateFields();
            }
            this.updateSelectedRow(record);
        }
        let selectedRowKeys = [...this.state.selectedRowKeys];
        let selectedRows = [...this.state.selectedRows];

        const {selectType, editFields} = this.props;
        let quantityFlag = false;
        if(editFields){
            quantityFlag = editFields.filter(item => item.dataIndex === 'quantity').length > 0;
        }
        if(selected && quantityFlag && !record.quantity){
            record.quantity = 1;
            record.form.setFieldsValue({quantity: 1});
        }

        if (selectType === 'radio') {
            selectedRowKeys = [record.key];
            selectedRows = [record];
        } else {
            if (selected) {
                selectedRowKeys.push(record.key);
                selectedRows.push(record);
            } else {
                let index = selectedRowKeys.indexOf(record.key);
                selectedRowKeys.splice(index, 1);
                selectedRows.splice(index, 1);
            }
        }

        this.updateSelectRows(selectedRowKeys, selectedRows);
    };
    onSelectAll = (selected, _selectedRows, changeRows) => {
        let selectedRowKeys = [...this.state.selectedRowKeys];
        let selectedRows = [...this.state.selectedRows];
        let _this = this;
        let quantityFlag = false;
        if(this.props.editFields){
            quantityFlag = this.props.editFields.filter(item => item.dataIndex === 'quantity').length > 0;
        }
        if (selected) {
            let keys = [];
            changeRows.forEach((item) => {
                keys.push(item.key);
                if (!item.salePrice && _this.state.salePriceEditable) {
                    // item.salePrice = undefined;
                    item.form && item.form.validateFields();
                    this.updateSelectedRow(item);
                }
                if(quantityFlag && !item.quantity){
                    item.quantity = 1;
                    item.form.setFieldsValue({quantity: 1});
                }
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
        this.setState({
            selectedRowKeys,
            selectedRows
        });
        this.updateSelectRows(selectedRowKeys, selectedRows);


    };
    // 点击行
    selectRow = (event, record) => {
        if (event.target && event.target.nodeName !== "INPUT" && event.target.nodeName !== "TD" && event.target.nodeName !== "TR") {
            let selectedRowKeys = [...this.state.selectedRowKeys];
            let selectedRows = [...this.state.selectedRows];
            const {selectType} = this.props;
            if (selectType === 'radio') {
                selectedRowKeys = [record.key];
                selectedRows = [record];
                this.updateSelectRows(selectedRowKeys, selectedRows);
            } else {
                let selected = selectedRowKeys.indexOf(record.key) < 0;
                this.onRowSelect(record, selected);
            }
        }
    };

    updateArray = (target, array) => {
        const index = array.findIndex(item => target.key === item.key);
        const item = array[index];
        array.splice(index, 1, {
            ...item,
            ...target,
        });
        return array;
    };
    // 更新当前选中行的数据
    // 为了解决setState异步跟新问题，必须返回计算后的值
    updateSelectedRow = (row) => {
        let selectedRows = [...this.state.selectedRows];
        selectedRows = this.updateArray(row, selectedRows);
        this.setState({selectedRows: selectedRows});
        return selectedRows;
    };

    handleSave = (row) => {
        const newData = [...this.state.dataSource];
        if (this.state.selectedRowKeys.indexOf(row.key) >= 0) {
            let selectedRows = this.updateSelectedRow(row);
            this.updateSelectRows(this.state.selectedRowKeys, selectedRows);
        }
        this.setState({dataSource: this.updateArray(row, newData)});
    };

    //加载当前库存数据
    loadWare = (visible, code) => {
        const dataSource = this.state.dataSource;
        const hasCache = dataSource.filter(item => {
            return item.code === code && item.wareList
        }).length > 0;
        if (visible && !hasCache) {
            this.props.asyncPopFetchWareByCode(code, (data) => {
                if (data && data.retCode == 0) {
                    let newDataSource = this.state.dataSource.map(item => {
                        if(item.code === code){
                            item.wareIsFetching = false;
                            item.wareList = data.data;
                        }
                        return item;
                    });
                    this.setState({dataSource: newDataSource})
                }
            })
        }
    };

    render() {
        const {selectType, editFields, hideFields=[]} = this.props;
        let quantityDecimalNum = Number(getCookie("quantityDecimalNum")||3);
        let priceDecimalNum =  Number(getCookie("priceDecimalNum")||3);
        let columns = [
            {title: intl.get("components.goodsPop.goodsTab.serial"), dataIndex: 'serial', key: 'serial', width: 70, render: (text, data, index) => <span>{index+1}</span>},
            {title: intl.get("components.goodsPop.goodsTab.displayCode"), dataIndex: 'displayCode', width: 110},
            {title: intl.get("components.goodsPop.goodsTab.name"), dataIndex: 'name', width: 200},
            {title: intl.get("components.goodsPop.goodsTab.description"), dataIndex: 'description', width: 200},
            {title: intl.get("components.goodsPop.goodsTab.unit"), dataIndex: 'unit', width: 70},
            {title: intl.get("components.goodsPop.goodsTab.brand"), dataIndex: 'brand', width: 80},
            {title: intl.get("components.goodsPop.goodsTab.produceModel"), dataIndex: 'produceModel', width: 100},
            {
                title: intl.get("components.goodsPop.goodsTab.currentQuantity"), dataIndex: 'currentQuantity',
                render: (currentQuantity, data) => (
                    <Dropdown
                        onVisibleChange={(visible) => this.loadWare(visible, data.code)}
                        overlay={() => (
                            <Menu className={cx('ware-drop-menu')}>
                                <Menu.Item>
                                    <Spin
                                        spinning={data.wareIsFetching}
                                    >
                                        <div className={cx("ware-drop")}>
                                            <div className={cx("tit")}>{intl.get("components.goodsPop.goodsTab.stockDetail")}</div>
                                            <ul>
                                                {
                                                    data.wareList && data.wareList.map((item, index) =>
                                                        <li key={index}>
                                                            {item.warehouseName}：{item.currentQuantity}
                                                        </li>
                                                    )
                                                }
                                            </ul>
                                        </div>
                                    </Spin>
                                </Menu.Item>

                            </Menu>
                        )}>
                        <span>{currentQuantity && fixedDecimal(currentQuantity,quantityDecimalNum)}<DownOutlined className="ml5" /></span>
                    </Dropdown>
                ),
                width: 120
            },
            {title: intl.get("components.goodsPop.goodsTab.orderPrice"), dataIndex: 'orderPrice',
            render: (text)=>{
                const formatText = removeCurrency(formatCurrency(text, priceDecimalNum, true));
                return <span className="txt-clip" title={formatText}>{formatText && fixedDecimal(formatText,priceDecimalNum)}</span>
            }, width: 120},
            {title: intl.get("components.goodsPop.goodsTab.salePrice"), dataIndex: 'salePrice', nullEditable: this.state.salePriceEditable,
                render: (text)=>{
                    const formatText = removeCurrency(formatCurrency(text, priceDecimalNum, true));
                    return <span className="txt-clip" title={formatText}>{formatText && fixedDecimal(formatText,priceDecimalNum)}</span>
                }, width: 120
            }
        ];
        editFields && editFields.forEach((item) => {
            columns.push({
                ...item,
                editable: item.editable,
                nullEditable: item.nullEditable
            });
        });

        // 过滤调需要隐藏的字段
        columns = columns.filter(item => hideFields.indexOf(item.dataIndex)===-1);

        columns = columns.map((col) => {
            if (!(col.editable || col.nullEditable)) {
                if (!col.render) {
                    col.render = (text) => (<span className="txt-clip" title={text}>{text}</span>)
                }
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    editable: col.editable,
                    nullEditable: col.nullEditable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });


        const components = {
            body: {
                row: EditableFormRow,
                cell: EditableCell,
            },
        };

        const {goodsList} = this.props;
        let dataSource = this.state.dataSource;
        let paginationInfo = goodsList.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};

        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            type: selectType || 'checkbox',
            // onChange: this.onSelectRowChange,
            onSelect: this.onRowSelect,
            onSelectAll: this.onSelectAll,
            columnWidth: constants.TABLE_COL_WIDTH.SELECTION
        };

        const filterDataSource = {
            prefixComponents: [
                <div className={cx(["list-search"])}>
                    <Search
                        placeholder={intl.get("components.goodsPop.goodsTab.placeholder")}
                        onSearch={this.onSearch}
                        enterButton
                        allowClear={true}
                    />
                </div>,
                <SelectGoodsCate hideManage onChange={this.onCategoryChange}/>
            ],
            selectComponents: [
                {
                    label: "components.goodsPop.goodsTab.wareState",
                    fieldName: 'wareState',
                    options: [{label: intl.get("components.goodsPop.goodsTab.wareState_1"), value: "normal"},
                        {label: intl.get("components.goodsPop.goodsTab.wareState_2"), value: "neg"},
                        {label: intl.get("components.goodsPop.goodsTab.wareState_3"), value: "upper"},
                        {label: intl.get("components.goodsPop.goodsTab.wareState_4"), value: "lower"}]
                },
                {
                    label: "components.goodsPop.goodsTab.disableFlag",
                    fieldName: 'disableFlag',
                    options: [{label: intl.get("components.goodsPop.goodsTab.show"), value: '0'},
                        {label: intl.get("components.goodsPop.goodsTab.disabled"), value: '1'}],
                    defaultValue: this.props.display?"0":""
                },
                {
                    label: "node.goods.expirationFlag",
                    fieldName: 'expirationFlag',
                    options: [{label: '是', value: '1'},
                        {label: '否', value: '0'}]
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
                                components={components}
                                onRow={
                                    (record) => {
                                        return {
                                            onClick: (event) => this.selectRow(event, record)
                                        }
                                    }}
                                isNeedDrag={true}
                                pagination={false}
                                loading={goodsList.get('isFetching')}
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
}
const mapStateToProps = (state) => ({
    goodsList: state.getIn(['goodsIndex', 'goodsPopList']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchGoodsList,
        asyncPopFetchWareByCode
    }, dispatch)
};
export default connect(mapStateToProps, mapDispatchToProps)(GoodsTab)