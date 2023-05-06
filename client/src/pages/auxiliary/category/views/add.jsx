import React, {Component} from 'react';
import { Form, Modal, Input, message, Select } from 'antd';
import {connect} from 'react-redux';
import intl from 'react-intl-universal';
import defaultOptions from 'utils/validateOptions';
import {bindActionCreators} from "redux";

import {asyncAddCate,asyncEditCate, asyncFetchCateList} from '../actions';
import {actions as auxiliaryDeptActions} from 'pages/auxiliary/dept';

class FormContent extends Component {

    render() {
        const {curCateData,formRef} = this.props;

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

        /*getFieldDecorator('code', {
            initialValue: curCateData.code
        });

        getFieldDecorator('parentCatCode', {
            initialValue: curCateData.parentCatCode
        });

        getFieldDecorator('level', {
            initialValue: curCateData.level
        });*/

        return (
            <Form ref={formRef}>
                {
                    curCateData.parentName?(
                        <Form.Item
                            {...formItemLayout}
                            label={intl.get("auxiliary.category.parentCateName")}
                            name={"parentCateName"}
                            initialValue={curCateData.parentName}
                            { ...defaultOptions}
                            rules={[
                                {
                                    required: true,
                                    message: intl.get("auxiliary.category.validate1")
                                }
                            ]}
                        >
                            <Input disabled/>
                        </Form.Item>
                    ):null
                }
                <Form.Item
                    {...formItemLayout}
                    label={intl.get("auxiliary.category.name1")}
                    name={"name"}
                    { ...defaultOptions}
                    initialValue={curCateData.cateName}
                    rules={[
                        {
                            required: true,
                            message: intl.get("auxiliary.category.validate2")
                        },
                        {
                            max: 20,
                            message: intl.get("auxiliary.category.validate3")
                        },
                        // {
                        //     validator: (rules, val, callback) => {
                        //         this.props.asyncCheckName('prod','category', val, function(res) {
                        //             if (res.data && res.data.retCode !== 0 && res.data.retMsg) {
                        //                 callback(res.data.retMsg)
                        //             }
                        //             else {
                        //                 callback();
                        //             }
                        //         }, function(error) {
                        //             callback(error);
                        //         })
                        //     }
                        // }
                    ]}
                >
                    <Input maxLength={20}/>
                </Form.Item>
                <Form.Item name="code" initialValue={curCateData.code}>
                    <Input type="hidden"/>
                </Form.Item>
                <Form.Item name="parentCatCode" initialValue={curCateData.parentCatCode}>
                    <Input type="hidden"/>
                </Form.Item>
                <Form.Item name="level" initialValue={curCateData.level}>
                    <Input type="hidden"/>
                </Form.Item>
            </Form>
        )
    }
}

class Add extends Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
    }

    closeModal = () => {
        this.props.onClose();
    };

    handleCreate = () => {
        this.formRef.current.validateFields().then((values)=>{
            const oper = this.props.curCateData.code ? 'asyncEditCate' : 'asyncAddCate';
            this.props[oper](values, (res) => {
                if (res.data.retCode === '0') {
                    message.success(intl.get('common.confirm.success'));
                    this.props.asyncFetchCateList();
                    this.formRef.current.resetFields();
                    this.props.onClose();
                }
                else {
                    message.error(res.data.retMsg);
                }
            })
        });
    };

    render() {
        return (
            <Modal
                title={intl.get("auxiliary.category.new")}
                visible={this.props.visible}
                onCancel={this.closeModal}
                width={800}
                onOk={this.handleCreate}
                confirmLoading={this.props.addCate.get('isFetching')}
                destroyOnClose={true}
            >
                <FormContent formRef={this.formRef} {...this.props}/>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        addCate: state.getIn(['auxiliaryCate', 'addCate'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncAddCate,
        asyncEditCate,
        asyncFetchCateList,
        asyncCheckName: auxiliaryDeptActions.asyncCheckName
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Add)
