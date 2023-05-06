import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import 'url-search-params-polyfill';
import {formatCurrency, removeCurrency} from 'utils/format';
import {numberReg} from 'utils/reg';
import {PRICE_NO_AUTH_RENDER} from 'utils/constants';
import { Form, Modal, Button, message, Input, DatePicker, Select} from 'antd';
const {Option} = Select;
import {getCookie} from 'utils/cookie';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
import moment from 'moment-timezone';
import {SelectSupplier} from 'pages/supplier/index';
import {SelectUnit} from 'pages/auxiliary/goodsUnit';
import {SelectRate} from 'pages/auxiliary/rate';
import {asyncAddGoodsForDetail} from 'pages/goods/multiGoodsAdd/actions';
import {actions as addGoodsActions} from 'pages/goods/add';

moment.tz.setDefault("Asia/Shanghai");

const cx = classNames.bind(styles);

const mapStateToProps = (state) => ({
    addGoods: state.getIn(['multiGoodsAdd', 'addGoods'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncAddGoodsForDetail,
        asyncFetchUnits: addGoodsActions.asyncFetchUnits,
    }, dispatch)
};


@withRouter
@connect(mapStateToProps, mapDispatchToProps)
export default class EditSuppliyQuotationModal extends Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            optionGroupMap: {}
        }
    }

    componentDidUpdate(){
    }

    //根据供应商带入联系人和联系电话
    handleSelectSupplier = (supplierCode)=>{
        let {setFieldsValue} = this.formRef.current;
        this.props.asyncShowSupplier(supplierCode, data => {
            if (data.retCode === '0') {
                //带入客户联系人和联系电话
                const contacterName = data.data.contacterName;
                const mobile = data.data.mobile;

                setFieldsValue({
                    supplierContacterName: contacterName,
                    supplierMobile: mobile
                });
            }
        });
    }

    handleUnitPriceChange = (value, type) => {
        let {setFieldsValue,getFieldValue} = this.formRef.current;
        let quantity = getFieldValue('quantity') || 0;
        let unitPrice = getFieldValue('unitPrice') || 0;

        value = value || 0;

        if(type === 'unitPrice'){
            setFieldsValue({
                amount: (value*quantity).toFixed(2)
            });
        }else {
            setFieldsValue({
                amount: (value * unitPrice).toFixed(2)
            });
        }

    };

    // 新增规格提交
    handleSubmit = (values) => {
        //对供应商字段处理
        values.supplierCode = values.supplierCode.key;
        console.log(values, 'values');
        this.props.asyncAddQuotationGoods(values.id,values,(data)=>{
            if(data.data.retCode === "0"){
                message.success('操作成功！');
                this.props.onOk();
            }else{
                message.error(data.data.retMsg||'操作失败');
            }
        });
    };

    // 获取焦点的回调事件
    handleOnFocus = () => {
        const {optionGroupMap} = this.state;
        let {productCode} = this.props;
        !optionGroupMap[productCode] && this.props.asyncFetchUnits(productCode, (res) => {
            if(res && res.retCode === '0'){
                optionGroupMap[productCode] = res.data;
                this.setState({optionGroupMap});
            }
        })
    };

    render() {
        //表单宽度
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 10},
            }
        };
        const {goodsName,data,productCode,unitFlag} = this.props;
        let quantityDecimalNum = getCookie("quantityDecimalNum");
        let priceDecimalNum = getCookie("priceDecimalNum");
        let {optionGroupMap} = this.state;
        return (
            <React.Fragment>
                <Modal
                    title={`修改"${productCode}-${goodsName}"报价记录`}
                    visible={this.props.visible}
                    onCancel={this.props.onClose}
                    width={850}
                    footer={null}
                    destroyOnClose={true}
                >
                    <Form ref={this.formRef}
                          onFinish={(values) => {
                              this.handleSubmit(values);
                          }}
                    >
                        <Form.Item
                            label={"供应商"}
                            name={"supplierCode"}
                            {...formItemLayout}
                            initialValue = {{
                                key: data.supplierCode,
                                label: data.supplierName
                            }}
                            rules={[{ required: true,message: "该项为必填项"}]}
                        >
                            <SelectSupplier  onSelect={(value)=>this.handleSelectSupplier(value.key)}
                                             onBlur={(existSupplier)=>this.handleSelectSupplier(existSupplier.key)}/>
                        </Form.Item>

                        <Form.Item
                            {...formItemLayout}
                            label={"联系人"}
                            initialValue={data.supplierContacterName}
                            name={"supplierContacterName"}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            {...formItemLayout}
                            label={"联系电话"}
                            initialValue={data.supplierMobile}
                            name={"supplierMobile"}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            {...formItemLayout}
                            label={"报价日期"}
                            name={"quotationDate"}
                            initialValue={data.quotationDate && moment(data.quotationDate)}
                            rules={[{ required: true,message: "该项为必填项"}]}
                        >
                            <DatePicker className={"gb-datepicker"}/>
                        </Form.Item>


                        <Form.Item
                            {...formItemLayout}
                            label={"报价数量"}
                            name={"quantity"}
                            initialValue={data.quantity}
                            rules={[
                                {
                                    validator: (rules, value, callback) => {
                                        let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+ quantityDecimalNum +'})?$/');
                                        if(!value){
                                            callback();
                                        }else{
                                            if (!reg.test(value)) {
                                                callback(`整数部分不能超过10位，小数点后不能超过${quantityDecimalNum}位`);
                                            } else if(value === 0 || value === '0'){
                                                callback(`数量不能为0！`);
                                            }else {
                                                callback();
                                            }
                                        }

                                    }
                                }
                            ]}
                        >
                            <Input maxLength={11+Number(quantityDecimalNum)} onBlur={(e)=>{this.handleUnitPriceChange(e.target.value, 'quantity')}}/>
                        </Form.Item>


                        <Form.Item
                            {...formItemLayout}
                            label={"单位"}
                            initialValue={data.unit}
                            name={"unit"}
                        >
                            {
                                (!unitFlag)?(
                                    <Input className={cx("readOnly")} readOnly={true}/>
                                ):(
                                    <Select
                                        allowClear
                                        onDropdownVisibleChange={() => this.handleOnFocus()}
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

                        <Form.Item
                            {...formItemLayout}
                            name={"unitPrice"}
                            label={"含税单价"}
                            initialValue={data.unitPrice}
                            rules={[{ required: true,message: "该项为必填项"},
                                {
                                    validator: (rules, value, callback) => {
                                        let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+ priceDecimalNum +'})?$/');
                                        if (value && !reg.test(value)) {
                                            callback(`整数部分不能超过10位，小数点后不能超过${priceDecimalNum}位`);
                                        }
                                        callback();
                                    }
                                }
                            ]}
                        >
                            <Input  onBlur={(e)=>{this.handleUnitPriceChange(e.target.value,'unitPrice')}}/>
                        </Form.Item>


                        <Form.Item
                            {...formItemLayout}
                            name={"taxRate"}
                            label={"税率"}
                            initialValue={data.taxRate}
                            rules={[{ required: true,message: "该项为必填项"}]}
                        >
                            <SelectRate showEdit/>
                        </Form.Item>


                        <Form.Item
                            {...formItemLayout}
                            label={"价税合计"}
                            initialValue={data.amount}
                            name={"amount"}
                        >
                            <Input className={cx("readOnly")} readOnly={true}/>
                        </Form.Item>

                        <Form.Item
                            {...formItemLayout}
                            label={"价格有效期"}
                            name={"expiredDate"}
                            initialValue={data.expiredDate && moment(data.expiredDate)}
                            rules={[{ required: true,message: "该项为必填项"}]}
                        >
                            <DatePicker className={"gb-datepicker"}/>
                        </Form.Item>


                        <Form.Item
                            {...formItemLayout}
                            label={"备注"}
                            initialValue={data.remarks}
                            name={"remarks"}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            initialValue={data.id}
                            name={"id"}
                        >
                            <Input  type={"hidden"}/>
                        </Form.Item>

                        <Form.Item>
                            <div style={{textAlign: "right",marginLeft: "38px"}}>
                                <Button type="primary" htmlType="submit">
                                    确定
                                </Button>
                                <Button onClick={this.props.onClose} style={{marginLeft: 10}}>
                                    取消
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </Modal>
            </React.Fragment>
        )
    }
}

