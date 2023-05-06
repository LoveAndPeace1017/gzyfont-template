import React, {Component} from 'react';
import Base from '../dependencies/base';
import {getCookie} from 'utils/cookie';
import {fixedDecimal} from "utils/Decimal";
import _ from "lodash";

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

        /** 返回新增的列表 和 已经存在的列表数据 */
        _findNewAndExistListByKey = (listArray, formArray, source) => {
            let addList = [], sameList = [], quantity = 0;
            _.forEach(listArray, (list) => {
                let sLi = _.filter(formArray, (o) => this._validateIsSameData(list, o, source));
                if (sLi && sLi.length > 0) {
                    quantity = _.toNumber(sLi[0].quantity) || 0;
                    if(list.quantity){  // 如果弹层中返回列表数据存在quantity，需要与form 表单中相同物品编号 对应的数量进行相加
                        quantity += _.toNumber(list.quantity);
                    }
                    sameList.push({...sLi[0], ...list, quantity});
                } else {
                    addList.push(list);
                }
            });
            return [addList, sameList];
        };

        /** 校验是否为相同物品*/
        _validateIsSameData = (li1, li2, source) => {
            let filterFlag = false;
            if(source === 'bom'){  /** 来源为生产bom */
                filterFlag = li1.bomCode===li2.bomCode
            } else if (source === 'saleOrder') {  /** 来源为销售订单 */
                filterFlag = (li1.saleDisplayBillNo===li2.saleDisplayBillNo) && (li1.bomCode===li2.bomCode) && (li1.prodNo===li2.prodNo);
            } else {   /** 来源为普通物品 */
                filterFlag = li1.prodNo===li2.prodNo;
            }
            return filterFlag;
        };

        /** 删除多余行 */
        _removeExtraRow = (surplusKeyArray) => {
            let {formData} = this.state;
            let newFormData = _.cloneDeep(formData);
            newFormData = _.filter(newFormData, item => _.indexOf(surplusKeyArray, item.key) === -1);
            this.setState({formData: newFormData});
        };

        /** 过滤符合的物品信息 需要区分 普通物品、bom物品 和 销售订单物品 */
        _filterFormArrayByKey = (formArray, source) => {
            return _.filter(formArray, (o)=> this._validateIsSameSourceData(o, source));
        };

        /** 校验是否为相同类型物品*/
        _validateIsSameSourceData = (oLi, source) => {
            let filterFlag = false;
            if(source === 'bom'){  /** 来源为生产bom */
                filterFlag = oLi.prodNo && oLi.bomCode && !oLi.saleDisplayBillNo;
            } else if (source === 'saleOrder') {  /** 来源为销售订单 */
                filterFlag = oLi.prodNo && oLi.saleDisplayBillNo;
            } else {   /** 来源为普通物品 */
                filterFlag = oLi.prodNo && !oLi.bomCode && !oLi.saleDisplayBillNo;
            }
            return filterFlag;
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

        /**
         *  填充列表数据
         * @param listArray 需要填充的数据
         * @param source  数据来源  1.goods(普通物品)、2.popGoods（物品弹层勾选物品） 3.bom、 4.saleOrder销售订单
         */
        fillList = (listArray, source) => {
            if(!listArray || listArray.length === 0) return;
            let formArray = this._formToArray();
            // 过滤符合的物品信息 需要区分 bomCode物品 和 普通物品
            formArray = this._filterFormArrayByKey(formArray, source);
            // 返回新加的 和 已经 存在的 列表信息
            let [addList, sameList] = this._findNewAndExistListByKey(listArray, formArray, source);
            // 如果数据来源于物品弹层时 即我的物品弹层点击提交时，需要删除 解除勾选的物品
            if(source === 'popGoods'){
                let removeList = _.differenceBy(formArray, sameList, 'prodNo');
                // 删除列表中原有的重复列
                this.setFormFields(_.map(removeList, o => o.key), null);
            }
            if(sameList && sameList.length > 0){
                //  弹层中的列表数据已经在表格中存在时，计划生产数量需要进行叠加
                this.setFormFields(_.map(sameList, o => o.key), sameList);
            }
            // 查找列表中的空白行
            let emptyKeyArray = this._findEmptyPosition();
            let addLen = addList.length,
                emptyLen = emptyKeyArray.length;
            // 如果新增的列表长度大于空白行的列表长度
            if (addLen > 0 && addLen > emptyLen) {
                let len = addLen - emptyLen;
                // 如果新增的列表长度大于空白行的列表长度，需要重新创建空白行
                this._buildNewRow(len, (newKeyGroup) => {
                    let keyGroup = emptyKeyArray.concat(newKeyGroup);
                    // 新增完成后回填数据
                    this.setFormFields(keyGroup, addList);
                })
            }
            // 如果新增的列表长度小于空白行的列表长度
            if (addLen > 0 && addLen <= emptyLen) {
                this.setFormFields(emptyKeyArray, addList);
            }
            // 删除多余行
            if (!addLen || emptyLen > addLen) {
                let surplusKeyArray = emptyKeyArray.slice((addLen || 0), emptyLen);
                this._removeExtraRow(surplusKeyArray);
            }
            // 计算总数量
            this.calculateTotalQuantity();
        };

        /** 计算总数量 */
        calculateTotalQuantity = () => {
            let quantityDecimalNum = getCookie("quantityDecimalNum");
            let {setFieldsValue} = this.props.formRef.current;
            setTimeout(()=>{
                let totalQuantity = 0;
                let dataSource = this.getFormField();
                _.forIn(dataSource, function (data) {
                    if (!!data && data.prodNo && data.quantity)
                        totalQuantity += Number(data.quantity);
                });
                setFieldsValue({[this.dataPrefix+"TotalQuantity"]: fixedDecimal(totalQuantity, quantityDecimalNum)})
            },50)
        };

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
                    fillList={this.fillList}
                    calculateTotalQuantity={this.calculateTotalQuantity}
                    getExistRows={this.getExistRows}
                />
            )
        }
    }
}