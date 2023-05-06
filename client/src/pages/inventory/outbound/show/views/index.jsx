import React, { Component } from 'react';
import intl from 'react-intl-universal';
import {Modal, message, Spin, Layout,Button,Input} from 'antd';
import LogModalTable from 'components/business/logModalTable';
import LogisticsDisplay from 'components/business/logisticsDisplay';
import Crumb from 'components/business/crumb';
import OpeBar from 'components/business/opeBar';
import {AttributeBlock} from 'components/business/attributeBlock';
import {ShowBasicBlock} from 'components/business/showBasicInfo';
import OperatorLog from 'components/business/operatorLog';
import PrintStatus from 'components/business/printStatus';
import GoodsTableFieldConfigMenu from 'components/business/goodsTableFieldConfigMenu';
import CheckWareArriveUpperLimit,{dealCheckWareUpperLimitData} from 'components/business/checkWareArriveUpperLimit';
import ProductList from 'components/business/productList';
import IsVipJudge from 'components/business/isVipJudge';
import FileView from 'components/business/fileView';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Link} from 'react-router-dom';
import {getYmd} from 'utils/format';
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';

import classNames from "classnames/bind";
import styles from "../styles/index.scss";
import {asyncFetchOutBoundOrderById} from "../../add/actions";
import {asyncFetchExpressInfoNum,asyncFetchExpressInfoDetail} from '../../../../auxiliary/express/actions';
import {actions as outboundOrderActions} from "../../index";
import PrintArea from "../../../../../components/widgets/printArea/views";
import moment from "moment/moment";
import PageTurnBtn from 'components/business/pageTurnBtn';
import {actions as approveActions, RejectApprove, backDisabledStatus, batchBackDisabledStatusForDetail, backApproveStatusImg,ApproveProcess,
    SelectApproveItem, withApprove, BACKEND_TYPES} from 'components/business/approve';  //***
import {actions as vipServiceHomeActions} from "pages/vipService/index";  //***
import {detailPage} from  'components/layout/listPage';   //***
import IntlTranslation from 'utils/IntlTranslation';
import {Auth} from 'utils/authComponent';
import {actions as vipOpeActions,withVipWrap} from "components/business/vipOpe";
import {PRICE_NO_AUTH_RENDER} from 'utils/constants';
import { ExclamationCircleOutlined } from '@ant-design/icons';
const cx = classNames.bind(styles);


const setBillType = {
    0: 'OutWarehouse_0',
    1: 'OutWarehouse_1',
    2: 'OutWarehouse_2',
    3: 'OutWarehouse_3',
    4: 'OutWarehouse_4',
    5: 'OutWarehouse_5',
    6: 'OutWarehouse_6',
    7: 'OutWarehouse_7'
};

const outTypeMap = {
    0: <IntlTranslation intlKey="outbound.show.index.outType_0"/>,
    1: <IntlTranslation intlKey="outbound.show.index.outType_1"/>,
    2: <IntlTranslation intlKey="outbound.show.index.outType_2"/>,
    3: <IntlTranslation intlKey="outbound.show.index.outType_3"/>,
    4: <IntlTranslation intlKey="outbound.show.index.outType_4"/>,
    5: <IntlTranslation intlKey="outbound.show.index.outType_5"/>,
    6: <IntlTranslation intlKey="outbound.show.index.outType_6"/>,
    7: <IntlTranslation intlKey="outbound.show.index.outType_7"/>
};

