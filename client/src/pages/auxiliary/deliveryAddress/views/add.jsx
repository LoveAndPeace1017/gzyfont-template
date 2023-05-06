import React, {Component} from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Input, message, Select } from 'antd';
import {connect} from 'react-redux';
import intl from 'react-intl-universal';
import defaultOptions from 'utils/validateOptions';
import {bindActionCreators} from "redux";
import Area from 'components/widgets/area';

import {asyncFetchAddressList, asyncAddAddress} from "../actions";



class FormContent extends Component {
    onChange = (value,obj)=> {
        this.props.form.setFieldsValue({
            provinceText: obj[0]?obj[0].label:'',
            cityText: obj[1]?obj[1].label:'',
        });
    };

    render() {
        const {getFieldDecorator,getFieldValue} = this.props.form;
        const labelName = intl.get("auxiliary.deliveryAddress.labelName");
        console.log(this.props);
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
        getFieldDecorator('id', {
            initialValue: this.props.id
        });
        return (
            <Form>
                <Form.Item
                    {...formItemLayout}
                    label={intl.get("auxiliary.deliveryAddress.cityCode")}
                >
                    {getFieldDecorator('cityCode', {
                        initialValue: [this.props.receiverProvinceCode,this.props.receiverCityCode],
                        rules: [
                            {
                                required: true,
                                message: ' '
                            },
                            {
                                validator: (rules, val, callback) => {
                                    if(!val[0]){
                                        callback(intl.get("auxiliary.deliveryAddress.validate1"))
                                    }else{
                                        callback();
                                    }
                                }
                            }
                        ]
                    })(
                        <Area onChange={this.onChange}/>
                    )}
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label={labelName}
                >

                    {getFieldDecorator('paramName', {
                        ...defaultOptions,
                        initialValue: this.props.incomeName,
                        rules: [
                            {
                                required: true,
                                message: intl.get("auxiliary.deliveryAddress.validate2")
                            },
                            {
                                max: 50,
                                message: intl.get("auxiliary.deliveryAddress.validate3")
                            }
                        ],
                    })(
                        <Input maxLength={50}/>
                    )}
                </Form.Item>
                <div style={{display:"none"}}>
                    {getFieldDecorator('provinceText', {
                        initialValue:this.props.receiverProvinceText
                    })(
                        <Input   />
                    )}
                    {getFieldDecorator('cityText', {
                        initialValue:this.props.receiverCityText
                    })(
                        <Input  />
                    )}
                </div>
            </Form>
        )
    }
}

class Add extends Component {

    constructor(props) {
        super(props);
    }

    closeModal = () => {
        this.props.onClose();
    };

    handleCreate = () => {
        this.props.form.validateFields((err, values) => {
            if (err) {
                return;
            }
            const oper = this.props.id ? 'edit' : 'add';
            this.props.asyncAddAddress(oper, values, (res) => {
                if (res.data.retCode === '0') {
                    //重新获取列表数据
                    this.props.asyncFetchAddressList(this.props.type);
                    console.log(values,'values');
                    this.props.callback && this.props.callback(values.cityCode[0]+' '+values.provinceText+' '+values.cityCode[1]+' '+values.cityText+' '+values.paramName);
                    message.success(intl.get('common.confirm.success'));
                    this.props.form.resetFields();
                    this.props.onClose();
                }
                else {
                    if(res.data.retCode === '2001'){
                        alert(res.data.retMsg);
                    }else{
                        alert(res.data.retMsg+res.data.retValidationMsg.msg[0].msg);
                    }

                }
            })
        })
    };

    render() {
        return (
            <Modal
                title={this.props.id?intl.get("auxiliary.deliveryAddress.editor"):intl.get("auxiliary.deliveryAddress.add")}
                visible={this.props.visible}
                onCancel={this.closeModal}
                width={800}
                onOk={this.handleCreate}
                confirmLoading={this.props.addAddress.get('isFetching')}
                destroyOnClose={true}
            >
                <FormContent {...this.props}/>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        addAddress: state.getIn(['auxiliaryAddress', 'addAddress'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncAddAddress,
        asyncFetchAddressList
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Add))
