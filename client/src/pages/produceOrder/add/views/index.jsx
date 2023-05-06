import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import {Input, message, Spin, Form, Modal, Button, Radio, Row, Col} from 'antd';
const RadioGroup = Radio.Group;
import {withRouter} from "react-router-dom";
import Crumb from 'components/business/crumb';
import {newAddForm as AddForm, actions as addFormActions, formCreate} from 'components/layout/addForm';
import Content from 'components/layout/content';
import Fold from 'components/business/fold';
import {asyncFetchPreData, asyncAddProduceOrder, asyncFetchProduceOrderById, emptyDetailData} from '../actions';
import {actions as supplierAddActions} from 'pages/supplier/add';
import {actions as fieldConfigActions} from 'components/business/goodsTableFieldConfigMenu'
import {actions as produceOrderIndexActions} from "pages/produceOrder/index";

import {addPage} from  'components/layout/listPage';
import {actions as vipOpeActions} from "components/business/vipOpe";
import SheetGoods from 'components/business/sheetGoods';
import GoodsTableFieldConfigMenu from 'components/business/goodsTableFieldConfigMenu';
import {actions as vipServiceHomeActions} from "pages/vipService/index";
import {actions as mrpCountShowActions} from 'pages/mrpCount/show';
import BaseInfo from './baseInfo';
import OtherInfo from './otherInfo';
import SaleOrderPop from './saleOrderPop';
import 'url-search-params-polyfill';
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';
import {getUrlParamValue} from 'utils/urlParam';
import formMap from '../dependencies/initFormMap';
import classNames from "classnames/bind";
import styles from "../styles/index.scss";
import moment from "moment-timezone/index";
const cx = classNames.bind(styles);
const PpopGoods = SheetGoods();
const PpomGoods = SheetGoods();

const mapStateToProps = (state) => ({
    goodsTableConfig: state.getIn(['goodsTableFieldConfigMenu', 'goodsTableConfig']),
    addProduceOrder: state.getIn(['produceOrderAdd', 'addProduceOrder']),
    produceOrderInfo: state.getIn(['produceOrderAdd', 'produceOrderInfo']),
    preData: state.getIn(['produceOrderAdd', 'preData']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchPreData,
        asyncAddProduceOrder,
        asyncFetchProduceOrderById,
        emptyDetailData,
        emptyFieldConfig: fieldConfigActions.emptyFieldConfig,
        asyncSaveFieldConfigForProduce: fieldConfigActions.asyncSaveFieldConfigForProduce,
        asyncShowSupplier: supplierAddActions.asyncShowSupplier,
        asyncShowSupplierForSelect: supplierAddActions.asyncShowSupplierForSelect,
        asyncFetchProduceFittingList: produceOrderIndexActions.asyncFetchProduceFittingList,
        asyncFetchMrpCountDetail: mrpCountShowActions.asyncFetchMrpCountDetail,
        setInitFinished: addFormActions.setInitFinished,
        asyncOpenVipAndSendRequestToOss: vipOpeActions.asyncOpenVipAndSendRequestToOss,
        asyncFetchVipService: vipServiceHomeActions.asyncFetchVipService,
    }, dispatch)
};

/**
 * @visibleName Index（生产单新建）
 * @author jinb
 */
