import React, {Component} from 'react';
import {withRouter} from "react-router-dom";
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import {parse} from 'url';
import { Row, Col, Input, message, DatePicker, Spin, Radio, Modal, Form } from 'antd';
import defaultOptions from 'utils/validateOptions';
import {getCookie} from 'utils/cookie';
import {formatCurrency, removeCurrency} from 'utils/format';
import {asyncAddIncome, asyncEditIncome, asyncFetchIncomeById} from '../actions';
import {actions as vipServiceHomeActions} from "pages/vipService/index";
import {newAddForm as AddForm, actions as addFormActions, formCreate}  from 'components/layout/addForm';
import {actions as commonActions} from "components/business/commonRequest";
import AttachmentUpload from 'components/business/attachmentUpload';
import {actions as approveActions, SelectApproveItem, BACKEND_TYPES, withApprove} from  'components/business/approve';
import {addPage} from  'components/layout/listPage';
import {actions as vipOpeActions} from "components/business/vipOpe";
import Crumb from 'components/business/crumb';
import Fold from 'components/business/fold';
import { IncomeList as FinanceTable } from 'components/business/newFinance';
import {SelectCurrency} from 'pages/auxiliary/multiCurrency';
import {SelectEmployeeFix} from 'pages/auxiliary/employee';
import SelectIncomeType from "pages/auxiliary/income/views/selectIncomeType";
import formMap from '../dependencies/initFormMap';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import EditType from '../../../editType'
import _ from "lodash";


const RadioGroup = Radio.Group;
const {TextArea} = Input;

