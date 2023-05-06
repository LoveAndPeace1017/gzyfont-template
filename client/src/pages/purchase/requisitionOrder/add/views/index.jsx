import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import {Input, message, Spin, Form, Modal, Button} from 'antd';
import {withRouter} from "react-router-dom";
import Crumb from 'components/business/crumb';
import {newAddForm as AddForm, actions as addFormActions, formCreate} from 'components/layout/addForm';
import Content from 'components/layout/content';
import {asyncFetchPreData, asyncAddRequisitionOrder, asyncFetchRequisitionOrderById, emptyDetailData} from '../actions';
import {actions as purchaseAddActions} from "pages/purchase/add";
import {actions as approveActions, SelectApproveItem, BACKEND_TYPES, withApprove} from 'components/business/approve';
import {actions as fieldConfigActions} from 'components/business/goodsTableFieldConfigMenu'
import {addPage} from  'components/layout/listPage';
import {actions as vipOpeActions} from "components/business/vipOpe";
import RequisitionTable from 'components/business/requisitionGoods';
import GoodsTableFieldConfigMenu from 'components/business/goodsTableFieldConfigMenu';
import {actions as commonActions} from "components/business/commonRequest";
import {actions as vipServiceHomeActions} from "pages/vipService/index";
import BaseInfo from './baseInfo';
import OtherInfo from './otherInfo';
import 'url-search-params-polyfill';
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';
import {getUrlParamValue} from 'utils/urlParam';
import formMap from '../dependencies/initFormMap';
import classNames from "classnames/bind";
import styles from "../styles/index.scss";
import moment from "moment-timezone/index";
const cx = classNames.bind(styles);

const mapStateToProps = (state) => ({
    goodsTableConfig: state.getIn(['goodsTableFieldConfigMenu', 'goodsTableConfig']),
    addRequisitionOrder: state.getIn(['requisitionOrderAdd', 'addRequisitionOrder']),
    requisitionOrderInfo: state.getIn(['requisitionOrderAdd', 'requisitionOrderInfo']),
    preData: state.getIn(['requisitionOrderAdd', 'preData']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchPreData,
        asyncAddRequisitionOrder,
        asyncFetchRequisitionOrderById,
        emptyDetailData,
        asyncFetchAccountRelation: commonActions.asyncFetchAccountRelation,
        asyncFetchGoodsDataByProdNo: purchaseAddActions.asyncFetchGoodsDataByProdNo,
        emptyFieldConfig: fieldConfigActions.emptyFieldConfig,
        asyncSaveFieldConfigForProduce: fieldConfigActions.asyncSaveFieldConfigForProduce,
        setInitFinished: addFormActions.setInitFinished,
        asyncGetApproveStatus: approveActions.asyncGetApproveStatus,
        asyncOpenVipAndSendRequestToOss: vipOpeActions.asyncOpenVipAndSendRequestToOss,
        asyncFetchVipService: vipServiceHomeActions.asyncFetchVipService,
    }, dispatch)
};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
@withApprove
@formCreate
export default class Index extends addPage {
    formRef = React.createRef();
    dataPrefixForPpopList = 'prodList';
    constructor(props) {
        super(props);
        this.state = {
            submitData: {},
            selectApprove: false,  // 选择审批流弹层 ***
            approveModuleFlag: 0,  // 当前模块是否开启审批权限 0 无 1 有 ***
            approveStatus: 0,   //审批状态 0 未提交  1 通过  2 反驳  3 审批中 ***
        };
    }

    componentDidMount() {
        this.preDataProcess();
    }

    componentWillUnmount() {
        this.props.emptyDetailData();
        this.props.asyncSaveFieldConfigForProduce();
        this.props.emptyFieldConfig();
    }

    // 初始化数据的流程
    preDataProcess = async () => {
        const {match} = this.props;
        let params = new URLSearchParams(this.props.location.search);
        const type = params && params.get('type') || "";
        //修改页面或复制页面
        let id = match.params.id || match.params.copyId;
        await this.initPreData();
        if(id) await this.initModifyData(id);
        if(type === "lackMaterial" || type === "purchaseProposal") { //type=lackMaterial 缺料查询带入数据
            let accountInfo = await this.getAccountRelation();     //type=purchaseProposal MRP运算 采购建议带入数据
            await this.initLackMaterialData(type, accountInfo);
        }
        this.props.setInitFinished();
    };