@withRouter
@connect(mapStateToProps, mapDispatchToProps)
@formCreate
export default class Index extends addPage {
    formRef = React.createRef();
    dataPrefixForPpopList = 'ppopList'; // 成品
    dataPrefixForPpomList = 'ppomList'; // 原料
    constructor(props) {
        super(props);
        let produceType =  props.location.searchObj.produceType || 0;
        this.state = {
            submitData: {},
            fileList: [],
            produceType: Number(produceType), // 生产类型 0：内部制造，1：委外加工
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
        const fkMrpBillNo = params && params.get('fkMrpBillNo') || "";  // mrp详情页-生产建议 点击 生产 操作带入
        const sIndex = params && params.get('index') || [];  // mrp详情页-生产建议 点击 生产 操作带入  索引不会发生改变 可以做唯一key
        //修改页面或复制页面
        let id = match.params.id || match.params.copyId;
        await this.initPreData();
        if(id) await this.initModifyData(id);
        if(fkMrpBillNo) await this.initMrpProduceInfo(fkMrpBillNo, sIndex);
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
            this.props.asyncFetchProduceOrderById(id, data => {
                let info = data.data || {};
                this.initForm(info);
                resolve();
            })
        })
    };

    // 初始化Mrp带入的数据
    initMrpProduceInfo = async (id, sIndex) => {
        let info = {};
        let indexGroup = _.split(sIndex, ',');
        let ppopList = await this.getMrpData(id);
        info.fkMrpBillNo = id;
        info.ppopList = _.map(indexGroup, index => this.initMrpData(ppopList[index]));
        // 比较最小日期
        info.orderDate = _.get(_.minBy(info.ppopList, (o)=> o.requiredDate), 'requiredDate');
        info.ppomList = await this.getFittingData(info.ppopList);
        this.initForm(info);
    };

    // 处理Mrp的数据对应关系
    initMrpData = (info) => {
        let {prodNo, prodCustomNo, prodName, unit, brand, descItem, produceModel, suggestQuantity: quantity, bomCode, requiredDate} = info;
        return {prodNo, prodCustomNo, prodName, unit, brand, descItem, produceModel, quantity, bomCode, requiredDate, level: 1}
    };

    // 获取bomCode对应详情数据
    getMrpData = (id) => {
        return new Promise((resolve, reject) => {
            this.props.asyncFetchMrpCountDetail('productionSuggest',id, data => {
                if(data.data.retCode === '0'){
                    resolve(data.data.data);
                }
                reject();
            })
        })
    };

    // 获取bom成品对应的配件信息
    getFittingData = (bomList) => {
        return new Promise((resolve, reject) => {
            this.props.asyncFetchProduceFittingList({bomList}, (data) => {
                if (data.retCode === '0') {
                    resolve(data.list);
                }
                reject();
            })
        })
    };

    initForm = (info) => {
        // 以前的员工部门组件有问题，需要在此修改子组件的state中的depId
        if(info.departmentId){
            this.baseRef.setState({depId: info.departmentId});
        }
        // 切换生产类型
        if(info.produceType === 1){
            this.setState({ produceType: info.produceType});
        }
        info = this.initFormData(info);
        this.initFormField(formMap, info);
    };

    /** 初始化表单数据 */
    initFormData = (info) => {
        // 处理自定义列表字段
        info = this.initFormTags(info, 'property_value');
        // 初始化成品列表
        this.initPpopListTable(info);
        // 初始化原料列表
        this.initPpomListTable(info);
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

    /** 初始化成品列表*/
    initPpopListTable = (info, source) => {
        if(!info || !info.ppopList) return;
        let ppopListTable = _.map(info.ppopList, item => {
            let { saleDeliveryDeadlineDate, ...restItem } = item;
            saleDeliveryDeadlineDate = saleDeliveryDeadlineDate ? moment(saleDeliveryDeadlineDate).format('YYYY-MM-DD') : null;
            return {  ...restItem, saleDeliveryDeadlineDate };
        });
        this.ppopRef.fillList(ppopListTable, source);  // 调用组件的方法回填数据
    };

    /** 初始化原料列表*/
    initPpomListTable = (info) => {
        if(!info || !info.ppomList) return;
        let ppomListTable = _.map(info.ppomList, item => {
            let { supplierNo, supplierName,description, ...restItem } = item;
            return { supplier: {key: supplierNo, label: supplierName},descItem:description, ...restItem };
        });
        this.ppomRef.fillList(ppomListTable);  // 调用组件的方法回填数据
    };

    getPpopRef = (ppopRef) => {
        this.ppopRef = ppopRef
    };

    getPpomRef = (ppomRef) => {
        this.ppomRef = ppomRef
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
            return item && Object.entries(item).some(v => {
                return (v[0] === 'prodName' && v[1] && v[1] !== ''); //物品名称必须要有值，否则这行物品数据会被过滤掉
            });
        });
        values[this.dataPrefixForPpomList] = values[this.dataPrefixForPpomList].filter(item=>{
            if(item && item.supplier) {
                let { key, label } = item.supplier;
                item.supplierNo = key;
                item.supplierName = label;
                delete item.supplier;
            }
            return item && Object.entries(item).some(v => {
                return (v[0] === 'prodName' && v[1] && v[1] !== ''); //物品名称必须要有值，否则这行物品数据会被过滤掉
            });
        });
    };

    /** 处理物品的单位用量字段 */
    dealProdListForUnitConsump = (values) => {
        const ppopList = values[this.dataPrefixForPpopList];
        const ppomList = values[this.dataPrefixForPpomList];
        const quantityDecimalNum = getCookie("quantityDecimalNum");
        if(ppopList.length !== 1) return;
        const produceQuantity = _.parseInt(ppopList[0].quantity) ;
        if(produceQuantity !== 0) {
            values[this.dataPrefixForPpomList] = ppomList.map(item => {
                item.unitConsump = fixedDecimal(item.quantity/produceQuantity, quantityDecimalNum);
                return item;
            })
        }
    };

    /** 处理其他信息 */
    dealOtherInfo = (values) => {
        let {produceType} = this.state;
        values.fileIds = this.otherInfoRef.state.fileList.map(item => item.response.fileId);
        if(produceType === 1 && values.supplier){
            values.supplierNo = values.supplier.key;
            values.supplierName = values.supplier.label;
            delete values.supplier;
        }
    };

    /** 处理表单提交数据 */
    dealSubmitFormInfo = (values) => {
        this.dealCustomField(values); //处理自定义字段
        this.dealProdList(values);  // 处理物品列表
        this.dealOtherInfo(values);  // 处理其他信息
        this.dealProdListForUnitConsump(values);  // 处理物品的单位用量字段
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
        await this.backendValidateAndSubmit('produceOrder', values);
        /** 提交表单数据 */
        this.asyncSubmit();
    };

    // 提交表单数据
    asyncSubmit=()=> {
        let values = this.state.submitData;
        if(values.ppomList){
            let ppomList = values.ppomList;
            ppomList.forEach((item)=>{
                if(item.description){
                    item.descItem = item.description;
                }
            })
        }
        this.props.asyncAddProduceOrder(values.billNo, values, (res) => {
            if (res.data.retCode === '0') {
                let displayId = res.data.data;
                message.success('操作成功');
                this.props.emptyFieldChange();
                let url = `/produceOrder/show/${displayId}`;
                this.props.history.push(url);
            }  else {
                Modal.error({
                    title: intl.get("提示信息"),
                    content: (res.data.retValidationMsg && res.data.retValidationMsg.msg && res.data.retValidationMsg.msg[0].msg)||res.data.retMsg
                })
            }
        })
    };

    /** 选择供应商后，带入联系人联系电话*/
    handleSelectSupplier=(supplierCode, isInit)=>{
        if(!supplierCode) return;
        this.props.asyncShowSupplierForSelect(supplierCode, data =>{
            if(data.retCode === '0'){
                if(!isInit){
                    let {setFieldsValue} = this.formRef.current;
                    //带入客户联系人和联系电话
                    const contacterName = data.data.contacterName;
                    const mobile = data.data.mobile;
                    setFieldsValue({
                        supplier:{
                            key:data.data.code,
                            label:data.data.name
                        },
                        contacterName: contacterName,
                        contacterTelNo: mobile
                    });
                }

            }
        });
    };

    /** 选择销售物品点击提交操作 */
    handleSaleOrderPopOnOK = async (list, bomList) => {
        let info = {};
        info.ppopList = list;
        info.ppomList = await this.getFittingData(bomList);
        this.initPpopListTable(info, 'saleOrder');
        this.initPpomListTable(info);
    };

    /** 切换生产类型 */
    onChangeProduceType = (value) => {
        this.setState({produceType: value});
    };

    resetDefaultFields = ()=>{
        this.props.asyncFetchPreData(()=>{
            this.props.setInitFinished();
        });
    };

    render() {
        const {match, produceOrderInfo, preData, goodsTableConfig} = this.props;
        const {saleOrderPopVisible, produceType} = this.state;
        let listProduceFields = preData && preData.getIn(['data', 'listProduceFields']);
        let listMaterialFields = preData && preData.getIn(['data', 'listMaterialFields']);
        let baseInfo = produceOrderInfo && produceOrderInfo.getIn(['data', 'data']);
        let prodFields = preData && preData.getIn(['data', 'prodDataTags']);

        return (
            <React.Fragment>
                <Content.ContentHd>
                    <Crumb data={[
                        {
                            url: '/produceOrder/',
                            title: "生产单"
                        },
                        {
                            title: match.params.id ? "修改生产单": "新建生产单"
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <GoodsTableFieldConfigMenu
                            produceTableConfigList={listProduceFields}
                            materialTableConfigList={listMaterialFields}
                            refresh={this.resetDefaultFields}
                            type={['pmsproduce_creatmaterial_product', 'pmsproduce_creatorder_product']}
                        />
                    </div>
                </Content.ContentHd>
                <Content.ContentBd>
                    <Spin
                        spinning={preData.get('isFetching') || produceOrderInfo.get("isFetching")}
                    >
                        <AddForm {...this.props}
                                 onSubmit={this.handleSubmit}
                                 formRef={this.formRef}
                                 isModify={!!match.params.id}
                                 loading={produceOrderInfo.get('isFetching')}
                        >
                            {
                                this.formRef.current && (
                                    <React.Fragment>
                                        <AddForm.TopOpe>
                                            <Row>
                                                <Col span={12} className={cx("special-col")}>
                                                    {
                                                        match.params.id ? (
                                                            <>
                                                                <div style={{display: "none"}}>
                                                                    <Form.Item name="produceType">
                                                                        <Input type="hidden"/>
                                                                    </Form.Item>
                                                                </div>
                                                                <Form.Item
                                                                    label={'生产类型'}
                                                                    name="produceTypeText"
                                                                    {...addPage.formItemLayout}
                                                                >
                                                                    {produceType === 0 ? '内部制造' : '委外加工'}
                                                                </Form.Item>
                                                            </>
                                                        ) : (
                                                            <Form.Item
                                                                label={'生产类型'}
                                                                name="produceType"
                                                                initialValue={produceType}
                                                                {...addPage.formItemLayout}
                                                            >
                                                                <RadioGroup onChange={(e) => this.onChangeProduceType(e.target.value)}>
                                                                    <Radio key={0} value={0}>内部制造</Radio>
                                                                    <Radio key={1} value={1}>委外加工</Radio>
                                                                </RadioGroup>
                                                            </Form.Item>
                                                        )
                                                    }
                                                </Col>
                                                <Col span={12} className={cx("special-col-lst")}>
                                                    <Button type="sub" className="fr"
                                                            onClick={() => this.openModal('saleOrderPopVisible')}>从销售订单选择</Button>
                                                </Col>
                                            </Row>
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
                                                      produceType={produceType}
                                                      formItemLayout={addPage.formItemLayout}
                                                      handleSelectSupplier={this.handleSelectSupplier}
                                                      getRef={this.getBaseRef}/>
                                        </AddForm.BaseInfo>
                                        <Fold title="生产成品">
                                            <PpopGoods dataPrefix={this.dataPrefixForPpopList}
                                                       fillOutGoods={this.ppomRef && this.ppomRef.fillList}
                                                       getRef={this.getPpopRef}
                                                       goodsTableConfig={goodsTableConfig}
                                                       prodFields={prodFields}
                                                       formRef={this.formRef}/>
                                        </Fold>
                                        <Fold title="消耗原料">
                                            <PpomGoods dataPrefix={this.dataPrefixForPpomList}
                                                       getRef={this.getPpomRef}
                                                       goodsTableConfig={goodsTableConfig}
                                                       prodFields={prodFields}
                                                       formRef={this.formRef}/>
                                        </Fold>

                                        <AddForm.OtherInfo>
                                            <OtherInfo  {...this.props}
                                                        formRef={this.formRef}
                                                        formItemLayout={addPage.formItemLayout}
                                                        initBaseInfo={baseInfo}
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
            </React.Fragment>
        );
    }
}
