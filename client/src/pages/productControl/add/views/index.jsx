import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import {Input, message, Spin, Form, Modal, Button} from 'antd';
import {withRouter} from "react-router-dom";
import Crumb from 'components/business/crumb';
import {newAddForm as AddForm, actions as addFormActions, formCreate} from 'components/layout/addForm';
import Content from 'components/layout/content';
import Fold from 'components/business/fold';
import {asyncFetchPreData, asyncAddProductControl, asyncFetchProductControlById, asyncFetchProcessListByKey, asyncFetchProcessListByBomCode, emptyDetailData} from '../actions';
import {asyncFetchEmployeeList} from '../../../auxiliary/employee/actions';
import {addPage} from  'components/layout/listPage';
import ProcessTable from './processTable';
import {actions as vipOpeActions} from "components/business/vipOpe";
import {actions as vipServiceHomeActions} from "pages/vipService/index";
import {actions as multiBomActions} from "pages/multiBom/add";
import BaseInfo from './baseInfo';
import OtherInfo from './otherInfo';
import SaleOrderPop from './saleOrderPop';
import 'url-search-params-polyfill';
import {getUrlParamValue} from 'utils/urlParam';
import formMap from '../dependencies/initFormMap';

import classNames from "classnames/bind";
import styles from "../styles/index.scss";
import moment from "moment-timezone/index";
const cx = classNames.bind(styles);

