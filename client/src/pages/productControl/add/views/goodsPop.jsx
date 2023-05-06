import React, {Component} from 'react';
import * as constants from 'utils/constants';
import { Button, Select, Input, InputNumber, message, Dropdown, Menu, Spin } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
const Option = Select.Option;
const Search = Input.Search;
import ListModalTable from 'components/business/listModalTable';
import Pagination from 'components/widgets/pagination';
import FilterToolBar from "components/business/filterToolBar";
import {asyncFetchGoodsList, asyncPopFetchWareByCode, setGoodsListForBom} from 'pages/goods/index/actions';
import SelectGoodsCate from "pages/auxiliary/category/views/selectGoodsCate";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {getCookie} from 'utils/cookie';
import {formatCurrency, removeCurrency} from 'utils/format';
import {fixedDecimal} from "utils/Decimal";
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
    save = (value) => {
        const { record, handleSave } = this.props;
        handleSave({ ...record, quantity:value }, 'quantity');
    };

    render() {
        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            ...restProps
        } = this.props;
        return (
            <td {...restProps}>
                {editable ? (
                    <EditableContext.Consumer>
                        {(form) => {
                            this.form = form;
                            return (
                                <div className={"tb-input-wrap"}>
                                    <Form.Item style={{ margin: 0 }}>
                                        {form.getFieldDecorator(dataIndex, {
                                            initialValue: record[dataIndex],
                                            rules: [{required: true, message: '该项为必填项！'},{
                                                validator: (rules, value, callback) => {
                                                    let quantityDecimalNum = Number(getCookie("quantityDecimalNum")||3);
                                                    let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+ quantityDecimalNum +'})?$/');
                                                    if (value && (Number.isNaN(value) || !reg.test(value))) {
                                                        callback(`整数部分不能超过10位，小数点后不能超过${quantityDecimalNum}位`);
                                                    }
                                                    callback();
                                                }
                                            }],
                                        })(
                                            <InputNumber onChange={this.save} />
                                        )}
                                    </Form.Item>
                                </div>
                            );
                        }}
                    </EditableContext.Consumer>
                ) : restProps.children}
            </td>
        );
    }
}

