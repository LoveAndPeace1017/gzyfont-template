import React, {Component} from 'react';
import Base from '../dependencies/base';
import _ from "lodash";
import {getCookie} from 'utils/cookie';
import {fixedDecimal} from 'utils/Decimal';
import {message} from "antd/lib/index";
import {formatCurrency, removeCurrency} from 'utils/format';

/**
 * @visibleName WithFormOperate（对表单操作有关的功能封装）
 * @author jinb
 */
export default function withFormOperate(WrappedComponent) {
    return class WithFormOperate extends Base {
        componentDidMount() {
            this.props.getRef && this.props.getRef(this);
        }

        constructor(props) {
            super(props);
            this.dataPrefix = this.props.dataPrefix;
            this.state = {
                currentKey: 0,
                formData: [{key: 0}]
            };
        }

        /** 找寻table中可以使用的空白行 */
        _findEmptyPosition = () => {
            let outKeyGroup = [];
            let {formData} = this.state;
            let dataSource = this.getFormField();
            _.forEach(formData, (list) => {
                if (!dataSource || !dataSource[list.key])
                    outKeyGroup.push(list.key);
            });
            return outKeyGroup;
        };

        /** 当插入的物品信息超过table的长度时，需要创建新的空白行 */
        _buildNewRow = (len, callback) => {
            let outKeyGroup = [];
            let {formData, currentKey} = this.state;
            let newFormData = _.cloneDeep(formData);
            while (len > 0) {
                outKeyGroup.push(++currentKey);
                newFormData.push({key: currentKey});
                len--;
            }
            this.setState({formData: newFormData, currentKey}, () => {
                callback && callback(outKeyGroup);
            })
        };

        /** 将表单数据转换为数组 */
        _formToArray = () => {
            let array = [];
            let dataSource = this.getFormField();
            _.forIn(dataSource, function (value, key) {
                if (!!value)
                    array.push({...value, key});
            });
            return array;
        };


        /** 删除多余行 */
        _removeExtraRow = (surplusKeyArray) => {
            let {formData} = this.state;
            let newFormData = _.cloneDeep(formData);
            newFormData = _.filter(newFormData, item => _.indexOf(surplusKeyArray, item.key) === -1);
            this.setState({formData: newFormData});
        };


        /**
         *  操作单行数据
         * @param key
         * @param value  为null或者不传 表示删除
         */
        setFormField = (key, value) => {
            let {getFieldValue, setFieldsValue} = this.props.formRef.current;
            let preItem = getFieldValue([this.dataPrefix, key]);
            let newItem = value ? {...preItem, ...value} : null;
            setFieldsValue({[this.dataPrefix]: {[key]: newItem}});
        };

        /**
         * 操作多行数据
         * @param keyArray
         * @param valueArray
         * valueArray 为null或者不传 表示删除
         */
        setFormFields = (keyArray, valueArray) => {
            let idx = 0;
            let len = keyArray.length;
            while (idx < len) {
                let key = keyArray[idx];
                let value = valueArray ? valueArray[idx] : null;
                this.setFormField(key, value);
                idx++;
            }
        };

        /**
         * 获取表单数据
         * @param recordKey
         * @param key
         * valueArray 为null或者不传 表示删除
         */
        getFormField = (recordKey, key) => {
            let {getFieldValue} = this.props.formRef.current;
            if(recordKey === null || recordKey === undefined){
                return getFieldValue([this.dataPrefix]);
            }
            if(!key){
                return getFieldValue([this.dataPrefix, recordKey]);
            }
            return getFieldValue([this.dataPrefix, recordKey, key]);
        };


        fillList = (listArray, source) => {
            if(!listArray || listArray.length === 0) return;
            let formArray = this._formToArray();
            // 需要新增的列表数据
            let addList = listArray;
            // 如果数据来源于物品弹层时 即我的物品弹层点击提交时，需要删除 解除勾选的物品
            if(source === 'goods'){
                let removeList = _.differenceBy(formArray, listArray, 'prodNo');
                addList = _.differenceBy(listArray, formArray, 'prodNo');
                // 删除列表中原有的重复列
                this.setFormFields(_.map(removeList, o => o.key), null);
            }
            // 查找列表中的空白行
            let emptyKeyArray = this._findEmptyPosition();
            let addLen = addList.length,
                emptyLen = emptyKeyArray.length;
            if (addLen > 0) {
                let len = addLen - emptyLen;
                // 如果新增的列表长度大于空白行的列表长度，需要重新创建空白行
                this._buildNewRow(len, (newKeyGroup) => {
                    let keyGroup = emptyKeyArray.concat(newKeyGroup);
                    // 新增完成后回填数据
                    this.setFormFields(keyGroup, addList);
                })
            }
            // 删除多余行
            if (!addLen || emptyLen > addLen) {
                let surplusKeyArray = emptyKeyArray.slice((addLen || 0), emptyLen);
                this._removeExtraRow(surplusKeyArray);
            }
            // 计算总数量
            this.calculateTotalQuantity();
        };


        /** 计算总数量，总价格*/
        calculateTotalQuantity = (recordKey,type) => {
            let {setFieldsValue} = this.props.formRef.current;
            let re = /^[0-9]+.?[0-9]*/;
            re.test(recordKey) && this.calculateAmountAndPrice(recordKey,type);
            setTimeout(()=>{
                let totalQuantity = 0;
                let totalAmount = 0;
                let dataSource = this.getFormField();
                _.forIn(dataSource, function (data) {
                    if (!!data && data.prodNo && data.quantity)
                        totalQuantity += Number(data.quantity);
                    if (!!data && data.prodNo && data.amount)
                        totalAmount += Number(data.amount);
                });
                let quantityDecimalNum = getCookie("quantityDecimalNum");
                let priceDecimalNum = getCookie("priceDecimalNum");
                setFieldsValue({[this.dataPrefix+"TotalQuantity"]: fixedDecimal(totalQuantity,quantityDecimalNum)});
                setFieldsValue({[this.dataPrefix+"TotalAmount"]: formatCurrency(fixedDecimal(totalAmount,priceDecimalNum))});
            },50);

        };

        /** 根据 数量 单价 金额 得其2算出另外一个*/
        calculateAmountAndPrice = (recordKey,type)=>{
            let amount = this.getFormField(recordKey,'amount');
            let unitPrice = this.getFormField(recordKey,'unitPrice');
            let quantity = this.getFormField(recordKey,'quantity');
            let quantityDecimalNum = getCookie("quantityDecimalNum");
            let priceDecimalNum = getCookie("priceDecimalNum");
            if(amount && unitPrice && !quantity){
                this.setFormField(recordKey,{'quantity': fixedDecimal(Number(amount)/Number(unitPrice),quantityDecimalNum)});
            }else if(!amount && unitPrice && quantity){
                this.setFormField(recordKey,{'amount': fixedDecimal(Number(unitPrice)*Number(quantity),priceDecimalNum)});
            }else if(amount && !unitPrice && quantity){
                this.setFormField(recordKey,{'unitPrice': fixedDecimal(Number(amount)/Number(quantity),priceDecimalNum)});
            }else if(amount && unitPrice && quantity && !type){
                this.setFormField(recordKey,{'unitPrice': fixedDecimal(Number(amount)/Number(quantity),priceDecimalNum)});
            }else if(amount && unitPrice && quantity && type){
                //如果数量，单价，金额，类型都有值，那么数字的变化根据实际的触发类型来定
                if(type === 'quantity' || type === 'unitPrice'){
                    this.setFormField(recordKey,{'amount': fixedDecimal(Number(unitPrice)*Number(quantity),priceDecimalNum)});
                }else if(type === 'amount'){
                    this.setFormField(recordKey,{'unitPrice': fixedDecimal(Number(amount)/Number(quantity),priceDecimalNum)});
                }
            }
        }

        /** 添加行 */
        addOneRow = (index) => {
            let {formData, currentKey} = this.state;
            let newFormData = _.cloneDeep(formData);
            newFormData.splice(index + 1, 0, {key: ++currentKey});
            this.setState({currentKey, formData: newFormData});
        };

        /** 删除行 */
        removeOneRow = (key) => {
            let {formData} = this.state;
            let newFormData = formData.filter(item => item.key !== key);
            this.setState({formData: newFormData}, () => {
                // 清楚当前行form中的数据
                this.setFormField(key, null);
                // 计算总数量
                this.calculateTotalQuantity();
            });
        };

        /** 获取已经存在的列表数据  且 该物品不是bomCode物品*/
        getExistRows = () => {
            let array = [];
            let { getFieldValue } = this.props.formRef.current;
            let dataSource = getFieldValue([this.dataPrefix]);
            _.forIn(dataSource, function(value) {
                if(!!value && !value.bomCode)
                    array.push({
                        key: value.prodNo,
                        productCode: value.prodNo,
                        name: value.prodName,
                        prodCustomNo: value.prodCustomNo,
                        unit: value.unit,
                        brand: value.brand,
                        descItem: value.descItem,
                        produceModel: value.produceModel
                    });
            });
            return array;
        };

        /** 一键填充*/
        oneKeyFill = ()=>{
            let dataSource = this._formToArray();
            let firstDate;
            for (let i = 0; i < dataSource.length; i++) {
                const deliveryDeadlineDate = dataSource[i].deliveryDeadlineDate;
                if(deliveryDeadlineDate){
                    firstDate = deliveryDeadlineDate;
                    break;
                }
            }
            if(firstDate){
                //填充第一个日期到所有日期
                for (let i = 0; i < dataSource.length; i++) {
                    this.setFormField(dataSource[i].key,{deliveryDeadlineDate:firstDate});
                }
            }else{
                message.error("没有可以填充的内容！");
            }
        }

        render() {
            let {formData} = this.state;
            return (
                <WrappedComponent
                    {...this.props}
                    formData={formData}
                    addOneRow={this.addOneRow}
                    removeOneRow={this.removeOneRow}
                    getFormField={this.getFormField}
                    setFormField={this.setFormField}
                    setFormFields={this.setFormFields}
                    oneKeyFill={this.oneKeyFill}
                    fillList={this.fillList}
                    calculateTotalQuantity={this.calculateTotalQuantity}
                    getExistRows={this.getExistRows}
                />
            )
        }
    }
}