import React, {Component, useState, useEffect} from 'react';
import {formatCurrency, removeCurrency} from 'utils/format';
import {AuthInput} from 'components/business/authMenu';
import {SelectBatchShelf} from 'components/business/batchShelfLeft';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import {Input, Form, DatePicker} from "antd";
import {EllipsisOutlined} from '@ant-design/icons';
import Base from './base';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");

const cx = classNames.bind(styles);

export default function withBatchLeft(WrappedComponent) {
    return class withBatchLeft extends Base {
        constructor(props) {
            super(props);
            this.state={
                visible: false,
                idx: 0,  // 当前的所在行号
            };
        }

        handleOpen = (idx) => {
            let {getFieldValue} = this.props.formRef.current;
            let productCode = getFieldValue([this.dataPrefix, idx, this.dataName.productCode]);
            let warehouseName = getFieldValue('warehouseName');
            if(!getFieldValue([this.dataPrefix, idx, this.dataName.expirationFlag])){
                return false;
            }
            this.setState({idx, visible: true, productCode, warehouseName});
        };

        dealCurrentItem = (list) => {
            let {setFieldsValue} = this.props.formRef.current;
            let idx = this.state.idx;
            let {batchNo, productionDate, expirationDate} = list;
            setFieldsValue({[this.dataPrefix]: {[idx]: {batchnoFlag: true}}});
            setFieldsValue({[this.dataPrefix]: {[idx]: {batchNo}}});
            setFieldsValue({[this.dataPrefix]: {[idx]: {productionDate: moment(productionDate)}}});
            setFieldsValue({[this.dataPrefix]: {[idx]: {expirationDate: moment(expirationDate)}}});
        };

        dealNewItem = (lists) => {
            let {getFieldValue} = this.props.formRef.current;
            let currentGoodItem = getFieldValue([this.dataPrefix, this.state.idx]);
            return lists.map(item => {
                let {key, ...newItem} = item;
                return {...currentGoodItem, ...newItem, productCode: currentGoodItem.prodNo,  batchnoFlag: true}
            });
        };

        confirmOperate = (selectedRows) => {
            if(selectedRows.length === 0){
                message.error('请选择一个批次号！');
                return false;
            }
            let newItems = selectedRows.slice(1);

            this.dealCurrentItem(selectedRows[0]);  // 更新当前行数据
            if(newItems.length > 0){
                newItems = this.dealNewItem(newItems);
                this.fillGoods(newItems, 'batchShelfLeft');
            }
            this.setState({visible: false});
        };

        handleChange = (e, idx) => {
            let {getFieldValue, setFieldsValue} = this.props.formRef.current;
            let productCode = getFieldValue([this.dataPrefix, idx, this.dataName.productCode]);
            let batchno = e.target.value;
            if(productCode && batchno){
                this.props.asyncFetchBatchShelfList({productCode, batchno}, (res)=> {
                    if(res.data && res.data.retCode==="0"){
                        let dataSource = res.data.data;
                        if(dataSource && dataSource.length > 0){
                            let {productionDate, expirationDate} = dataSource[0];
                            setFieldsValue({[this.dataPrefix]: {[idx]: {[this.dataName.batchnoFlag]: true}}});
                            setFieldsValue({[this.dataPrefix]: {[idx]: {[this.dataName.productionDate]: moment(productionDate)}}});
                            setFieldsValue({[this.dataPrefix]: {[idx]: {[this.dataName.expirationDate]: moment(expirationDate)}}});
                        } else {
                            setFieldsValue({[this.dataPrefix]: {[idx]: {[this.dataName.batchnoFlag]: ''}}});
                            setFieldsValue({[this.dataPrefix]: {[idx]: {[this.dataName.productionDate]: ''}}});
                            setFieldsValue({[this.dataPrefix]: {[idx]: {[this.dataName.expirationDate]: ''}}});
                        }
                        this.setState({flag: false});
                    }
                })
            }
        };

        render() {
            let {getFieldValue, setFieldsValue} = this.props.formRef.current;
            let {productCode, warehouseName} = this.state;
            let batchLeftColumns = [];
            if(this.props.showBatchLeftColumns){
                batchLeftColumns = [{
                    title: "批次号",
                    key: this.dataName.batchNo,
                    originalKey: 'batchNo',
                    columnName: 'batchNo',
                    maxLength: 50,
                    rules: [
                        {
                            rule: (val, record) =>  {
                                return getFieldValue([this.dataPrefix, record.key, this.dataName.expirationFlag]) && !val;
                            },
                            message: '该项为必填项'
                        }
                    ],
                    render: (text, record,  index, dataSource, validConfig)=> {
                        return (
                            <Form.Item
                                initialValue={text}
                                rules={validConfig}
                                validateTrigger="onBlur"
                                name={[this.dataPrefix, record.key, this.dataName.batchNo]}
                            >
                                <Input
                                    disabled={!getFieldValue([this.dataPrefix, record.key, this.dataName.expirationFlag])}
                                    onBlur={(e)=>this.handleChange(e, record.key)}
                                    placeholder={this.props.placeholder}
                                    style={{width:'100%', ...this.props.style}}
                                    suffix={(
                                        <a href="#!"
                                           onClick={() => this.handleOpen(record.key)}>
                                            <EllipsisOutlined style={{fontSize: "16px"}}/>
                                        </a>
                                    )}
                                    className={cx("suggest")}
                                />
                            </Form.Item>
                        )
                    }
                },{
                    title: "生产日期",
                    key: this.dataName.productionDate,
                    originalKey: 'productionDate',
                    columnName: 'productionDate',
                    getFieldDecoratored: true,
                    rules: [
                        {
                            rule: (val, record) =>  {
                                return getFieldValue([this.dataPrefix, record.key, this.dataName.expirationFlag]) && !val;
                            },
                            message: '该项为必填项'
                        }
                    ],
                    render: (text, record, index, dataSource, validConfig)=> {
                        let expirationFlag = getFieldValue([this.dataPrefix, record.key, this.dataName.expirationFlag]);
                        let batchnoFlag = getFieldValue([this.dataPrefix, record.key, this.dataName.batchnoFlag]);
                        /***
                         *   入库时  当物品非批次管理物品时字段不可用
                         *  当物品对应批次号在系统内存在时字段只读，显示该批次的生产日期
                         *  当物品对应批次号在系统内不存在时字段可用，点击则打开日期选择控件可选择日期
                         *
                         *   出库时 只读
                         */
                        return (
                            <Form.Item
                                initialValue={text && moment(text)}
                                rules={validConfig}
                                name={[this.dataPrefix, record.key, this.dataName.productionDate]}
                            >
                                <DatePicker className={"gb-datepicker"}
                                            disabled={!(expirationFlag && !batchnoFlag)|| this.props.source==='wareOut'}
                                            onChange={(val) => {
                                                let expirationDay = getFieldValue([this.dataPrefix, record.key, this.dataName.expirationDay]);
                                                setFieldsValue({
                                                    [this.dataPrefix]: {
                                                        [record.key]: {
                                                            [this.dataName.expirationDate]: moment(val).add(expirationDay-1, 'days')
                                                        }
                                                    }
                                                })
                                            }}
                                />
                            </Form.Item>
                        )
                    }
                },{
                    title: "到期日期",
                    key: this.dataName.expirationDate,
                    originalKey: 'expirationDate',
                    columnName: 'expirationDate',
                    getFieldDecoratored: true,
                    rules: [
                        {
                            rule: (val, record) =>  {
                                return getFieldValue([this.dataPrefix, record.key, this.dataName.expirationFlag]) && !val;
                            },
                            message: '该项为必填项'
                        },
                        {
                            rule: (val, record) =>  {
                                let productionDate = getFieldValue([this.dataPrefix, record.key, this.dataName.productionDate]);
                                return val && productionDate && productionDate.isAfter(val, 'date');
                            },
                            message: '到期日期不能早于生产日期'
                        }
                    ],
                    render: (text, record, index, dataSource, validConfig)=> {
                        let expirationFlag = getFieldValue([this.dataPrefix, record.key, this.dataName.expirationFlag]);
                        let batchnoFlag = getFieldValue([this.dataPrefix, record.key, this.dataName.batchnoFlag]);
                        /***
                         *   入库时  当物品非批次管理物品时字段不可用
                         *  当物品对应批次号在系统内存在时字段只读，显示该批次的到期日期
                         *  当物品对应批次号在系统内不存在时字段可用，点击则打开日期选择控件可选择日期
                         *
                         *   出库时 只读
                         */
                        return (
                            <Form.Item
                                initialValue={text && moment(text)}
                                rules={validConfig}
                                name={[this.dataPrefix, record.key, this.dataName.expirationDate]}
                            >
                                <DatePicker className={"gb-datepicker"}
                                            disabled={!(expirationFlag && !batchnoFlag) || this.props.source==='wareOut'}
                                />
                            </Form.Item>
                        )
                    }
                }];
            }

            return (
                <React.Fragment>
                    <WrappedComponent
                        {...this.props}
                        batchLeftColumns={batchLeftColumns}
                    />
                    <SelectBatchShelf
                        visible={this.state.visible}
                        onOk={(selectedRows) => this.confirmOperate(selectedRows)}
                        onCancel={()=>{this.setState({visible: false})}}
                        productCode={productCode}
                        warehouseName={warehouseName}
                    />
                </React.Fragment>
            )
        }
    }
}