class goodsPop extends Component{
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            selectedRows: [],
            condition: {}
        }
    }
    componentDidMount(){
        this.fetchData();
    }

    fetchData = (params)=>{
        this.props.asyncFetchGoodsList({...params, scene: 'pop', showBom: 1}, ()=> {
            let selectedRows = this.state.selectedRows;
            if(selectedRows && selectedRows.length > 0){
                selectedRows.forEach(item => {
                    this.props.setGoodsListForBom(item);
                });
            }
        });
    };

    handleSave  = (row, type) => {
        let {selectedRowKeys, selectedRows} = this.state;

        let currentIndex = selectedRowKeys.indexOf(row.key);
        if(selectedRowKeys.length!==0 && currentIndex!==-1){
            selectedRows[currentIndex][type] = row[type];
            this.setState({selectedRows});
        }
        this.props.setGoodsListForBom(row);
    };

    onSelectRowChange = (newSelectedRowKeys,newSelectedRows) => {
        newSelectedRows.forEach(item => {
            if(!item.quantity){
                item.quantity = 1;
            }
            this.props.setGoodsListForBom(item);
        });
        newSelectedRowKeys = newSelectedRows.map(item => item.key);
        this.setState({
            selectedRowKeys:newSelectedRowKeys,
            selectedRows:newSelectedRows
        });
    };

    selectRow = (event,record) => {
        if (event.target && event.target.nodeName !== "INPUT") {
            let {selectedRowKeys, selectedRows} = this.state;
            let currentIndex = selectedRowKeys.indexOf(record.key);
            if(currentIndex < 0){
                selectedRowKeys = [...selectedRowKeys, record.key];
                selectedRows = [...selectedRows, record];
            } else {
                selectedRowKeys.splice(currentIndex, 1);
                selectedRows.splice(currentIndex, 1)
            }
            this.onSelectRowChange(selectedRowKeys,selectedRows);
        }
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
        this.fetchData(params)
    };

    onSearch = (value) => {
        this.doFilter({key: value}, true);
        this.filterToolBarHanler.reset();
    };

    onCategoryChange = (value) => {
        this.doFilter({catCode: value.value});
    };

    //加载当前库存数据
    loadWare = (visible, code) => {
        if (visible) {
            this.props.asyncPopFetchWareByCode(code)
        }
    };

    onOk = ()=>{
        let list = this.state.selectedRows;
        if(!list || list.length===0){
            message.error('请选择单据');
            return;
        }
        let quantityDecimalNum = Number(getCookie("quantityDecimalNum")||3);
        let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+ quantityDecimalNum +'})?$/');
        let uList = _.filter(list, (o)=> !Number.isNaN(o.quantity) && reg.test(o.quantity));
        if(uList.length !== list.length){
            message.error('数量格式错误，请填写正确的格式');
            return;
        }
        let bomList = _.filter(list, (o)=>!!o.bomCode);
        this.props.onOk(list, bomList);
        this.props.onCancel()
    };

    render(){
        let { goodsList } = this.props;
        let quantityDecimalNum = Number(getCookie("quantityDecimalNum")||3);
        let priceDecimalNum =  Number(getCookie("priceDecimalNum")||3);

        let dataSource = goodsList.getIn(['data','list']);
        dataSource = dataSource? dataSource.toJS():[];
        let paginationInfo = goodsList.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};

        let columns = [
            {title: "序号",dataIndex: 'serial',key: 'serial', width: 70},
            {title: "物品编号",dataIndex: 'displayCode', width: 110},
            {title: "物品名称",dataIndex: 'name', width: 250},
            {title: "规格型号",dataIndex: 'description', width: 250},
            {title: "单位", dataIndex: 'unit', width: 70},
            {title: "品牌", dataIndex: 'brand', width: 80},
            {title: "制造商型号", dataIndex: 'produceModel', width: 100},
            {
                title: "总库存", dataIndex: 'currentQuantity',
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
                                            <div className={cx("tit")}>库存详情</div>
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
            {title: "销售数量",dataIndex: 'saleQuantity', width: 100},
            {title: "计划生产数量",dataIndex: 'producedQuantity', width: 100},
            {title: "采购价", dataIndex: 'orderPrice',
                render: (text)=>{
                    const formatText = removeCurrency(formatCurrency(text, priceDecimalNum, true));
                    return <span className="txt-clip" title={formatText}>{formatText && fixedDecimal(formatText,priceDecimalNum)}</span>
                }, width: 120},
            {title: "销售价", dataIndex: 'salePrice',
                render: (text)=>{
                    const formatText = removeCurrency(formatCurrency(text, priceDecimalNum, true));
                    return <span className="txt-clip" title={formatText}>{formatText && fixedDecimal(formatText,priceDecimalNum)}</span>
                }, width: 120
            },
            {title: "选择BOM",dataIndex: 'bomCode', width: 150, fixed: 'right',
                render: (value, record, index) => (
                    <EditableContext.Consumer>
                        {(form) => {
                            this.form = form;
                            return (
                                <div className={"tb-input-wrap"}>
                                    <Form.Item style={{margin: 0}}>
                                        {form.getFieldDecorator('bomCode')(
                                            <Select onChange={(value) => this.handleSave({...record, bomCode: value}, 'bomCode')}>
                                                {
                                                    _.map(record.bomCodes, (bomCode) =>
                                                        <Option key={bomCode} value={bomCode}>
                                                            {bomCode}
                                                        </Option>
                                                    )
                                                }
                                            </Select>
                                        )}
                                    </Form.Item>
                                </div>
                            )}
                        }
                    </EditableContext.Consumer>
                )
            },
            {title: "展开阶数", dataIndex: 'level', width: 150, fixed: 'right',
                render: (value, record, index) => (
                    <EditableContext.Consumer>
                        {(form) => {
                            this.form = form;
                            return (
                                <div className={"tb-input-wrap"}>
                                    <Form.Item style={{margin: 0}}>
                                        {form.getFieldDecorator('level', {
                                            initialValue: '1'
                                        })(
                                            <Select onChange={(value) => this.handleSave({...record, level: value}, 'level')}>
                                                <Option value="1">一阶</Option>
                                                <Option value="2">二阶</Option>
                                                <Option value="3">三阶</Option>
                                            </Select>
                                        )}
                                    </Form.Item>
                                </div>
                            )}
                        }
                    </EditableContext.Consumer>
                )
            },
            {title: "生产数量",dataIndex: 'quantity',editable:true, required: true, fixed: 'right', width: 120},
        ];

        columns = columns.map((col) => {
            if (!col.editable) {
                if(!col.render){
                    col.render = (text) => (<span className="txt-clip" title={text}>{text}</span>)
                }
                return col;
            }
            return {
                ...col,
                title: () => {
                    return (
                        <React.Fragment>
                            {
                                col.required ? (<span className="required">*</span>) : null
                            }
                            {col.title}
                        </React.Fragment>
                    )
                },
                onCell: record => ({
                    record,
                    editable: col.editable,
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

        const rowSelection = {
            selectedRowKeys:this.state.selectedRowKeys,
            type:'radio',
            onChange: this.onSelectRowChange,
            columnWidth: constants.TABLE_COL_WIDTH.SELECTION
        };

        const filterDataSource = {
            prefixComponents: [
                <div className={cx(["list-search"])}>
                    <Search
                        placeholder={"物品编号/商品名称/物品条形码/规格型号"}
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
                    options: [{label: "正常", value: "normal"},
                        {label: "负库存", value: "neg"},
                        {label: "超出上限", value: "upper"},
                        {label: "低于下限", value: "lower"}]
                },
                {
                    label: "components.goodsPop.goodsTab.disableFlag",
                    fieldName: 'disableFlag',
                    options: [{label: "显示", value: '0'},
                        {label: "隐藏", value: '1'}],
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
                                    components={components}
                                    pagination={false}
                                    loading={goodsList.get('isFetching')}
                    />
                </div>
                <div className="cf">
                    <Pagination {...paginationInfo}
                                size="small"
                                onChange={this.onPageInputChange}
                                onShowSizeChange={this.onShowSizeChange}
                    />
                </div>
                <div className={cx('modal-btn')}>
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

const mapStateToProps = (state) => ({
    goodsList: state.getIn(['goodsIndex', 'goodsPopList']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchGoodsList,
        setGoodsListForBom,
        asyncPopFetchWareByCode
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(goodsPop)