const mapStateToProps = (state) => ({
    addProductControl: state.getIn(['productControlAdd', 'addProductControl']),
    productControlInfo: state.getIn(['productControlAdd', 'productControlInfo']),
    preData: state.getIn(['productControlAdd', 'preData']),
    employeeList: state.getIn(['auxiliaryEmployee', 'employeeList'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchPreData,
        asyncAddProductControl,
        asyncFetchProductControlById,
        asyncFetchProcessListByKey,
        emptyDetailData,
        asyncFetchEmployeeList,
        asyncFetchProcessListByBomCode,
        asyncFetchMultiBomByCode: multiBomActions.asyncFetchMultiBomByCode,
        setInitFinished: addFormActions.setInitFinished,
        asyncOpenVipAndSendRequestToOss: vipOpeActions.asyncOpenVipAndSendRequestToOss,
        asyncFetchVipService: vipServiceHomeActions.asyncFetchVipService,
    }, dispatch)
};

/**
 * 新增工单
 * @visibleName Index（新增工单）
 * @author jinb
 */
@withRouter
@connect(mapStateToProps, mapDispatchToProps)
@formCreate
export default class Index extends addPage {
    formRef = React.createRef();
    dataPrefix = 'processList';
    constructor(props) {
        super(props);
        this.state = {
            fileList: [],
            submitData: {},
            fileMap: {},  // 上传文件的集合 such as {1101: '附件名称1'}  key: fileId, value: fileName
        };
    }

    componentDidMount() {
        this.props.asyncFetchEmployeeList();
        this.preDataProcess();
    }

    componentWillUnmount() {
        this.props.emptyDetailData();
    }

    // 初始化数据的流程
    preDataProcess = async () => {
        const {match} = this.props;
        let params = new URLSearchParams(this.props.location.search);
        //修改页面或复制页面
        let id = match.params.id || match.params.copyId;
        const fkProduceNo = params && params.get('fkProduceNo') || "";  // 生产单详情页点击 下达工单 操作带入
        await this.initPreData();
        if(id) await this.initModifyData(id);
        if(fkProduceNo) await this.initProduceInfo(fkProduceNo);
        this.props.setInitFinished();
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

    // 初始化修改数据
    initModifyData = (id) => {
        return new Promise((resolve, reject) => {
            this.props.asyncFetchProductControlById(id, data => {
                let info = data.data || {};
                this.initForm(info);
                // 处理自定义字段
                this.setState({tags: data.tags});
                resolve();
            })
        })
    };

    // 初始化生产单数据
    initProduceInfo = async (fkProduceNo) => {
        let info = JSON.parse(localStorage.getItem("PRODUCE_ORDER_INFO")) || {};
        info.expectStartDate = _.toNumber(moment().format('x')); // 计划开始时间
        if(info.bomCode){
            let {processList, dayProductivity} = await this.getBomData(info.bomCode);
            info.expectEndDate = _.toNumber(moment().add(_.divide(info.expectCount, dayProductivity), 'days').format('x'));
            info.processList = _.map(processList, (item) => {
                //处理浮点数
                item.expectCount = Number(_.multiply(item.workload, info.expectCount)).toFixed(4)/1;
                return item;
            })
        }
        this.initForm({...info, fkProduceNo});
    };

    // 获取bomCode对应详情数据
    getBomData = (bomCode) => {
        return new Promise((resolve, reject) => {
            this.props.asyncFetchMultiBomByCode({bomCode}, data => {
                let info = data.data || {};
                resolve(info);
            })
        })
    };

    initForm = (info) => {
        info = this.initFormData(info);
        this.initFormField(formMap, info);
    };

    /** 初始化表单数据 */
    initFormData = (info) => {
        // 初始化日期
        if(!info.expectEndDate){
            info.expectEndDate = moment().add(1, 'days');
        }
        // 处理自定义列表字段
        info = this.initFormTags(info, 'property_value');
        // 处理工序列表
        this.initProcessTable(info);
        return info;
    };

    /** 初始化自定义列*/
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

    /** 初始化工序列表*/
    initProcessTable = (info) => {
        if(!info || !info.processList || info.processList.length === 0) return;
        let {fileMap} = this.state;
        //如果修改操作中的负责人设置为隐藏，那么置空officerId
        let employeeList = this.props.employeeList;
        employeeList = employeeList && employeeList.toJS().data.data;
        let employeeListAry = [];
        for(let i=0;i<employeeList.length;i++){
            if(employeeList[i].visibleflag === 0){
                employeeListAry.push(employeeList[i].id);
            }
        }
        let processTable = info.processList.map((item, index) => {
            let out = {};
            let fileIds = [];
            out.key = index;
            out.id = item.id;
            out.processCode = item.processCode;
            out.processName = item.processName;
            out.expectStartDate = item.expectStartDate && moment(item.expectStartDate);
            out.expectEndDate = item.expectEndDate && moment(item.expectEndDate);
            out.expectCount = item.expectCount||item.workload;
            out.caCode = item.caCode;
            out.officerId = employeeListAry.indexOf(item.officerId)===-1?'':item.officerId;
            out.remarks = item.remarks;
            _.forEach(item.fileInfo, o => {
                if(!fileMap[o.fileId]){
                    fileIds.push(o.fileId);
                    fileMap[o.fileId] = o.fileName;
                }
            });
            out.fileIds = _.join(fileIds, ',');
            return out;
        });
        if(this.processTableRef.initFormData){
            this.setState({ fileMap });
            this.processTableRef.initFormData(processTable);
        }
    };

    closeModal = (tag) => {
        let obj = {};
        obj[tag] = false;
        this.setState(obj)
    };

    openModal = (tag) => {
        let obj = {};
        obj[tag] = true;
        this.setState(obj)
    };

    getProcessTableRef = (processTableRef) => {
        this.processTableRef = processTableRef
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
                        customInfoType: 'WorkOrderPropInfo'
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

    dealProcessList = (values) => {
        let list = this.processTableRef.state.processList;

        let processList = [];
        for(let i=0;i<list.length;i++){
            processList.push(values.processList[list[i].key]);
        }
        values.processList = processList.filter(item =>
            item!=null && item.processCode);   // 拥有 processCode 才说明该条数据有效;

        values.processList = values.processList.filter(item => {
            item.fileIds = item.fileIds ? item.fileIds.split(',') : '';
            return item!=null
        });
    };

    /** 处理表单提交数据*/
    dealSubmitFormInfo = (values) => {
        this.dealCustomField(values); //处理自定义字段
        this.dealProcessList(values);
    };

    /**  后端校验工作，如符合条件则提交表单 */
    backendValidateAndSubmit = async (module, values) => {
        /** 审批未开启 直接提交*/
        await new Promise((resolve, reject) => {
            this.setState({submitData: values}, () => {
                this.cancelApproveOperate();
                reject();
            });
        })
    };

    // 获取工序列表
    fetchProcessList = ({bomCode, level, quantity}) => {
        this.props.asyncFetchProcessListByBomCode({bomCode, level, productionQuantity: quantity},(data)=>{
            if(data.data){
                let obj = {
                    processList:data.data
                };
                this.initProcessTable(obj);
            }
        })
    };

    //从销售订单获取数据的回调
    handleSaleOrderPopOnOK = (list) => {
        let info = {
            prodName: list[0].prodName,
            productCode: list[0].prodNo,
            expectCount: list[0].quantity,
            saleBillNo: list[0].saleBillNo,
            displaySaleBillNo: list[0].saleDisplayBillNo,
            saleCustomerOrderNo: list[0].saleCustomerOrderNo,
            prodDisplayCode: list[0].prodCustomNo,
        };
        this.initForm(info);
        let {bomCode, level, quantity} = list[0];
        if(bomCode){
            this.fetchProcessList({bomCode, level, quantity});
        }
    };

    handleSubmit = async (values) => {
        console.log('Received values of form: ', values);
        /** 处理表单提交数据 */
        this.dealSubmitFormInfo(values);
        /** 后端校验工作，如符合条件则提交表单*/
        await this.backendValidateAndSubmit('productControl', values);
        /** 提交表单数据 */
        this.asyncSubmit();
    };

    // 提交表单数据（新加） ***
    asyncSubmit=()=> {
        let values = this.state.submitData;
        this.props.asyncAddProductControl(values.billNo, values, (res) => {
            if (res.data.retCode === '0') {
                let displayId = res.data.data;
                message.success(intl.get("purchase.add.index.operateSuccessMessage"));
                this.props.emptyFieldChange();
                let url = `/productControl/show/${displayId}`;
                this.props.history.push(url);
            }  else {
                Modal.error({
                    title: intl.get("purchase.add.index.warningTip"),
                    content: (res.data.retValidationMsg && res.data.retValidationMsg.rowMsg && res.data.retValidationMsg.rowMsg[0].msgs && res.data.retValidationMsg.rowMsg[0].msgs[0] && res.data.retValidationMsg.rowMsg[0].msgs[0].msg)||res.data.retMsg
                })
            }
        })
    };

    resetDefaultFields = ()=>{
        const {match} = this.props;
        const id = match.params.id;
        if(id){
            this.props.asyncFetchProductControlById(id, ()=>{
                this.props.setInitFinished();
            })
        }else{
            this.props.asyncFetchPreData(()=>{
                this.props.setInitFinished();
            });
        }
    };

    render() {
        const {match, productControlInfo, preData, asyncFetchProcessListByKey,employeeList} = this.props;
        const {saleOrderPopVisible,fileMap} = this.state;
        let id = match.params.id || match.params.copyId;
        let isCopy = !!match.params.copyId;

        let productControlInfoData,
            baseInfo;
        if(id){
            productControlInfoData = productControlInfo && productControlInfo.getIn(['data', 'data']);
            if(productControlInfoData && productControlInfoData.get('billNo') === id) {
                baseInfo = productControlInfoData;
            }
        }

        return (
            <React.Fragment>
                <Content.ContentHd>
                    <Crumb data={[
                        {
                            url: '/productControl/',
                            title: "生产工单"
                        },
                        {
                            title: this.props.match.params.id ? "修改生产工单": "新建生产工单"
                        }
                    ]}/>
                </Content.ContentHd>
                <Content.ContentBd>
                    <Spin
                        spinning={preData.get('isFetching') || productControlInfo.get("isFetching")}
                    >
                        <AddForm {...this.props}
                                 onSubmit={this.handleSubmit}
                                 formRef={this.formRef}
                                 isModify={!!match.params.id}
                                 loading={productControlInfo.get('isFetching')}
                        >
                            {
                                this.formRef.current && (
                                    <React.Fragment>
                                        <AddForm.TopOpe>
                                            <Button type="sub" className="fr"
                                                    onClick={() => this.openModal('saleOrderPopVisible')}>从销售订单选择</Button>
                                            <Modal
                                                visible={saleOrderPopVisible}
                                                title={'选择销售物品'}
                                                width={'1400px'}
                                                footer={null}
                                                onCancel={() => this.closeModal('saleOrderPopVisible')}
                                                destroyOnClose={true}
                                                okText={'确定'}
                                                cancelText={'取消'}
                                            >
                                                <SaleOrderPop
                                                    onCancel={() => this.closeModal('saleOrderPopVisible')}
                                                    onOk={(list, bomList) => this.handleSaleOrderPopOnOK(list, bomList)}
                                                />
                                            </Modal>
                                        </AddForm.TopOpe>
                                        <AddForm.BaseInfo>
                                            <BaseInfo {...this.props} formRef={this.formRef}
                                                      fetchProcessList={this.fetchProcessList}
                                                      initBaseInfo={baseInfo}/>
                                        </AddForm.BaseInfo>
                                        <Fold title="工序">
                                            <ProcessTable dataPrefix={this.dataPrefix} formRef={this.formRef}
                                                          getRef={this.getProcessTableRef}
                                                          asyncFetchProcessListByKey={asyncFetchProcessListByKey}
                                                          hideWorkloadFlag={true}
                                                          processCodeRequiredFlag={true}
                                                          processNameRequiredFlag={true}
                                                          caCodeRequiredFlag={true}
                                                          officerIdRequiredFlag={true}
                                                          employeeList={employeeList}
                                                          fileMap={fileMap}
                                                          isCopy={isCopy}/>
                                        </Fold>
                                        <AddForm.OtherInfo>
                                            <OtherInfo  {...this.props}
                                                        formRef={this.formRef}
                                                        initBaseInfo={baseInfo}
                                                        getRef={this.getOtherInfoRef}
                                            />
                                        </AddForm.OtherInfo>
                                        <div style={{display: "none"}}>
                                            <Form.Item name="id" initialValue={productControlInfo && productControlInfo.get('id')}>
                                                <Input type="hidden"/>
                                            </Form.Item>
                                            <Form.Item name="billNo" initialValue={this.props.match.params.id}>
                                                <Input type="hidden"/>
                                            </Form.Item>
                                            <Form.Item name="fkProduceNo">
                                                <Input type="hidden"/>
                                            </Form.Item>
                                        </div>
                                    </React.Fragment>
                                )
                            }
                        </AddForm>
                    </Spin>
                </Content.ContentBd>
            </React.Fragment>
        );
    }
}
