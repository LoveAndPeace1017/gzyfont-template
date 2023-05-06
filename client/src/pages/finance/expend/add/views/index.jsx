import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {connect} from 'react-redux';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Row, Col, Input, message, DatePicker, Spin, Radio, Modal } from 'antd';
const RadioGroup = Radio.Group;
const {TextArea} = Input;

import {Url, parse} from 'url'

import defaultOptions from 'utils/validateOptions';

import classNames from "classnames/bind";
import styles from "../styles/index.scss";
import {bindActionCreators} from "redux";
import {asyncAddExpend, asyncEditExpend, asyncFetchExpendById} from '../actions';
import AddForm, {actions as addFormActions, oldFormCreate}  from 'components/layout/addForm'
import Crumb from 'components/business/crumb';
import Fold from 'components/business/fold';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import SelectIncomeType from "pages/auxiliary/income/views/selectIncomeType";
import AttachmentUpload from 'components/business/attachmentUpload';
import {actions as approveActions, SelectApproveItem, BACKEND_TYPES, withApprove} from  'components/business/approve';  //***
import {addPage} from  'components/layout/listPage';  //***
import {actions as vipOpeActions} from "components/business/vipOpe";  // ***
import {actions as vipServiceHomeActions} from "pages/vipService/index";  // ***
import {actions as commonActions} from "components/business/commonRequest";
import {SelectEmployeeFix} from 'pages/auxiliary/employee';
import UpperBill from './upperBill';
import EditType from '../../../editType'
import {fromJS} from "immutable";
import {withRouter} from "react-router-dom";
import FinanceIncomeAddForm from "../../../income/add/views";


