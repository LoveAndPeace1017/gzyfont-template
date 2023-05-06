import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import {Button, Row, Input, message, Spin, Form, Modal} from 'antd';
import {withRouter} from "react-router-dom";
import Crumb from 'components/business/crumb';
import {newAddForm as AddForm, actions as addFormActions, formCreate} from 'components/layout/addForm';
import Content from 'components/layout/content';
import Fold from 'components/business/fold';
import {ExclamationCircleOutlined} from '@ant-design/icons';
import {asyncFetchPreData, asyncAddSubcontract, asyncFetchSubcontractById, emptyDetailData} from '../actions';
import {actions as supplierAddActions} from 'pages/supplier/add'
import GoodsTableFieldConfigMenu from 'components/business/goodsTableFieldConfigMenu';
import {addPage} from  'components/layout/listPage';
import {actions as vipOpeActions} from "components/business/vipOpe";
import {actions as vipServiceHomeActions} from "pages/vipService/index";
import {checkWareArriveUpperLimit, dealCheckWareUpperLimitData, actions as wareUpperLimitActions} from 'components/business/checkWareArriveUpperLimit';
import BaseInfo from './baseInfo';
import PreformProdList from './preformProdList';
import ConsumeProdList from './consumeProdList';
import OtherInfo from './otherInfo';
import 'url-search-params-polyfill';
import {getUrlParamValue} from 'utils/urlParam';
import formMap from '../dependencies/initFormMap';

import classNames from "classnames/bind";
import styles from "../styles/index.scss";
const cx = classNames.bind(styles);

