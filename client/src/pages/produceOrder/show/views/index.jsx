import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Layout, Modal, Spin, Button, message, Tabs} from 'antd';
const {TabPane} = Tabs;
import {getYmd} from "utils/format";
import {Auth} from 'utils/authComponent';
import {PRICE_NO_AUTH_RENDER} from 'utils/constants';
import {getUrlParamValue} from 'utils/urlParam';
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';
import Crumb from 'components/business/crumb';
import OpeBar from 'components/business/opeBar';
import PrintStatus from 'components/business/printStatus';
import {AttributeBlock, AttributeInfo} from 'components/business/attributeBlock';
import {detailPage} from  'components/layout/listPage';
import Fold from 'components/business/fold';
import {ResizeableTable} from 'components/business/resizeableTitle';
import OperatorLog from 'components/business/operatorLog';
import GoodsTableFieldConfigMenu from 'components/business/goodsTableFieldConfigMenu';
import {actions as vipOpeActions, withVipWrap} from "components/business/vipOpe";
import FileView from 'components/business/fileView';
import {asyncFetchProduceOrderById, asyncFetchGainMaterialRecord, asyncFetchQuitMaterialRecord,
    asyncFetchProductEnterRecord, asyncFetchWorkSheetRecord, asyncCompleteOperate, asyncRevertOperate,
    asyncFetchProdAbstractForGainMaterial, asyncFetchProdAbstractForQuitMaterial, asyncFetchProdAbstractForProductInbound } from '../actions';
import {asyncFetchWarehouseList} from '../../../warehouse/index/actions';
import {actions as produceOrderIndexActions} from 'pages/produceOrder/index'
import {actions as vipServiceHomeActions} from "pages/vipService/index";
import ProductList from './productListRecord';
import GainMaterialRecord from './gainMaterialRecord';
import QuitMaterialRecord from './quitMaterialRecord';
import ProductInboundRecord from './productInboundRecord';
import WorkSheetRecord from './workSheetRecord';
import PoductEnterWarehousePop  from './PoductEnterWarehousePop';
import PrintArea from 'components/widgets/printArea';
import {orderStatusMap, ASYNC_REQUEST_FOR_TAB, ASYNC_LOAD_WARE} from "./data";
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");

import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import {Link, withRouter} from "react-router-dom";
import {asyncFetchGoodsDataByProdNo} from "../../../purchase/add/actions";
const cx = classNames.bind(styles);

const mapStateToProps = (state) => ({
    produceOrderInfo: state.getIn(['produceOrderShow', 'produceOrderInfo']),
    gainMaterialRecord: state.getIn(['produceOrderShow', 'gainMaterialRecord']),
    quitMaterialRecord: state.getIn(['produceOrderShow', 'quitMaterialRecord']),
    productInboundRecord: state.getIn(['produceOrderShow', 'productInboundRecord']),
    workSheetRecord: state.getIn(['produceOrderShow', 'workSheetRecord']),
    vipService: state.getIn(['vipHome', 'vipService']),
    warehouseList: state.getIn(['warehouseIndex', 'warehouseList']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchProduceOrderById,
        asyncFetchGainMaterialRecord,
        asyncFetchQuitMaterialRecord,
        asyncFetchProductEnterRecord,
        asyncFetchWorkSheetRecord,
        asyncCompleteOperate,
        asyncRevertOperate,
        asyncFetchProdAbstractForGainMaterial,
        asyncFetchProdAbstractForQuitMaterial,
        asyncFetchProdAbstractForProductInbound,
        asyncFetchWarehouseList,
        asyncDeleteProduceOrderInfo: produceOrderIndexActions.asyncDeleteProduceOrderInfo,
        asyncOpenVipAndSendRequestToOss: vipOpeActions.asyncOpenVipAndSendRequestToOss,
        asyncFetchVipService: vipServiceHomeActions.asyncFetchVipService,
        asyncFetchGoodsDataByProdNo
    }, dispatch)
};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
@withVipWrap
export default class Index extends detailPage {
    formRef = React.createRef();
    getFinishRef = (finishRef) => {
        this.finishRef = finishRef
    };
    getConsumeRef = (consumeRef) => {
        this.consumeRef = consumeRef
    };
    getProductInRef = (productInRef) => {
        this.productInRef = productInRef
    };
    constructor(props) {
        super(props);
        this.state = {
            tags: [],
            productInboundVisible: false, // 成品入库弹层
            showBatchNoFlag: true
        }
    }

