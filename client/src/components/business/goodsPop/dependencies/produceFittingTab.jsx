import React, {Component} from 'react';
import intl from 'react-intl-universal';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Table, InputNumber, Input, Select } from 'antd';
const Option = Select.Option;
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {actions as fittingActions} from "pages/multiBom/index";
import * as constants from 'utils/constants';
import ListModalTable from 'components/business/listModalTable';
import Pagination from 'components/widgets/pagination';
import FilterToolBar from "../../filterToolBar/views";
import {getCookie} from 'utils/cookie';

const cx = classNames.bind(styles);

function difference(first, second) {
    var out = [];
    var idx = 0;
    var firstLen = first.length;
    var secondLen = second.length;
    var toFilterOut = new Set([]);

    for (var i = 0; i < secondLen; i += 1) {
        toFilterOut.add(second[i]);
    }

    while (idx < firstLen) {
        if (!toFilterOut.has(first[idx])) {
            out[out.length] = first[idx];
        }
        idx += 1;
    }
    return out;
}

const FormItem = Form.Item;
const EditableContext = React.createContext();

const Search = Input.Search;

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {

    save = (value) => {
        const { record, handleSave } = this.props;
        handleSave({ ...record, quantity:value });
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
                                    <FormItem style={{ margin: 0 }}>
                                        {form.getFieldDecorator(dataIndex, {
                                            initialValue: record[dataIndex],
                                            rules: [{
                                                validator: (rules, value, callback) => {
                                                    let quantityDecimalNum = Number(getCookie("quantityDecimalNum")||3);
                                                    let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+ quantityDecimalNum +'})?$/');
                                                    if (Number.isNaN(value) || !reg.test(value)) {
                                                        callback(`整数部分不能超过10位，小数点后不能超过${quantityDecimalNum}位`);
                                                    }
                                                    callback();
                                                }
                                            }],
                                        })(
                                            <InputNumber onChange={this.save} />
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

class ProduceFittingTab extends Component{
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

    fetchData = (param)=>{
        let params = param || this.props.condition || null;
        params.isProductionBom = true;  // 只查生产BOM
        this.props.asyncFetchMultiBomList(params, ()=> {
            let selectedRows = this.state.selectedRows;
            if(selectedRows && selectedRows.length > 0){
                // 更新数量， 这这个组件写的很烂，整个需要重写
                selectedRows.forEach(item => {
                    this.props.asyncSetMultiBomQuantity(item);
                });
            }
        });
    };

    onSelectRowChange = (newSelectedRowKeys,newSelectedRows) => {
        let {selectedRowKeys} = this.state;
        if(newSelectedRowKeys.length > selectedRowKeys.length){
            let diffSelectedRowKeys = difference(newSelectedRowKeys, selectedRowKeys);
            let record = newSelectedRows.filter(item => diffSelectedRowKeys.indexOf(item.key) !== -1);
            record.forEach(item => {
                if(!item.quantity){
                    item.quantity = 1;
                }
                this.props.asyncSetMultiBomQuantity(item);
            });
        }
        newSelectedRowKeys = newSelectedRows.map(item => item.key);

        this.setState({
            selectedRowKeys:newSelectedRowKeys,
            selectedRows:newSelectedRows
        });
        this.props.onSelectFittingRowChange(newSelectedRowKeys,newSelectedRows);
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
        this.fetchData(params);
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

    handleSave  = (row) => {
        let {selectedRowKeys, selectedRows} = this.state;

        let currentIndex = selectedRowKeys.indexOf(row.key);
        if(selectedRowKeys.length!=0&&currentIndex!==-1){
            selectedRows[currentIndex].quantity = row.quantity;
            this.props.onSelectFittingRowChange(selectedRowKeys,selectedRows);
            this.setState({selectedRows});
        }
        this.props.asyncSetMultiBomQuantity(row);
    };

    handleSaveForLevel  = (row) => {
        let {selectedRowKeys, selectedRows} = this.state;

        let currentIndex = selectedRowKeys.indexOf(row.key);
        if(selectedRowKeys.length!=0&&currentIndex!==-1){
            selectedRows[currentIndex].level = row.level;
            this.props.onSelectFittingRowChange(selectedRowKeys,selectedRows);
            this.setState({selectedRows});
        }
        this.props.asyncSetMultiBomLevel(row);
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


    render(){
        let columns = [
            {title: "序号",dataIndex: 'serial',key: 'serial', width: 70},
            {title: "BOM编号",dataIndex: 'bomCode',key: 'bomCode', width: 110},
            {title: "版本",dataIndex: 'bomVersion',key: 'bomVersion', width: 70},
            {title: "成品编号",dataIndex: 'prodCustomNo', width: 110},
            {title: "成品名称",dataIndex: 'prodName', width: 250},
            {title: "规格型号",dataIndex: 'descItem', width: 250},
            {title: "展开阶数", dataIndex: 'level', width: 150,  fixed: 'right',
                render: (value, record, index) => (
                    <EditableContext.Consumer>
                        {(form) => {
                            this.form = form;
                            return (
                                <div className={"tb-input-wrap"}>
                                    <FormItem style={{margin: 0}}>
                                        {form.getFieldDecorator('level', {
                                            initialValue: '1'
                                        })(
                                            <Select onChange={(value) => this.handleSaveForLevel({...record, level: value})}>
                                                <Option value="1">一阶</Option>
                                                <Option value="2">二阶</Option>
                                                <Option value="3">三阶</Option>
                                                {/*<Option value="-1">尾阶</Option>*/}
                                            </Select>
                                        )}
                                    </FormItem>
                                </div>
                            )}
                        }
                    </EditableContext.Consumer>
                )
            },
            {title: "数量",dataIndex: 'quantity',editable:true,  fixed: 'right', width: 120},
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

        const {multiBomList} = this.props;
        let dataSource = multiBomList.getIn(['data','list']);
        dataSource = dataSource? dataSource.toJS():[];
        let paginationInfo = multiBomList.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};

        const rowSelection = {
            selectedRowKeys:this.state.selectedRowKeys,
            type:'checkbox',
            onChange: this.onSelectRowChange,
            columnWidth: constants.TABLE_COL_WIDTH.SELECTION
        };

        const filterDataSource = {
            prefixComponents: [
                <div className={cx(["list-search"])}>
                    <Search
                        placeholder={intl.get("components.goodsPop.fittingTab.placeholder")}
                        onSearch={this.onSearch}
                        enterButton
                        allowClear={true}
                    />
                </div>
            ],
            inputComponents:[
                {
                    label:"node.multiBom.rowMaterial",
                    fieldName: 'rowMaterial',
                    placeholder:'原料编号/原料名称/规格型号'
                }
            ],
        };

        return (
            <React.Fragment>
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
                                    rowSelection={rowSelection}
                                    components={components}
                                    pagination={false}
                                    loading={multiBomList.get('isFetching')}
                    />
                </div>
                <div className="cf">
                    <Pagination {...paginationInfo}
                                size="small"
                                onChange={this.onPageInputChange}
                                onShowSizeChange={this.onShowSizeChange}
                    />
                </div>
            </React.Fragment>
        );
    }
}
const mapStateToProps = (state) => ({
    multiBomList: state.getIn(['multiBomIndex', 'multiBomList'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchMultiBomList:fittingActions.asyncFetchMultiBomList,
        asyncSetMultiBomQuantity:fittingActions.asyncSetMultiBomQuantity,
        asyncSetMultiBomLevel:fittingActions.asyncSetMultiBomLevel,
    }, dispatch)
};
export default connect(mapStateToProps, mapDispatchToProps)(ProduceFittingTab)