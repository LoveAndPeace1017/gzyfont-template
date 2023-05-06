import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import {Button, Input, message, Spin, Modal, Form} from 'antd';
import {withRouter} from "react-router-dom";
import moment from 'moment-timezone';
import {
    ExclamationCircleOutlined
} from '@ant-design/icons';
import Crumb from 'components/business/crumb';

import {addPage} from  'components/layout/listPage';
import {newAddForm as AddForm, actions as addFormActions, formCreate} from 'components/layout/addForm';
import Content from 'components/layout/content';
import {asyncFetchPreData, asyncAddStocktaking, asyncFetchStocktakingById, emptyDetailData,asyncCancelStocktaking, asyncFetchStockProdData} from '../actions';
import { withPreProcessProd, StockProdList as ProdList } from 'components/business/goods';
import LimitOnlineTip from 'components/business/limitOnlineTip';
import GoodsTableFieldConfigMenu from 'components/business/goodsTableFieldConfigMenu';

import formMap from '../dependencies/initFormMap';
import BaseInfo from './baseInfo';
import OtherInfo from './otherInfo';

import classNames from "classnames/bind";
import styles from "../styles/index.scss";
import {fromJS} from "immutable";
import _ from "lodash";

const cx = classNames.bind(styles);

const mapStateToProps = (state) => ({
    addStocktaking: state.getIn(['stocktakingAdd', 'addStocktaking']),
    stocktakingInfo: state.getIn(['stocktakingAdd', 'stocktakingInfo']),
    preData:  state.getIn(['stocktakingAdd', 'preData']),
    goodsTableConfig: state.getIn(['goodsTableFieldConfigMenu', 'goodsTableConfig']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchPreData,
        asyncAddStocktaking,
        asyncCancelStocktaking,
        asyncFetchStocktakingById,
        emptyDetailData,
        asyncFetchStockProdData,
        setInitFinished: addFormActions.setInitFinished
    }, dispatch)
};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
@formCreate
export default class StocktakingAddForm extends addPage {
    formRef = React.createRef();
    dataPrefix = 'prod';
    source='STOCK';
    fieldConfigType = 'warecheck_order';

    getProdRef = (prodRef)=>{
        this.prodRef = prodRef;
    };

    getOtherInfoRef = (otherInfoRef) => {
        this.otherInfoRef = otherInfoRef
    };

    constructor(props) {
        super(props);
        this.state={
            copyFromOrderVisible: false,
            customerNo: '',
            deliveryAddrData: fromJS([]),
            tags: [],
            totalQuantity: 0,
            isDraft: false,
            wareName:"",
            showTip: false,
            warehouseName: ''
        };
    }

    componentDidMount() {
        this.preDataProcess();
    }

    /** 初始化数据的流程 */
    preDataProcess = async () => {
        const {match} = this.props;
        //修改页面或复制页面
        let id = match.params.id || match.params.copyId;
        await this.initPreData();
        if(id) await this.initModifyData(id);
        this.props.setInitFinished();
    };


    /** 初始化数据 */
    initPreData = () => {
        return new Promise((resolve, reject) => {
            this.props.asyncFetchPreData((preData)=>{
                let warehouseName = '';
                if(preData && preData.data) warehouseName = preData.data.warehouseName;
                this.handleWarehouseNameChange(warehouseName);
                this.initForm({warehouseName});
                resolve();
            });
        })
    };

    // 预处理物品列表数据
    preProcessProd = (prodList) => {
        return prodList.map(item => {
            item.recUnit = item.unit;
            item.productCode = item.prodNo;
            item.offsetQuantityShow = item.offsetQuantity;
            return item;
        })
    };

    /** 初始化修改数据 */
    initModifyData = (id) => {
        return new Promise((resolve, reject) => {
            this.props.asyncFetchStocktakingById(id,(res)=>{
                if(res && res.data) {
                    const {match} = this.props;
                    let info = res.data;
                    if(match.params.copyId){
                        this.initCopyStockProdData(info.warehouseName, info.prodList);
                        info.addedTime = moment();
                    } else {
                        let prodList = this.preProcessProd(info.prodList);
                        // 初始化物品表单数据
                        this.initProdForm(prodList);
                    }
                    this.initForm(info);
                }
                resolve();
            });
        })
    };

    componentWillUnmount() {
        this.props.emptyDetailData();
    }