    // 获取当前帐号的部门员工
    getAccountRelation = () => {
        return new Promise((resolve, reject) => {
            this.props.asyncFetchAccountRelation(null, (res) => {
                if (res.retCode === '0') {
                    resolve(res.data || {});
                }
            })
        })
    };

    // 初始化数据
    initPreData = () => {
        return new Promise((resolve, reject) => {
            this.props.asyncFetchPreData(data => {
                if (data.retCode === '0') {
                    if (data.tags) {
                        this.setState({tags: data.tags},()=>{
                            this.initForm({});
                        });
                    }
                    resolve();
                }
            });
        });
    };

    // 初始化缺料查询所选物品信息
    initLackMaterialData = (type, info) => {
        return new Promise((resolve, reject) => {
            let prodList =JSON.parse(localStorage.getItem(type));
            this.props.asyncFetchGoodsDataByProdNo(prodList,(data)=>{
                //获取prod数据处理，遍历使其适配goodsTable
                let prodInfo = data.data || [];
                console.log(prodInfo, 'prodInfo');
                info.prodList = prodInfo.map(item => {
                    let {code, displayCode, name, description, orderPrice, remarks, ...out} = item;
                    out.prodNo = code;
                    out.prodCustomNo = displayCode;
                    out.prodName = name;
                    out.descItem = description;
                    out.unitPrice = orderPrice || 0;
                    out.amount = out.unitPrice * out.quantity;
                    return out;
                });
                this.initForm(info);
                resolve();
            });
        });
    };

    // 初始化修改数据
    initModifyData = (id) => {
        return new Promise((resolve, reject) => {
            this.props.asyncFetchRequisitionOrderById(id, data => {
                let info = data.data || {};
                //设置审批状态
                this.setState({
                    approveStatus: data.data.approveStatus,
                    approveModuleFlag: data.approveModuleFlag
                });

                let _this = this;

                if(info.approveStatus == 1 && data.approveFlag == 1 && !match.params.copyId){
                    Modal.warning({
                        title: intl.get("purchase.add.index.warningTip"),
                        okText: intl.get("purchase.add.index.okText"),
                        content: intl.get("purchase.add.index.orderHasApproveTipContent"),
                        onOk() {
                            _this.props.history.goBack();
                        }
                    });
                    reject();
                }

                this.initForm(info);
                resolve();
            })
        })
    };


    initForm = (info) => {
        // 以前的员工部门组件有问题，需要在此修改子组件的state中的depId
        if(info.departmentId){
            this.baseRef.setState({depId: info.departmentId});
        }
        info = this.initFormData(info);
        this.initFormField(formMap, info);
    };

    /** 初始化表单数据 */
    initFormData = (info) => {
        // 处理自定义列表字段
        info = this.initFormTags(info, 'property_value');
        // 初始化附件
        this.initFileList(info);
        // 初始化列表数据
        this.initPpopListTable(info);
        return info;
    };

    /** 初始化附件 */
    initFileList = (info) =>{
        let fileList = []
        fileList = info.fileInfo && info.fileInfo.map((file, index) => {
            file.uid = -(index+1);
            file.url = `${BASE_URL}/file/download/?url=/file/download/${file.fileId}`;
            file.name = file.fileName;
            file.status = 'done';
            file.response = {
                fileId: file.fileId
            };
            return file;
        });
        fileList && this.otherInfoRef.setState({
            fileList:fileList
        });

    };

    /** 初始化自定义列表*/
    initFormTags = (info, propValue) => {
        info.dataTagList = [];
        this.state.tags&&this.state.tags.forEach((item,index)=>{
            if(item.propName!=""){
                info.dataTagList.push({
                    index,
                    id:item.id,
                    mappingName:item.mappingName,
                    propName:item.propName,
                    propValue:info.propertyValues ? info.propertyValues[propValue+item.mappingName.slice(-1)] : ''
                })
            }
        });
        if (info.dataTagList.length===0){
            info.dataTagList = [{
                index:5,
                mappingName:"property_value1",
                propValue:"",
                propName:""
            }];
        }
        return info;
    };

