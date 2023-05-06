import React, {Component} from 'react';
import Base from '../dependencies/base';
import _ from "lodash";

/**
 * @visibleName WithFormOperate（对表单操作有关的功能封装）
 * @author jinb
 */
export default function withFormOperate(WrappedComponent) {
    return class WithFormOperate extends Base {
        constructor(props) {
            super(props);
            this.dataPrefix = this.props.dataPrefix;
            this.defaultForm = [{key: 0}];
            this.state = {
                currentKey: 0,
                formData: this.defaultForm
            };
        }

        /** 找寻table中可以使用的空白行 */
        _findEmptyPosition = () => {
            let outKeyGroup = [], outIdxGroup = [];
            let {formData} = this.state;
            let dataSource = this.getFormField();
            _.forEach(formData, (list, idx) => {
                if (!dataSource || !dataSource[list.key] || !(dataSource[list.key].prodCustomNo || dataSource[list.key].prodName)){
                    outKeyGroup.push(list.key);
                    outIdxGroup.push(idx);
                }
            });
            return [outKeyGroup, outIdxGroup];
        };

        /** 填充state中formData中的数据，当插入的物品信息超过table的长度时，需要创建新的空白行 */
        _fillFormData = (addList, emptyIdxArray, callback) => {
            let outKeyGroup = [];
            let {formData, currentKey} = this.state;
            let newFormData = _.cloneDeep(formData);
            let aLen = addList.length, eLen = emptyIdxArray.length;
            let nLen = aLen - eLen;
            let fLen = aLen > eLen ? eLen : aLen;
            let idx1 = 0, idx2 = 0;
            while (idx1 < fLen) {
                let { key } = newFormData[emptyIdxArray[idx1]];
                newFormData[emptyIdxArray[idx1]] = {
                    ...addList[idx1],
                    key
                };
                idx1++;
            }
            while (idx2 < nLen) {
                outKeyGroup.push(++currentKey);
                newFormData.push({
                    ...addList[eLen + idx2],
                    key: currentKey
                });
                idx2++;
            }
            if (idx1 < eLen) {  //删除空白行
                let removeIdxArray = emptyIdxArray.slice(idx1, eLen);
                let removeKeyArray = _.map(removeIdxArray, (idx) => formData[idx].key);
                this.setFormFields(removeKeyArray, null);
                _.pullAt(newFormData, removeIdxArray);
            }
            this.setState({formData: newFormData, currentKey}, () => {
                callback && callback(outKeyGroup);
            })
        };

        /** 将表单数据转换为数组 */
        _formToArray = () => {
            let array = [];
            let dataSource = this.getFormField();
            _.forIn(dataSource, (value, key) => {
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

        /**
         * 获取表单state中的formData中的数据
         * @param recordKey
         * @param key
         * valueArray 为null或者不传 表示删除
         */
        getFormState = (idx, key) => {
            let {formData} = this.state;
            if(idx!==0 && !idx && !key) return formData;
            if(!key) return formData[idx] || null;
            return formData[idx] ? formData[idx][key] : null;
        };

        /**
         *  设置表单state中的formData中的数据
         * @param idx 索引
         * @param value 改动的值  value为null即清空操作
         * @param callback 成功的回调
         */
        setFormState  = (idx, value, callback) => {
            let {formData} = this.state;
            let row = this.getFormState(idx);
            let newFormData = _.cloneDeep(formData);
            newFormData[idx] = value ? {...row, ...value} : {key: row.key};
            this.setState({formData: newFormData}, ()=>{
                callback && callback();
            })
        };

        /**
         *  填充列表数据
         * @param listArray 需要填充的数据
         * @param source  数据来源
         */
        fillList = (listArray, source, callback) => {
            if(!listArray || listArray.length === 0) return;
            let formArray = this._formToArray();
            // 需要新增的列表数据
            let addList = listArray;
            // 如果数据来源于物品弹层时 即我的物品弹层点击提交时，需要删除 解除勾选的物品
            if(source === 'goods'){
                let removeList = _.differenceBy(formArray, listArray, 'productCode');
                addList = _.differenceBy(listArray, formArray, 'productCode');
                // 删除列表中原有的重复列
                this.setFormFields(_.map(removeList, o => o.key), null);
            }
            // 查找列表中的空白行
            let [emptyKeyArray, emptyIdxArray] = this._findEmptyPosition();
            let addLen = addList.length,
                emptyLen = emptyKeyArray.length;
            if (addLen > 0) {
                // 如果新增的列表长度大于空白行的列表长度，需要重新创建空白行
                this._fillFormData(addList, emptyIdxArray, (newKeyGroup) => {
                    let keyGroup = emptyKeyArray.concat(newKeyGroup);
                    // 新增完成后回填数据
                    this.setFormFields(keyGroup, addList);
                })
            }
            // 删除多余行
            if (!addLen && emptyLen > 0) {
                this._removeExtraRow(emptyKeyArray);
            }
            // 计算总数量
            callback && callback();
        };

        /** 添加行 */
        addOneRow = (index, form) => {
            let {formData, currentKey} = this.state;
            let newFormData = _.cloneDeep(formData);
            newFormData.splice(formData.length, 0, {key: ++currentKey});
            this.setState({currentKey, formData: newFormData}, () => {
                // 添加默认值
                this.setFormField(currentKey, form)
            });
        };

        /** 删除行 */
        removeOneRow = (key, callback) => {
            let {formData} = this.state;
            let newFormData = formData.filter(item => item.key !== key);
            this.setState({formData: newFormData}, () => {
                // 清楚当前行form中的数据
                this.setFormField(key, null);
                // 计算总数量
                callback && callback();
            });
        };

        /** 获取已经存在的列表数据  且 该物品不是bomCode物品*/
        getExistRows = () => {
            let array = [];
            let dataSource = this.getFormField();
            _.forIn(dataSource, function(value) {
                if(!!value)
                    array.push({
                        key: value.productCode,
                        productCode: value.productCode,
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

        /** 清楚所有行 */
        clearAllRows = async (callback) => {
            await this.setState({
                currentKey: 0,
                formData: this.defaultForm
            }, () => {
                let { setFieldsValue } = this.props.formRef.current;
                setFieldsValue({[this.dataPrefix]: null});
            });
            if(callback) await callback()
        };

        render() {
            let {formData} = this.state;

            return (
                <WrappedComponent
                    {...this.props}
                    formData={formData}
                    addOneRow={this.addOneRow}
                    clearOneRow={this.clearOneRow}
                    removeOneRow={this.removeOneRow}
                    getFormField={this.getFormField}
                    setFormField={this.setFormField}
                    setFormFields={this.setFormFields}
                    getFormState={this.getFormState}
                    setFormState={this.setFormState}
                    fillList={this.fillList}
                    calculateTotalQuantity={this.calculateTotalQuantity}
                    getExistRows={this.getExistRows}
                    clearAllRows={this.clearAllRows}
                />
            )
        }
    }
}