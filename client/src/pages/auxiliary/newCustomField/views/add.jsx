import React, {Component} from 'react';
import { Modal, Input, message, Select, Form, Radio, Alert} from 'antd';
import {connect} from 'react-redux';
import defaultOptions from 'utils/validateOptions';
import {bindActionCreators} from "redux";
import {asyncAddNewCustomField, asyncFetchNewCustomFieldList} from '../actions';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import styles from "../styles/index.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

class FormContent extends Component {

    state = {
        type: this.props.type||'text',
        required: 0,
        precision: 2
    }

    typeChange = (value)=>{
        this.setState({
            type:value
        })
    }

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

        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: { span: 10, offset: 8 },
                sm: { span: 10, offset: 8 },
            },
        };

        let {formRef,extra,required,type} = this.props;
        extra && (extra = JSON.parse(extra));
        required && (required = required?1:0);

        //获取选项中的key最大值
        let i = 0;
        if(extra && extra.options && extra.options.length>0){
            let option = extra.options;
            let maxKey = 0;
            option.forEach((item)=>{
                let key = item.key/1;
                if(key>maxKey) maxKey = key;
            });
            i = maxKey + 1;
        }

        return (
            <Form ref={formRef}>
                {
                    this.props.id ? (
                        <Form.Item
                            {...formItemLayout}
                            wrapperCol={{
                                xs: {span: 24},
                                sm: {span: 12},
                            }}
                            colon={false}
                            label={<React.Fragment/>}
                        >
                            <Alert message={"修改后，历史单据里的选项信息会被同步更新！"} type="info" showIcon/>
                        </Form.Item>
                    ) : null
                }
                <Form.Item
                    {...formItemLayout}
                    label={"字段名称"}
                    name={"propName"}
                    initialValue={this.props.customFieldName}
                    rules={[
                        {
                            required: true,
                            message: '字段名称为必填项'
                        },
                        {
                            max: 20,
                            message: '字段名称最多可以输入20个字符'
                        }
                    ]}
                >
                    <Input maxLength={20}/>
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label={"字段类型"}
                    name={"type"}
                    initialValue={type||this.state.type}
                >
                    <Select disabled={this.props.id || this.props.moduleName==='prod'} onChange={this.typeChange}>
                        <Select.Option value={'text'} key={1}>文本</Select.Option>
                        <Select.Option value={'number'} key={2}>数值</Select.Option>
                        <Select.Option value={'select'} key={3}>单选项</Select.Option>
                        <Select.Option value={'date'} key={4}>日期</Select.Option>
                    </Select>
                </Form.Item>


                {this.state.type === 'number'?
                    <>
                        <Form.Item
                            {...formItemLayout}
                            label={"小数位数"}
                            name={"precision"}
                            initialValue={extra && extra.precision || this.state.precision}
                        >
                            <Select>
                                {
                                    [2,3,4,5,6,7,8,9].map((item)=>{
                                        if(extra && extra.precision){
                                            return <Select.Option disabled={item<(extra.precision/1)} value={item} key={item}>{item}</Select.Option>
                                        }else{
                                            return <Select.Option value={item} key={item}>{item}</Select.Option>
                                        }
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </>
                :null}


                {this.state.type === 'select'?
                    <>
                        <Form.List
                            name="options"
                            initialValue={extra && extra.options||[{}]}
                        >
                            {
                                (fields, { add, remove }, { errors }) => (
                                    <React.Fragment>
                                        {fields.map((field, index) => (
                                                <Form.Item
                                                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                                                    label={index === 0 ? '设置选项' : ''}
                                                    key={field.key}
                                                    required={true}
                                                >
                                                    <Form.Item
                                                        {...field}
                                                        name={[field.name,'value']}
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: "设置选项为必填项"
                                                            }
                                                        ]}
                                                    >
                                                        <Input placeholder={"请输入选项名称"} maxLength={20}/>
                                                    </Form.Item>
                                                    <Form.Item
                                                        key={field.key+10000}
                                                        style={{display: "none"}}
                                                        name={[field.name,'key']}
                                                        initialValue={i}
                                                    >
                                                        <Input/>
                                                    </Form.Item>
                                                    <div className={cx("field-ope")}>
                                                        {fields.length > 1 ?
                                                            <MinusCircleOutlined style={{marginRight: "10px"}} onClick={() => {remove(field.name)}} /> : ""}
                                                        {fields.length < 10 ?
                                                            <PlusCircleOutlined onClick={() => {add();i=i+1}} /> : ""}
                                                    </div>
                                                </Form.Item>
                                        ))}
                                    </React.Fragment>
                                )
                            }
                        </Form.List>
                    </>
                 :null}


                <Form.Item
                    {...formItemLayout}
                    label={"是否必填"}
                    name={"required"}
                    initialValue={required || this.state.required}
                >
                    <Radio.Group>
                        <Radio value={1} disabled={this.props.moduleName==='prod'}>是</Radio>
                        <Radio value={0}>否</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item name="id" style={{display: "none"}} initialValue={this.props.id}>
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
            //重新拼装后端需要的数据结构
            let obj = {
                propName: values.propName,
                required: values.required,
                type: values.type
            };
            switch (values.type){
                case 'number':
                    let extra = {
                        precision:values.precision
                    };
                    obj.extra = extra;
                    break;
                case 'select':
                    let extra1 = {
                        options:values.options
                    };
                    obj.extra = extra1;
                    break;
            }
            if(values.id) obj.id = values.id;
            obj.moduleName = this.props.moduleName;
            let type = values.id?'edit':'add';
            this.props.asyncAddNewCustomField(type,obj, (res) => {
                if (res.data.retCode === '0') {
                    //重新获取列表数据
                    this.props.fetchData();
                    message.success('操作成功！');
                    this.formRef.current.resetFields();
                    this.props.onClose();
                } else {
                    message.error(res.data.retMsg+res.data.retValidationMsg.msg[0].msg)
                }
            })
        });

    };

    render() {
        const titleName = this.props.customFieldName? '修改自定义字段':'新建自定义字段';
        return (
            <Modal
                title={titleName}
                visible={this.props.visible}
                onCancel={this.closeModal}
                width={800}
                onOk={this.handleCreate}
                confirmLoading={this.props.addCustomField.get('isFetching')}
                destroyOnClose={true}
            >
                <FormContent formRef={this.formRef} {...this.props}/>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        addCustomField: state.getIn(['auxiliaryNewCustomField', 'addNewCustomField'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncAddNewCustomField,
        asyncFetchNewCustomFieldList
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Add)
