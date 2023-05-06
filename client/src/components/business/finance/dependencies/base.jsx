import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import 'url-search-params-polyfill';
import {formatCurrency, removeCurrency} from 'utils/format';

import {
    addGoodsItem,
    removeGoodsItem,
    initGoodsItem,
    emptyDetailData
} from "../actions";

import styles from "../styles/index.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);


export default function financeTable(WrappedComponent) {

    const mapStateToProps = (state) => ({
        ordersInfo: state.getIn(['finance', 'ordersInfo'])
    });

    const mapDispatchToProps = dispatch => {
        return bindActionCreators({
            addGoodsItem,
            removeGoodsItem,
            initGoodsItem,
            emptyDetailData
        }, dispatch)
    };

    return connect(mapStateToProps, mapDispatchToProps)(
        class Base extends Component {

            static defaultProps = {
                dataPrefix: 'prod',
                KEY_CODE_TO_DIRECTION_MAP: {
                    38: 'up',
                    40: 'down',
                    37: 'left',
                    39: 'right'
                }
            };

            dataPrefix = this.props.dataPrefix;
            dataName = Object.assign({}, {
                billNo: 'billNo',
                displayBillNo: 'displayBillNo',
                aggregateAmount: 'aggregateAmount',
                payAmount: 'payAmount',
                waitPay: 'waitPay',
                remarks: 'remarks',
            }, this.props.dataName ? this.props.dataName : {});

            constructor(props) {
                super(props);
                this.state = {
                    selectedLineKey: '',
                    totalAmount: 0
                }
                this.KEY_CODE_TO_DIRECTION_MAP = this.props.KEY_CODE_TO_DIRECTION_MAP;
            }

            includeANotB = (a, b) => {
                return a.concat(b).filter(v => a.includes(v) && !b.includes(v))
            };

            fillGoods = (orderList, insertAllGoodsCallBack) => {

                let selectedIds = orderList.map((item) => {
                    return item.billNo;
                });

                //获取当前单据物品列表中已经存在的物品code
                const existIds = this.getExistIds();

                const needAddIds = this.includeANotB(selectedIds, existIds);

                let needRemoveIds = this.includeANotB(existIds, selectedIds);

                const needAddGoods = [];
                needAddIds.length > 0 && needAddIds.forEach(billNo => {
                    orderList.forEach(item => {
                        if (item.billNo === billNo) {
                            needAddGoods.push(item)
                        }
                    })
                });
                //插入物品
                needAddGoods.length > 0 && this.insertGoods(needAddGoods, insertAllGoodsCallBack);

                //删除物品
                if(needRemoveIds.length > 0){
                    needRemoveIds.forEach(id => {
                        this.removeGoods(id,insertAllGoodsCallBack);
                    });
                }

            };

            removeGoods = (id,insertAllGoodsCallBack) => {
                const {form: {getFieldValue}, ordersInfo} = this.props;
                const dataSource = ordersInfo.get('data').toJS();
                dataSource.forEach((item, index) => {
                    const billNo = getFieldValue(`${this.dataPrefix}[${item.key}].${this.dataName.billNo}`);
                    if (billNo === id) {
                        this.props.removeGoodsItem(index);
                        // this.props.onRemoveGoods && this.props.onRemoveGoods();
                        insertAllGoodsCallBack && insertAllGoodsCallBack([],[item.key]);
                    }
                });
            };

            //填充物品信息
            insertGoods = (goods, insertAllGoodsCallBack) => {
                const {form: {setFieldsValue}, ordersInfo, backCustomerOrSupplier} = this.props;

                const dataSource = ordersInfo.get('data').toJS();

                const emptyKeys = this.findKeyWithEmptyLine(dataSource);

                if (emptyKeys.length > 0) {
                    const needSetGoods = goods.slice(0, emptyKeys.length);
                    needSetGoods.forEach((goodsItem, index) => {
                        setFieldsValue({
                            [`${this.dataPrefix}[${emptyKeys[index]}].${this.dataName.billNo}`]: goodsItem.billNo,
                            [`${this.dataPrefix}[${emptyKeys[index]}].${this.dataName.displayBillNo}`]: goodsItem.displayBillNo,
                            [`${this.dataPrefix}[${emptyKeys[index]}].${this.dataName.aggregateAmount}`]: goodsItem.aggregateAmount,
                            [`${this.dataPrefix}[${emptyKeys[index]}].${this.dataName.payAmount}`]: goodsItem.payAmount,
                            [`${this.dataPrefix}[${emptyKeys[index]}].${this.dataName.waitPay}`]: goodsItem.waitPay
                        });

                        setFieldsValue({
                            [`${this.dataPrefix}[${emptyKeys[index]}].${this.dataName.billNo}`]: goodsItem.billNo,
                        });
                        //除了物品基本信息以外的字段需要填充信息时
                        this.props.onInsertGoods && this.props.onInsertGoods(goodsItem, emptyKeys[index]);
                    });
                    backCustomerOrSupplier && backCustomerOrSupplier(needSetGoods);
                }

                //没有找到空行就新增一行再找
                if (emptyKeys.length === 0 || goods.length > emptyKeys.length) {
                    let needAddGoods = goods.slice(emptyKeys.length);

                    if (this.props.goodsPopCarryFields) {
                        needAddGoods = needAddGoods.map(item => {
                            for (let key in this.props.goodsPopCarryFields) {
                                const fromField = key;
                                const toField = this.props.goodsPopCarryFields[key];
                                item[toField] = item[fromField]
                            }
                            return item;
                        });
                    }

                    needAddGoods = needAddGoods.map((item, index) => {
                        this.props.onInsertGoods && this.props.onInsertGoods(item, dataSource.length + index + 1, dataSource);
                        return item;
                    });

                    //转换字段名称
                    const needAddGoodsData = needAddGoods.map(item => {
                        item[this.dataName.billNo] = item.billNo;
                        item[this.dataName.displayBillNo] = item.displayBillNo;
                        item[this.dataName.aggregateAmount] = item.aggregateAmount;
                        item[this.dataName.payAmount]  = item.payAmount;
                        item[this.dataName.waitPay] =  item.waitPay;
                        item[this.dataName.remarks] = item.remarks;
                        return item;
                    });

                    backCustomerOrSupplier && backCustomerOrSupplier(needAddGoods);
                    this.props.addGoodsItem(dataSource.length, 0, needAddGoodsData);
                }

                insertAllGoodsCallBack && insertAllGoodsCallBack(goods, emptyKeys);
            };

            calcTotal = (goods, emptyKeys) => {
                let totalAmount = goods.reduce(function (total, item) {
                    console.log(item, 'item');
                    let amount = item.waitPay ? item.waitPay : 0;
                    return total + amount;
                });
                console.log(totalAmount, 'totalAmount');
                this.setState({totalAmount: totalAmount});
            };

            getExistIds = () => {
                const {form: {getFieldValue}, ordersInfo} = this.props;
                const dataSource = ordersInfo.get('data').toJS();
                const existIds = dataSource.map(item => {
                    const billNo = getFieldValue(`${this.dataPrefix}[${item.key}].${this.dataName.billNo}`);
                    if (billNo) {
                        return billNo;
                    }
                });
                return existIds.filter(item => item);
            };

            isEmptyLine = (key) => {
                const {form: {getFieldValue}} = this.props;

                const billNo = getFieldValue(`${this.dataPrefix}[${key}].${this.dataName.billNo}`);
                const displayBillNo = getFieldValue(`${this.dataPrefix}[${key}].${this.dataName.displayBillNo}`);
                const aggregateAmount = getFieldValue(`${this.dataPrefix}[${key}].${this.dataName.aggregateAmount}`);
                const payAmount = getFieldValue(`${this.dataPrefix}[${key}].${this.dataName.payAmount}`);
                const waitPay = getFieldValue(`${this.dataPrefix}[${key}].${this.dataName.waitPay}`);

                // const remarks = getFieldValue(`${this.dataPrefix}[${key}].${this.dataName.remarks}`);
                if (billNo || displayBillNo || aggregateAmount || payAmount || waitPay) {
                    return false
                }
                return true
            };

            setSelectedLineKey =(selectedLineKey)=>{
                this.setState({
                    selectedLineKey
                })
            };

            findKeyWithEmptyLine = (dataSource) => {
                let emptyKeys = [];
                for (let i = 0; i < dataSource.length; i++) {
                    //判断空行条件---1、物品几个字段只要有一个存在值就不是空行 2、选择的行 为当前触发弹层显示的行
                    if (this.isEmptyLine(dataSource[i].key)) {
                        emptyKeys.push(dataSource[i].key);
                    }
                }
                return emptyKeys;
            };

            // 键盘移动功能
            tabMove = (keyCode, index, key, columns) => {
                let direction = this.KEY_CODE_TO_DIRECTION_MAP[keyCode];
                if(direction){
                    const {ordersInfo} = this.props;
                    const dataSource = ordersInfo.get('data').toJS();
                    let rowIndex = 0;
                    while(columns[rowIndex].key!==key){
                        rowIndex++;
                    }
                    this[direction+'Move']({columnIndex: index, key, rowIndex, columns, dataSource});
                }
            };

            // 键盘向上移动  38
            upMove = ({columnIndex, key, dataSource}) => {
                let dom;
                while(!dom && columnIndex>0){
                    --columnIndex;
                    dom = document.getElementById(`${this.dataPrefix}[${dataSource[columnIndex].key}].${key}`);
                    if(this.checkDisabled(dom)) dom='' ;
                }
                dom && dom.focus();
            };

            // 键盘向下移动  40
            downMove = ({columnIndex, key, dataSource}) => {
                let dom;
                while(!dom && columnIndex<dataSource.length-1){
                    ++columnIndex;
                    dom = document.getElementById(`${this.dataPrefix}[${dataSource[columnIndex].key}].${key}`);
                    if(this.checkDisabled(dom)) dom='' ;
                }
                dom && dom.focus();
            };

            // 键盘向左移动  37
            leftMove = ({columnIndex, rowIndex, columns, dataSource}) => {
                let dom, key;
                while(!dom && rowIndex>0){
                    key = columns[--rowIndex].key;
                    dom = document.getElementById(`${this.dataPrefix}[${dataSource[columnIndex].key}].${key}`);
                    if(this.checkDisabled(dom)) dom='' ;
                }
                dom && dom.focus();
            };

            // 键盘向右移动  39
            rightMove = ({columnIndex, rowIndex, columns, dataSource}) => {
                let dom, key;
                while(!dom && rowIndex<columns.length-1){
                    key = columns[++rowIndex].key;
                    dom = document.getElementById(`${this.dataPrefix}[${dataSource[columnIndex].key}].${key}`);
                    if(this.checkDisabled(dom)) dom='' ;
                }
                dom && dom.focus();
            };

            checkDisabled = (dom) => {
                if(!dom) return false;
                let jumpFlag = dom.disabled || dom.readonly;
                return jumpFlag;
            };

            render(){
                return <WrappedComponent
                    {...this.props}
                    dataPrefix={this.dataPrefix}
                    dataName={this.dataName}
                    includeANotB={this.includeANotB}
                    fillGoods={this.fillGoods}
                    insertGoods={this.insertGoods}
                    getExistIds={this.getExistIds}
                    isEmptyLine={this.isEmptyLine}
                    setSelectedLineKey={this.setSelectedLineKey}
                    findKeyWithEmptyLine={this.findKeyWithEmptyLine}
                    tabMove={this.tabMove}
                />
            }

        }
    )
}




