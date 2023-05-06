import React, {Component} from 'react';
import {Form, Modal, Input, Select, message } from 'antd';
import {connect} from 'react-redux';
import intl from 'react-intl-universal';
import defaultOptions from 'utils/validateOptions';
import {bindActionCreators} from "redux";
import {asyncAddEmployee, asyncFetchEmployeeList} from '../actions';
import {actions as auxiliaryDeptActions} from 'pages/auxiliary/dept';

const {Option} = Select;

class FormContent extends Component {
    constructor(props){
        super(props);
        this.state = {
            supplier:{departName: ''}
        };
    }
    componentDidMount() {
        this.props.asyncFetchDeptEmp();
        let curEmployeeData = this.props.curEmployeeData;
        let upValue = this.props.upValue;
        let upValueName = this.props.upValueName;
        if(curEmployeeData){
            this.setState({departName: curEmployeeData.get('department')});
        }else{
            this.setState({departName: upValueName});
        }
    }

    handleChange = (val) => {
        this.setState({departName: val.label});
    };

    render() {

        const {formRef, deptEmployee, curEmployeeData,upValue,upValueName} = this.props;
        const {departName} = this.state;

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

        const deptData = deptEmployee && deptEmployee.getIn(['data', 'data']);

        /*getFieldDecorator('id', {
            initialValue: curEmployeeData?curEmployeeData.get('id'):''
        });*/

        return (
            <Form ref={formRef}>
                <Form.Item
                    {...formItemLayout}
                    label={intl.get("auxiliary.employee.dept")}
                    name={"dept"}
                    { ...defaultOptions}
                    initialValue={{
                        key: curEmployeeData?curEmployeeData.get('deptId'):upValue,
                        label: curEmployeeData?curEmployeeData.get('department'):upValueName
                    }}
                    rules={
                        [
                            {
                                required: true,
                                message: "部门为必填项"
                            }
                        ]
                    }
                >
                    <Select
                        labelInValue
                        onChange={this.handleChange}
                    >
                        {deptData && deptData.size > 0 && deptData.map(dept => <Option key={dept.get('deptId')}
                                                                                       value={dept.get('deptId')}>{dept.get('deptName')}</Option>)}
                    </Select>
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    label={intl.get("auxiliary.employee.employeeName")}
                    name={"employeeName"}
                    initialValue={curEmployeeData?curEmployeeData.get('employeeName'):''}
                    rules={[
                        {
                            required: true,
                            message: intl.get("auxiliary.employee.validate2")
                        },
                        {
                            max: 25,
                            message: intl.get("auxiliary.employee.validate3")
                        },
                        {
                            validator: (rules, val, callback) => {
                                this.props.asyncCheckName({params:{name: val, layerName: 'employees', extParam: departName, recId: curEmployeeData && curEmployeeData.get('id')}}, function(res) {
                                    if (res.data.data && res.data.retCode === '0') {
                                        callback(intl.get("auxiliary.employee.validate4"))
                                    }
                                    else {
                                        callback();
                                    }
                                }, function(error) {
                                    callback(error);
                                })
                            }
                        }
                    ]}
                >
                    <Input placeholder={intl.get("auxiliary.employee.placeholder")} maxLength={25}/>
                </Form.Item>
                <Form.Item
                    {...formItemLayout}
                    {...defaultOptions}
                    label={intl.get("auxiliary.employee.telNo")}
                    name={"telNo"}
                    initialValue={curEmployeeData?curEmployeeData.get('telNo'):''}
                    rules={[
                        {
                            max: 50,
                            message: intl.get("auxiliary.employee.validate5")
                        }
                    ]}
                >
                    <Input placeholder={intl.get("auxiliary.employee.placeholder1")} maxLength={50}/>
                </Form.Item>
                <Form.Item name="id" initialValue={curEmployeeData?curEmployeeData.get('id'):''}>
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
            const oper = values.id ? 'edit' : 'add';
            this.props.asyncAddEmployee(oper, values , (res) => {
                if (res.data.retCode === '0') {
                    //重新获取列表数据
                    this.props.asyncFetchEmployeeList();
                    console.log(res.data, '&&');
                    this.props.callback && this.props.callback(res.data.data.id, res.data.data.employeeName);
                    message.success(intl.get('common.confirm.success'));
                    this.formRef.current.resetFields();
                    this.props.onClose();
                }
                else {
                    message.error(res.data.retMsg)
                }
            })
        });
    };


    render() {
        const {curEmployeeData} = this.props;
        const titleName =  curEmployeeData ?intl.get("auxiliary.employee.editor") :intl.get("auxiliary.employee.new");
        return (
            <Modal
                title={titleName}
                visible={this.props.visible}
                onCancel={this.closeModal}
                width={800}
                onOk={this.handleCreate}
                confirmLoading={this.props.addEmployee.get('isFetching')}
                destroyOnClose={true}
            >
                <FormContent formRef={this.formRef} {...this.props}/>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        deptEmployee: state.getIn(['auxiliaryDept', 'deptEmployee']),
        addEmployee: state.getIn(['auxiliaryEmployee', 'addEmployee'])
    }
};

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncAddEmployee,
        asyncFetchEmployeeList,
        asyncCheckName: auxiliaryDeptActions.asyncCheckName,
        asyncFetchDeptEmp: auxiliaryDeptActions.asyncFetchDeptEmp
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(Add);
