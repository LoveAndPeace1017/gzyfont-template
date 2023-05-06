import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {Form, Button, Radio, message, Modal} from 'antd';
import 'url-search-params-polyfill';
import {actions as productControlShowActions} from 'pages/productControl/show';
import {actions as employeeActions} from "pages/auxiliary/employee";
import {actions as auxiliaryWorkCenterActions} from 'pages/auxiliary/workCenter';
import OperateTable0 from './operate_0';
import OperateTable1 from './operate_1';

/**
 * @visibleName Index（新增报工单）
 * @author jinb
 */
const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchEmployeeList: employeeActions.asyncFetchEmployeeList,
        asyncFetchWorkCenterDetail: auxiliaryWorkCenterActions.asyncFetchWorkCenterDetail,
        asyncAddWorkSheetReport: productControlShowActions.asyncAddWorkSheetReport,
    }, dispatch)
};

@withRouter
@connect(null, mapDispatchToProps)
export default class Index extends Component {
    formRef = React.createRef();
    getTable0Ref = (ref)=>{
        this.table0Ref = ref;
    };
    getTable1Ref = (ref)=>{
        this.table1Ref = ref;
    };
    constructor(props) {
        super(props);
        this.state = {
            onlyReport: 0, // 0：报工+质检  1：报工
            formList: [],  // 初始时form列表的数据
        }
    }

    static tailLayout = {
        wrapperCol: { offset: 20, span: 16 }
    };

    componentDidMount() {
        this.props.getRef && this.props.getRef(this);
    }

    // 初始化新增工单操作
    initOperate = async() => {
        await this.getEmployeeList();
        await this.getWorkCenterDetail();
        await this.fillFormList(0)
    };

    // 工序 报工操作
    getWorkCenterDetail =  () => {
        let { caCode } = this.props.info;
        return new Promise((resolve, reject) => {
            if(caCode){
                this.props.asyncFetchWorkCenterDetail(caCode, (res) => {
                    if(res && res.retCode==='0'){
                        let pwceList = res.data.pwceList;  // 工作中心对应的员工列表
                        let formList = pwceList && pwceList.map((item, index) => {
                            let out = {key: index, employeeId: item.employeeId};
                            return out;
                        });
                        this.setState({formList});
                        resolve();
                    }
                });
            } else {
                let formList = [{key: 0}];
                this.setState({formList});
                resolve();
            }
        });
    };

    // 获取员工列表
    getEmployeeList = () => {
        return new Promise((resolve, reject) => {
            this.props.asyncFetchEmployeeList({}, (data) => {
                if(data.retCode === '0'){
                    resolve(); 
                }
            });
        });
    };

    // 改变类型
    handleOnChangeType = async(e) => {
        let onlyReport = e.target.value;
        await this.setState({ onlyReport });
        await this.fillFormList(onlyReport);
    };

    // 初始化表单列表数据
    fillFormList = (onlyReport) => {
        let ref = onlyReport === 0 ? 'table0Ref' : 'table1Ref';
        let {formList} = this.state;
        this[ref].props.initFormList(formList);
    };

    // 新建报工记录
    handleSubmit = (values) => {
        let { id, billNo } = this.props.info;
        let { reports_0, reports_1, finish, onlyReport } = values;
        let reports = (onlyReport === 0) ? reports_0 : reports_1;
        reports = reports.filter(item => item!=null);
        let params = { id, billNo,  reports, finish, onlyReport };
        this.props.asyncAddWorkSheetReport(params, (res) => {
            if(res && res.retCode==="0"){
                message.success('操作成功');
                this.emptyInfo(); // 清空 表单数据
                this.props.onOk();
            } else {
                Modal.error({
                    title: "提示信息",
                    content: res.retMsg || '操作失败'
                })
            }
        });
    };

    // 还原表单数据
    emptyInfo = async() => {
        this.table0Ref && await this.table0Ref.props.clearAllRows(); // 清空 表单数据
        this.table1Ref && await this.table1Ref.props.clearAllRows(); // 清空 表单数据
        await this.formRef.current.setFieldsValue({onlyReport: 0, finish: 0});
        await this.setState({onlyReport: 0});
    };

    render() {
        let { onlyReport } = this.state;

        return (
            <React.Fragment>
                <Form ref={this.formRef}
                      onFinish={(values) => {
                          this.handleSubmit(values);
                      }}
                >
                    <Form.Item
                        label={'类型'}
                        name={'onlyReport'}
                        initialValue={0}
                    >
                        <Radio.Group onChange={this.handleOnChangeType}>
                            <Radio value={1}>仅报工</Radio>
                            <Radio value={0}>报工并质检</Radio>
                        </Radio.Group>
                    </Form.Item>

                    {
                        onlyReport === 0 ? (
                            <OperateTable0
                                dataPrefix={'reports_0'}
                                getRef={this.getTable0Ref}
                                formRef={this.formRef} />
                        ) : (
                            <OperateTable1
                                dataPrefix={'reports_1'}
                                getRef={this.getTable1Ref}
                                formRef={this.formRef}/>
                        )
                    }

                    {
                        onlyReport === 0 && (
                            <Form.Item
                                label={'同时完成工序'}
                                name={'finish'}
                                initialValue={1}
                                style={{"marginTop": "20px"}}
                            >
                                <Radio.Group>
                                    <Radio value={1}>是</Radio>
                                    <Radio value={0}>否</Radio>
                                </Radio.Group>
                            </Form.Item>
                        )
                    }

                    <Form.Item {...Index.tailLayout} style={{"marginTop": '15px'}}>
                        <Button type="primary" htmlType="submit">
                            确定
                        </Button>
                        <Button onClick={() => {this.props.onCancel();}} style={{marginLeft: 10}}>
                            取消
                        </Button>
                    </Form.Item>
                </Form>
            </React.Fragment>
        )
    }
}

