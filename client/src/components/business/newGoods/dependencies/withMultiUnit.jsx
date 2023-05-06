import React, {Component} from 'react';
import {formatCurrency, removeCurrency} from 'utils/format';
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';
import {SelectUnit} from 'pages/auxiliary/goodsUnit';
import {Form, Select, Input} from "antd";
const {Option} = Select;
import Base from './base';
import {fromJS} from "immutable";

export default function withMultiUnit(WrappedComponent) {
    return class withMultiSpecGoods extends Base {
        constructor(props) {
            super(props);
            this.state = {
                optionGroupMap: {}
            }
        }

        handleChange = (value, key, productCode) => {
            let {getFieldValue, setFieldsValue} = this.props.formRef.current;
            let {optionGroupMap} = this.state;
            let quantity = getFieldValue([this.dataPrefix, key, this.dataName.quantity]);
            let unit = getFieldValue([this.dataPrefix, key, this.dataName.unit]);
            let quantityDecimalNum = getCookie("quantityDecimalNum");
            let currentOption = {}, mainOption = {};
            optionGroupMap[productCode].forEach(item => {
                if(item.unitName === value) currentOption = item;
                if(item.unitName === unit) mainOption = item;
            });

            let unitConverterText = `1${currentOption.unitName}=${currentOption.unitConverter}${mainOption.unitName}`;
            let recQuantity = fixedDecimal(quantity / currentOption.unitConverter, quantityDecimalNum);

            if(this.props.showUnitConverterColumn){
                setFieldsValue({[this.dataPrefix]: {[key]: {
                            [this.dataName.unitConverterText]: unitConverterText,
                            [this.dataName.unitConverter]: currentOption.unitConverter
                }}});
            }
            this.props.showQuantityColumns && setFieldsValue({[this.dataPrefix]: {[key]: {[this.dataName.recQuantity]: recQuantity}}});
            (currentOption.unitName!==mainOption.unit) && setFieldsValue({[this.dataPrefix]: {[key]: {[this.dataName.proBarCode]: currentOption.proBarCode }}});
        };

        // 获取焦点的回调事件
        handleOnFocus = (productCode) => {
            const {optionGroupMap} = this.state;

            !optionGroupMap[productCode] && this.props.asyncFetchUnits(productCode, (res) => {
                if(res && res.retCode === '0'){
                    optionGroupMap[productCode] = res.data;
                    this.setState({optionGroupMap});
                }
            })
        };

        render(){
            let {getFieldValue} = this.props.formRef.current;
            let {optionGroupMap} = this.state;

            let unitColumn = {
                title: '单位',
                key: this.dataName.recUnit,
                originalKey: 'recUnit',
                columnName: 'recUnit',
                width: 101,
                maxLength: 50,
                render: (text, record,  index, dataSource, validConfig, requiredFlag, onKeyDown)=> {
                    let unitFlag = !!getFieldValue([this.dataPrefix, record.key, this.dataName.unitFlag]);
                    let productCode = getFieldValue([this.dataPrefix, record.key, this.dataName.productCode]);
                    let productCodeFlag = !!productCode;
                    /**
                     *    情况1： 新建的物品  unitFlag： false,   productCode: null
                     *    情况2： 选择的普通物品   unitFlag： false,  productCode: exist
                     *    情况3： 选择的多单位物品   unitFlag： true,  productCode: exist
                     */
                    return (
                        <Form.Item
                            rules={validConfig}
                            name={[this.dataPrefix, record.key, this.dataName.recUnit]}
                        >
                            {
                                (!unitFlag && !productCodeFlag) ?  (  // 情况1：
                                    <SelectUnit minWidth=""
                                                showEdit
                                                id={this.dataPrefix+"_"+record.key+"_unit"}
                                                onKeyDown={onKeyDown}
                                                disabled={record['unitReadOnly']}/>
                                ) : ((!unitFlag && productCodeFlag) || !this.props.showUnitConverterColumn) ? (   // 情况2：
                                    <Input type="text" disabled/>
                                ) : (
                                    <Select   //  情况3：
                                        id={this.dataPrefix+"_"+record.key+"_unit"}
                                        onKeyDown
                                        allowClear
                                        value={this.state.value}
                                        onDropdownVisibleChange={() => this.handleOnFocus(productCode)}
                                        onChange={(value) => this.handleChange(value, record.key, productCode)}
                                        style={{minWidth: this.props.minWidth}}>
                                        {
                                            optionGroupMap[productCode] && optionGroupMap[productCode].map((item, index) => (
                                                <Option key={index} value={item.unitName}>
                                                    {item.unitName}
                                                </Option>
                                            ))
                                        }
                                    </Select>
                                )
                            }
                        </Form.Item>
                    )
                }
            };


            return (
                <React.Fragment>
                    <WrappedComponent
                        {...this.props}
                        unitColumn={unitColumn}
                    />
                </React.Fragment>
            )
        }
    }
}