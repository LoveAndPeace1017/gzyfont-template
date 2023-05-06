import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from "lodash";
import {Form, Select, Input, DatePicker} from "antd";
const {Option} = Select;
import Base from './base';

/**
 * @visibleName withCustomFields（自定义字段组件）
 * @author jinb
 */
export default function withCustomFields(WrappedComponent) {

    return class withCustomFields extends Base {
        static propTypes = {
            /** 字段的key前缀，一般会改成我们向后端提交数据时，后端需要的名称 */
            dataPrefix: PropTypes.string,
            /** 获取表单数据 */
            getFormField: PropTypes.func,
        };
        /**
         *  提供物品自定义字段-只读
         * @return {Array}
         */
        renderProdCustomFields = (fields) => {
            let customArray = [];
            _.forEach(fields, (field) => {
                let obj = {
                    title: field.propName,
                    required: field.required,
                    key: field.mappingName,
                    dataIndex: field.mappingName,
                    columnName: field.mappingName,
                    width: 150,
                    readOnly: true
                };
                customArray.push(obj);
            });
            return customArray;
        };

        /**
         *  提供单据自定义字段
         * @return {Array}
         */
        renderCustomFields = (fields) => {
            let {dataPrefix} = this.props;
            let customArray = [];
            _.forEach(fields, (field) => {
                let obj = {
                    title: field.propName,
                    required: field.required,
                    key: field.mappingName,
                    dataIndex: field.mappingName,
                    columnName: field.mappingName,
                    width: 150,
                };
                if(field.type === 'text'){
                    obj.render = (text, record) => (
                        <Form.Item
                            name={[dataPrefix, record.key, obj.key]}
                            rules={[
                                {
                                    required: field.required,
                                    message: '该项为必填项'
                                }
                            ]}
                        >
                            <Input maxLength={1000}/>
                        </Form.Item>
                    )
                } else if (field.type === 'number') {
                    obj.render = (text, record) => (
                        <Form.Item
                            name={[dataPrefix, record.key, obj.key]}
                            rules={
                                [
                                    {
                                        validator: (rules, value, callback) => {
                                            let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+ field.extra.precision +'})?$/');
                                            if(!value && field.required){
                                                callback('该项为必填项');
                                            } else if (value && !reg.test(value)) {
                                                callback(`整数部分不能超过10位，小数点后不能超过${field.extra.precision}位`);
                                            }
                                            callback();
                                        }
                                    }
                                ]
                            }
                        >
                            <Input maxLength={20}/>
                        </Form.Item>
                    )
                } else if (field.type === 'date') {
                    obj.render = (text, record) => (
                        <Form.Item
                            name={[dataPrefix, record.key, obj.key]}
                            rules={[
                                {
                                    type: 'object',
                                    required: field.required,
                                    message: '该项为必填项'
                                }
                            ]}
                        >
                            <DatePicker />
                        </Form.Item>
                    )
                } else if (field.type === 'select') {
                    obj.render = (text, record) => (
                        <Form.Item
                            name={[dataPrefix, record.key, obj.key]}
                            rules={[
                                {
                                    required: field.required,
                                    message: '该项为必填项'
                                }
                            ]}
                        >
                            <Select>
                                {
                                    field.extra.options && field.extra.options.map((item) => (
                                        <Option key={item.key} value={item.key}>{item.value}</Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                    )
                }
                customArray.push(obj);
            });
            return customArray;
        };

        render(){
            return (
                <React.Fragment>
                    <WrappedComponent
                        {...this.props}
                        renderCustomFields={this.renderCustomFields}
                        renderProdCustomFields={this.renderProdCustomFields }
                    />
                </React.Fragment>
            )
        }
    }
}

