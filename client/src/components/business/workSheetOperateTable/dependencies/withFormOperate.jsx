import React, {Component} from 'react';
import _ from "lodash";

/**
 * @visibleName WithFormOperate（对表单操作有关的功能封装）
 * @author jinb
 */
export default function withFormOperate(WrappedComponent) {
    return class WithFormOperate extends Component {
        constructor(props) {
            super(props);
            this.dataPrefix = this.props.dataPrefix;
            this.defaultForm = [{key: 0}];
            this.state = {
                currentKey: 0,
                formData: this.defaultForm,
                initFlag: false  // 是否已经初始化表单数据，只执行一次
            };
        }

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
         *  初始化时填充列表数据
         * @param listArray 需要填充的数据
         */
        initFormList = (listArray) => {
            let { initFlag } = this.state;
            if(!initFlag) {
                let keyArray = listArray.map(item => item.key);
                this.setState({
                    formData: listArray,
                    currentKey: listArray.length,
                    initFlag: true
                }, () => {
                    this.setFormFields(keyArray, listArray);
                })
            }
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

        /** 清楚所有行 */
        clearAllRows = async (callback) => {
            await this.setState({
                currentKey: 0,
                initFlag: false,
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
                    initFormList={this.initFormList}
                    clearAllRows={this.clearAllRows}
                />
            )
        }
    }
}