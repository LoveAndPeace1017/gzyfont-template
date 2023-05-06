import React, {Component} from 'react';
import 'url-search-params-polyfill';
import {formatCurrency, removeCurrency} from 'utils/format';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import moment from "moment-timezone/index";

const cx = classNames.bind(styles);

export default class Base extends Component {

    static defaultProps = {
        dataPrefix: 'prod',
        KEY_CODE_TO_DIRECTION_MAP: {
            38: 'up',
            40: 'down',
            37: 'left',
            39: 'right'
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            selectedLineKey: ''
        };
        this.defaultDataName = {
            id: 'id',  // 修改时物品id
            productCode: 'productCode',
            prodCustomNo: 'prodCustomNo',
            prodName: 'prodName',
            descItem: 'descItem',
            unit: 'unit',
            brand: 'brand',
            produceModel: 'produceModel',
            quantity: 'quantity',
            amount: 'amount',
            unitCost: 'unitCost',  // 单位成本
            allocatedPrice: 'allocatedPrice',  //分摊后单价
            allocatedAmount: 'allocatedAmount',  // 分摊后金额
            remarks: 'remarks',
            batchNo: 'batchNo',  // 批次号
            expirationFlag: 'expirationFlag',  // 批次号是否启用
            expirationDay: 'expirationDay',  // 保质期时间
            productionDate: 'productionDate',  // 生产日期
            expirationDate: 'expirationDate',  // 到期日期
            batchnoFlag: 'batchnoFlag',  // 批次号是否存在
        };
        this.dataPrefix = this.props.dataPrefix;
        this.KEY_CODE_TO_DIRECTION_MAP = this.props.KEY_CODE_TO_DIRECTION_MAP;
        this.dataName = Object.assign({}, this.defaultDataName, this.props.dataName ? this.props.dataName : {});
    }

    includeANotB = (a, b) => {
        return a.concat(b).filter(v => a.includes(v) && !b.includes(v))
    };

    getNeedAddObjs= (selectedObjs, existIds)=>{
        return selectedObjs.filter(item=>{
            return existIds.length === 0 || !existIds.includes(item.productCode)
        })
    };

    getNeedRemoveIds= (existIds, selectedObjs)=>{
        return existIds.filter(item=>{
            return selectedObjs.length === 0 || !selectedObjs.some(selectObj =>{
                return selectObj.productCode === item;
            })
        })
    };


    fillGoods = (prodList, source, insertExistsLineCallBack, insertInExistsLineCallBack, insertAllGoodsCallBack, removeAllGoodsCallBack) => {

        let selectedObjs = prodList.map((item) => {
            item.rnd = Math.random();  //为了解决重复物品选择到问题加了这个
            return {
                productCode: item.productCode,
                rnd: item.rnd
            };
        });

        //获取当前单据物品列表中已经存在的物品code
        const existIds = this.getExistIds();
        let needAddObjs = [], needRemoveIds = [];

        if(source === 'fittingPop'){
            needAddObjs = selectedObjs;
            needRemoveIds = existIds;
        } else {
            if(source === 'batchShelfLeft'){
                needAddObjs = selectedObjs;
            } else {
                needAddObjs = this.getNeedAddObjs(selectedObjs, existIds);
            }
            if (source === 'goodsPop' || source === 'copyFromOrderPop' || source === 'copyFromSale') {
                needRemoveIds = this.getNeedRemoveIds(existIds, selectedObjs);
            }
        }

        const needAddGoods = [];
        needAddObjs.length > 0 && needAddObjs.forEach(needAddItem => {
            prodList.forEach(item => {
                if (item.productCode === needAddItem.productCode && item.rnd === needAddItem.rnd) {
                    needAddGoods.push(item)
                }
            })
        });

        //删除物品
        /*needRemoveIds.length > 0 && needRemoveIds.forEach(id => {
            this.removeGoods(id);
        });*/
        needRemoveIds.length > 0 && this.removeGoodsByIds(needRemoveIds, removeAllGoodsCallBack);

        //插入物品
        needAddGoods.length > 0 && this.insertGoods(needAddGoods, source, needRemoveIds, insertExistsLineCallBack, insertInExistsLineCallBack, insertAllGoodsCallBack);
    };

