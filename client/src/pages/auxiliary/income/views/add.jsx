import React, {Component} from 'react';
import { Modal, Input, message, Form } from 'antd';
import {connect} from 'react-redux';
import defaultOptions from 'utils/validateOptions';
import {bindActionCreators} from "redux";
import {asyncAddIncome, asyncFetchIncomeList} from '../actions';
import {actions as auxiliaryDeptActions} from 'pages/auxiliary/dept';


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
            this.props.asyncAddIncome(oper, values, (res) => {
                if (res.data.retCode === '0') {
                    //重新获取列表数据
                    this.props.asyncFetchIncomeList(this.props.type);
                    const {id, propName} = res.data.data;
                    this.props.callback && this.props.callback({key: id, label: propName});
                    message.success('操作成功!');
                    this.props.onClose();
                    this.formRef.current.resetFields();
                }
                else {
                    message.error(res.data.retMsg)
                }
            })
        })
    };

    render() {
        const propType = this.props.type ;
        const labelName = propType === 'account'? "账户名称" : "类型名称";

        return (
            <Modal
                title={this.props.id ? "修改字段名称" : "新建字段名称"}
                visible={this.props.visible}
                onCancel={this.closeModal}
                width={800}
                onOk={this.handleCreate}
                confirmLoading={this.props.addIncome.get('isFetching')}
                destroyOnClose={true}
            >
                <Form ref={this.formRef}>
                    <Form.Item
                        {...defaultOptions}
                        {...Add.formItemLayout}
                        label={labelName}
                        initialValue={this.props.incomeName}
                        name={'propName'}
                        rules={[{required: true, message: "字段名称为必填项！"}, {max: 20, message: "字段名称不能超过20个字符!"}]}
                    >
                        <Input maxLength={20}/>
                    </Form.Item>

                    <Form.Item name="id" initialValue={this.props.id}>
                        <Input type="hidden"/>
                    </Form.Item>

                    <Form.Item name="propType" initialValue={this.props.type}>
                        <Input type="hidden"/>
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        addIncome: state.getIn(['auxiliaryIncome', 'addIncome'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncAddIncome,
        asyncFetchIncomeList,
        asyncCheckName:auxiliaryDeptActions.asyncCheckName
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Add)