const mapStateToProps = (state) => ({
    incomeInfo: state.getIn(['financeIncomeAdd', 'incomeInfo']),
    addIncome: state.getIn(['financeIncomeAdd', 'addIncome'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncAddIncome,
        asyncEditIncome,
        asyncFetchIncomeById,
        setInitFinished: addFormActions.setInitFinished,
        asyncGetApproveStatus: approveActions.asyncGetApproveStatus,
        asyncOpenVipAndSendRequestToOss: vipOpeActions.asyncOpenVipAndSendRequestToOss,
        asyncFetchVipService: vipServiceHomeActions.asyncFetchVipService,
        asyncFetchGetContinueCreate: commonActions.asyncFetchGetContinueCreate,
        asyncFetchSetContinueCreate: commonActions.asyncFetchSetContinueCreate,
    }, dispatch)
};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
@withApprove
@formCreate
export default class FinanceIncomeAddForm extends addPage {
    formRef = React.createRef();
    getTableRef = (tableRef)=>{
        this.tableRef = tableRef;
    };

    static formItemLayout = {
        labelCol: {
            xs: {span: 24},
            sm: {span: 8},
        },
        wrapperCol: {
            xs: {span: 24},
            sm: {span: 16},
        }
    };

    static otherFormItemLayout = {
        labelCol: {
            xs: {span: 24},
            sm: {span: '2d66'},
        },
        wrapperCol: {
            xs: {span: 24},
            sm: {span: '21d33'},
        }
    };

    constructor(props) {
        super(props);
        const searchQuery = parse(props.location.search, true);

        this.state = {
            bindBillType: 1, //  0: 不绑定单据  1: 绑定销售订单
            customerNameEditEnabled: !(searchQuery && searchQuery.query.fkBillNo && searchQuery.query.fkBillNo.length > 0),
            option: EditType.Add,
            selectModalVisible: false,
            fileList: [],
            flag: true,
            selectApprove: false,  // 选择审批流弹层
            approveModuleFlag: 0,  // 当前模块是否开启审批权限 0 无 1 有
            approveStatus: 0,   //审批状态 0 未提交  1 通过  2 反驳  3 审批中
            submitData: {}, // 新增最终提交表单的信息
            continueAddFlag: true,  //连续新增Flag
            typeKey: "SalePayment",
            quotationDisabledFlag: false
        };
    }

    componentDidMount() {
        this.preDataProcess();
    }

    /** 初始化数据的流程 */
    preDataProcess = async () => {
        const {match} = this.props;
        let recId = match.params.id;
        if (recId) {
            let option = match.path.indexOf('/copy/')!==-1 ? EditType.Copy : EditType.Modify;
            this.setState({ option });
            await this.initModifyData(recId);
        } else {
            // 初始化数据
            this.initForm({});
        }
        //获取连续新建Flag
        this.getContinueCreateFlag();
        this.props.setInitFinished();
    };

    /** 初始化修改数据 */
    initModifyData = (id) => {
        return new Promise((resolve, reject) => {
            this.props.asyncFetchIncomeById(id, data=>{
                let list = data.data;
                let bindBillType = list[0].bindBillType;
                // 设置当前单据的审批状态
                this.setState({
                    bindBillType,
                    approveStatus: list[0].approveStatus,
                    approveModuleFlag: data.approveModuleFlag,
                    quotationDisabledFlag: list[0].currencyFlag || false
                });
                this.initForm(list[0]);
                // 初始化物品表单数据
                this.initTableForm(data);
                // 初始化合计
                this.initFormTotal(data);
                resolve();
            })
        })
    };

    /** 初始化列表表单数据 */
    initTableForm = (info, callback) => {
        let list = info && _.map(info.data, (item)=> {
            return {
                billNo: item.saleBillNo,
                displayBillNo: item.displayBillNo,
                aggregateAmount: item.aggregateAmount,
                payAmount: info.approveModuleFlag === 1 ?item.payAmount : (item.payAmount - item.damount),
                amount: item.damount,
                currencyAmount: item.currencyAmount,  // 本币金额
                currencyId: item.currencyId,
                currencyFlag: item.currencyFlag,
                remarks: item.dremarks
            }
        });
        if(list && list.length > 0){
            this.tableRef.props.fillList(list, () => {
                callback && callback();
            });
        }
    };

    /** 初始化时给表单赋值 */
    initForm = (info)=>{
        if(info.noBindCurrencyAmount && info.bindBillType === 0){
            info.currencyAmount = info.noBindCurrencyAmount;
        }
        this.initFormField(formMap, info);
    };

    /** 初始化合计 */
    initFormTotal = (info) => {
        let { totalAmount, totalCurrencyAmount } = info;
        this.tableRef.props.setTotalForm({ totalAmount, totalCurrencyAmount });
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
        this.formRef.current.setFieldsValue({
            customerName: selectedRows[0].customerName
        });
    };

    // 切换绑定单据的方式
    onChangeBillType = (val) => {
        this.setState({ bindBillType: val });
    };

    /** 处理物品列表*/
    dealTableList = (values) => {
        let dataList = _.filter(values.dataList, item => {
            return item && Object.values(item).some(v => {
                return v && v !== '';
            });
        });
        let formData = this.tableRef.props.formData;
        dataList = _.map(dataList, (item, idx) => {
            let {displayBillNo, amount, remarks, currencyAmount} = item;
            let {billNo, aggregateAmount, payAmount} = formData[idx];
            return {displayBillNo, amount, remarks, billNo, aggregateAmount, payAmount, currencyAmount};
        });
        delete values.dataList;
        return dataList
    };

    handleEditResult = (data) => {
        if (data && data.retCode == 0) {
            message.success("操作成功!");
            this.props.emptyFieldChange();
            const id = this.state.option !== EditType.Modify ? data.data : this.props.match.params.id;
            let continueAddFlag = this.state.option !== EditType.Modify && this.state.continueAddFlag;
            let url = continueAddFlag ? '/blank' :`/finance/income/show/${id}`;
            this.props.history.push(url);
            continueAddFlag && this.props.history.goBack();
        } else {
            Modal.error({
                title: "提示信息",
                content: (data && data.retMsg) || "操作失败！"
            });
        }
    };

    handleSubmit = (values) => {
        let recId = this.props.match.params.id;
        //处理物品信息
        let dataList;
        if (values.bindBillType === 1) {
            dataList = this.dealTableList(values);
        }
        let fileIds = this.state.fileList.map(item => item.response.fileId);

        const submitData = {
            id: recId,
            json: {
                ...values,
                paymentDate: values['paymentDate'].format('YYYY-MM-DD'),
                accountId: values['account'] && values['account'].key,
                accountName: values['account'] && values['account'].label,
                typeId: values['incomeType'] && values['incomeType'].key,
                typeName: values['incomeType'] && values['incomeType'].label,
                fileIds,
                dataList
            }
        };
        this.setState({ submitData }, ()=>{
            this.props.asyncGetApproveStatus({types: BACKEND_TYPES.income}, (res) => {
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
    };

    // 提交表单数据（新加）
    asyncSubmit=()=>{
        let self = this;
        let values = this.state.submitData;
        if (this.state.option === EditType.Add || this.state.option === EditType.Copy) {
            this.props.asyncAddIncome(values, function (data) {
                self.handleEditResult(data);
            });
        } else {
            this.props.asyncEditIncome(values, function (data) {
                self.handleEditResult(data);
            });
        }
    };

    // 当不绑定订单且多币种开通时， 收入金额失焦时，计算本币金额
    handleAmountBlur = (e) => {
        let amount = e.target.value;
        const {getFieldValue, setFieldsValue} = this.formRef.current;
        let quotation = getFieldValue('quotation') || 100;
        setFieldsValue({ currencyAmount: removeCurrency(formatCurrency(amount * quotation / 100), 2, true)});
    };

    // 当币种发生变化时
    handleCurrencyChange = (value, option) => {
        let currency = option.currency;
        let quotationDisabledFlag = false;
        let {paramValue: quotation, paramModule} = currency;
        const {getFieldValue, setFieldsValue} = this.formRef.current;
        let amount = getFieldValue('amount') || 0;
        if(paramModule === 'CurrencyDefault'){  // 默认币种不可以修改牌价
            quotationDisabledFlag = true;
        }
        this.setState({ quotationDisabledFlag });
        setFieldsValue({ quotation,  currencyAmount: removeCurrency(formatCurrency(amount * quotation / 100), 2, true)});
    };

    // 当牌价发生改变时
    handleBlurQuotation = (e) => {
        let quotation = e.target.value;
        if(this.state.bindBillType === 0){
            const {getFieldValue, setFieldsValue} = this.formRef.current;
            let amount = getFieldValue('amount') || 0;
            setFieldsValue({ currencyAmount: removeCurrency(formatCurrency(amount * quotation / 100), 2, true)});
        } else {
            if(this.tableRef.handleQuotationOnChange){
                this.tableRef.handleQuotationOnChange(quotation*1);
            }
        }
    };

    // 当多币种服务状态开启时，弹层选择单据确定后的回调接口， 改变当前的币种
    orderPopCallback = ({currencyId, quotation, currencyFlag}) => {
        this.formRef.current.setFieldsValue({
            currencyId, quotation
        });
        this.setState({
            quotationDisabledFlag: currencyFlag || false
        })
    };

    render() {
        let currencyVipFlag = getCookie("currencyVipFlag");
        let priceDecimalNum = getCookie("priceDecimalNum");
        let { bindBillType, quotationDisabledFlag } = this.state;
        const {incomeInfo} = this.props;

        const dataList = incomeInfo.getIn(['data', 'data']);
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

        return (
            <React.Fragment>
                <div className="content-hd">
                    <Crumb data={[
                        {
                            url: '/finance/income',
                            title: "收入"
                        },
                        {
                            title: this.state.option === EditType.Modify ? "修改收入记录" : "新建收入记录"
                        }
                    ]}/>
                </div>
                <Spin
                    spinning={incomeInfo.get("isFetching")}
                >
                    <AddForm {...this.props}
                             onSubmit={this.handleSubmit}
                             isModify={this.state.option === EditType.Modify}
                             setContinueAddFlag={this.setContinueAddFlag}
                             continueAddFlag={this.state.continueAddFlag}
                             loading={this.props.addIncome.get('isFetching')}
                             formRef={this.formRef}
                    >
                        {
                            this.formRef.current && (
                                <div className="content-bd">
                                    <Fold title={"基础信息"}>
                                        <Row>
                                            <Col span={8}>
                                                <Form.Item
                                                    {...FinanceIncomeAddForm.formItemLayout}
                                                    label={'收入日期'}
                                                    name="paymentDate"
                                                    rules={[
                                                        {
                                                            type: 'object',
                                                            required: true,
                                                            message: "收入日期必填!"
                                                        }
                                                    ]}
                                                >
                                                    <DatePicker />
                                                </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                                <Form.Item
                                                    {...defaultOptions}
                                                    {...FinanceIncomeAddForm.formItemLayout}
                                                    label={'收入类型'}
                                                    name="incomeType"
                                                >
                                                    <SelectIncomeType type='inType' showEdit={true} placeholder={'请下拉选择'} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                                <Form.Item
                                                    {...defaultOptions}
                                                    {...FinanceIncomeAddForm.formItemLayout}
                                                    label={'资金账户'}
                                                    name="account"
                                                >
                                                    <SelectIncomeType type='account' showEdit={true} placeholder={'请下拉选择'} />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={8}>
                                                <Form.Item
                                                    {...defaultOptions}
                                                    {...FinanceIncomeAddForm.formItemLayout}
                                                    label={'付款方'}
                                                    name="customerName"
                                                >
                                                    <Input maxLength={80} disabled={!this.state.customerNameEditEnabled} placeholder={'填写付款方'}/>
                                                </Form.Item>
                                            </Col>
                                            <Col span={8}>
                                                <Form.Item
                                                    label={<React.Fragment/>}
                                                    name="bindBillType"
                                                    initialValue={1}
                                                    colon={false}
                                                    {...FinanceIncomeAddForm.formItemLayout}
                                                >
                                                    <RadioGroup onChange={(e) => this.onChangeBillType(e.target.value)}>
                                                        <Radio key={1} value={1}>{'绑定销售订单'}</Radio>
                                                        <Radio key={0} value={0}>{'不绑定单据'}</Radio>
                                                    </RadioGroup>
                                                </Form.Item>
                                            </Col>
                                            {
                                                bindBillType === 0 && (
                                                    <Col span={8}>
                                                        <Form.Item
                                                            label={'收入金额'}
                                                            name={'amount'}
                                                            {...defaultOptions}
                                                            {...FinanceIncomeAddForm.formItemLayout}
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: '金额必填'
                                                                }, {
                                                                    validator: (rules, val, callback) => {
                                                                        const reg = /^(0|[1-9]\d{0,9})(\.\d{1,2})?$/;
                                                                        if (Number.isNaN(val) || !reg.test(val)) {
                                                                            callback('整数部分不能超过10位，小数点后不能超过2位');
                                                                        }
                                                                        if (val == 0) {
                                                                            callback('金额不能为0！')
                                                                        }
                                                                        callback();
                                                                    }
                                                                }
                                                            ]}
                                                        >
                                                            <Input placeholder={'请填写金额'} onBlur={(e) => this.handleAmountBlur(e)} autoFocus={true} maxLength={13} suffix={'元'}/>
                                                        </Form.Item>
                                                    </Col>
                                                )
                                            }
                                        </Row>
                                        {
                                            currencyVipFlag === 'true' && (
                                                <Row>
                                                    {
                                                        bindBillType === 0 && (
                                                            <Col span={8}>
                                                                <Form.Item
                                                                    label={'本币金额'}
                                                                    name="currencyAmount"
                                                                    {...defaultOptions}
                                                                    {...FinanceIncomeAddForm.formItemLayout}
                                                                >
                                                                    <Input  disabled suffix={'元'}/>
                                                                </Form.Item>
                                                            </Col>
                                                        )
                                                    }
                                                    <Col span={8}>
                                                        <Form.Item
                                                            {...defaultOptions}
                                                            {...FinanceIncomeAddForm.formItemLayout}
                                                            label={'币种'}
                                                            name="currencyId"
                                                        >
                                                            <SelectCurrency disabled={bindBillType===1}
                                                                            onChange={this.handleCurrencyChange}
                                                                            showEdit={true}
                                                                            showVisible={true}/>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={8}>
                                                        <Form.Item
                                                            {...defaultOptions}
                                                            label={'牌价'}
                                                            {...FinanceIncomeAddForm.formItemLayout}
                                                            name="quotation"
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: '该项为必填项'
                                                                },
                                                                {
                                                                    validator: (rules, val, callback) => {
                                                                        if (val) {
                                                                            let reg = eval('/^(0|[1-9]\\d{0,9})(\\.\\d{1,'+ priceDecimalNum +'})?$/');
                                                                            if(!val){
                                                                                callback('该项为必填项');
                                                                            } else if (val && !reg.test(val)) {
                                                                                callback(`整数部分不能超过10位，小数点后不能超过${priceDecimalNum}位`);
                                                                            } else {
                                                                                callback();
                                                                            }
                                                                        } else {
                                                                            callback();
                                                                        }
                                                                    }
                                                                }
                                                            ]}
                                                        >
                                                            <Input maxLength={50} disabled={quotationDisabledFlag} onBlur={(e)=> this.handleBlurQuotation(e)}/>
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                            )
                                        }
                                        {
                                            bindBillType === 1 && (
                                                <Col span={24}>
                                                    <FinanceTable
                                                        dataPrefix={'dataList'}
                                                        financeType={'income'}
                                                        currencyVipFlag={currencyVipFlag}
                                                        orderPopCallback={this.orderPopCallback}
                                                        backCustomerOrSupplier={this.backCustomerOrSupplier}
                                                        getRef={this.getTableRef}
                                                        formRef={this.formRef}/>
                                                </Col>
                                            )
                                        }
                                    </Fold>
                                    <Fold title={'其他信息'}>
                                        <Row>
                                            <Col span={24}>
                                                <Form.Item
                                                    label={'经办人'}
                                                    name ={"ourContacterName"}
                                                    {...FinanceIncomeAddForm.otherFormItemLayout}
                                                    {...defaultOptions}
                                                >
                                                    <SelectEmployeeFix width={250}/>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}>
                                                <Form.Item
                                                    label={'备注'}
                                                    name ={"remarks"}
                                                    {...FinanceIncomeAddForm.otherFormItemLayout}
                                                    {...defaultOptions}
                                                >
                                                    <TextArea rows={4} maxLength={2000} placeholder={'备注'}/>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={8}>
                                                <Form.Item
                                                    label={'上传附件'}
                                                    name={"tempAtt"}
                                                    {...FinanceIncomeAddForm.formItemLayout}
                                                    {...defaultOptions}
                                                >
                                                    <AttachmentUpload
                                                        maxLength={'5'}
                                                        fileList={this.state.fileList}
                                                        handleChange={(fileList) => this.setState({fileList})}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Fold>
                                    <div style={{display: "none"}}>
                                        <Form.Item name="billNo">
                                            <Input type="hidden"/>
                                        </Form.Item>
                                    </div>
                                </div>
                            )
                        }
                    </AddForm>
                    <SelectApproveItem
                        onClose={this.extendApproveCancelModal}
                        onOk={(id)=>{this.extendApproveOkModal(id)}}
                        show={this.state.selectApprove}
                        type={BACKEND_TYPES.income}
                    />
                </Spin>
            </React.Fragment>
        );
    }
}


