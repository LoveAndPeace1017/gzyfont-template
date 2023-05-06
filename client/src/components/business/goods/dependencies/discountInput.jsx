import React, {Component} from 'react';
import { Input, Form } from 'antd';
import {formatCurrency, removeCurrency} from 'utils/format';
/**
 *  优惠金额输入框功能
 *
 * @visibleName DiscountInput(优惠金额)
 * @author jinb
 *
 */

export default class DiscountInput extends Component {
    constructor(props) {
        super(props);
    }

    static formItemLayout = {
        labelCol: {
            xs: {span: 24},
            sm: {span: 10},
        },
        wrapperCol: {
            xs: {span: 24},
            sm: {span: 14},
        }
    };

    onChange = (e) => {
        let value = e.target.value;
        this.props.onChange(value);
    };

    openModal = (tag)=>{
        this.setState({
            [tag]:true
        })
    };

    closeModal = (tag)=>{
        this.setState({
            [tag]:false
        })
    };


    render() {
        const {title, discountAmount} = this.props;

        return (
            <React.Fragment>
                <Form.Item
                    label={title}
                    {...DiscountInput.formItemLayout}
                    name="discountAmount"
                    initialValue={discountAmount || 0}
                    rules={[
                        {
                            validator: (rules, value, callback) => {
                                let {getFieldInstance} =  this.props.formRef.current;
                                let totalAmount = getFieldInstance('totalAmount').state.value;

                                if(totalAmount) totalAmount = Number(removeCurrency(totalAmount));
                                const reg = /^(0|[1-9]\d{0,9})(\.\d{1,2})?$/;
                                if(!value){
                                    callback();
                                } else if (!reg.test(value)) {
                                    callback('整数部分不能超过10位，小数点后不能超过2位');
                                } else if(value > totalAmount) {
                                    callback('优惠金额不能大于含税总金额');
                                }
                                callback();
                            }
                        }
                    ]}
                >
                    <Input
                        onBlur={this.onChange}
                        style={{width:'100%', ...this.props.style}}
                        maxLength={this.props.maxLength}
                    />
                </Form.Item>
            </React.Fragment>
        );
    }
}

