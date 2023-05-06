import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import PropTypes from 'prop-types';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Form, Select} from "antd";
const {Option} = Select;
import {formatCurrency, removeCurrency} from 'utils/format';
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';
import {SelectUnit} from 'pages/auxiliary/goodsUnit';
import {actions as addGoodsActions} from 'pages/goods/add';
import Base from './base';
import _ from "lodash";


const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchUnits: addGoodsActions.asyncFetchUnits,
    }, dispatch)
};

@withRouter
@connect(null, mapDispatchToProps)
export default function withMultiUnit(WrappedComponent) {
    return class withMultiSpecGoods extends Base {
        static propTypes = {
            /** 字段的key前缀，一般会改成我们向后端提交数据时，后端需要的名称 */
            dataPrefix: PropTypes.string,
            /** 获取表单数据 */
            getFormField: PropTypes.func,
            /** 填充当前行数据 */
            setFormField: PropTypes.func,
            /** 设置表单state中的formData中的数据*/
            setFormState: PropTypes.func
        };

        constructor(props) {
            super(props);
            this.state = {
                optionGroupMap: {}
            }
        }

        handleChange = (value, idx, record) => {
            let { getFormField, setFormField, setFormState } = this.props;
            let {optionGroupMap} = this.state;
            let quantity = getFormField(record.key, 'quantity');
            let unit = record.unit;
            let quantityDecimalNum = getCookie("quantityDecimalNum");
            let currentOption = {}, mainOption = {};
            optionGroupMap[record.productCode].forEach(item => {
                if(item.unitName === value) currentOption = item;
                if(item.unitName === unit) mainOption = item;
            });
            let unitConverterText = `1${currentOption.unitName}=${currentOption.unitConverter}${mainOption.unitName}`;
            let recQuantity = fixedDecimal(_.divide(quantity, currentOption.unitConverter), quantityDecimalNum);

            setFormField(record.key, {recQuantity});
            setFormState(idx, {unitConverterText, unitConverter:currentOption.unitConverter, proBarCode: currentOption.proBarCode});
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
            let {optionGroupMap} = this.state;
            let { dataPrefix } = this.props;

            let unitColumn = {
                title: '单位',
                key: 'recUnit',
                dataIndex: 'recUnit',
                columnName: 'recUnit',
                width: 101,
                maxLength: 50,
                render: (text, record,  index)=> {
                    let {key, productCode, unitFlag} = record;
                    /**
                     *    情况1： 选择的普通物品   unitFlag： false,  productCode: exist
                     *    情况2： 新建的物品  unitFlag： false,   productCode: null
                     *    情况3： 选择的多单位物品   unitFlag： true,  productCode: exist
                     */
                    return (
                        <React.Fragment>
                            {
                                (!unitFlag && productCode) ? (
                                    <span className="txt-clip" title={text}>{text}</span>
                                ) : (!unitFlag && !productCode) ? (
                                    <Form.Item
                                        name={[dataPrefix, key, 'recUnit']}
                                    >
                                        <SelectUnit minWidth=""
                                                    showEdit
                                                    id={this.dataPrefix+"_"+key+"_unit"}
                                                    disabled={record['unitReadOnly']}/>
                                    </Form.Item>
                                ) : (
                                    <Form.Item
                                        name={[dataPrefix, key, 'recUnit']}
                                    >
                                        <Select   //  情况3：
                                            allowClear
                                            value={this.state.value}
                                            onDropdownVisibleChange={() => this.handleOnFocus(productCode)}
                                            onChange={(value) => this.handleChange(value, index, record)}
                                            style={{minWidth: this.props.minWidth}}>
                                            {
                                                optionGroupMap[productCode] && optionGroupMap[productCode].map((item, index) => (
                                                    <Option key={index} value={item.unitName}>
                                                        {item.unitName}
                                                    </Option>
                                                ))
                                            }
                                        </Select>
                                    </Form.Item>
                                )
                            }
                        </React.Fragment>
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