import React, {Component} from 'react';
import '@ant-design/compatible/assets/index.css';
import { Modal, Input, message, Select ,Col, Row, Form, Button} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import {asyncFetchDeviceManageList, asyncAddDeviceManage} from "../actions";
import {SelectEmployeeIdFix} from 'pages/auxiliary/employee';
import { FormInstance } from 'antd/lib/form';
import classNames from "classnames/bind";
import styles from "../styles/index.scss";
const cx = classNames.bind(styles);

const {TextArea} = Input;


class FormContent extends Component {

    onFinish = (values) => {
        console.log(values);
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

        console.log(this.props.data,'this.props.data');

        return (
            <React.Fragment>
            <Form name={"deviceManage"} ref={this.props.formRef} onFinish={this.onFinish}>
                <Row>
                    <Col span={22}>
                        <Form.Item
                            {...formItemLayout}
                            name={"equipmentCode"}
                            label={"设备编号"}
                            initialValue={this.props.id?this.props.data.equipmentCode:''}
                            rules={[
                                {
                                    required: true,
                                    message: "设备编号为必填项"
                                }
                            ]}
                        >
                            <Input disabled={this.props.id} maxLength={20}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={22}>
                        <Form.Item
                            {...formItemLayout}
                            label={"设备名称"}
                            name={"equipmentName"}
                            initialValue={this.props.id?this.props.data.equipmentName:''}
                            rules={[
                                {
                                    required: true,
                                    message: "设备名称为必填项"
                                }
                            ]}
                        >
                            <Input maxLength={20}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={22}>
                        <Form.Item
                            {...formItemLayout}
                            label={"负责人"}
                            initialValue={this.props.id?this.props.data.officerId:''}
                            name={"officerId"}
                        >
                            <SelectEmployeeIdFix width={366}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={22}>
                        <Form.Item
                            {...formItemLayout}
                            label={"备注"}
                            name={"remarks"}
                            initialValue={this.props.id?this.props.data.remarks:null}
                        >
                            <TextArea rows={4} maxLength={2000} placeholder="备注"/>
                        </Form.Item>
                    </Col>
                </Row>

            </Form>
            </React.Fragment>
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
            console.log(values,'values');
            this.props.asyncAddDeviceManage(this.props.id?'edit':'add', values, (res) => {
                console.log(res,'ressss');
                if (res.data.retCode === '0') {
                    //重新获取列表数据
                    this.props.asyncFetchDeviceManageList();
                    message.success(this.props.id?'修改成功！':'新增成功！');
                    this.props.callback && this.props.callback(values);
                    this.closeModal();
                }
                else {
                    message.error(res.data.retMsg);
                }
            })

        })
    };

    render() {
        return (
            <Modal
                title={this.props.id?"修改设备":"新建设备"}
                visible={this.props.visible}
                onCancel={this.closeModal}
                width={1000}
                onOk={this.handleCreate}
                confirmLoading={this.props.addDeviceManage.get('isFetching')}
                destroyOnClose={true}
            >
                <FormContent formRef={this.formRef} {...this.props}/>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        addDeviceManage: state.getIn(['auxiliaryDeviceManage', 'addDeviceManage'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchDeviceManageList,
        asyncAddDeviceManage
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Add)