    //填充物品信息
    insertGoods = (goods, source, needRemoveIds, insertExistsLineCallBack, insertInExistsLineCallBack, insertAllGoodsCallBack) => {
        const {goodsInfo, rateList} = this.props;
        let defaultRateValue = rateList && rateList.getIn(['rate', 'defaultValue']);
        let {setFieldsValue} = this.props.formRef.current;

        const dataSource = goodsInfo.get('data').toJS();

        const emptyKeys = this.findKeyWithEmptyLine(dataSource, source, needRemoveIds);

        if (emptyKeys.length > 0) {
            const needSetGoods = goods.slice(0, emptyKeys.length);
            needSetGoods.forEach((goodsItem, index) => {
                setFieldsValue({
                    [this.dataPrefix]: {
                        [emptyKeys[index]]: {
                            [this.dataName.productCode] : goodsItem.productCode,
                            [this.dataName.prodCustomNo] : goodsItem.prodCustomNo,
                            [this.dataName.prodName] : goodsItem.prodName,
                            [this.dataName.descItem] : goodsItem.descItem,
                            [this.dataName.unit] : goodsItem.unit,
                            [this.dataName.brand] : goodsItem.brand,
                            [this.dataName.produceModel] : goodsItem.produceModel,
                            [this.dataName.expirationFlag] : goodsItem.expirationFlag,  // 批次号是否启用
                            [this.dataName.expirationDay] : goodsItem.expirationDay,  // 批次号是否启用
                            [this.dataName.quantity]: goodsItem.quantity,
                            [this.dataName.unitCost]: goodsItem.unitCost,
                            [this.dataName.allocatedPrice]: goodsItem.allocatedPrice,
                            [this.dataName.allocatedAmount]: goodsItem.allocatedAmount
                        }
                    }
                });

                if(source === 'batchShelfLeft'){ // 来源为批次号
                    setFieldsValue({[this.dataPrefix]: {[emptyKeys[index]]: {batchNo: goodsItem.batchNo}}});
                    setFieldsValue({[this.dataPrefix]: {[emptyKeys[index]]: {productionDate: moment(goodsItem.productionDate)}}});
                    setFieldsValue({[this.dataPrefix]: {[emptyKeys[index]]: {expirationDate: moment(goodsItem.expirationDate)}}});
                    setFieldsValue({[this.dataPrefix]: {[emptyKeys[index]]: {batchnoFlag: goodsItem.batchnoFlag}}});
                }

                this.setFieldReadOnlyStatus(true, emptyKeys[index]);

                insertExistsLineCallBack && insertExistsLineCallBack(goodsItem, index, emptyKeys, source);

                if (this.props.goodsPopCarryFields) {
                    for (let key in this.props.goodsPopCarryFields) {
                        const fromField = key;
                        const toField = this.props.goodsPopCarryFields[key];
                        setFieldsValue({
                            [this.dataPrefix]: {
                                [emptyKeys[index]]: {
                                    [toField]: goodsItem[fromField]
                                }
                            }
                        });
                    }
                }

                //除了物品基本信息以外的字段需要填充信息时
                this.props.onInsertGoods && this.props.onInsertGoods(goodsItem, emptyKeys[index], source);
            });
        }

        //没有找到空行就新增一行再找
        if (emptyKeys.length === 0 || goods.length > emptyKeys.length) {
            let needAddGoods = goods.slice(emptyKeys.length);

            if (insertInExistsLineCallBack) {
                needAddGoods = insertInExistsLineCallBack(needAddGoods, source);
            }

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
            let needAddGoodsData = needAddGoods.map(item => {
                item[this.dataName.productCode] = item.productCode;
                item[this.dataName.prodCustomNo] = item.prodCustomNo;
                item[this.dataName.prodName] = item.prodName;
                item[this.dataName.descItem] = item.descItem;
                item[this.dataName.unit] = item.unit;
                item[this.dataName.brand] = item.brand;
                item[this.dataName.remarks] = item.remarks;
                item[this.dataName.amount]=item.amount;
                item[this.dataName.quantity]=item.quantity;
                item[this.dataName.expirationFlag]=item.expirationFlag;  // 批次号是否启用
                item[this.dataName.expirationDay]=item.expirationDay;
                item[this.dataName.quantity]= item.quantity;
                item[this.dataName.unitCost]= item.unitCost;
                item[this.dataName.allocatedPrice]= item.allocatedPrice;
                item[this.dataName.allocatedAmount]= item.allocatedAmount;

                if(source === 'batchShelfLeft'){ // 来源为批次号
                    item[this.dataName.batchNo]=item.batchNo;
                    item[this.dataName.productionDate]=item.productionDate;
                    item[this.dataName.expirationDate]=item.expirationDate;
                    item[this.dataName.batchnoFlag]=item.batchnoFlag;
                }
                return item;
            });
            this.props.addGoodsItem(dataSource.length, 0, needAddGoodsData, {taxRate: defaultRateValue});
        }

        insertAllGoodsCallBack && insertAllGoodsCallBack(goods, emptyKeys);
    };

    removeGoodsByIds = (ids, removeAllGoodsCallBack) => {
        const {goodsInfo} = this.props;
        let {getFieldValue, setFieldsValue} = this.props.formRef.current;

        const dataSource = goodsInfo.get('data').toJS();
        const needRemoveGoodsKeys = [];
        let newForm = getFieldValue(this.dataPrefix);

        dataSource.forEach(item => {
            const productCode = getFieldValue([this.dataPrefix, item.key, this.dataName.productCode]);
            if (ids.includes(productCode)) {
                needRemoveGoodsKeys.push(item.key);
                delete newForm[item.key];
            }
        });
        setFieldsValue({[this.dataPrefix]: newForm});
        this.props.removeGoodsItem(needRemoveGoodsKeys);
        removeAllGoodsCallBack && removeAllGoodsCallBack(needRemoveGoodsKeys);
        this.props.onRemoveGoods && this.props.onRemoveGoods(needRemoveGoodsKeys);
    };