    // 初始化复制的盘点物品列表信息
    initCopyStockProdData = (warehouseName, prodList) => {
        prodList = prodList.map(item => {
            item.code = item.prodNo;
            return item;
        });
        this.props.asyncFetchStockProdData({warehouseName, prodList}, (data)=>{
            let list = this.preProcessProd(data.data);
            this.initProdForm(list);
        });
    };

    /** 初始化表单数据 */
    initFormData = (info) => {
        return info;
    };

    /** 初始化时给表单赋值 */
    initForm = (info)=>{
        info = this.initFormData(info);
        this.initFormField(formMap, info);
    };

    /** 初始化物品表单数据 */
    initProdForm = (prodList, source, callback) => {
        if(prodList && prodList.length > 0){
            this.prodRef.props.fillList(prodList, source, () => {
                callback && callback();
            });
        }
    };

    /** 处理物品列表*/
    dealProdList = (values) => {
        let prodList = _.filter(values.prod, (item) => item);
        let formData = this.prodRef.props.formData;
        prodList = _.map(prodList, (item, idx) => {
            let {amount,diasbleFlag,key,orderPrice,quantity,recQuantity,salePrice,
                serial,tax,unitConverterText,unitPrice,untaxedAmount,
                untaxedPrice,wareIsFetching,...form} = formData[idx];
            item.unit = (!form.unit) ? item.recUnit : form.unit;
            return {...form, ...item};
        });
        delete values[this.dataPrefix];
        values.prodList = prodList;
    };

    submitForm = (type)=>{
        this.formRef.current.validateFields().then(values => {
            //处理物品信息
            this.dealProdList(values);

            let method = type==='add'?"asyncAddStocktaking":"asyncCancelStocktaking";
            if(this.props.match.params.copyId || !this.props.match.params.id){
                values.checkNo = "";
            }
            let fileIds = this.otherInfoRef.state.fileList.map(item => item.response.fileId);
            this.props[method](values.checkNo, {
                ...values,
                fileIds
            }, (data) => {
                if (data.retCode === '0') {
                    let displayId = data.data;
                    message.success(intl.get("stocktaking.add.index.operateSuccessMessage"));
                    this.props.emptyFieldChange();
                    (displayId || values.checkNo) && this.props.history.push(`/inventory/stocktaking/show/${displayId || values.checkNo}`);
                }else if (data.retCode == '2019'){
                    Modal.info({
                        icon: <ExclamationCircleOutlined/>,
                        title: intl.get("stocktaking.add.index.warningTip"),
                        content: (
                            <div>
                                <p>{intl.get("stocktaking.add.index.vipExpireTip")}</p>
                                <a style={{color:'#0066dd'}} target="_blank" href="https://kefu.trademessenger.com/chat?domain=abiz&businessType=ayfvNxUccAs&multiWindow=true">{intl.get("stocktaking.add.index.treatyText")}</a>
                            </div>
                        )
                    });
                    return false;
                }else if(data && data.retCode == undefined && !data.status){
                    this.setState({showTip:true});
                }else {
                    //alert(data.retMsg);
                    Modal.error({
                        title: intl.get("stocktaking.add.index.warningTip"),
                        content: data.retMsg
                    });
                }
            });
        }).catch(errorInfo => {
            message.error('存在信息不符合规则，请修改！');
        });
    };

    handleSubmit = () => {
        this.submitForm('add');
    };

    /** 清楚物品列表数据 */
    emptyProdList = (callback) => {
        this.prodRef.props.clearAllRows(callback);
    };

    showFinishConfirm = ()=>{
        let self = this;
        this.setState({
            isDraft: false
        },()=>{
            Modal.confirm({
                title: intl.get("stocktaking.add.index.warningTip"),
                okText: intl.get("stocktaking.add.index.okText"),
                cancelText: intl.get("stocktaking.add.index.cancelText"),
                content: intl.get("stocktaking.add.index.message_1"),
                onOk() {
                    self.submitForm('endCheck');
                },
                onCancel() { },
            });
        });
    };

    saveDraft=()=>{
        this.setState({
            isDraft: true
        },()=>{
            this.submitForm('add');
        });
    };

    resetDefaultFields = ()=>{
        const {match} = this.props;
        const id = match.params.id;
        if(id){
            this.props.asyncFetchStocktakingById(id, ()=>{
                this.props.setInitFinished();
            })
        }else{
            this.props.asyncFetchPreData(()=>{
                this.props.setInitFinished();
            });
        }
    };

    handleWarehouseNameChange = (warehouseName) => {
        this.setState({warehouseName});
    };

