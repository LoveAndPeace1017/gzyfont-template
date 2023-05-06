import React, {Component} from 'react';
import {formatCurrency, removeCurrency} from 'utils/format';
import * as constants from 'utils/constants';
import { Input, Modal, Spin } from 'antd';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';

import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import Pagination from 'components/widgets/pagination';
import ListModalTable from 'components/business/listModalTable'
import {getCookie} from 'utils/cookie';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {asyncFetchGoodsList} from "pages/goods/index/actions";
const FormItem = Form.Item;
const EditableContext = React.createContext();

const cx = classNames.bind(styles);

const EditableRow = ({form, index, ...props}) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends Component {

    save = (e) => {
        const {record, handleSave} = this.props;
        this.form.validateFields((error, values) => {
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
                                                    let quantityDecimalNum = Number(getCookie("quantityDecimalNum")||3);
                                                    let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+ quantityDecimalNum +'})?$/');
                                                    if(value === '' || value === undefined){
                                                        callback("请先填写数量!");
                                                    }else if (Number.isNaN(value) || !reg.test(value)) {
                                                        callback(`整数部分不能超过10位，小数点后不能超过${quantityDecimalNum}位！`);
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


let initParams = {
    dataSource: [],
    condition: {},
    selectedRowKeys: [],
    selectedRows: [],
};

class SelectMultiSpecGoods extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initParams
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.specGroup !== this.props.specGroup){
            let condition = {...this.state.condition, specFlag: this.props.specGroup};
            this.setState({ condition });
            this.getGoodsList(condition);
        }
    }

    getGoodsList = (params) => {
        console.log(params,'params');
        this.props.asyncFetchGoodsList({...params, scene: 'pop'}, (data) => {
            let dataSource = [];
            if (data.retCode === 0) {
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
        })
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

    onPageInputChange = (page) => {
        this.doFilter({page});
    };

    onShowSizeChange = (current, perPage) => {
        this.doFilter({perPage, page: 1});
    };

    handleOnClose = () => {
        this.setState({
            selectedRowKeys: [],
            selectedRows: [],
        });
        this.props.onCancel && this.props.onCancel();
    };

    handleOnOk = () => {
        let validateFlag = true;
        this.state.selectedRows.forEach(record => {
            record.form && record.form.validateFields((err, values) => {
                if (err) {
                    validateFlag = false;
                    return false;
                }
            });
        });
        if(validateFlag){
            this.props.onOk && this.props.onOk(this.state.selectedRows);
            this.setState({
                selectedRowKeys: [],
                selectedRows: [],
            });
        }
    };

    updateSelectRows = (selectedRowKeys, selectedRows) => {
        console.log('updateSelectRows:', selectedRowKeys, selectedRows);
        this.setState({
            selectedRowKeys,
            selectedRows
        });
    };

    // 点击多选框
    onRowSelect = (record, selected, _selectedRows, nativeEvent) => {
        console.log('onRowSelect:', record, selected, _selectedRows, nativeEvent);
        if (selected) {
            record.form && record.form.validateFields();
            this.updateSelectedRow(record);
        }
        let selectedRowKeys = [...this.state.selectedRowKeys];
        let selectedRows = [...this.state.selectedRows];


        if (selected) {
            selectedRowKeys.push(record.key);
            selectedRows.push(record);
        } else {
            let index = selectedRowKeys.indexOf(record.key);
            selectedRowKeys.splice(index, 1);
            selectedRows.splice(index, 1);
        }

        this.updateSelectRows(selectedRowKeys, selectedRows);
    };

    onSelectAll = (selected, _selectedRows, changeRows) => {
        console.log('onSelectAll:', selected, _selectedRows, changeRows);
        let selectedRowKeys = [...this.state.selectedRowKeys];
        let selectedRows = [...this.state.selectedRows];
        if (selected) {
            let keys = [];
            changeRows.forEach((item) => {
                keys.push(item.key);
                item.form && item.form.validateFields();
                this.updateSelectedRow(item);
            });
            selectedRowKeys = selectedRowKeys.concat(keys);
            selectedRows = selectedRows.concat(changeRows);
        } else {
            let firstKey = changeRows[0].key;
            let len = changeRows.length;
            const index = selectedRowKeys.indexOf(firstKey);
            selectedRowKeys.splice(index, len);
            selectedRows.splice(index, len);
        }
        this.setState({
            selectedRowKeys,
            selectedRows
        });
        this.updateSelectRows(selectedRowKeys, selectedRows);
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

    render(){
        let columns = [
            {title: '序号', dataIndex: 'serial', key: 'serial', width: 70},
            {title: '物品编号', dataIndex: 'displayCode', width: 110},
            {title: '物品名称', dataIndex: 'name', width: 300},
            {title: '规格型号', dataIndex: 'description', width: 300},
            {title: '数量',dataIndex: 'quantity',editable:true, width: 120},
        ];

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


        const rowSelection = {
            selectedRowKeys:this.state.selectedRowKeys,
            type:'checkbox',
            onSelect: this.onRowSelect,
            onSelectAll: this.onSelectAll,
            // onChange: this.onSelectRowChange,
            columnWidth: constants.TABLE_COL_WIDTH.SELECTION
        };

        const {goodsList} = this.props;
        let dataSource = this.state.dataSource;
        let paginationInfo = goodsList.getIn(['data', 'pagination']);
        paginationInfo = paginationInfo ? paginationInfo.toJS() : {};

        return (
            <Modal
                visible={this.props.visible}
                title={'请选择规格'}
                width={'1200'}
                destroyOnClose={true}
                onOk={this.handleOnOk}
                onCancel={this.handleOnClose}
                className={cx("goods-pop") + " list-pop"}
            >
                <ListModalTable dataSource={dataSource} columns={columns}
                                components={components}
                                rowSelection={rowSelection}
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
            </Modal>
        )
    }
}

const mapStateToProps = (state) => ({
    goodsList: state.getIn(['goodsIndex', 'goodsPopList']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchGoodsList,
    }, dispatch)
};
export default connect(mapStateToProps, mapDispatchToProps)(SelectMultiSpecGoods)