    componentDidMount() {
        this.props.asyncFetchVipService((res) => {
            let showBatchNoFlag = res.data.BATCH_SHELF_LIFE.vipState === 'TRY' || res.data.BATCH_SHELF_LIFE.vipState === 'OPENED';
            this.setState({
                showBatchNoFlag
            })
        }); // 获取Vip信息
        //获取默认仓库
        this.props.asyncFetchWarehouseList();
        const activeKey = this.props.location.hash.replace('#', '') || 'baseInfo';
        this.loadData({activeKey});
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.match.params.id!==this.props.match.params.id){
            this.loadData({nextId: nextProps.match.params.id});
        }
    }

    loadData = ({nextId, activeKey = 'baseInfo', params}) => {
        const {match} = this.props;
        const id = nextId || match.params.id;
        if (id) {
            this.props[ASYNC_REQUEST_FOR_TAB[activeKey]](id, params, (res) => {
                let errorMsg = res.retCode != 0 && res.retMsg;
                if (errorMsg) {
                    Modal.info({
                        title: intl.get("提示信息"),
                        content: errorMsg
                    });
                }
            })
        }
    };

    // 删除操作
    showConfirm = () => {
        const info = this.getInfo();
        let id = info.get('recId');
        let self = this;
        Modal.confirm({
            title: intl.get("purchase.index.index.warningTip"),
            content: <div><p>删除单据后无法恢复，确定删除吗？</p></div>,
            onOk() {
                return new Promise((resolve, reject) => {
                    self.props.asyncDeleteProduceOrderInfo({ids:[id]}, function(res) {
                        resolve();
                        if (res.retCode == 0) {
                            message.success('删除成功');
                            self.props.history.replace('/produceOrder/')
                        }
                        else {
                            message.error(res.retMsg);
                        }
                    });
                })
            }
        });
    };

    getInfo() {
        const {produceOrderInfo} = this.props;
        return produceOrderInfo && produceOrderInfo.getIn(['data', 'data']);
    }

    // 下达工单
    sendWorkSheet = () => {
        let {selectedRows} = this.finishRef.state;
        let fkProduceNo = this.props.match.params.id;
        const info = this.getInfo();
        if(selectedRows.length !== 1){
            message.error('请勾选一个生产成品后下达工单');
            return;
        }
        let produceOrderInfo = this.dealProduceInfo(selectedRows[0]);
        produceOrderInfo.officerId = info.get('employeeId');
        localStorage.setItem('PRODUCE_ORDER_INFO', JSON.stringify(produceOrderInfo));
        window.open(`/productControl/add?fkProduceNo=${fkProduceNo}`);
    };

    // 处理数据提供给生产工单
    dealProduceInfo = (info) => {
        let {prodName, prodNo: productCode, bomCode, quantity=0, expectCount=0,saleDisplayBillNo, saleBillNo, saleCustomerOrderNo} = info;
        expectCount = _.toNumber(quantity)-_.toNumber(expectCount);
        if(expectCount<0) expectCount = 0;  // 计划生产数量-已投产数量（若＜0，则为0）
        return { prodName, productCode, expectCount, bomCode, displaySaleBillNo: saleDisplayBillNo, saleBillNo, saleCustomerOrderNo };
    };

    modifyConfirm = (flag, billNo) => {
        if(flag){
            message.error('已完成或存在关联单据无法修改');
            return;
        }
        this.props.history.push(`/produceOrder/modify/${billNo}`);
    };

    // 成品入库
    inboundForFinishProduct = () => {
        let {selectedRowKeys, selectedRows} = this.finishRef.state;
        if(selectedRowKeys.length === 0) {
            message.error('请勾选需要入库的成品');
        } else {
            let info = this.getInfo();
            let prodLists = [];
            let otherData = {};

            otherData = {
                billNo: info.get('billNo'),
                projectName: info.get('projectName'),
            };
            otherData.enterType = info.get('produceType') === 1 ? 6 : 5;
            if(otherData.enterType === 5){  // 内部制造
                otherData.departmentName = info.get('departmentName');
                otherData.employeeName =  info.get('employeeName');
            }
            if(otherData.enterType === 6){  // 委外成品
                otherData.supplierCode = info.get('supplierNo');
                otherData.supplierName =  info.get('supplierName');
                otherData.supplierContacterName = info.get('contacterName');
                otherData.supplierMobile =  info.get('contacterTelNo');
            }

            let arrData = selectedRows.map((item) => {
                return {
                    'code': item.prodNo,
                    'quantity': item.unEnterCount
                }
            });

            this.props.asyncFetchGoodsDataByProdNo(arrData, (prodData) => {
                //获取prod数据处理，遍历使其适配goodsTable
                let quantityDecimalNum = getCookie("quantityDecimalNum");
                prodData.data.forEach((item, index) => {
                    prodLists.push({
                        ...item,
                        prodNo: item.code || item.productCode,
                        prodCustomNo: item.displayCode || item.prodCustomNo,
                        prodName: item.name || item.prodName,
                        descItem: item.description || item.descItem,
                        proBarCode: item.proBarCode,
                        firstCatName: item.firstCatName,
                        secondCatName: item.secondCatName,
                        thirdCatName: item.thirdCatName,
                        unit: item.unit,
                        recUnit: item.unit,
                        unitConverterText: `1${item.unit}=1${item.unit}`,
                        brand: item.brand,
                        unitPrice: item.orderPrice,
                        produceModel: item.produceModel,
                        propertyValue1: item.propertyValue1,
                        propertyValue2: item.propertyValue2,
                        propertyValue3: item.propertyValue3,
                        propertyValue4: item.propertyValue4,
                        propertyValue5: item.propertyValue5,
                        orderPrice: item.orderPrice,
                        salePrice: item.salePrice,
                        recQuantity: item.quantity,
                        currentQuantity: fixedDecimal(item.currentQuantity, quantityDecimalNum),
                        unitFlag: item.unitFlag,
                        remarks: selectedRows[index].remarks
                    });
                });

                this.setState({
                    productInboundVisible: true,
                });
                this.productInRef && this.productInRef.initData(prodLists, otherData);
            });


        }
    };

    // 处理传值
    dealDataToBound = () => {
        let { selectedRows } = this.consumeRef.state;
        let warehouseName;
        let arrData = selectedRows.map((item) => {
            if(!warehouseName && item.warehouseName) {
                warehouseName = item.warehouseName
            }
            return {code: item.prodNo, quantity: item.quantity}
        });
        if(!warehouseName){
           //如果仓库没值，带入默认仓库名称
            const {warehouseList} = this.props;
            let dataSource = warehouseList.getIn(['data','list']);
            let dataSourceToJS = dataSource && dataSource.toJS();
            for(let i=0;i<dataSourceToJS.length;i++){
                if(dataSourceToJS[i].isCommon === 1){
                    warehouseName = dataSourceToJS[i].name;
                    break;
                }
            }
        }
        return { arrData, warehouseName }
    };

    // 领料出库
    outboundReceiveMaterial = () => {
        let {selectedRowKeys} = this.consumeRef.state;
        if(selectedRowKeys.length === 0) return message.error('请勾选需要出库的原料');

        const storage = window.localStorage;
        let produceType = this.getInfo().get('produceType');
        let billNo = this.getInfo().get('billNo');
        let { arrData, warehouseName } = this.dealDataToBound();
        //produceType === 1 => 表示生产单类型为委外加工 =》生成委外领料出库单
        //outType=6 委外领料出库单
        if(produceType === 1){
            //联系人
            let contacterName = this.getInfo().get('contacterName')||'';
            //联系电话
            let contacterTelNo = this.getInfo().get('contacterTelNo')||'';
            //供应商
            let supplierCode = this.getInfo().get('supplierNo')||'';
            let supplierName = this.getInfo().get('supplierName')||'';
            storage.setItem("outboundReceiveMaterial_arrData", JSON.stringify(arrData));
            this.props.history.push(`/inventory/outbound/add?outType=6&fkProduceNo=${billNo}&warehouseName=${warehouseName}&contacterName=${contacterName}&contacterTelNo=${contacterTelNo}&supplierName=${supplierName}&supplierCode=${supplierCode}`);
        }else{
            let departmentName = this.getInfo().get('departmentName') || '';
            let employeeName = this.getInfo().get('employeeName') || '';
            storage.setItem("outboundReceiveMaterial_arrData", JSON.stringify(arrData));
            this.props.history.push(`/inventory/outbound/add?outType=7&fkProduceNo=${billNo}&warehouseName=${warehouseName}&departmentName=${departmentName}&employeeName=${employeeName}`);
        }
    };

    // 退料入库
    inboundReturnMaterial = () => {
        let {selectedRowKeys} = this.consumeRef.state;
        if(selectedRowKeys.length === 0) return message.error('请勾选需要入库的原料');

        const storage = window.localStorage;
        let { arrData, warehouseName } = this.dealDataToBound();
        let billNo = this.getInfo().get('billNo');
        let produceType = this.getInfo().get('produceType');
        //produceType === 1 => 生产单类型为委外加工 =》生成委外退料入库单
        //enterType=8 委外退料入库单
        if(produceType === 1){
            //联系人
            let contacterName = this.getInfo().get('contacterName')||'';
            //联系电话
            let contacterTelNo = this.getInfo().get('contacterTelNo')||'';
            //供应商
            let supplierCode = this.getInfo().get('supplierNo')||'';
            let supplierName = this.getInfo().get('supplierName')||'';
            storage.setItem("inboundReturnMaterial_arrData", JSON.stringify(arrData));
            this.props.history.push(`/inventory/inbound/add?enterType=8&fkProduceNo=${billNo}&warehouseName=${warehouseName}&contacterName=${contacterName}&contacterTelNo=${contacterTelNo}&supplierName=${supplierName}&supplierCode=${supplierCode}`);
        }else{
            let departmentName = this.getInfo().get('departmentName') || '';
            let employeeName = this.getInfo().get('employeeName') || '';
            storage.setItem("inboundReturnMaterial_arrData", JSON.stringify(arrData));
            this.props.history.push(`/inventory/inbound/add?enterType=7&fkProduceNo=${billNo}&warehouseName=${warehouseName}&departmentName=${departmentName}&employeeName=${employeeName}`);
        }
    };

    // 前往生产记录
    produceRecord = () => {
        let {selectedRowKeys, selectedRows} = this.finishRef.state;
        if(selectedRowKeys.length === 1){
            let info = this.getInfo();
            let produceBillNo = info.get('billNo');
            let productCode = selectedRows[0].prodNo;
            let prodName = selectedRows[0].prodName;
            this.props.history.push(`/produceOrder/addRecord?produceBillNo=${produceBillNo}&productCode=${productCode}&prodName=${prodName}`);
        } else {
            let errorMsg = (selectedRowKeys.length === 0) ? '请勾选要记录的物品': '仅能勾选一条物品';
            message.error(errorMsg);
        }
    };

    // 基本信息-生产成品列表 以及 消耗原料列表
    productListInfo = () => {
        const {produceOrderInfo} = this.props;
        const info = this.getInfo();
        const ppopList = produceOrderInfo && produceOrderInfo.getIn(['data', 'data', 'ppopList']);
        const ppomList = produceOrderInfo && produceOrderInfo.getIn(['data', 'data', 'ppomList']);
        const prodDataTags = produceOrderInfo && produceOrderInfo.getIn(['data', 'prodDataTags']) && produceOrderInfo.getIn(['data', 'prodDataTags']).toJS();

        let quantityDecimalNum = getCookie("quantityDecimalNum");

        let ppopData = ppopList.map((item, index) => {
            let prodItem = item && item.toJS();
            prodItem = this.multiPreProcessDataTagValue(prodDataTags, prodItem); // 处理自定义字段中的特殊值
            return {
                ...prodItem,
                serial: index + 1,
                key: prodItem.id,
                quantity: fixedDecimal(prodItem.quantity, quantityDecimalNum),
                expectCount: fixedDecimal(prodItem.expectCount, quantityDecimalNum),
                finishCount: fixedDecimal(prodItem.finishCount, quantityDecimalNum),
                enterCount: fixedDecimal(prodItem.enterCount, quantityDecimalNum),
                unEnterCount: fixedDecimal(prodItem.unEnterCount, quantityDecimalNum),
                saleQuantity: prodItem.saleQuantity ? fixedDecimal(prodItem.saleQuantity, quantityDecimalNum) : '',
            }
        }).toArray();

        let ppomData  = ppomList.map((item, index) => {
            let prodItem = item && item.toJS();
            prodItem = this.multiPreProcessDataTagValue(prodDataTags, prodItem); // 处理自定义字段中的特殊值
            return {
                ...prodItem,
                serial: index + 1,
                key: prodItem.id,
                quantity: fixedDecimal(prodItem.quantity, quantityDecimalNum),
                unitConsump: fixedDecimal(prodItem.unitConsump, quantityDecimalNum),
                receiveCount: fixedDecimal(prodItem.receiveCount, quantityDecimalNum),
                rejectCount: fixedDecimal(prodItem.rejectCount, quantityDecimalNum),
                totalReceiveCount: fixedDecimal(prodItem.totalReceiveCount, quantityDecimalNum)
            }
        }).toArray();

        return (
            <React.Fragment>
                <Fold title={"生产成品"}
                      rightContent={()=>{
                          return (
                              <React.Fragment>
                                  {
                                      info.get('produceType') === 0 && (
                                          <Button type="primary" onClick={this.sendWorkSheet}>下达工单</Button>
                                      )
                                  }
                                  <Button type="primary" onClick={this.produceRecord} style={{marginLeft: 10}}>生产记录</Button>
                                  <Button type="primary" onClick={this.inboundForFinishProduct} style={{marginLeft: 10}}>成品入库</Button>
                              </React.Fragment>
                          )
                      }}
                >
                    <ProductList
                        productList={ppopData}
                        moduleType={"finish"}
                        getRef={this.getFinishRef}
                        prodDataTags={prodDataTags}
                        fieldConfigType={'pmsProduce_order'}
                    />
                </Fold>
                <Fold title={"消耗原料"}
                      rightContent={()=>{
                          return (
                              <React.Fragment>
                                  <Button type="primary" onClick={this.outboundReceiveMaterial}>领料出库</Button>
                                  <Button type="primary" onClick={this.inboundReturnMaterial} style={{marginLeft: 10}}>退料入库</Button>
                              </React.Fragment>
                          )
                      }}
                >
                    <ProductList
                        moduleType={"consume"}
                        productList={ppomData}
                        getRef={this.getConsumeRef}
                        prodDataTags={prodDataTags}
                        fieldConfigType={'pmsProduce_order'}
                    />
                </Fold>
            </React.Fragment>
        )

    };

    // 基本信息-操作按钮
    operateBar = () => {
        const info = this.getInfo();
        if (!info) {
            return null;
        }
        let billNo = info.get('billNo');
        let flag = info.get('flag');
        let orderStatus = info.get('orderStatus');
        let listAction = [];
        listAction = listAction.concat([
            {
                name: 'edit',
                module: 'productOrder',
                onClick: () => {
                    this.modifyConfirm(flag, billNo);
                }
            },
            {
                name: 'delete',
                module: 'productOrder',
                onClick: () => {
                    this.showConfirm();
                }
            },
            {
                name: 'copy',
                module: 'productOrder',
                path:`/produceOrder/copy/${billNo}`
            },
            {
                name: 'print',
                displayBillNo: billNo,
                templateType: 'ProduceOrder'
            },{
                name: 'export',
                module: 'outbound',
                label: intl.get("outbound.show.index.export"),
                href: `${BASE_URL}/file/download?url=/produceorder/excel/export/${billNo}`,
                displayBillNo: billNo,
                templateType: 'ProduceOrder'
            }
        ]);

        return (
            <React.Fragment>
                <OpeBar data={{
                    listData: listAction,
                    moreData: []
                }}/>
                <div className={cx("status-img")}>
                    { orderStatus === 1 && (<Button className={cx(["btn", "green"])} onClick={() => this.complete(billNo)}>生产完成</Button>)}
                    { orderStatus === 0 && (<Button className={cx(["btn", "green", "ml10"])} onClick={() => this.revert(billNo)}>撤回</Button>)}
                </div>
            </React.Fragment>
        )
    };

    // 基本信息-头部信息
    renderHeaderBaseInfo = () => {
        const info = this.getInfo();
        return (
            <React.Fragment>
                <div style={{marginBottom: "0",overflow: "hidden"}}>
                    <AttributeInfo data={{
                        name: "生产单号",
                        value: info.get('billNo'),
                        highlight: true
                    }}/>
                    <AttributeInfo data={{
                        name: "单据日期",
                        value: info.get('orderDate') && moment(info.get('orderDate')).format('YYYY-MM-DD')
                    }}/>
                    <AttributeInfo data={{
                        name: "生产类型",
                        value: info.get('produceType') === 0 ? "内部制造" : "委外加工"
                    }}/>
                    {
                        info.get('produceType') === 0 && (
                            <>
                                <AttributeInfo data={{
                                    name: "生产部门",
                                    value: info.get('departmentName')
                                }}/>
                                <AttributeInfo data={{
                                    name: "生产人",
                                    value: info.get('employeeName')
                                }}/>
                            </>
                        )
                    }
                    <AttributeInfo data={{
                        name: "交付期限",
                        value: info.get('deliveryDeadlineDate') && moment(info.get('deliveryDeadlineDate')).format('YYYY-MM-DD')
                    }}/>
                    {
                        info.get('produceType') === 1 && (
                            <>
                                <AttributeInfo data={{
                                    name: "供应商",
                                    value: info.get('supplierName')
                                }}/>
                                <AttributeInfo data={{
                                    name: "联系人",
                                    value: info.get('contacterName')
                                }}/>
                                <AttributeInfo data={{
                                    name: "联系电话",
                                    value: info.get('contacterTelNo')
                                }}/>
                            </>
                        )
                    }
                    <AttributeInfo data={{
                        name: "状态",
                        value: orderStatusMap[info.get('orderStatus')]
                    }}/>
                </div>
            </React.Fragment>
        );
    };

    // 基本信息-底部信息
    renderFooterBaseInfo = () => {
        const {produceOrderInfo} = this.props;
        const info = this.getInfo() || {};
        const data = [];
        data.push({
           name: '项目',
           value: info.get('projectName')
        });
        const tags = produceOrderInfo && produceOrderInfo.getIn(['data', 'tags']) && produceOrderInfo.getIn(['data', 'tags']).toJS();
        tags && tags.forEach((value) => {
            let propName = value.propName;
            let mappingName = value.mappingName;
            const propertyIndex = mappingName && parseInt(mappingName.substr(mappingName.length - 1));
            if (propName && propName !== "" && mappingName) {
                data.push({
                    name: propName,
                    value: info.getIn(['propertyValues', `property_value${propertyIndex}`]) || ""
                })
            }
        });
        return (
            <div className="detail-sub-attr">
                <AttributeBlock data={data}/>
            </div>
        );
    };

    // 基本信息-附件
    renderAttachment = () => {
        const info = this.getInfo() || {};
        return (
            <div>
                <div style={{
                    display: 'inline-block',
                    verticalAlign: 'top',
                    fontSize: '14px',
                    color: '#666',
                    marginRight: '10px',
                    lineHeight: '30px'
                }}>附件：
                </div>
                <div style={{display: 'inline-block', lineHeight: '30px'}}>
                    {
                        info.get("fileInfo") && info.get("fileInfo").toJS().map((file) => {
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
        )
    };

    //加载当前物品概要数据
    loadWare = (visible, billNo, type) => {
        const dataSource = this.props[type].getIn(['data', 'list']) || [];
        const hasCache = dataSource.filter(item => {
            return item.get('billNo') === billNo && item.get('prodAbstractList')
        }).size > 0;
        if (visible && !hasCache) {
            this.props[ASYNC_LOAD_WARE[type]](billNo);
        }
    };

    // 领料记录
    renderGainMaterialRecord = () => {
        let { gainMaterialRecord } = this.props;
        let dataSource = gainMaterialRecord && gainMaterialRecord.getIn(['data', 'list']) && gainMaterialRecord.getIn(['data', 'list']).toJS();
        let paginationInfo = gainMaterialRecord && gainMaterialRecord.getIn(['data', 'pagination']) && gainMaterialRecord.getIn(['data', 'pagination']).toJS();
        return (
            <div className="detail-table-wrap">
                <GainMaterialRecord
                    fetchData={this.loadData}
                    loadWare={this.loadWare}
                    dataSource={dataSource}
                    paginationInfo={paginationInfo}
                    bordered
                    pagination={false}
                />
            </div>
        );
    };

    // 退料记录
    renderQuitMaterialRecord = () => {
        let { quitMaterialRecord } = this.props;
        let dataSource = quitMaterialRecord && quitMaterialRecord.getIn(['data', 'list']) && quitMaterialRecord.getIn(['data', 'list']).toJS();
        let paginationInfo = quitMaterialRecord && quitMaterialRecord.getIn(['data', 'pagination']) && quitMaterialRecord.getIn(['data', 'pagination']).toJS();
        return (
            <div className="detail-table-wrap">
                <QuitMaterialRecord
                    fetchData={this.loadData}
                    loadWare={this.loadWare}
                    dataSource={dataSource}
                    paginationInfo={paginationInfo}
                    bordered
                    pagination={false}
                />
            </div>
        );
    };

    // 成品入库记录
    renderProductInboundRecord = () => {
        let { productInboundRecord } = this.props;
        let dataSource = productInboundRecord && productInboundRecord.getIn(['data', 'list']) && productInboundRecord.getIn(['data', 'list']).toJS();
        let paginationInfo = productInboundRecord && productInboundRecord.getIn(['data', 'pagination']) && productInboundRecord.getIn(['data', 'pagination']).toJS();
        return (
            <div className="detail-table-wrap">
                <ProductInboundRecord
                    fetchData={this.loadData}
                    loadWare={this.loadWare}
                    dataSource={dataSource}
                    paginationInfo={paginationInfo}
                    bordered
                    pagination={false}
                />
            </div>
        );
    };

    // 工单记录列表
    renderWorkSheetRecord = () => {
        let { workSheetRecord } = this.props;
        let dataSource = workSheetRecord && workSheetRecord.getIn(['data', 'list']) && workSheetRecord.getIn(['data', 'list']).toJS();
        let paginationInfo = workSheetRecord && workSheetRecord.getIn(['data', 'pagination']) && workSheetRecord.getIn(['data', 'pagination']).toJS();
        return (
            <div className="detail-table-wrap">
                <WorkSheetRecord
                    fetchData={this.loadData}
                    dataSource={dataSource}
                    paginationInfo={paginationInfo}
                    bordered
                    pagination={false}
                />
            </div>
        );
    };

    handleTabClick = (activeKey) => {
        this.loadData({activeKey});
        this.props.history.replace({
            pathname: this.props.location.pathname,
            search: this.props.location.search,
            hash: activeKey
        });
    };

    // 完成
    complete = (billNo) => {
        this.props.asyncCompleteOperate(billNo, (res) => {
            if(res && res.retCode==="0"){
                message.success('操作成功');
                this.loadData({activeKey: 'baseInfo'});
            } else {
                Modal.error({
                    title: "提示信息",
                    content: res.retMsg || '操作失败'
                })
            }
        });
    };

    // 撤回
    revert = (billNo) => {
        this.props.asyncRevertOperate(billNo, (res) => {
            if(res && res.retCode==="0"){
                message.success('操作成功');
                this.loadData({activeKey: 'baseInfo'});
            } else {
                Modal.error({
                    title: "提示信息",
                    content: res.retMsg || '操作失败'
                })
            }
        });
    };

    resetDefaultFields = ()=>{
        this.loadData({activeKey: 'baseInfo'});
    };


    render() {
        const { productInboundVisible, showBatchNoFlag } = this.state;
        const {produceOrderInfo} = this.props;
        const data = produceOrderInfo.getIn(['data', 'data']);
        let listProduceFields = produceOrderInfo && produceOrderInfo.getIn(['data', 'listProduceFields']);
        let listMaterialFields = produceOrderInfo && produceOrderInfo.getIn(['data', 'listMaterialFields']);
        const detailData = produceOrderInfo && data !== '' && data;
        const {match} = this.props;
        const id = match.params.id;
        const activeKey = this.props.location.hash.replace('#', '') || 'workSheetInfo';

        const billNo = data && data.get('billNo');
        const printStatus = data && data.get('printState');

        let renderContent = null;
        if (produceOrderInfo && produceOrderInfo.get('isFetching')) {
            renderContent = <Spin className="gb-data-loading"/>;
        }
        else if (detailData) {
            renderContent = (
                <React.Fragment>
                    {
                        (printStatus === 0 ||  printStatus === 1)?<PrintStatus status={printStatus} billNo={billNo}/>:null
                    }
                    {this.renderHeaderBaseInfo()}
                    {this.productListInfo()}
                    {this.renderFooterBaseInfo()}
                    {this.renderAttachment()}
                    <OperatorLog logInfo={{
                        creator: data.get('addedName')||data.get('addedLoginName'),
                        createDate: getYmd(data.get('addedTime')),
                        lastModifier: data.get('updatedName')||data.get('updatedLoginName'),
                        lastModifyDate: getYmd(data.get('updatedTime')),
                    }}/>
                </React.Fragment>
            )
        }

        return (
            <Layout>
                <div>
                    <Crumb data={[
                        {
                            url: '/produceOrder/',
                            title: "生产管理"
                        },
                        {
                            url: '/produceOrder/',
                            title: "生产单列表"
                        },
                        {
                            title: "详情页"
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <GoodsTableFieldConfigMenu
                            produceTableConfigList={listProduceFields}
                            materialTableConfigList={listMaterialFields}
                            refresh={this.resetDefaultFields}
                            type={['pmsproduce_material_product', 'pmsproduce_order_product']}
                        />
                    </div>
                </div>
                <div className="detail-content" style={{position:"relative"}}>
                    {this.operateBar()}
                    <div className="detail-content-bd"  style={{position:"relative"}}>
                        <Tabs
                            onTabClick={this.handleTabClick}
                            defaultActiveKey={activeKey}
                            className="record-tab"
                        >
                            <TabPane tab={<span className={cx("tab-tit")}>基本信息</span>} key="baseInfo">
                                <PrintArea>
                                    {renderContent}
                                    <PoductEnterWarehousePop
                                        {...this.props}
                                        visible={productInboundVisible}
                                        getRef={this.getProductInRef}
                                        onCancel={()=>{
                                            this.setState({
                                                productInboundVisible: false,
                                            });
                                            this.productInRef && this.productInRef.onCancelCallback();
                                        }}
                                        showBatchNoFlag={showBatchNoFlag}
                                    />
                                </PrintArea>
                            </TabPane>
                            <TabPane tab={<span className={cx("tab-tit")}>领料记录</span>} key="gainMaterialRecord">
                                {this.renderGainMaterialRecord()}
                            </TabPane>
                            <TabPane tab={<span className={cx("tab-tit")}>退料记录</span>} key="quitMaterialRecord">
                                {this.renderQuitMaterialRecord()}
                            </TabPane>
                            <TabPane tab={<span className={cx("tab-tit")}>成品入库记录</span>} key="productInboundRecord">
                                {this.renderProductInboundRecord()}
                            </TabPane>
                            <TabPane tab={<span className={cx("tab-tit")}>工单记录</span>} key="workSheetRecord">
                                {this.renderWorkSheetRecord()}
                            </TabPane>
                        </Tabs>
                    </div>
                </div>

            </Layout>
        )
    }
}

