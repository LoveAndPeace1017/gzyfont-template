import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import {Input, message, Spin, Form, Modal} from 'antd';
import {withRouter} from "react-router-dom";
import Crumb from 'components/business/crumb';
import {newAddForm as AddForm, actions as addFormActions, formCreate} from 'components/layout/addForm';
import Content from 'components/layout/content';
import Fold from 'components/business/fold';
import Tip from 'components/widgets/tip';
import {asyncFetchPreData, asyncAddMultiBom, asyncFetchMultiBomById, emptyDetailData} from '../actions';
import {actions as productControlActions, ProcessTable} from 'pages/productControl/add';
import {addPage} from  'components/layout/listPage';
import {actions as vipOpeActions} from "components/business/vipOpe";
import {actions as vipServiceHomeActions} from "pages/vipService/index";
import {asyncFetchEmployeeList} from '../../../auxiliary/employee/actions';
import BaseInfo from './baseInfo';
import FittingTable from './fittingTable';
import OtherInfo from './otherInfo';
import 'url-search-params-polyfill';
import {getUrlParamValue} from 'utils/urlParam';
import formMap from '../dependencies/initFormMap';

import classNames from "classnames/bind";
import styles from "../styles/index.scss";
const cx = classNames.bind(styles);

const mapStateToProps = (state) => ({
    addMultiBom: state.getIn(['multiBomAdd', 'addMultiBom']),
    multiBomInfo: state.getIn(['multiBomAdd', 'multiBomInfo']),
    preData: state.getIn(['multiBomAdd', 'preData']),
    employeeList: state.getIn(['auxiliaryEmployee', 'employeeList'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchPreData,
        asyncAddMultiBom,
        asyncFetchMultiBomById,
        emptyDetailData,
        asyncFetchEmployeeList,
        asyncFetchProcessListByKey: productControlActions.asyncFetchProcessListByKey,
        setInitFinished: addFormActions.setInitFinished,
        asyncOpenVipAndSendRequestToOss: vipOpeActions.asyncOpenVipAndSendRequestToOss,
        asyncFetchVipService: vipServiceHomeActions.asyncFetchVipService,
    }, dispatch)
};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
@formCreate
export default class Index extends addPage {
    formRef = React.createRef();
    dataPrefixForBom = 'accessoryList';
    dataPrefixForProcess = 'processList';
    constructor(props) {
        super(props);
        this.state = {
            submitData: {},
            oldMomFlag: false,  // 是否是老版bom
            fileMap: {},  // 上传文件的集合 such as {1101: '附件名称1'}  key: fileId, value: fileName
            tags: []
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
        //修改页面或复制页面
        let id = match.params.id || match.params.copyId;
        let params = new URLSearchParams(this.props.location.search);
        const prodNo = params && params.get('prodNo') || "";
        const prodName = params && params.get('prodName') || "";
        await this.initPreData();
        if(id) await this.initModifyData(id);
        // 新增子bom操作，从详情点击进入
        if(prodNo && prodName) this.initForm({prodNo, prodName});
        this.props.setInitFinished();
    };

    // 初始化数据
    initPreData = () => {
        return new Promise((resolve, reject) => {
            this.props.asyncFetchPreData(data => {
                if (data.retCode === '0') {
                    if (data.tags) {
                        let tags = this.initSubBomTags(data.tags);
                        this.setState({tags});
                    }
                    resolve();
                } else {
                    message.error(data.retMsg);
                    reject();
                }
            });
        });
    };

    // 初始化修改数据
    initModifyData = (id) => {
        return new Promise((resolve, reject) => {
            this.props.asyncFetchMultiBomById(id, data => {
                let info = data.data || {};
                if(!info.bomCode) {
                    this.setState({oldMomFlag : true});
                }
                this.initForm(info);
                resolve();
            })
        })
    };

    initForm = (info) => {
        info = this.initFormData(info);
        this.initFormField(formMap, info);
    };

    /** 初始化表单数据 */
    initFormData = (info) => {
        // 处理工序列表
        this.initProcessTable(info);
        // 初始化BOM配件列表
        this.initAccessoryList(info);
        return info;
    };

    /** 初始化自定义列*/
    initSubBomTags = (tags) => {
        tags = _.filter(tags, (tag)=>tag.propName);
        return _.map(tags, (tag) => {
            return {
                propName:tag.propName,
                propValue: `propertyValue${tag.mappingName.slice(-1)}`
            };
        });
    };

    /** 初始化BOM配件列表*/
    initAccessoryList = (info) => {
        if(!info || !info.accessoryList || !info.subProdList) return;
        // 老版bom(不具有bomCode)则取subProdList
        let accessoryList = info.bomCode ? info.accessoryList :info.subProdList;
        let accessoryTable = accessoryList.map(item => {
            let out = {};
            out.recId = item.recId;
            out.prodNo = item.prodNo;
            out.displayCode = item.prodCustomNo;
            out.prodName = item.prodName;
            out.unit = item.unit;
            out.brand = item.brand;
            out.descItem = item.descItem;
            out.proBarCode = item.proBarCode;
            out.produceModel = item.produceModel;
            out.quantity = item.quantity;
            out.lossRate = item.lossRate;
            _.forEach([1,2,3,4,5], (idx) => {
                if(item['propertyValue'+idx]) out['propertyValue'+idx] = item['propertyValue'+idx];
            });
            return out;
        });
        if(this.fittingTableRef.fillList){
            this.fittingTableRef.fillList(accessoryTable);
        }
    };

    /** 初始化工序列表*/
    initProcessTable = (info) => {
        let {fileMap} = this.state;
        if(!info || !info.processList || info.processList.length === 0) return;
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
            let fileIds = [];
            let out = {};
            out.key = index;
            out.id = item.id;
            out.processCode = item.processCode;
            out.processName = item.processName;
            out.caCode = item.caCode;
            out.workload = item.workload;
            out.officerId = employeeListAry.indexOf(item.officerId)===-1?'':item.officerId;
            _.forEach(item.fileInfo, o => {
                if(!fileMap[o.fileId]){
                    fileIds.push(o.fileId);
                    fileMap[o.fileId] = o.fileName;
                }
            });
            out.fileIds = _.join(fileIds, ',');
            return out;
        });
        if(processTable && processTable.length > 0){
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

    getFittingTableRef = (fittingTableRef) => {
        this.fittingTableRef = fittingTableRef
    };

    getProcessTableRef = (processTableRef) => {
        this.processTableRef = processTableRef
    };

    getOtherInfoRef = (otherInfoRef) => {
        this.otherInfoRef = otherInfoRef
    };

    /** 配件列表*/
    dealAccessoryList = (values) => {
        values.accessoryList = values.accessoryList.filter(item => item!=null);
    };

    /** 工序列表*/
    dealProcessList = (values) => {
        if(!values.processList) return;
        let list = this.processTableRef.state.processList;
        let processList = [];
        for(let i=0;i<list.length;i++){
            processList.push(values.processList[list[i].key]);
        }
        values.processList = processList.filter(item =>
            item!=null && item.processCode);   // 拥有 processCode 才说明该条数据有效;

        values.processList = values.processList.map((item, index) => {
            let {processCode, workload, caCode, officerId, fileIds,id} = item;
            fileIds = fileIds ? fileIds.split(',') : '';
            return {processCode, workload, caCode, officerId, orderNo: index+1, fileIds,id}
        });
    };

    /** 处理表单提交数据*/
    dealSubmitFormInfo = (values) => {
        this.dealAccessoryList(values);
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

    handleSubmit = async (values) => {
        console.log('Received values of form: ', values);
        /** 处理表单提交数据 */
        this.dealSubmitFormInfo(values);
        /** 后端校验工作，如符合条件则提交表单*/
        await this.backendValidateAndSubmit('multiBom', values);
        /** 提交表单数据 */
        this.asyncSubmit();
    };

    // 提交表单数据（新加） ***
    asyncSubmit=()=> {
        let values = this.state.submitData;
        this.props.asyncAddMultiBom(values.billNo, values, (res) => {
            if (res.data.retCode === '0') {
                let displayId = res.data.data;
                message.success(intl.get("purchase.add.index.operateSuccessMessage"));
                this.props.emptyFieldChange();
                let url = `/multiBom/show/${displayId}`;
                this.props.history.push(url);
            }  else {
                Modal.error({
                    title: intl.get("purchase.add.index.warningTip"),
                    content: (res.data.retValidationMsg && res.data.retValidationMsg.msg && res.data.retValidationMsg.msg[0].msg)||res.data.retMsg
                })
            }
        })
    };

    resetDefaultFields = ()=>{
        const {match} = this.props;
        const id = match.params.id;
        if(id){
            this.props.asyncFetchMultiBomById(id, ()=>{
                this.props.setInitFinished();
            })
        }else{
            this.props.asyncFetchPreData(()=>{
                this.props.setInitFinished();
            });
        }
    };

    render() {
        let {oldMomFlag, tags, fileMap} = this.state;
        const {match, multiBomInfo, preData, asyncFetchProcessListByKey,employeeList} = this.props;
        let id = match.params.id || match.params.copyId;
        const code = preData.getIn(['data', 'bomCode']);
        let isCopy = !!match.params.copyId;

        return (
            <React.Fragment>
                <Content.ContentHd>
                    <Crumb data={[
                        {
                            url: '/multiBom/list',
                            title: "多级BOM"
                        },
                        {
                            title: this.props.match.params.id ? "修改多级BOM": "新建多级BOM"
                        }
                    ]}/>
                </Content.ContentHd>
                <Content.ContentBd>
                    <Spin
                        spinning={preData.get('isFetching') || multiBomInfo.get("isFetching")}
                    >
                        <AddForm {...this.props}
                                 onSubmit={this.handleSubmit}
                                 formRef={this.formRef}
                                 isModify={!!match.params.id}
                                 loading={multiBomInfo.get('isFetching')}
                        >
                            {
                                this.formRef.current && (
                                    <React.Fragment>
                                        <AddForm.BaseInfo>
                                            <BaseInfo {...this.props} code={code} oldMomFlag={oldMomFlag} formRef={this.formRef}/>
                                        </AddForm.BaseInfo>
                                        <Fold title="BOM配件">
                                            <div>
                                                <Tip>目前生产单仅支持最多三阶BOM展开，为了功能适用请合理设计BOM组成</Tip>
                                            </div>
                                            <FittingTable dataPrefix={this.dataPrefixForBom} formRef={this.formRef}
                                                          tags={tags} getRef={this.getFittingTableRef}/>
                                        </Fold>
                                        <Fold title="工序">
                                            <ProcessTable dataPrefix={this.dataPrefixForProcess} formRef={this.formRef}
                                                          getRef={this.getProcessTableRef}
                                                          asyncFetchProcessListByKey={asyncFetchProcessListByKey}
                                                          source={'bom'} fileMap={fileMap}
                                                          employeeList = {employeeList}
                                                          hideExpectStartDateFlag={true} hideExpectEndDateFlag={true}
                                                          hideExpectCountFlag={true} isCopy={isCopy}/>
                                        </Fold>
                                        <Fold title="其他信息">
                                            <OtherInfo  {...this.props}
                                                        formRef={this.formRef}
                                                        getRef={this.getOtherInfoRef}
                                            />
                                        </Fold>
                                        <div style={{display: "none"}}>
                                            <Form.Item name="id" initialValue={multiBomInfo && multiBomInfo.get('id')}>
                                                <Input type="hidden"/>
                                            </Form.Item>
                                            <Form.Item name="billNo" initialValue={this.props.match.params.id}>
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