const mapStateToProps = (state) => ({
    addSale: state.getIn(['outboundOrderAdd', 'addSale']),
    outboundOrderShow: state.getIn(['outboundOrderAdd', 'orderInfo']),
    fetchLogInfo: state.getIn(['outboundOrderIndex', 'fetchLogInfo']),
    vipService: state.getIn(['vipHome', 'vipService'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchOutBoundOrderById,
        asyncFetchExpressInfoNum,
        asyncFetchExpressInfoDetail,
        asyncDeleteOutboundOrderInfo:outboundOrderActions.asyncDeleteOutboundOrderInfo,
        //操作日志
        asyncOperationLog:outboundOrderActions.asyncOperationLog,
        asyncGetApproveStatus: approveActions.asyncGetApproveStatus,  //***
        asyncOperateApprove: approveActions.asyncOperateApprove,  //***
        asyncFetchVipService: vipServiceHomeActions.asyncFetchVipService,  //***
        asyncOpenVipAndSendRequestToOss: vipOpeActions.asyncOpenVipAndSendRequestToOss,
    }, dispatch)
};

@connect(mapStateToProps, mapDispatchToProps)
@withVipWrap
@withApprove
export default class supplierShow extends detailPage{
    constructor(props) {
        super(props);
        this.state = {
            operationLogVisible: false,  // 操作日志
            selectApprove: false,  // 选择审批流弹层 ***
            approveModuleFlag: 1,
            approveStatus: 0,
            //控制重复点击按钮
            approveBtnFlag: false,
            approveRevertBtnFlag: false,
            expressPhone: '',
            logisticsVisible: false,
            logisticsData: []
        }
    }

    componentDidMount () {
        //获取Vip信息
        this.props.asyncFetchVipService();
        this.loadData();
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.match.params.id!=this.props.match.params.id){
            this.props.asyncFetchOutBoundOrderById(nextProps.match.params.id);
        }
    }

    loadData=(nextId)=>{
        let id = this.props.match.params.id;
        if (id) {
            this.props.asyncFetchOutBoundOrderById(id, (res) => {
                let errorMsg = res.retCode != 0 && res.retMsg;
                if(res.retCode == "0"){
                    this.setState({
                        approveModuleFlag:res.approveModuleFlag,
                        approveStatus: res.data.approveStatus
                    })
                }
                if (errorMsg) {
                    Modal.info({
                        title: intl.get("sale.show.index.warningTip"),
                        content: errorMsg
                    });
                }
            });
        }
    };

    getInfo() {
        const {outboundOrderShow} = this.props;
        return outboundOrderShow && outboundOrderShow.getIn(['data', 'data']);
    }

    showConfirm = (type) => {
        const {match} = this.props;
        const id = match.params.id;

        let self = this;
        Modal.confirm({
            title: intl.get("outbound.show.index.warningTip"),
            okText: intl.get("outbound.show.index.okText"),
            cancelText: intl.get("outbound.show.index.cancelText"),
            content: intl.get("outbound.show.index.deleteWarningContent"),
            onOk() {
                self.props.asyncDeleteOutboundOrderInfo([id], function (res) {
                    if (res.retCode == 0) {

                        if (res.partDeleteFlag == 1) {
                            if (type && type.length > 0) {
                                let errorMsg = (type == intl.get("outbound.show.index.stockOutbound")) ? intl.get("outbound.show.index.deleteConfirmContent_1") :
                                    (type == intl.get("outbound.show.index.allocateOutbound")) ? intl.get("outbound.show.index.deleteConfirmContent_2") : '';
                                errorMsg && message.warning(errorMsg);
                            }
                            else {
                                message.success(`${intl.get("outbound.show.index.deleteConfirmContent_3")} + "\n" + "\n" + ${intl.get("outbound.show.index.deleteConfirmContent_4")}`);
                            }
                        }
                        else {
                            message.success(intl.get("outbound.show.index.deleteSuccessMessage"));
                            self.props.history.replace('/inventory/outbound/index')
                        }


                    } else {
                        message.error(res.retMsg);
                    }
                })
            },
            onCancel() {
            },
        });
    };

    submitApprove = (billNo)=>{
        let {approveModuleFlag, approveStatus} = this.state;
        this.props.submitApproveProcess(()=>this.closeModal('selectApprove'), ()=>{
            if(approveModuleFlag===1 && approveStatus===2){ // 当前单据的审批状态为反驳状态 2，则直接提交
                this.asyncApproveOperate({operate: 2, type: BACKEND_TYPES.outbound, billNo}, this.loadData);
            } else {
                this.openModal('selectApprove'); // 否则打开选择审批流弹层
            }
        });
    }

    //查询次数
    queryTimes = ()=>{
        return new Promise((resolve, reject) => {
            this.props.asyncFetchExpressInfoNum((data)=>{
               if(data.data.retCode === "0"){
                   let num = data.data.data;
                   if(num && num >0){
                       resolve();
                   }else{
                       Modal.warning({
                           title: '提示',
                           content: '当前可用查询次数不足，请充值后继续查询，详询客服 400-6979-890（转1）或18402578025（微信同号）',
                       });
                       reject();
                   }

               }else{
                   message.error('查询物流可用次数出错。');
                   reject();
               }
            });
        });
    }

    //校验数据
    verificationData = ()=>{
        const info = this.getInfo();
        let waybillNo =  info.get('waybillNo');
        let logistics = info.get('logistics');
        let _this = this;
        if(waybillNo && logistics){
            //特殊的快递需要填写手机号
            if(logistics === '顺丰速运' || logistics === '丰网速运'){
                Modal.info({
                    title: '提示',
                    content: (
                        <div>
                            <p>政策原因，{logistics}需要填写手机号才可查询物流信息！</p>
                            <div>
                                <Input  placeholder="填写手机号"
                                        onChange={(e)=>{
                                                _this.setState({
                                                    expressPhone:e.target.value
                                                });
                                }}/>
                            </div>

                        </div>
                    ),
                    okText: '填写完毕',
                    maskClosable: true,
                    onOk() {
                        _this.queryDate('needPhone');
                    },
                });
            }else{
                _this.queryDate();
            }

        }else{
            message.error('物流公司不符合规则，请在【业务设置-订单选项】处修改后再次修改出库单，按要求填写物流公司与物流单号后方可查询');
        }
    }

    //查询数据
    queryDate = (type)=>{
        const info = this.getInfo();
        let waybillNo =  info.get('waybillNo')||'';
        let logistics = info.get('logistics')||'';
        let params = {
            waybillNo,
            logistics
        };
        (type && type === 'needPhone')?params.phone = this.state.expressPhone:null;
        this.props.asyncFetchExpressInfoDetail(params,(data)=>{
            if(data.data.retCode === "0"){
                this.setState({
                    logisticsData: data.data.data.data || []
                },()=>{
                    this.openModal('logisticsVisible');
                })
            }else{
                message.error(data.data.retMsg || '获取物流信息失败。');
            }
        });

    }

    //操作物流查询
    operateExpress = async (type)=>{
        //如果是点击试用，不用判断查询次数是否足够
        //直接进行查询操作
        if(type && type === 'try'){
            this.verificationData();
        }else{
            //每次点击都添加用户提示
            let _this = this;
            Modal.confirm({
                icon: <ExclamationCircleOutlined/>,
                title: "提示",
                content: <div>
                    本查询将消耗1次物流查询次数，确认查询？
                </div>,
                async onOk() {
                    //优先判断是否次数足够
                     await _this.queryTimes();
                     _this.verificationData();
                }
            })
        }

    }

    operateBar = () => {
        const info = this.getInfo();
        if (!info) {
            return null;
        }

        const updatedTime =info.get('updatedTime'); //审批更新时间
        const outType = info.get('outType');
        const billNo = info.get('billNo');
        const {outboundOrderShow} = this.props;
        const approveModuleFlag = outboundOrderShow.getIn(['data', 'approveModuleFlag']);  // 是否开启审批功能 0 无 1 有
        let approveTask = outboundOrderShow.getIn(['data', 'approveTask']);
        // ****
        let infoData = info&&info.toJS();
        infoData.approveModuleFlag = approveModuleFlag;
        let prodList = infoData && infoData.prodList || [];
        let warehouseName = infoData && infoData.warehouseName;

        const {disabledGroup} = batchBackDisabledStatusForDetail(infoData, backDisabledStatus);
        let {
            approvePass, // 审批通过
            approveReject,  // 审批驳回
            approveRevert,  // 审批撤回
            approveSubmit, // 审批提交
            modifyApproveDisabled,
            deleteApproveDisabled,
            operateLogApproveDisabled
        } = disabledGroup;
        // ***

        const listData = [
            {
                name: 'edit',
                module: 'outbound',
                disabled: !modifyApproveDisabled,
                path:`/inventory/outbound/modify/${billNo}`
            },
            {
                name: 'delete',
                module: 'outbound',
                disabled: !deleteApproveDisabled,
                onClick: () => {
                    this.showConfirm(outTypeMap[outType]);
                }
            },
        ];

        if(outType !== 7) listData.push(
            {
                name: 'copy',
                module: 'outbound',
                path:`/inventory/outbound/copy/${billNo}`
            }
        )
        listData.push(
            {
                name: 'export',
                module: 'outbound',
                label: intl.get("outbound.show.index.export"),
                href: `${BASE_URL}/file/download?url=/outwares/excel/export/${billNo}`,
                displayBillNo: billNo,
                templateType: setBillType[outType]
            },
            {
                name: 'print',
                displayBillNo: billNo,
                templateType: setBillType[outType]
            },
            {
                name: 'interchangeLog',
                label: intl.get("outbound.show.index.operateLog"),
                icon: 'icon-operation-log',
                hidden: !operateLogApproveDisabled,
                onClick: () => {
                    this.props.asyncOperationLog(billNo);
                    this.openModal('operationLogVisible');
                }
            },{
                name: 'expressLog',
                label: "物流查询",
                icon: 'icon-operation-log',
                onClick: this.operateExpress,
                vipSource: 'logisticsQuery',
                hot: true
            },{
                name: 'approveSubmit',  //提交审批流
                label: intl.get("components.approve.approveSubmit"),
                icon: 'icon-submit',
                module: 'sale',
                hidden: !approveSubmit,
                onClick: () => {
                    //在提交审批先判断是否有批次号物品，有则判断批次号vip权限
                    //判断否是保质期物品
                    let prodList = infoData.prodList;
                    let flag = false;
                    for(let i=0;i<prodList.length;i++){
                        if(prodList[i].expirationFlag){
                            flag = true;
                            break
                        }
                    }
                    if(!flag){
                        this.submitApprove(billNo);
                    }else{
                        //判断保质期vip是否到期
                        this.props.vipTipPop({source:"batchShelfLeft",onTryOrOpenCallback:()=>{
                                this.submitApprove(billNo);
                            }})
                    }
                }
            },{
                name: 'approveRevert',  //撤回审批流
                label: intl.get("components.approve.approveRevert"),
                icon: 'icon-cancel-copy',
                module: 'sale',
                disabled: this.state.approveRevertBtnFlag,
                hidden: !approveRevert,
                onClick: () => {
                    let _this = this;
                    Modal.confirm({
                        title: '提示',
                        icon: <ExclamationCircleOutlined />,
                        content: '确认撤回审批么？',
                        onOk() {
                            _this.asyncApproveOperate({operate: 3, type:BACKEND_TYPES.outbound,billNo}, _this.loadData);
                        }
                    });

                }
            }
        );


        return (
            <React.Fragment>
                <OpeBar data={{
                    listData: listData,
                    moreData: []
                }}/>
                <div className={cx("status-img")}>
                    {
                        approvePass && (  // 审批通过按钮
                            <CheckWareArriveUpperLimit
                                callback={() => {
                                    //在提交审批先判断是否有批次号物品，有则判断批次号vip权限
                                    //判断否是保质期物品
                                    let prodList = infoData.prodList;
                                    let flag = false;
                                    for(let i=0;i<prodList.length;i++){
                                        if(prodList[i].expirationFlag){
                                            flag = true;
                                            break
                                        }
                                    }
                                    if(!flag){
                                        this.asyncApproveOperate({approveTask,operate: 4,type: BACKEND_TYPES.outbound,billNo}, this.loadData)
                                    }else{
                                        //判断保质期vip是否到期
                                        this.props.vipTipPop({source:"batchShelfLeft",onTryOrOpenCallback:()=>{
                                                this.asyncApproveOperate({approveTask,operate: 4,type: BACKEND_TYPES.outbound,billNo}, this.loadData)
                                        }})
                                    }

                                }}
                                params={dealCheckWareUpperLimitData(billNo, prodList, warehouseName, 'outbound')}
                                render={() => (
                                    <Button className={cx("approve-btn")}
                                            disabled={this.state.approveBtnFlag}
                                            type={"primary"}
                                    >{intl.get("components.approve.pass")}</Button>
                                )}
                            />
                        )
                    }
                    {
                        approveReject && (  // 审批驳回按钮
                            <RejectApprove
                                okCallback={this.loadData}
                                approveTask={approveTask}
                                billNo={billNo}
                                type={BACKEND_TYPES.outbound}
                                render={() => (
                                    <Button className={cx("approve-btn")} style={{'marginLeft': '10px'}}
                                            type={"primary"}
                                            okCallback={this.loadData}
                                    >{intl.get("components.approve.reject")}</Button>
                                )}
                            />
                        )
                    }
                </div>
            </React.Fragment>
        )
    };

    closeModal = type => {
        this.setState({
            [type]: false
        })
    };

    openModal = type => {
        this.setState({
            [type]: true
        })
    };

    // 操作日志
    operationLog = () => {
        const {fetchLogInfo} = this.props;
        let logInfo = fetchLogInfo && fetchLogInfo.get('data');
        console.log(logInfo && logInfo.toJS(), 'logInfo');
        const data = logInfo && logInfo.map((item, index) => {
            return {
                key: index,
                serial: index + 1,
                operateLoginName: item.get('operatedLoginName'),
                operation: item.get('operation'),
                operateTime: getYmd(item.get('operatedTime'))
            }
        });

        return (
            <LogModalTable title={intl.get("outbound.show.index.operateLog")}
                           columns="operationColumns"
                           logVisible={this.state.operationLogVisible}
                           logData={data}
                           cancelCallBack={() => this.closeModal('operationLogVisible')}
            />
        )
    };

    outBoundProductList = () => {
        const {outboundOrderShow,vipService} = this.props;

        const outType = outboundOrderShow && outboundOrderShow.getIn(['data', 'data', 'outType']);
        // 销售出库时如果没有销售订单查看权无法查看
        const priceType = outType === 2 ? 'salePrice' : 'purchasePrice';
        const prodList = outboundOrderShow && outboundOrderShow.getIn(['data', 'data', 'prodList']);

        /**
         *  aggregateAmount 订单优惠后总金额
         *  discountAmount 订单优惠金额
         *  taxAllAmount  订单含税总金额
         * */
        const aggregateAmount = outboundOrderShow && outboundOrderShow.getIn(['data', 'data', 'aggregateAmount']);
        const discountAmount = outboundOrderShow && outboundOrderShow.getIn(['data', 'data', 'discountAmount']);
        const taxAllAmount = outboundOrderShow && outboundOrderShow.getIn(['data', 'data', 'taxAllAmount']);
        const prodDataTags = outboundOrderShow && outboundOrderShow.getIn(['data', 'prodDataTags']) && outboundOrderShow.getIn(['data', 'prodDataTags']).toJS();

        let quantityDecimalNum = getCookie("quantityDecimalNum");
        let priceDecimalNum = getCookie("priceDecimalNum");


        let dataSource = vipService.getIn(['vipData','data']);
        dataSource = dataSource ? dataSource.toJS() : [];
        let batchShelfLeft = dataSource.BATCH_SHELF_LIFE || {};
        let batchShelfLeftFlag = (batchShelfLeft.vipState === 'TRY' || batchShelfLeft.vipState === 'OPENED');
        let data = [];

        prodList && prodList.map((item, index) => {
            let prodItem = item && item.toJS();
            prodItem = this.multiPreProcessDataTagValue(prodDataTags, prodItem); // 处理自定义字段中的特殊值

            let items =  {
                ...prodItem,
                serial: index + 1,
                key: prodItem.id,
                quantity: fixedDecimal(prodItem.quantity, quantityDecimalNum),
                untaxedPrice: fixedDecimal(prodItem.untaxedPrice, priceDecimalNum),
                unitPrice: fixedDecimal(prodItem.unitPrice, priceDecimalNum),
                untaxedAmount: (prodItem.untaxedAmount || 0).toFixed(2),
                taxRate: prodItem.taxRate || 0,
                tax: prodItem.tax,
                amount: (prodItem.amount || 0).toFixed(2),
                //物品(采购/销售/出库/入库)自定义字段
                item_property_value1: prodItem.propertyValues && prodItem.propertyValues.property_value1,
                item_property_value2: prodItem.propertyValues && prodItem.propertyValues.property_value2,
                item_property_value3: prodItem.propertyValues && prodItem.propertyValues.property_value3,
                item_property_value4: prodItem.propertyValues && prodItem.propertyValues.property_value4,
                item_property_value5: prodItem.propertyValues && prodItem.propertyValues.property_value5,
                serialNumber: prodItem.serialNumberList,  // 序列号
                unitConverter: `1${prodItem.recUnit}=${prodItem.unitConverter}${prodItem.unit}`,
                recQuantity: fixedDecimal(prodItem.recQuantity, quantityDecimalNum),
            };
            //批次号vip服务器内
            batchShelfLeftFlag && (
                items.batchNo = prodItem.batchNo,
                items.expirationDate = prodItem.expirationDate?moment(prodItem.expirationDate).format('YYYY-MM-DD'):null,
                items.productionDate = prodItem.productionDate?moment(prodItem.productionDate).format('YYYY-MM-DD'):null
            );
            data.push(items);
        });

        return (
            <ProductList
                productList={data}
                aggregateAmount={aggregateAmount}
                discountAmount={discountAmount}
                taxAllAmount={taxAllAmount}
                moduleType={'outbound'}
                priceType={priceType}
                fieldConfigType={'wareOut_serial'}
                prodDataTags={prodDataTags}
                batchShelfLeftFlag = {batchShelfLeftFlag}
            />
        )
    };

    resetDefaultFields = ()=>{
        let billNo = this.props.match.params.id;
        this.props.asyncFetchOutBoundOrderById(billNo);
    };

    render(){
        let { outboundOrderShow } = this.props;

        const listFields = outboundOrderShow && outboundOrderShow.getIn(['data', 'listFields']);
        outboundOrderShow = outboundOrderShow?outboundOrderShow.toJS():{};
        
        //基础信息数据处理
        const objData = outboundOrderShow && outboundOrderShow.data.data||{};
        const objData1 = outboundOrderShow && outboundOrderShow.data;
        const billNo = objData && objData.billNo;
        let printStatus = objData && objData.printState;
        //approveStatus 0是未审批，1是已审批
        let approveStatus = objData.approveStatus;
        let approveModuleFlag = objData1.approveModuleFlag;
        const processData = objData1.flowState;
        const tags = outboundOrderShow && outboundOrderShow.data.tags||[];

        const basicInfoData = objData && [{
            name: intl.get("outbound.show.index.displayBillNo"),
            value: objData.displayBillNo,
            highlight: true
        }, {
                name: intl.get("outbound.show.index.outDate"),
                value: moment(objData.outDate).format("YYYY-MM-DD")
        },{
            name: intl.get("outbound.show.index.warehouseName"),
            value: objData.warehouseName
        },{
            name: intl.get("outbound.show.index.logistics"),
            value: objData.logistics
        },{
            name: intl.get("outbound.show.index.waybillNo"),
            value: objData.waybillNo
        },{
            name: intl.get("outbound.show.index.outAddress"),
            value: objData.outAddress ? objData.outProvinceText+ ' '+
            objData.outCityText+ ' '+
            objData.outAddress : ''
        }];

        if(objData && objData.fkSaleOrderBillNo){
            basicInfoData.push({
                name: intl.get("outbound.show.index.outType"),
                isLink: true,
                outType:intl.get("outbound.show.index.outType_"+objData.outType),
                href: '/sale/show/'+objData.fkSaleOrderBillNo,
                value: intl.get("outbound.show.index.billNo")+objData.displaySaleOrderNo,
                fkSaleOrderBillNo: objData.fkSaleOrderBillNo
            })
        }else if(objData && objData.fkOrderBillNo){
            basicInfoData.push({
                name: intl.get("outbound.show.index.outType"),
                isLink: true,
                outType:intl.get("outbound.show.index.outType_"+objData.outType),
                href: '/purchase/show/'+objData.fkOrderBillNo,
                value: intl.get("outbound.show.index.billNo")+objData.displayOrderNo,
                fkOrderBillNo: objData.fkOrderBillNo
            })
        }else if(objData && objData.wwBillNo){
            basicInfoData.push({
                name: intl.get("outbound.show.index.outType"),
                isLink: true,
                outType:intl.get("outbound.show.index.outType_"+objData.outType),
                href: '/subcontract/show/'+objData.wwBillNo,
                value: intl.get("outbound.show.index.billNo")+objData.wwBillNo,
                fkSaleOrderBillNo: objData.wwBillNo
            })
        } else {
            basicInfoData.push({
                name: intl.get("outbound.show.index.outType"),
                value: outTypeMap[objData.outType]
            })
        }

        if(objData && objData.outType === 7) {
            basicInfoData.push({
                name: "上游单据",
                value: objData.fkProduceNo,
                isLink: true,
                href: '/produceOrder/show/'+objData.fkProduceNo,
                fkProduceNo: objData.fkProduceNo
            });
        }

        if(objData && objData.outType === 6 && objData.fkProduceNo){
            basicInfoData.push({
                name: "上游单据",
                value: objData.fkProduceNo,
                isLink: true,
                href: '/produceOrder/show/'+objData.fkProduceNo,
                fkProduceNo: objData.fkProduceNo
            });
        }


        let otherInfoData = [];
        if(objData) {
            if (objData.outType == 0) {
                otherInfoData = [{
                    name: intl.get("outbound.show.index.outParty"),
                    value: objData.useDepartment
                }, {
                    name: intl.get("outbound.show.index.linkMan"),
                    value: objData.usePerson
                }];
            }
            else if (objData.outType == 2) {
                otherInfoData = [{
                    name: intl.get("outbound.show.index.outParty"),
                    value: objData.customerName
                }, {
                    name: intl.get("outbound.show.index.linkMan"),
                    value: objData.customerContacterName
                }, {
                    name: intl.get("outbound.show.index.mobile"),
                    value: objData.customerTelNo
                }, {
                    name: intl.get("outbound.show.index.customerNo"),
                    value: objData.customerOrderNo
                }];
            }
            else if (objData.outType == 3) {
                otherInfoData = [{
                    name: intl.get("outbound.show.index.outParty"),
                    value: objData.supplierName
                }, {
                    name: intl.get("outbound.show.index.linkMan"),
                    value: objData.supplierContacterName
                }, {
                    name: intl.get("outbound.show.index.mobile"),
                    value: objData.supplierTelNo
                }];
            }
            else if (objData.outType == 4) {
                otherInfoData = [{
                    name: intl.get("outbound.show.index.outParty"),
                    value: objData.useDepartment
                }, {
                    name: intl.get("outbound.show.index.linkMan"),
                    value: objData.usePerson
                }];
            }else if(objData.outType == 6){
                otherInfoData = [{
                    name: "供应商",
                    value: objData.supplierName
                }, {
                    name: "联系人",
                    value: objData.supplierContacterName
                },{
                    name: "联系电话",
                    value: objData.supplierTelNo
                }];
            } else if(objData.outType == 7){
                otherInfoData = [{
                    name: "出库方",
                    value: objData.useDepartment
                }, {
                    name: "联系人",
                    value: objData.usePerson
                }];
            }
            otherInfoData.push({
                name: intl.get("outbound.show.index.projectName"),
                value: objData.projectName
            });
            tags && tags.forEach((value) => {
                let propName = value.propName;
                let mappingName = value.mappingName;
                const propertyIndex = mappingName && parseInt(mappingName.substr(mappingName.length - 1));
                if (propName && propName !== "" && mappingName) {
                    otherInfoData.push({
                        name: propName,
                        value: objData[`propertyValue${propertyIndex}`] || ""
                    })
                }
            });
            if(objData.outType !== 2) {
                otherInfoData.push(
                    {
                        name: intl.get("outbound.show.index.ourContacterName"),
                        value: objData.ourContacterName
                    }
                );
            }
            if(objData.outType === 2 ){
                otherInfoData.push(
                    {
                        name: "销售方",
                        value: objData.ourName
                    }, {
                        name: "销售员",
                        value: objData.ourContacterName
                    },{
                        name: "销售员联系电话",
                        value: objData.ourMobile
                    },
                );
            }

            otherInfoData.push(
                {
                    name: intl.get("outbound.show.index.remarks"),
                    value: objData.remarks
                }
            );
        }

        let renderContent = null;
        if (outboundOrderShow && outboundOrderShow.isFetching) {
            renderContent = <Spin className="gb-data-loading"/>;
        } else if (objData) {
            renderContent = (
                <React.Fragment>
                    {this.outBoundProductList()}
                </React.Fragment>
            )
        }

        return(
            <Layout>
                {/*面包屑*/}
                <div className="content-hd">
                    <Crumb data={[
                        {
                            title: intl.get("outbound.show.index.outbound")
                        },
                        {
                            url: '/inventory/outbound/',
                            title: intl.get("outbound.show.index.outboundList")
                        },
                        {
                            title: intl.get("outbound.show.index.detail")
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <GoodsTableFieldConfigMenu
                            tableConfigList={listFields}
                            refresh={this.resetDefaultFields}
                            type={'wareOut_serial'}
                        />
                    </div>
                    <div className={cx("float-right")}>
                        <IsVipJudge templateType={setBillType[objData.outType]}/>
                    </div>
                </div>

                <div className="detail-content" style={{position:"relative"}}>
                    {this.operateBar()}
                    <PrintArea>
                        <div className={cx("detail-content-bd")}>
                            <PageTurnBtn type={"outbound"}  current={objData && objData.billNo}/>
                            <div className={"detail-main-attr cf"} style={{padding:"24px 5px"}}>
                                {
                                    (printStatus === 0 ||  printStatus === 1)?<PrintStatus status={printStatus} billNo={billNo}/>:null
                                }
                                <AttributeBlock data={basicInfoData}/>
                            </div>
                            <div className={cx("status-img-lst")}>
                                {
                                    approveModuleFlag == 1 && (
                                        <div className={cx("status-img-lst")}>
                                            <img src={backApproveStatusImg(approveStatus, intl.get("home.picFlag"))} width={120}/>
                                        </div>
                                    )
                                }
                            </div>
                            {renderContent}
                            {/*<ShowBasicBlock data={otherInfoData}  />*/}
                            <div className="detail-sub-attr">
                                <AttributeBlock data={otherInfoData}/>
                                <div>
                                    <div style={{
                                        display: 'inline-block',
                                        verticalAlign: 'top',
                                        fontSize: '14px',
                                        color: '#666',
                                        marginRight: '10px',
                                        lineHeight: '30px'
                                    }}>{intl.get("outbound.show.index.tempAtt")}：
                                    </div>
                                    <div style={{display: 'inline-block', lineHeight: '30px'}}>
                                        {
                                            objData && objData.fileInfo && objData.fileInfo.map((file) => {
                                                return (
                                                    <div key={file.fileId}>
                                                        <a style={{color: '#499fff'}}
                                                           href={`${BASE_URL}/file/download/?url=/file/download/${file.fileId}`}
                                                        >
                                                            {file.fileName}
                                                        </a>
                                                        <FileView fileId={file.fileId} fileName={file.fileName}/>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                            <OperatorLog logInfo={{
                                creator: objData && (objData.addedName || objData.addedLoginName),
                                createDate: objData && getYmd(objData.addedTime),
                                lastModifier: objData && (objData.updatedName || objData.updatedLoginName),
                                lastModifyDate: objData && getYmd(objData.updatedTime),
                                //判断是否显示审批人和审批时间
                                approveModuleFlag: approveModuleFlag,
                                approvedLoginName: objData && objData.approvedLoginName,
                                approvedTime: objData && getYmd(objData.approvedTime),

                            }}/>
                            <ApproveProcess data={processData} approveStatus={approveStatus}/>
                            {/*<AttributeBlock data={footInfoData} classNames={footInfoClassNames} />*/}
                        </div>
                    </PrintArea>
                    {this.operationLog()}
                    <SelectApproveItem  // 选择审批流 ***
                        onClose={this.extendApproveCancelModal}
                        onOk={(id)=>{this.extendApproveOkModal(id,billNo,BACKEND_TYPES.outbound,this.loadData)}}
                        show={this.state.selectApprove}
                        type={BACKEND_TYPES.outbound}
                    />
                    <LogisticsDisplay visible={this.state.logisticsVisible} closeModal ={this.closeModal} data={this.state.logisticsData}/>
                </div>
            </Layout>
        )
    }
}