    /** 初始化物品列表数据*/
    initPpopListTable = (info, source) => {
        if(!info || !info.prodList) return;
        let prodListTable = _.map(info.prodList, item => {
            let { deliveryDeadlineDate, ...restItem } = item;
            deliveryDeadlineDate = deliveryDeadlineDate ? moment(deliveryDeadlineDate) : null;
            return {  ...restItem, deliveryDeadlineDate };
        });
        this.ppopRef.fillList(prodListTable, source);  // 调用组件的方法回填数据
    };

    getPpopRef = (ppopRef) => {
        this.ppopRef = ppopRef
    };

    getBaseRef = (baseRef) => {
        this.baseRef = baseRef
    };

    getOtherInfoRef = (otherInfoRef) => {
        this.otherInfoRef = otherInfoRef
    };

    /** 处理自定义字段 */
    dealCustomField = (values)=>{
        // 处理自定义字段
        // 需要和后端确认分别在什么时候使用propValue1和property_value1
        let propertyValues = {};
        let tempArr = [];
        if (values.propName) {
            values.propName.forEach((item, index) => {
                if (item) {
                    propertyValues['property_value' + values.mappingName[index].slice(-1)] = values.propValue[index];
                    tempArr.push({
                        mappingName: values.mappingName[index],
                        propValue: values.propValue[index],
                        propName: values.propName[index],
                        customInfoType: 'ProduceOrderPropInfo'
                    });
                }
            });
        }
        values.propertyValues = propertyValues;
        values.dataTagList = tempArr;
        values.dataTagList.forEach((item)=>{
            this.state.tags.some((tag)=>{
                if(tag.mappingName==item.mappingName){
                    item.id = tag.id;
                }
            })
        });
    };


    /** 处理物品列表*/
    dealProdList = (values) => {
        values[this.dataPrefixForPpopList] = values[this.dataPrefixForPpopList].filter(item=>{
            item && (item.deliveryDeadlineDate = item.deliveryDeadlineDate && moment(item.deliveryDeadlineDate).format('YYYY-MM-DD'));
            return item && Object.entries(item).some(v => {
                return (v[0] === 'prodName' && v[1] && v[1] !== ''); //物品名称必须要有值，否则这行物品数据会被过滤掉
            });
        });
    };
    /** 处理附件列表*/
    dealFileList = (values)=>{
        values.fileIds = this.otherInfoRef.state.fileList.map(item => item.response.fileId);
    };

    /** 处理日期*/
    dealDate = (values) =>{
        values.requestDate = values.requestDate && moment(values.requestDate).format("YYYY-MM-DD");
    };

    /** 处理表单提交数据 */
    dealSubmitFormInfo = (values) => {
        this.dealCustomField(values); //处理自定义字段
        this.dealProdList(values);  // 处理物品列表
        this.dealFileList(values); //处理附件
        this.dealDate(values); //处理日期格式
    };

    /** 返回审批状态 */
    backApproveFlag = (module) => {
        let _this = this;
        return new Promise(function (resolve, reject) {
            _this.props.asyncGetApproveStatus({types: BACKEND_TYPES[module]}, (res) => {
                if(res.data.retCode === "0") {
                    resolve(res.data.data==="1")
                } else {
                    reject();
                }
            });
        });
    };

    /** 校验审批操作*/
    validateApproveStatus = (module, values) => {
        let {match} = this.props;
        let {approveModuleFlag, approveStatus} = this.state;
        let _this = this;
        return new Promise(function (resolve, reject) {
            _this.setState({submitData: values},() => {
                _this.props.submitApproveProcess(() => {
                    _this.cancelApproveOperate();  // 取消操作
                    reject();
                }, () => {
                    // 非复制状态， 且当前单据的审批状态为反驳状态 2，则直接提交
                    if(!match.params.copyId && approveModuleFlag===1 && approveStatus===2) {
                        _this.cancelApproveOperate(true);
                    } else {
                        _this.openModal('selectApprove'); // 否则进入审批流的过程，并提交表单
                    }
                    reject();
                });
            });
        });
    };

    /**  后端校验工作，如符合条件则提交表单 */
    backendValidateAndSubmit = async (module, values) => {
        /**  审批是否开启*/
        if(await this.backApproveFlag(module)){  // 审批开启
            /** 校验审批操作,如果符合条件，执行提交操作，审批为所有操作最后一步*/
            await this.validateApproveStatus(module, values);
        } else {
            /** 审批未开启 直接提交*/
            await new Promise((resolve, reject) => {
                this.setState({submitData: values}, () => {
                    this.cancelApproveOperate();
                    reject();
                });
            })
        }

       /* await new Promise((resolve, reject) => {
            this.setState({submitData: values}, () => {
                this.cancelApproveOperate();
                reject();
            });
        })*/
    };

