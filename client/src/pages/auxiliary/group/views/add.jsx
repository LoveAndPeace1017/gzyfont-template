import React, {Component} from 'react';
import { Modal, Input, message, Form } from 'antd';
import {connect} from 'react-redux';
import defaultOptions from 'utils/validateOptions';
import {bindActionCreators} from "redux";
import {asyncFetchGroupList, asyncAddGroup} from '../actions';


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
            this.props.asyncAddGroup(oper, this.props.type, values, (res) => {
                if (res.data.retCode === '0') {
                    //重新获取列表数据
                    this.props.asyncFetchGroupList(this.props.type);
                  /*  const {id, propName} = res.data.data;
                    this.props.callback && this.props.callback({key: id, label: propName});*/
                    message.success('操作成功!');
                    this.props.onClose();
                    this.formRef.current.resetFields();
                }
                else {
                    let retValidationMsg = res.data.retValidationMsg;
                    let detailInfo = retValidationMsg && retValidationMsg.msg && retValidationMsg.msg[0] && retValidationMsg.msg[0].msg;
                    message.error(res.data.retMsg + detailInfo);
                }
            })
        })
    };

    render() {
        const propType = this.props.type ;
        const labelName = propType === 'supply'? "供应商分组" : "客户分组";
        return (
            <Modal
                title={this.props.id ? `修改${labelName}` : `新建${labelName}`}
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
                        label={"分组名称"}
                        initialValue={this.props.groupName}
                        name={'groupName'}
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
        addIncome: state.getIn(['auxiliaryGroup', 'addGroup'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchGroupList,
        asyncAddGroup
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Add)
