import React, {Component} from 'react';
import {connect} from 'react-redux';
import { MinusCircleOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Table, InputNumber } from 'antd';
import defaultOptions from 'utils/validateOptions';
import {formatCurrency, removeCurrency} from 'utils/format';
import intl from 'react-intl-universal';
const TextArea = Input.TextArea;

import classNames from "classnames/bind";
import styles from "../styles/index.scss";
import {bindActionCreators} from "redux";
const cx = classNames.bind(styles);

import SelectGoodsOrFitting from 'components/business/goodsPop';
import {actions as fittingActions} from '../../index'
import {reducer as fittingIndex} from "../../index";
import * as constants from 'utils/constants';
import ListModalTable from 'components/business/listModalTable';
import {getCookie} from 'utils/cookie';
import {fixedDecimal} from "utils/Decimal";
const FormItem = Form.Item;
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
        console.log('save:',value);
        this.form.validateFields((error, values) => {
            if (error ) {
                return;
            }
            handleSave({ ...record, quantity:value.target.defaultValue });
        });

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
                                <div className="tb-input-wrap">
                                    <FormItem style={{ margin: 0 }}>
                                        {form.getFieldDecorator(dataIndex, {
                                            initialValue: record[dataIndex],
                                            ...defaultOptions,
                                            rules: [
                                                {
                                                    required:true,
                                                    message: intl.get("fitting.add.rule1")
                                                },
                                                {
                                                    validator: (rules, value, callback) => {
                                                        let quantityDecimalNum = Number(getCookie("quantityDecimalNum")||3);
                                                        let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+ quantityDecimalNum +'})?$/');
                                                        if (Number.isNaN(value) || !reg.test(value)) {
                                                            callback(`整数部分不能超过10位，小数点后不能超过${quantityDecimalNum}位`);
                                                        }
                                                        callback();
                                                    }
                                                }
                                            ],
                                        })(
                                            <InputNumber onBlur={this.save} />
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

const defaultGoods = {
    key: 'id-0',
    id: 'id-0',
    serial: 1,
    prodNo: "",
    prodName: "",
    descItem: "",
    unit: "",
    estimatedCost: ""
};

class FittingAddForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            finishProductPopVisible: false,
            goodsPopVisible: false,
            selectedFinishedKey: [],
            selectedProductKeys: [],
            selectedRows: [],
            selectedRowKeys: [],
            condition:{}
        }
    }

    componentDidMount() {
        this.props.getLocalFittingInfo({prodNo:this.props.prodNo,option:this.props.option});
    }

    closeModal = (tag) => {
        this.setState({
            [tag]:false
        })
    };
    openModal = (tag) => {
        this.setState({
            [tag]:true
        })
    };

    selectGoods = (visibleKey) => {
        this.openModal(visibleKey);
        this.setState({
            condition:{
                source: (visibleKey === "finishProductPopVisible") ? 'finishProduct': ''
            }
        });
    };

    onOk = (selectedRows, visibleKey) => {
        this.closeModal(visibleKey);
        selectedRows = selectedRows.filter((row)=>{
           return  row.id!="id-0";
        });
        selectedRows = selectedRows.map((row)=>{
            return  {
                ...row,
                quantity:row.quantity||1
            };
        });
        console.log('fitting ok:',selectedRows);
        let ids = selectedRows.map((item) => item.id);
        if (visibleKey === "finishProductPopVisible") {
            this.setState({selectedFinishedKey: ids[0]});
            this.props.setCurrentFittingInfo('finishedProduct',selectedRows);
        } else {
            this.setState({selectedProductKeys: ids});
            this.props.setCurrentFittingInfo('subProdList',selectedRows);
        }
    };
    updateArray = (target,array)=>{
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
    updateSelectedRow = (row)=>{
        let selectedRows = this.props.fittingList.getIn(['data','fitting','subProdList']).toJS()||[];
        selectedRows = this.updateArray(row,selectedRows);
        return selectedRows;
    };

    handleSave  = (row) => {
        const newData = this.props.fittingList.getIn(['data','fitting','subProdList']).toJS()||[];
        const index = newData.findIndex(item => row.key === item.key);
        if(index >= 0){
            let selectedRows = this.updateSelectedRow(row);
            this.props.setCurrentFittingInfo('subProdList',selectedRows);
            // this.props.form.setFieldsValue({'subProdList':selectedRows});
        }
    };
    remove = (key)=>{
        const subProdList = this.props.fittingList.getIn(['data','fitting','subProdList']).toJS()||[];
        const newData = subProdList.filter((item)=>item.key != key);
        this.props.setCurrentFittingInfo('subProdList',newData);
    };


    render() {

        const {fittingList} = this.props;
        let curFittingInfo = fittingList.getIn(['data','fitting']);
        curFittingInfo = curFittingInfo? curFittingInfo.toJS():{};
        let finishedProduct = curFittingInfo.finishedProduct||[defaultGoods];
        let subProdList = curFittingInfo.subProdList||[defaultGoods];
        let finishedProductId = finishedProduct?finishedProduct[0].prodNo:'';
        let subProdListIds = subProdList.map((item)=>{
            return item.prodNo;
        });
        //数量精度
        let quantityDecimalNum = Number(getCookie("quantityDecimalNum")||3);
        //价格精度
        let priceDecimalNum =  Number(getCookie("priceDecimalNum")||3);

        const {getFieldDecorator} = this.props.form;
        getFieldDecorator('subProdList', {initialValue: subProdList});
        getFieldDecorator('finishedProduct', {initialValue: finishedProduct});
        console.log('subProdList form:',this.props.form.getFieldValue('subProdList'));

        const len = subProdList.length;

        const columns1 = [
            {title: intl.get("fitting.add.prodCustomNo"), dataIndex: 'prodCustomNo'},
            {
                title: intl.get("fitting.add.prodName"), dataIndex: 'prodName',
                render: (prodName, data) => (
                    <React.Fragment>
                        <span>{prodName}</span>
                    </React.Fragment>
                ),
            },
            {title: intl.get("fitting.add.descItem"), dataIndex: 'descItem'},
            {title: intl.get("fitting.add.unit"), dataIndex: 'unit', width: constants.TABLE_COL_WIDTH.UNIT},
            {title: intl.get("fitting.add.estimatedCost"), dataIndex: 'estimatedCost',
                render:(estimatedCost) => (
                    <React.Fragment>
                        <span>{estimatedCost && fixedDecimal(removeCurrency(formatCurrency(estimatedCost, priceDecimalNum, true)),priceDecimalNum)}</span>
                    </React.Fragment>
                )
            },
            {
                title: '', dataIndex: 'choose', width: 100,
                render: () => (
                    <React.Fragment>
                        <span onClick={() => this.selectGoods('finishProductPopVisible')}
                              style={{float: 'right',fontSize: '12px',cursor:'pointer'}}  className={cx("choose-trigger")}>
                            {intl.get("fitting.add.selectGoods")}
                        </span>
                    </React.Fragment>
                ),
            }
        ];
        if(this.props.option==="modify"){
            columns1.splice(1,1,{
                title: intl.get("fitting.add.prodName"), dataIndex: 'prodName'
            });
        }
        let columns2 = [
            {
                title: '', dataIndex: 'ope', width: 50,
                render: (ope, data) => (
                    <div className={cx("field-ope")}>
                        {len > 1 ?
                            <MinusCircleOutlined onClick={() => this.remove(data.prodNo)} /> : ""}
                    </div>
                ),
            },
            {title: intl.get("fitting.add.serial"), dataIndex: 'serial', key: 'serial', width: constants.TABLE_COL_WIDTH.SERIAL},
            {title: intl.get("fitting.add.prodCustomNo"), dataIndex: 'prodCustomNo'},
            {
                title: intl.get("fitting.add.prodName"), dataIndex: 'prodName',
                render: (prodName) => (
                    <React.Fragment>
                        <span>{prodName}</span>
                    </React.Fragment>
                ),
            },
            {title: intl.get("fitting.add.descItem"), dataIndex: 'descItem'},
            {title: intl.get("fitting.add.unit"), dataIndex: 'unit', width: constants.TABLE_COL_WIDTH.UNIT},
            {title: intl.get("fitting.add.orderPrice"), dataIndex: 'orderPrice',
                render: (orderPrice) => (
                    <React.Fragment>
                        <span>{orderPrice && fixedDecimal(orderPrice,priceDecimalNum)}</span>
                    </React.Fragment>
                )},
            {title: <span><span className={'required'}>*</span>{intl.get("fitting.add.quantity")}</span>, dataIndex: 'quantity',editable:true,},
            {
                title: '', dataIndex: 'choose', width: 100,
                render: () => (
                    <React.Fragment>
                        <span onClick={() => this.selectGoods('goodsPopVisible')}
                              style={{float: 'right',fontSize: '12px',cursor:'pointer'}} className={cx("choose-trigger")}>
                            {intl.get("fitting.add.selectGoods")}
                        </span>
                    </React.Fragment>
                ),
            }
        ];
        columns2 = columns2.map((col) => {
            if (!col.editable) {
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
        return (
            <React.Fragment>
                <Form >
                    <div className={cx('fitting-add-hd')}>{intl.get("fitting.add.title1")}</div>
                    <Table dataSource={finishedProduct} className={cx("tb-finished-prod")} columns={columns1}
                           pagination={false}
                    />
                    <div className={cx('fitting-add-hd')}>{intl.get("fitting.add.title2")}</div>
                    <ListModalTable dataSource={subProdList} className="tb-account" columns={columns2}
                           pagination={false} components={components} tableScrollHeight={-172}
                    />
                    <div className={cx('fitting-add-hd')}>{intl.get("fitting.add.remarks")}</div>
                    <Form.Item
                    >
                        {
                            getFieldDecorator("remarks", {
                                initialValue: curFittingInfo.remarks,
                                ...defaultOptions
                            })(
                                <TextArea rows={4} placeholder={intl.get("fitting.add.remarks")} maxLength={1000}/>
                            )
                        }
                    </Form.Item>
                </Form>
                <SelectGoodsOrFitting
                    visible={this.state.finishProductPopVisible}
                    visibleFlag={'finishProductPopVisible'}
                    onOk={this.onOk}
                    onCancel={() => this.closeModal('finishProductPopVisible')}
                    selectType={"radio"}
                    popType={'goods'}
                    selectedRowKeys={finishedProductId}
                    selectedRows={finishedProduct}
                    condition={this.state.condition}
                />
                <SelectGoodsOrFitting
                    visible={this.state.goodsPopVisible}
                    visibleFlag={'goodsPopVisible'}
                    onOk={this.onOk}
                    onCancel={() => this.closeModal('goodsPopVisible')}
                    selectType={"checkbox"}
                    popType={'goods'}
                    selectedRowKeys={subProdListIds}
                    selectedRows={subProdList}
                    condition={this.state.condition}
                    editFields={[{
                        dataIndex:'quantity',
                        editable:true,
                        title:intl.get("fitting.add.quantity"),
                        width: 110
                    }]}
                />
            </React.Fragment>

        );
    }
}


const mapStateToProps = (state) => ({
    fittingList: state.getIn(['fittingIndex', 'fittingList']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        getLocalFittingInfo:fittingActions.getLocalFittingInfo,
        setCurrentFittingInfo:fittingActions.setCurrentFittingInfo,
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(FittingAddForm))