    getExistIds = () => {
        const {goodsInfo} = this.props;
        let {getFieldValue} = this.props.formRef.current;

        const dataSource = goodsInfo.get('data').toJS();
        const existIds = dataSource.map(item => {
            const productCode = getFieldValue([this.dataPrefix, item.key, this.dataName.productCode]);
            if (productCode) {
                return productCode;
            }
        });
        return existIds.filter(item => item);
    };

    isEmptyLine = (key) => {
        let {getFieldValue} = this.props.formRef.current;

        const productCode = getFieldValue([this.dataPrefix, key, this.dataName.productCode]);
        const prodCustomNo = getFieldValue([this.dataPrefix, key, this.dataName.prodCustomNo]);
        const prodName = getFieldValue([this.dataPrefix, key, this.dataName.prodName]);
        const descItem = getFieldValue([this.dataPrefix, key, this.dataName.descItem]);
        const unit = getFieldValue([this.dataPrefix, key, this.dataName.unit]);
        const brand = getFieldValue([this.dataPrefix, key, this.dataName.brand]);
        const produceModel = getFieldValue([this.dataPrefix, key, this.dataName.produceModel]);

        if (productCode || prodCustomNo || prodName || descItem || unit || brand || produceModel) {
            return false
        }
        return true
    };

    setSelectedLineKey = (selectedLineKey) => {
        this.setState({
            selectedLineKey
        })
    };

    findKeyWithEmptyLine = (dataSource, source, needRemoveIds) => {
        let {getFieldValue} = this.props.formRef.current;
        let emptyKeys = [];
        for (let i = 0; i < dataSource.length; i++) {
            //判断空行条件---1、物品几个字段只要有一个存在值就不是空行 2、选择的行 为当前触发弹层显示的行
            const productCode = getFieldValue([this.dataPrefix, dataSource[i].key, this.dataName.productCode]);

            if (this.isEmptyLine(dataSource[i].key) || (source === 'goodsPop' && this.state.selectedLineKey !== '' && dataSource[i].key === this.state.selectedLineKey && needRemoveIds.length > 0 && needRemoveIds.includes(productCode))) {
                emptyKeys.push(dataSource[i].key);
            }
        }
        return emptyKeys;
    };

    setFieldReadOnlyStatus = (isReadOnly, key) => {
        if (isReadOnly) {
            //设置字段只读
            this.props.setFieldReadonly('descItem', key);
            this.props.setFieldReadonly('unit', key);
            this.props.setFieldReadonly('brand', key);
            this.props.setFieldReadonly('produceModel', key);
        }
        else {
            //设置字段只读
            this.props.unsetFieldReadonly('descItem', key);
            this.props.unsetFieldReadonly('unit', key);
            this.props.unsetFieldReadonly('brand', key);
            this.props.unsetFieldReadonly('produceModel', key);
        }
    };

    // 键盘移动功能
    tabMove = (keyCode, index, key, columns) => {
        let direction = this.KEY_CODE_TO_DIRECTION_MAP[keyCode];
        if(direction){
            const {goodsInfo} = this.props;
            const dataSource = goodsInfo.get('data').toJS();
            console.log(dataSource, 'dataSource');
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
            dom = document.getElementById(`${this.dataPrefix}_${dataSource[columnIndex].key}_${key}`);
            if(this.checkDisabled(dom)) dom='' ;
        }
        dom && dom.focus();
    };

    // 键盘向下移动  40
    downMove = ({columnIndex, key, dataSource}) => {
        let dom;
        while(!dom && columnIndex<dataSource.length-1){
            ++columnIndex;
            dom = document.getElementById(`${this.dataPrefix}_${dataSource[columnIndex].key}_${key}`);
            if(this.checkDisabled(dom)) dom='' ;
        }
        dom && dom.focus();
    };

    // 键盘向左移动  37
    leftMove = ({columnIndex, rowIndex, columns, dataSource}) => {
        let dom, key;
        while(!dom && rowIndex>0){
            key = columns[--rowIndex].key;
            dom = document.getElementById(`${this.dataPrefix}_${dataSource[columnIndex].key}_${key}`);
            if(this.checkDisabled(dom)) dom='' ;
        }
        dom && dom.focus();
    };

    // 键盘向右移动  39
    rightMove = ({columnIndex, rowIndex, columns, dataSource}) => {
        let dom, key;
        while(!dom && rowIndex<columns.length-1){
            key = columns[++rowIndex].key;
            dom = document.getElementById(`${this.dataPrefix}_${dataSource[columnIndex].key}_${key}`);
            if(this.checkDisabled(dom)) dom='' ;
        }
        dom && dom.focus();
    };

    checkDisabled = (dom) => {
        if(!dom) return false;
        let jumpFlag = dom.disabled || dom.readonly;
        return jumpFlag;
    };

    render() {
        return null
    }

}