const mapStateToProps = (state) => ({
    addSubcontract: state.getIn(['subcontractAdd', 'addSubcontract']),
    subcontractInfo: state.getIn(['subcontractAdd', 'subcontractInfo']),
    preData: state.getIn(['subcontractAdd', 'preData']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchPreData,
        asyncAddSubcontract,
        asyncFetchSubcontractById,
        emptyDetailData,
        asyncShowSupplier: supplierAddActions.asyncShowSupplier,
        asyncShowSupplierForSelect: supplierAddActions.asyncShowSupplierForSelect,
        setInitFinished: addFormActions.setInitFinished,
        asyncCheckWareArriveUpperLimit: wareUpperLimitActions.asyncCheckWareArriveUpperLimit,
        asyncOpenVipAndSendRequestToOss: vipOpeActions.asyncOpenVipAndSendRequestToOss,
        asyncFetchVipService: vipServiceHomeActions.asyncFetchVipService
    }, dispatch)
};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
@formCreate
export default class SubAddForm extends addPage {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            supplierCode: '',
            fileList: [],
            showTip: false,
            submitData: {}, // 新增最终提交表单的信息  ***
            createEnter: false  // 成品入库是否勾选
        };
    }

    componentDidMount() {
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
        const supplierNo = params && params.get('supplierNo') || "";
        await this.initPreData();
        if(id) await this.initModifyData(id);
        if(supplierNo) await this.handleSelectSupplier(supplierNo, false);
        this.props.setInitFinished();
    };
    // 初始化数据
    initPreData = (id) => {
        return new Promise((resolve, reject) => {
            this.props.asyncFetchPreData(data => {
                if (data.retCode === '0') {
                    //设置仓库的默认值
                    if(!id){
                        this.formRef.current.setFieldsValue({
                            warehouseNameIn: data.warehouseName,
                            warehouseNameOut: data.warehouseName
                        });
                    }
                    this.initForm({});
                    resolve();
                }
            });
        });
    };

    // 初始化修改数据
    initModifyData = (id) => {
        return new Promise((resolve, reject) => {
            this.props.asyncFetchSubcontractById(id, data => {
                let subcontract = data.data || {};
                this.initForm(subcontract);
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
        // 处理自定义列表字段
        return info;
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

    getOtherInfoRef = (otherInfoRef) => {
        this.otherInfoRef = otherInfoRef
    };

    /** 处理物品列表*/
    dealProdList = (values) => {
        values.enterProdList = values.enterProdList.filter(item=>{
            return item && Object.entries(item).some(v => {
                return (v[0] === 'prodName' && v[1] && v[1] !== ''); //物品名称必须要有值，否则这行物品数据会被过滤掉
            });
        });
        values.outProdList = values.outProdList.filter(item=>{
            return item && Object.entries(item).some(v => {
                return (v[0] === 'prodName' && v[1] && v[1] !== ''); //物品名称必须要有值，否则这行物品数据会被过滤掉
            });
        });
    };

    /** 处理其他信息*/
    dealOtherInfo = (values) => {
        if(this.props.match.params.copyId) values.id = null;  // 复制状态将id置为0
        values.fileIds = this.otherInfoRef.state.fileList.map(item => item.response.fileId);
        values.createEnter = this.state.createEnter;
        if(values.supplier){
            values.supplierCode = values.supplier.key;
            values.supplierName = values.supplier.label;
        }
    };

    /** 处理表单提交数据*/
    dealSubmitFormInfo = (values) => {
        this.dealProdList(values);  // 处理物品列表
        this.dealOtherInfo(values);  // 处理其他信息
    };

    /** 校验库存上限*/
    validateWarehouseArriveUpperLimit = (module, values) => {
        let _this = this;
        return new Promise(function (resolve, reject) {
            let {billNo, outProdList, warehouseNameOut} = values;
            let initWareParams = dealCheckWareUpperLimitData(billNo, outProdList, warehouseNameOut, module);
            _this.props.asyncCheckWareArriveUpperLimit(initWareParams, (res) => {  // 校验是否达到上限
                // data 为 0代表正常操作  1 允许超卖  2 不允许超卖
                // 1 表示允许超卖， 点击确定继续执行表单操作
                if(res===1) {
                    checkWareArriveUpperLimit(res, module, ()=> resolve(), ()=> reject());
                } else if(res===2) {
                    checkWareArriveUpperLimit(res, module, ()=>reject(), ()=>reject());
                } else{
                    resolve();
                }
            });
        })
    };

    /**  后端校验工作，如符合条件则提交表单 */
    backendValidateAndSubmit = async (module, values) => {
        /** 直接提交*/
        await new Promise((resolve, reject) => {
            this.setState({submitData: values}, () => {
                this.cancelApproveOperate();
                reject();
            });
        })

    };

    handleSubmit = async (values) => {
        console.log('Received values of form: ', values);
        /** 校验库存上限*/
        await this.validateWarehouseArriveUpperLimit('outbound', values);
        /** 处理表单提交数据 */
        this.dealSubmitFormInfo(values);
        /** 后端校验工作，如符合条件则提交表单*/
        await this.backendValidateAndSubmit('outbound', values);
        /** 提交表单数据 */
        this.asyncSubmit();
    };

    // 提交表单数据（新加） ***
    asyncSubmit=()=> {
        let values = this.state.submitData;
        this.props.asyncAddSubcontract(values.billNo, values, (res) => {
            if (res.data.retCode === '0') {
                let displayId = res.data.data;
                message.success(intl.get("purchase.add.index.operateSuccessMessage"));
                this.props.emptyFieldChange();
                let url = `/subcontract/show/${displayId}`;
                this.props.history.push(url);
            } else if(res.data.retCode == '2001' && res.data.retMsg === 'limitException' ) {
                this.setState({showTip:true});
            }  else if (res.data.retCode == '2019'){
                Modal.info({
                    icon: <ExclamationCircleOutlined/>,
                    title: intl.get("purchase.add.index.warningTip"),
                    content: (
                        <div>
                            <p>{intl.get("purchase.add.index.vipExpireTip")}</p>
                            <a style={{color:'#0066dd'}} target="_blank" href="https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true">{intl.get("purchase.add.index.treatyText")}</a>
                        </div>
                    )
                });
                return false;
            } else {
                Modal.error({
                    title: intl.get("purchase.add.index.warningTip"),
                    content: (res.data.retValidationMsg && res.data.retValidationMsg.msg && res.data.retValidationMsg.msg[0].msg)||res.data.retMsg
                })
            }
        })
    };

    //选择供应商后，带入联系人联系电话以及供应商交货地址
    handleSelectSupplier = (supplierCode, isInit) => {
        this.setState({
            supplierCode
        });
        new Promise((resolve, reject) => {
            this.props.asyncShowSupplierForSelect(supplierCode, data => {
                if (data.retCode === '0') {
                    if (!isInit) {
                        //带入客户联系人和联系电话
                        const contacterName = data.data.contacterName;
                        const mobile = data.data.mobile;
                        this.formRef.current.setFieldsValue({
                            supplier: {
                                key: data.data.code,
                                label: data.data.name
                            },
                            supplierContacterName: contacterName,
                            supplierMobile: mobile
                        });
                    }
                    resolve();
                }
            });
        });
    };

    resetDefaultFields = ()=>{
        const {match} = this.props;
        const id = match.params.id;
        if(id){
            this.props.asyncFetchSubcontractById(id, ()=>{
                this.props.setInitFinished();
            })
        }else{
            this.props.asyncFetchPreData(()=>{
                this.props.setInitFinished();
            });
        }
    };

    fillGoodsCallback = (callback) => {
        // 获取消耗原料列表的填充物品的方法 以提供给 加工成品列表在点击配件提交时将物品填充到消耗原料列表
        if(callback) this.fittingFillGoods = callback;
    };

    setFinishProductInboundFlag = (e) => {
        this.setState({createEnter:e.target.checked})
    };

    render() {

        const {match, subcontractInfo, preData} = this.props;

        let listFields;

        if(match.params.id){
            listFields  = subcontractInfo && subcontractInfo.getIn(['data', 'listFields']);
        }else{
            listFields  = preData && preData.getIn(['data', 'listFields'])
        }

        let id = match.params.id || match.params.copyId;

        let subcontractInfoData,
            baseInfo,
            enterGoodsTableData,
            outGoodsTableData;
        if(id){
            subcontractInfoData = subcontractInfo && subcontractInfo.getIn(['data', 'data']);
            if(subcontractInfoData && subcontractInfoData.get('billNo') === id) {
                baseInfo = subcontractInfoData;
                enterGoodsTableData = subcontractInfoData && subcontractInfoData.get('enterProdList');
                outGoodsTableData = subcontractInfoData && subcontractInfoData.get('outProdList');
            }
        }

        return (
            <React.Fragment>
                <Content.ContentHd>
                    <Crumb data={[
                        {
                            url: '/subcontract/',
                            title: "委外加工"
                        },
                        {
                            title: this.props.match.params.id ? "修改委外加工单": "新建委外加工单"
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <GoodsTableFieldConfigMenu
                            tableConfigList={listFields}
                            refresh={this.resetDefaultFields}
                            type={'outsource_product'}
                        />
                    </div>
                </Content.ContentHd>
                <Content.ContentBd>
                    <Spin
                        spinning={preData.get('isFetching') || subcontractInfo.get("isFetching")}
                    >
                        <AddForm id={'subcontract-form-add'}
                                 {...this.props}
                                 onSubmit={this.handleSubmit}
                                 formRef={this.formRef}
                                 isModify={!!match.params.id}
                                 setFinishProductInboundFlag={this.setFinishProductInboundFlag}
                                 loading={this.props.addSubcontract.get('isFetching')}
                        >
                            {
                                this.formRef.current && (
                                    <React.Fragment>
                                        <AddForm.BaseInfo>
                                            <BaseInfo {...this.props} formRef={this.formRef} initBaseInfo={baseInfo}
                                                      handleSelectSupplier={this.handleSelectSupplier}/>
                                        </AddForm.BaseInfo>
                                        <Fold title="加工成品列表">
                                            <AddForm.ProdList>
                                                <PreformProdList
                                                    {...this.props}
                                                    formRef={this.formRef}
                                                    fittingFillGoods={this.fittingFillGoods}
                                                    closeCopyModal={this.closeModal}
                                                    initGoodsTableData={enterGoodsTableData}
                                                />
                                            </AddForm.ProdList>
                                        </Fold>
                                        <Fold title="消耗原料列表">
                                            <AddForm.ProdList>
                                                <ConsumeProdList
                                                    {...this.props}
                                                    fillGoodsCallback={this.fillGoodsCallback}
                                                    formRef={this.formRef}
                                                    closeCopyModal={this.closeModal}
                                                    initGoodsTableData={outGoodsTableData}
                                                />
                                            </AddForm.ProdList>
                                        </Fold>
                                        <AddForm.OtherInfo>
                                            <OtherInfo  {...this.props}
                                                        formRef={this.formRef}
                                                        initBaseInfo={baseInfo}
                                                        getRef={this.getOtherInfoRef}
                                            />
                                        </AddForm.OtherInfo>
                                        <div style={{display: "none"}}>
                                            <Form.Item name="id" initialValue={subcontractInfoData && subcontractInfoData.get('id')}>
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
