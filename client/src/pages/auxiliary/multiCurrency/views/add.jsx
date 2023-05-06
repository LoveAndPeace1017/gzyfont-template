import React, {Component} from 'react';
import { Modal, Input, message, Form } from 'antd';
import {connect} from 'react-redux';
import defaultOptions from 'utils/validateOptions';
import {bindActionCreators} from "redux";
import {getCookie} from 'utils/cookie';
import {asyncFetchMultiCurrencyList, asyncAddMultiCurrency} from "../actions";


class Add extends Component {
    formRef = React.createRef();

    //表单宽度
    static formItemLayout = {
        labelCol: {
            xs: {span: 24},
            sm: {span: 8},
        },
        wrapperCol: {
            xs: {span: 24},
            sm: {span: 10},
        }
    };

    constructor(props) {
        super(props);
    }

    closeModal = () => {
        this.props.onClose();
    };

    handleCreate = () => {
        this.formRef.current.validateFields().then((values)=>{
            const oper = this.props.id ? 'edit' : 'add';
            this.props.asyncAddMultiCurrency(oper, values, (res) => {
                if (res.data.retCode === '0') {
                    //重新获取列表数据
                    this.props.asyncFetchMultiCurrencyList();
                    this.props.callback && this.props.callback(values.paramName);
                    message.success('操作成功!');
                    this.formRef.current.resetFields();
                    this.props.onClose();
                }
                else {
                    message.error(res.data.retMsg+res.data.retValidationMsg.msg[0].msg);
                }
            })
        })
    };

    render() {
        let quantityDecimalNum = Number(getCookie("quantityDecimalNum")||3);
        return (
            <Modal
                title={this.props.id ? "修改币种" : "新建币种"}
                visible={this.props.visible}
                onCancel={this.closeModal}
                width={800}
                onOk={this.handleCreate}
                confirmLoading={this.props.addMultiCurrency.get('isFetching')}
                destroyOnClose={true}
            >
                <Form ref={this.formRef}>
                    <Form.Item
                        {...defaultOptions}
                        {...Add.formItemLayout}
                        label={'币种名称'}
                        initialValue={this.props.incomeName}
                        name={'paramKey'}
                        rules={[{required: true, message: "币种名称为必填项！"}, {max: 10, message: "币种名称不能超过10个字符!"}]}
                    >
                        <Input placeholder={"如USD"} maxLength={10}/>
                    </Form.Item>

                    <Form.Item
                        {...defaultOptions}
                        {...Add.formItemLayout}
                        label={'牌价'}
                        initialValue={this.props.paramValue}
                        name={'paramValue'}
                        rules={[{required: true, message: "牌价为必填项！"}, {
                            validator: (rules, value, callback) => {
                                let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+ quantityDecimalNum +'})?$/');
                                if (value && !reg.test(value)) {
                                    callback(`整数部分不能超过10位，小数点后不能超过${quantityDecimalNum}位`);
                                }
                                callback();
                            }
                        }]}
                    >
                        <Input disabled={this.props.defaultCurrency === 1} placeholder={"100inCNY如637.09"}/>
                    </Form.Item>

                    <Form.Item name="id" initialValue={this.props.id}>
                        <Input type="hidden"/>
                    </Form.Item>

                    <Form.Item name="paramModule" initialValue={this.props.paramModule}>
                        <Input type="hidden"/>
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        addMultiCurrency: state.getIn(['auxiliaryMultiCurrency', 'addMultiCurrency'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncAddMultiCurrency,
        asyncFetchMultiCurrencyList
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Add)