    render() {

        const {stocktakingInfo, preData, match, goodsTableConfig} = this.props;

        const stocktakingInfoData = stocktakingInfo && stocktakingInfo.getIn(['data', 'data']);
        const baseInfo = stocktakingInfoData;

        let listFields, prodFields;
        if(match.params.id){
            listFields  = stocktakingInfo && stocktakingInfo.getIn(['data', 'listFields']);
            prodFields  = stocktakingInfo && stocktakingInfo.getIn(['data', 'prodDataTags']);
        }else{
            listFields  = preData && preData.getIn(['data', 'listFields']);
            prodFields  = preData && preData.getIn(['data', 'prodDataTags']);
        }


        let footerBar = <React.Fragment>
            <Button type="primary" htmlType="button" onClick={this.showFinishConfirm}>{intl.get("stocktaking.add.index.finishStock")}</Button>
            <Button type="primary" htmlType="button" loading={this.props.loading} onClick={()=>this.saveDraft()}>{intl.get("stocktaking.add.index.save")}</Button>
            <Button type="default" onClick={this.props.history.goBack}>{intl.get("stocktaking.add.index.cancel")}</Button>
        </React.Fragment>;

        return (
            <React.Fragment>
                <Content.ContentHd>
                    <Crumb data={[
                        {
                            url: '/inventory/stocktaking/',
                            title: intl.get("stocktaking.add.index.stocktaking")
                        },
                        {
                            title: (this.props.match.params.id)? intl.get("stocktaking.add.index.modifyStocktakingOrder") : intl.get("stocktaking.add.index.addStocktakingOrder")
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <GoodsTableFieldConfigMenu
                            tableConfigList={listFields}
                            refresh={this.resetDefaultFields}
                            type={'warecheck_order'}
                        />
                    </div>
                </Content.ContentHd>
                <Content.ContentBd>
                    <Spin
                        spinning={preData.get('isFetching') || stocktakingInfo.get("isFetching")}
                    >
                        <AddForm
                            {...this.props}
                            formRef={this.formRef}
                            onSubmit={this.handleSubmit}
                            loading={this.props.addStocktaking.get('isFetching')}
                            footerBar={footerBar}
                        >
                            {
                                this.formRef.current && (
                                    <React.Fragment>
                                        <AddForm.BaseInfo>
                                            <BaseInfo {...this.props} initBaseInfo={baseInfo}
                                                      emptyProdList={this.emptyProdList}
                                                      handleWarehouseNameChange={this.handleWarehouseNameChange}/>
                                        </AddForm.BaseInfo>
                                        <AddForm.ProdList>
                                            <ProdList dataPrefix={this.dataPrefix}
                                                      getRef={this.getProdRef}
                                                      formRef={this.formRef}
                                                      source={this.source}
                                                      prodFields={prodFields}
                                                      goodsPopCondition={{wareName: this.state.warehouseName}}
                                                      isDraft={this.state.isDraft}
                                                      billType={"listForSaleOrder"}
                                                      goodsTableConfig={goodsTableConfig}/>
                                            {/*<ProdList*/}
                                            {/*{...this.props}*/}
                                            {/*closeCopyModal={this.closeModal}*/}
                                            {/*formRef={this.formRef}*/}
                                            {/*copyFromOrderVisible={this.state.copyFromOrderVisible}*/}
                                            {/*wareName={this.state.warehouseName}*/}
                                            {/*initGoodsTableData={goodsTableData}*/}
                                            {/*totalQuantity={this.state.totalQuantity}*/}
                                            {/*isDraft={this.state.isDraft}*/}
                                            {/*onRef={this.onRef}*/}
                                            {/*/>*/}
                                        </AddForm.ProdList>
                                        <AddForm.OtherInfo>
                                            <OtherInfo  {...this.props}
                                                        formRef={this.formRef}
                                                        initBaseInfo={baseInfo}
                                                        getRef={this.getOtherInfoRef}
                                                        deliveryAddrData={this.state.deliveryAddrData}
                                            />
                                        </AddForm.OtherInfo>
                                        <div style={{display: "none"}}>
                                            <Form.Item name="checkNo"
                                                       initialValue={stocktakingInfoData?stocktakingInfoData.get('checkNo'):''}>
                                                <Input type="hidden"/>
                                            </Form.Item>
                                        </div>
                                    </React.Fragment>
                                )
                            }
                        </AddForm>
                    </Spin>
                </Content.ContentBd>
                <LimitOnlineTip onClose={()=>this.closeModal('showTip')} show={this.state.showTip}/>
            </React.Fragment>
        );
    }
}