const mapStateToProps = (state) => ({
    expendInfo: state.getIn(['financeExpendAdd', 'expendInfo']),
    addExpend: state.getIn(['financeExpendAdd', 'expendInfo'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncAddExpend,
        asyncEditExpend,
        asyncFetchExpendById,
        setInitFinished: addFormActions.setInitFinished,
        asyncGetApproveStatus: approveActions.asyncGetApproveStatus,  // ***
        asyncOpenVipAndSendRequestToOss: vipOpeActions.asyncOpenVipAndSendRequestToOss,  // ***
        asyncFetchVipService: vipServiceHomeActions.asyncFetchVipService,  // ***
        asyncFetchGetContinueCreate: commonActions.asyncFetchGetContinueCreate,
        asyncFetchSetContinueCreate: commonActions.asyncFetchSetContinueCreate,
    }, dispatch)
};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
@withApprove
@oldFormCreate
export default class FinanceExpendAddForm extends addPage {
    constructor(props) {
        super(props);

        const uri = parse(props.location.search, true);

        this.state = {
            supplierNameEditEnabled: !(uri && uri.query.fkBillNo && uri.query.fkBillNo.length > 0),
            option: EditType.Add,
            selectModalVisible: false,
            fileList: [],
            flag: true,
            selectApprove: false,  // 选择审批流弹层 ***
            approveModuleFlag: 0,  // 当前模块是否开启审批权限 0 无 1 有 ***
            approveStatus: 0,   //审批状态 0 未提交  1 通过  2 反驳  3 审批中 ***
            submitData: {}, // 新增最终提交表单的信息  ***
            continueAddFlag: true,  //连续新增Flag
            typeKey: "Payment"
        };
    }

    componentDidMount() {
        let recId = this.props.match.params.id;
        //获取连续新建Flag
        this.getContinueCreateFlag();
        if (recId) {
            if (this.props.match.path.indexOf('/copy/') !== -1) {
                this.setState({option: EditType.Copy});
            } else {
                this.setState({option: EditType.Modify});
            }
            this.props.asyncFetchExpendById(recId, (data) => {
                const formData = data.get('data').get(0);
                this.setState({
                    approveStatus: formData.get('approveStatus'),
                    approveModuleFlag: data.get('approveModuleFlag')
                });
                this.props.form.setFieldsValue({
                    paymentDate: this.state.option === EditType.Copy ? moment() : moment(formData.get('paymentDate')),
                    supplierName: formData.get('supplierName'),
                    account: {
                        key: formData.get('accountId'),
                        label: formData.get('accountName')
                    },
                    incomeType: {
                        key: formData.get('typeId'),
                        label: formData.get('typeName')
                    },
                    ourContacterName:  formData.get('ourContacterName'),
                    bindBillType: formData.get('bindBillType'),
                    billNo: formData.get('billNo'),
                    remarks: formData.get('remarks')
                });
                if(formData.get('bindBillType') == 0){
                    this.props.form.setFieldsValue({
                        amount: formData.get('amount')
                    })
                }
                this.props.emptyFieldChange();
                this.props.setInitFinished();
            });
        } else {
            const searchQuery = parse(this.props.location.search, true);
            const query = searchQuery.query;
            // const fkBillNo = query.fkBillNo;
            // if (fkBillNo) {
            //     this.props.form.setFieldsValue({
            //         amount: query.amount,
            //         supplierName: query.supplier,
            //     });
            //     this.props.emptyFieldChange();
            //     this.props.setInitFinished();
            // }
        }
    }

    closeModal = (type) => {
        this.setState({
            [type]: false
        })
    };

    // 选择模版页面确认操作
    extendApproveOkModal = (approveId) => {
        let {submitData} = this.state;
        if(approveId){
            submitData.json.process = approveId;
            submitData.json.commitFlag = 1;
        }
        this.setState({submitData}, () => {
            this.closeModal('selectApprove');
            this.asyncSubmit();
        });
    };

    extendApproveCancelModal = ()=>{
        let {submitData} = this.state;
        //commitFlag 0不提交 1提交
        submitData.json.commitFlag = 0;
        this.setState({submitData}, () => {
            this.closeModal('selectApprove');
            this.asyncSubmit();
        });
    };

    backCustomerOrSupplier = (selectedRows) => {
        this.props.form.setFieldsValue({
            supplierName: selectedRows[0].supplierName,
        });
    };

    handleEditResult = (data) => {
        console.log(data);
        if (data && data.retCode == 0) {
            message.success(intl.get("expend.add.index.operateSuccessMessage"));
            this.props.emptyFieldChange();
            const id = this.state.option !== EditType.Modify ? data.data : this.props.match.params.id;
            let continueAddFlag = this.state.option !== EditType.Modify && this.state.continueAddFlag;
            let url = continueAddFlag ? '/blank' :`/finance/expend/show/${id}`;
            this.props.history.push(url);
            continueAddFlag && this.props.history.goBack();
        } else {
            Modal.error({
                title: intl.get("expend.add.index.warningTip"),
                content: (data && data.retMsg) || intl.get("expend.add.index.operateFailureMessage")
            });
        }
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValues) => {
            let removeEmptyAry = [];
            removeEmptyAry = err && err.dataList.filter((e)=>{
                return e&&e;
            });
            if (!err||(fieldsValues.bindBillType == 0 && (removeEmptyAry[0].displayBillNo!=undefined || removeEmptyAry[0].amount!=undefined))) {
                console.log(fieldsValues);
                let recId = this.props.match.params.id;

                //处理物品信息
                let dataList;
                if (fieldsValues.bindBillType === 1) {
                    dataList = fieldsValues.dataList.filter(item => {
                        return item && Object.values(item).some(v => {
                            return v && v !== '';
                        });
                    });
                }

                let fileIds = this.state.fileList.map(item => item.response.fileId);

                const values = {
                    id: recId,
                    json: {
                        ...fieldsValues,
                        fkBillNo: this.state.fkBillNo,
                        paymentDate: fieldsValues['paymentDate'].format('YYYY-MM-DD'),
                        accountId: fieldsValues['account'] && fieldsValues['account'].key,
                        accountName: fieldsValues['account'] && fieldsValues['account'].label,
                        typeId: fieldsValues['incomeType'] && fieldsValues['incomeType'].key,
                        typeName: fieldsValues['incomeType'] && fieldsValues['incomeType'].label,
                        fileIds,
                        dataList
                    }
                };
                this.setState({submitData: values},()=>{
                    this.props.asyncGetApproveStatus({types: BACKEND_TYPES.expend}, (res) => {
                        if(res.data.retCode === "0") {
                            if(res.data.data === "1"){
                                this.props.submitApproveProcess(() => {
                                    this.cancelApproveOperate();  // 取消操作
                                }, () => {
                                    let {approveModuleFlag, approveStatus, option} = this.state;
                                    // 且当前单据的审批状态为反驳状态 2，则直接提交
                                    if(option!== EditType.Copy && approveModuleFlag===1 && approveStatus===2) {
                                        this.cancelApproveOperate(true);
                                    } else {
                                        this.openModal('selectApprove'); // 否则进入审批流的过程，并提交表单
                                    }
                                });
                            } else {
                                this.asyncSubmit();
                            }
                        }
                    });
                });
            } else {
                message.error('存在信息不符合规则，请修改！');
            }
        });
    };

    // 提交表单数据（新加）***
    asyncSubmit=()=>{
        let self = this;
        let values = this.state.submitData;
        if (this.state.option === EditType.Add || this.state.option === EditType.Copy) {
            this.props.asyncAddExpend(values, function (data) {
                self.handleEditResult(data);
            });
        } else {
            this.props.asyncEditExpend(values, function (data) {
                self.handleEditResult(data);
            });
        }
    };

    render() {
        const {getFieldDecorator, getFieldValue} = this.props.form;
        const {expendInfo} = this.props;
        const dataList = expendInfo.getIn(['data', 'data']);
        const totalAmount = expendInfo.getIn(['data', 'totalAmount']);

        const  approveModuleFlag  = expendInfo.getIn(['data', 'approveModuleFlag']);



        //把后端给的数据字段转换成 FinanceTable 组件dataName属性中的value值
        let initGoodsTableData;
        if (dataList && dataList.getIn([0, 'bindBillType']) === 1) {
            initGoodsTableData = dataList && dataList.map(item => {
                return fromJS({
                    billNo: item.get('orderBillNo'),
                    displayBillNo: item.get('displayBillNo'),
                    aggregateAmount: item.get('aggregateAmount'),
                    payAmount: approveModuleFlag === 1 ? item.get('payAmount'):(item.get('payAmount') - item.get('damount')),
                    amount: item.get('damount'),
                    remarks: item.get('dremarks')
                })
            });
        }
        let copyFlag = (this.props.match.path.indexOf('/copy/') !== -1);
        let addFlag = (this.props.match.path.indexOf('/add') === -1);
        if(dataList && dataList.getIn([0, 'fileInfo']) && this.state.flag && addFlag){
            let newFileInfo = dataList.getIn([0, 'fileInfo']).toJS().map((file, index) => {
                file.uid = -(index+1);
                file.url = `${BASE_URL}/file/download/?url=/file/download/${file.fileId}`;
                file.name = file.fileName;
                file.status = 'done';
                file.response = {
                    fileId: file.fileId
                };
                return file;
            });
            this.setState({fileList: copyFlag?[]:newFileInfo,
                flag: false});
        }

        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            }
        };

        const otherFormItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: '2d66'},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: '21d33'},
            }
        };

        return (
            <React.Fragment>
                <div className="content-hd">
                    <Crumb data={[
                        {
                            url: '/finance/expend',
                            title: intl.get("expend.add.index.expend")
                        },
                        {
                            title: this.state.option === EditType.Modify ? intl.get("expend.add.index.modifyExpendRecord") : intl.get("expend.add.index.addExpendRecord")
                        }
                    ]}/>
                </div>
                <Spin
                    spinning={expendInfo.get("isFetching")}
                >
                    <AddForm onSubmit={this.handleSubmit}
                             isModify={this.state.option === EditType.Modify}
                             setContinueAddFlag={this.setContinueAddFlag}
                             continueAddFlag={this.state.continueAddFlag}
                             loading={this.props.addExpend.get('isFetching')}>
                        <div className="content-bd">
                            <Fold title={intl.get("expend.add.index.baseInfo")}>
                                <Row>
                                    <Col span={8}>
                                        <Form.Item label={intl.get("expend.add.index.paymentDate")} {...formItemLayout}>
                                            {
                                                getFieldDecorator("paymentDate", {
                                                    initialValue: moment(),
                                                    rules: [{type: 'object', required: true, message: intl.get("expend.add.index.paymentDateMessage")}],
                                                })(
                                                    <DatePicker/>
                                                )
                                            }
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item label={intl.get("expend.add.index.incomeType")} {...formItemLayout}>
                                            {getFieldDecorator('incomeType', {
                                                initialValue: {
                                                },
                                                ...defaultOptions,
                                            })(
                                                <SelectIncomeType type='outType' showEdit={true} placeholder={intl.get("expend.add.index.incomeTypePlaceholder")} />
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item label={intl.get("expend.add.index.account")} {...formItemLayout}>
                                            {getFieldDecorator('account', {
                                                initialValue: {
                                                },
                                                ...defaultOptions,
                                            })(
                                                <SelectIncomeType type='account' showEdit={true} placeholder={intl.get("expend.add.index.accountPlaceholder")}/>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item label={intl.get("expend.add.index.supplierName")} {...formItemLayout}>
                                            {getFieldDecorator('supplierName', {
                                                ...defaultOptions,
                                            })(
                                                <Input maxLength={80} disabled={!this.state.supplierNameEditEnabled}
                                                       placeholder={'填写收款方'}/>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item  label={<React.Fragment/>} colon={false} {...formItemLayout}>
                                            {getFieldDecorator('bindBillType', {
                                                ...defaultOptions,
                                                initialValue:  1
                                            })(
                                                <RadioGroup>
                                                    <Radio key={1} value={1}>{intl.get("expend.add.index.bindBillType_1")}</Radio>
                                                    <Radio key={0} value={0}>{intl.get("expend.add.index.bindBillType_0")}</Radio>
                                                </RadioGroup>
                                            )}
                                        </Form.Item>
                                    </Col>
                                    {
                                            <Col span={8} style={getFieldValue('bindBillType') === 0?{display:"block"}:{display:"none"}}>
                                                <Form.Item label={intl.get("expend.add.index.amount")} {...formItemLayout}>
                                                    {getFieldDecorator('amount', {
                                                        ...defaultOptions,
                                                        rules: getFieldValue('bindBillType') === 0?[{
                                                            required: true,
                                                            message: intl.get("expend.add.index.amountMessage1")
                                                        }, {
                                                            validator: (rules, value, callback) => {
                                                                const reg = /^(0|[1-9]\d{0,9})(\.\d{1,2})?$/;
                                                                if (Number.isNaN(value) || !reg.test(value)) {
                                                                    callback(intl.get("expend.add.index.amountMessage2"))
                                                                }
                                                                if (value == 0) {
                                                                    callback(intl.get("expend.add.index.amountMessage3"))
                                                                }
                                                                callback();
                                                            }
                                                        }]:[],
                                                    })(
                                                        <Input placeholder={intl.get("expend.add.index.amountPlaceholder")} autoFocus={true} maxLength={13}
                                                               suffix={intl.get("expend.add.index.yuan")}/>
                                                    )}
                                                </Form.Item>
                                            </Col>
                                    }
                                    {
                                        <div style={getFieldValue('bindBillType') === 1?{display:"block",width:"100%"}:{display:"none"}}>
                                            <Col span={24}>
                                                <AddForm.ProdList>
                                                    <UpperBill
                                                        {...this.props}
                                                        initGoodsTableData={initGoodsTableData}
                                                        initTotalAmount={totalAmount}
                                                        backCustomerOrSupplier={this.backCustomerOrSupplier}
                                                    />
                                                </AddForm.ProdList>
                                            </Col>
                                        </div>
                                    }
                                </Row>
                            </Fold>
                            <Fold title={intl.get("expend.add.index.otherInfo")}>
                                <Row>
                                    <Col span={24}>
                                        <Form.Item
                                            label={"经办人"}
                                            {...otherFormItemLayout}>
                                            {
                                                getFieldDecorator("ourContacterName", {
                                                    initialValue: "",
                                                    ...defaultOptions
                                                })(
                                                    <SelectEmployeeFix width={250}/>
                                                )
                                            }
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <Form.Item
                                            label={intl.get("expend.add.index.remarks")}
                                            {...otherFormItemLayout}>
                                            {
                                                getFieldDecorator("remarks", {
                                                    initialValue: "",
                                                    ...defaultOptions
                                                })(
                                                    <TextArea rows={4} placeholder={intl.get("expend.add.index.remarks")} maxLength={2000}/>
                                                )
                                            }
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <Form.Item
                                            label={intl.get("expend.add.index.tempAtt")}
                                            {...formItemLayout}
                                        >
                                            {
                                                getFieldDecorator("tempAtt", {
                                                    ...defaultOptions
                                                })(
                                                    <AttachmentUpload
                                                        maxLength={'5'}
                                                        fileList={this.state.fileList}
                                                        handleChange={(fileList) => this.setState({fileList})}
                                                    />
                                                )
                                            }
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Fold>
                            <div style={{display: "none"}}>
                                {
                                    getFieldDecorator("billNo", {
                                        ...defaultOptions
                                    })(
                                        <Input type="hidden" />
                                    )
                                }
                            </div>
                        </div>
                    </AddForm>
                    <SelectApproveItem   // ***
                        onClose={this.extendApproveCancelModal}
                        onOk={(id)=>{this.extendApproveOkModal(id)}}
                        show={this.state.selectApprove}
                        type={BACKEND_TYPES.expend}
                    />
                </Spin>
            </React.Fragment>
        );
    }
}