    handleSubmit = async (values) => {
        console.log('Received values of form: ', values);
        /** 处理表单提交数据 */
        this.dealSubmitFormInfo(values);
        /** 后端校验工作，如符合条件则提交表单*/
        await this.backendValidateAndSubmit('requisition', values);
        /** 提交表单数据 */
        this.asyncSubmit();
    };

    // 提交表单数据
    asyncSubmit=()=> {
        let values = this.state.submitData;
        this.props.asyncAddRequisitionOrder(values.billNo, values, (res) => {
            if (res.data.retCode === '0') {
                let displayId = res.data.data;
                message.success('操作成功');
                this.props.emptyFieldChange();
                let url = `/purchase/requisitionOrder/show/${displayId}`;
                this.props.history.push(url);
            }  else {
                Modal.error({
                    title: intl.get("提示信息"),
                    content: (res.data.retValidationMsg && res.data.retValidationMsg.msg && res.data.retValidationMsg.msg[0].msg)||res.data.retMsg
                })
            }
        })
    };

    resetDefaultFields = ()=>{
        this.props.asyncFetchPreData(()=>{
            this.props.setInitFinished();
        });
    };

    render() {
        const {match, requisitionOrderInfo, preData, goodsTableConfig} = this.props;
        let id = match.params.id || match.params.copyId;
        let listFields = preData && preData.getIn(['data', 'listFields']);
        let prodFields = preData && preData.getIn(['data', 'prodDataTags']);

        return (
            <React.Fragment>
                <Content.ContentHd>
                    <Crumb data={[
                        {
                            url: '/purchase/',
                            title: "采购"
                        },
                        {
                            url: '/purchase/requisitionOrder/',
                            title: "请购单列表"
                        },
                        {
                            title: this.props.match.params.id ? "修改请购单": "新建请购单"
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <GoodsTableFieldConfigMenu
                            tableConfigList={listFields}
                            refresh={() => this.resetDefaultFields(billNo)}
                            type={'requisition_product'}
                        />
                    </div>
                </Content.ContentHd>
                <Content.ContentBd>
                    <Spin
                        spinning={preData.get('isFetching') || requisitionOrderInfo.get("isFetching")}
                    >
                        <AddForm {...this.props}
                                 onSubmit={this.handleSubmit}
                                 formRef={this.formRef}
                                 isModify={!!match.params.id}
                                 loading={requisitionOrderInfo.get('isFetching')}
                        >
                            {
                                this.formRef.current && (
                                    <React.Fragment>
                                        <AddForm.BaseInfo>
                                            <BaseInfo {...this.props} formRef={this.formRef}
                                                      getRef={this.getBaseRef}/>
                                        </AddForm.BaseInfo>

                                        <RequisitionTable dataPrefix={this.dataPrefixForPpopList}
                                                   fillOutGoods={this.ppomRef && this.ppomRef.fillList}
                                                   getRef={this.getPpopRef}
                                                   goodsTableConfig={goodsTableConfig}
                                                   prodFields={prodFields}
                                                   formRef={this.formRef}/>

                                        <AddForm.OtherInfo>
                                            <OtherInfo  {...this.props}
                                                        formRef={this.formRef}
                                                        getRef={this.getOtherInfoRef}
                                            />
                                        </AddForm.OtherInfo>

                                        <div style={{display: "none"}}>
                                            <Form.Item name="billNo" initialValue={this.props.match.params.id}>
                                                <Input type="hidden"/>
                                            </Form.Item>
                                            <Form.Item name="fkMrpBillNo">
                                                <Input type="hidden"/>
                                            </Form.Item>
                                        </div>
                                    </React.Fragment>
                                )
                            }
                        </AddForm>
                    </Spin>
                </Content.ContentBd>
                <SelectApproveItem   // ***
                    onClose={this.extendApproveCancelModal}
                    onOk={(id)=>{this.extendApproveOkModal(id)}}
                    show={this.state.selectApprove}
                    type={BACKEND_TYPES.requisition}
                />
            </React.Fragment>
        );
    }
}
