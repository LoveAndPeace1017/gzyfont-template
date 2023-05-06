import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Layout, Modal, Spin, Button, message, Tabs,Checkbox} from 'antd';
import Crumb from 'components/business/crumb';
import PrintArea from 'components/widgets/printArea';
import FileView from 'components/business/fileView';
import PrintStatus from 'components/business/printStatus';
import {
    WareEnterBatchEdit,
    FinanceExpendBatchEdit,
    FinanceInvoiceBatchEdit
} from 'components/business/batchEditPop';

import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import OpeBar from 'components/business/opeBar';
import {AttributeBlock, AttributeInfo} from 'components/business/attributeBlock';
import {asyncFetchSubcontractById, asyncGenerateOut, asyncGenerateIn} from '../actions';
import {asyncDeleteSubcontractInfo} from '../../index/actions';
import OperatorLog from 'components/business/operatorLog';
import {ConvertButton} from 'components/business/authMenu';
import GoodsTableFieldConfigMenu from 'components/business/goodsTableFieldConfigMenu';
import {SubcontractProductList as ProductList} from 'components/business/productList';
import CheckWareArriveUpperLimit,{dealCheckWareUpperLimitData} from 'components/business/checkWareArriveUpperLimit';
import {getYmd} from "utils/format";
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import {InboundRecord} from 'pages/inventory/inbound/index'
import {ExpendRecord} from 'pages/finance/expend/index'
import {InvoiceRecord} from 'pages/finance/invoice/index'
import {Auth} from 'utils/authComponent';
import {PRICE_NO_AUTH_RENDER} from 'utils/constants';
import {getUrlParamValue} from 'utils/urlParam';
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';
import {actions as vipServiceHomeActions} from "pages/vipService/index";
import {actions as vipOpeActions, withVipWrap} from "components/business/vipOpe";
import {detailPage} from  'components/layout/listPage';
import Fold from 'components/business/fold';
import {Link, withRouter} from "react-router-dom";

const cx = classNames.bind(styles);

const mapStateToProps = (state) => ({
    subcontractInfo: state.getIn(['subcontractShow', 'subcontractInfo']),
    vipService: state.getIn(['vipHome', 'vipService'])
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchSubcontractById,
        asyncDeleteSubcontractInfo,
        asyncGenerateOut,
        asyncGenerateIn,
        asyncOpenVipAndSendRequestToOss: vipOpeActions.asyncOpenVipAndSendRequestToOss,
        asyncFetchVipService: vipServiceHomeActions.asyncFetchVipService,
    }, dispatch)
};

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
@withVipWrap
export default class Index extends detailPage {
    constructor(props) {
        super(props);
        this.state = {
            deleteRelatedRecord: false,
        }
    }

    componentDidMount() {
        this.props.asyncFetchVipService(); // 获取Vip信息
        this.loadData();
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.match.params.id!=this.props.match.params.id){
            this.loadData(nextProps.match.params.id);
        }
    }

    loadData = (nextId) => {
        const {match} = this.props;
        const id = nextId || match.params.id;
        if (id) {
            this.props.asyncFetchSubcontractById(id, (res) => {
                let errorMsg = res.retCode != 0 && res.retMsg;
                if (errorMsg) {
                    Modal.info({
                        title: intl.get("purchase.show.index.warningTip"),
                        content: errorMsg
                    });
                }
            })
        }
    };

    onDeleteConfirmChange = (e) => {
        this.setState({
            deleteRelatedRecord: e.target.checked
        });
    };


    showConfirm = () => {
        const {match} = this.props;
        const id = match.params.id;
        let self = this;
        Modal.confirm({
            title: intl.get("purchase.index.index.warningTip"),
            content: <div>
                <p>删除单据后无法恢复，确定删除吗</p>
                <Checkbox onChange={this.onDeleteConfirmChange}>同时删除关联的出入库单</Checkbox>
            </div>,
            okButtonProps:{
                'ga-data':'list-delete-ok'
            },
            cancelButtonProps:{
                'ga-data':'list-delete-cancel'
            },
            onOk() {
                return new Promise((resolve, reject) => {
                    self.props.asyncDeleteSubcontractInfo({ids:[id],isCascaded: self.state.deleteRelatedRecord ? 1 : 0}, function(res) {
                        resolve();
                        if (res.retCode == 0) {
                            message.success(intl.get("purchase.show.index.deleteSuccessMessage"));
                            self.props.history.replace('/subcontract/')
                        }
                        else {
                            message.error(res.retMsg);
                        }
                    });
                }).catch(() => {
                    //alert("操作失败")
                })

            },
            onCancel() {
            },
        });
    };

    getInfo() {
        const {subcontractInfo} = this.props;
        return subcontractInfo && subcontractInfo.getIn(['data', 'data']);
    }

    purchaseBillInfo = () => {
        const info = this.getInfo();
        const {subcontractInfo} = this.props;
        const upData = subcontractInfo && subcontractInfo.getIn(['data']);
        return (
            <React.Fragment>
                <div style={{marginBottom: "0",overflow: "hidden"}}>
                    <AttributeInfo data={{
                        name: "加工单号",
                        value: info.get('billNo'),
                        highlight: true
                    }}/>
                    <AttributeInfo data={{
                        name: "录单日期",
                        value: moment(info.get('orderDate')).format('YYYY-MM-DD')
                    }}/>
                    <AttributeInfo data={{
                        name: "提醒日期",
                        value: moment(info.get('orderDate')).format('YYYY-MM-DD')
                    }}/>
                    <AttributeInfo data={{
                        name: "入库仓库",
                        value: info.get('warehouseNameIn')
                    }}/>
                    <AttributeInfo data={{
                        name: "入库状态",
                        value: upData.get('inState')?(upData.get('enterBillNo')?<span>已完成入库(<Link style={{color: "#0066dd"}} to={"/inventory/inbound/show/"+upData.get('enterBillNo')}>{upData.get('enterDisplayBillNo')}</Link>)</span>:"已完成入库"):((upData.get('enterBillNo')?<span>未完成入库(<Link style={{color: "#0066dd"}} to={"/inventory/inbound/show/"+upData.get('enterBillNo')}>{upData.get('enterDisplayBillNo')}</Link>)</span>:"未完成入库"))
                    }}/>
                </div>
                <div style={{marginBottom: "0",overflow: "hidden"}}>
                    <AttributeInfo data={{
                        name: "供应商",
                        value: info.get('supplierName'),
                        highlight: true
                    }}/>
                    <AttributeInfo data={{
                        name: "供应商联系人",
                        value: info.get('supplierContacterName'),
                        highlight: true
                    }}/>
                    <AttributeInfo data={{
                        name: "联系电话",
                        value: info.get('supplierMobile'),
                        highlight: true
                    }}/>
                    <AttributeInfo data={{
                        name: "出库仓库",
                        value: info.get('warehouseNameOut')
                    }}/>
                    <AttributeInfo data={{
                        name: "出库状态",
                        value: upData.get('outState')?(upData.get('outBillNo')?<span>已完成出库(<Link style={{color: "#0066dd"}} to={"/inventory/outbound/show/"+upData.get('outBillNo')}>{upData.get('outDisplayBillNo')}</Link>)</span>:"已完成出库"):((upData.get('outBillNo')?<span>未完成出库(<Link style={{color: "#0066dd"}} to={"/inventory/outbound/show/"+upData.get('outBillNo')}>{upData.get('outDisplayBillNo')}</Link>)</span>:"未完成出库"))
                    }}/>
                </div>
            </React.Fragment>
        );
    };

    materialsProductList = () => {
        const {subcontractInfo, vipService} = this.props;
        const enterProdList = subcontractInfo && subcontractInfo.getIn(['data', 'data', 'enterProdList']);
        const outProdList = subcontractInfo && subcontractInfo.getIn(['data', 'data', 'outProdList']);

        let quantityDecimalNum = getCookie("quantityDecimalNum");
        let priceDecimalNum = getCookie("priceDecimalNum");

        let vipSource = vipService.getIn(['vipData','data']);
        vipSource = vipSource ? vipSource.toJS() : [];
        let batchShelfLife = vipSource.BATCH_SHELF_LIFE || {};  //增值包数据
        let batchShelfLifeVipFlag = batchShelfLife.vipState === 'TRY' || batchShelfLife.vipState === 'OPENED';

        let enterData = enterProdList.map((item, index) => {
            return {
                serial: index + 1,
                key: item.get('id'),
                prodNo: item.get('prodCustomNo'),
                prodName: item.get('prodName'),
                descItem: item.get('descItem'),
                brand: item.get('brand'),
                produceModel: item.get('produceModel'),
                batchNo: item.get('batchNo'),
                productionDate: item.get('productionDate') ? new moment(item.get('productionDate')).format('YYYY-MM-DD') : "",
                expirationDate: item.get('expirationDate') ? new moment(item.get('expirationDate')).format('YYYY-MM-DD') : "",
                unitCost: fixedDecimal(item.get('unitCost'), priceDecimalNum),
                quantity: fixedDecimal(item.get('quantity'), quantityDecimalNum),
                unit: item.get('unit'),
                amount: (item.get('amount') || 0).toFixed(2),
                allocatedPrice: fixedDecimal(item.get('allocatedPrice'), priceDecimalNum),
                allocatedAmount: (item.get('allocatedAmount') || 0).toFixed(2),
            }
        }).toArray();

        let outData = outProdList.map((item, index) => {
            return {
                serial: index + 1,
                key: item.get('id'),
                prodNo: item.get('prodCustomNo'),
                prodName: item.get('prodName'),
                descItem: item.get('descItem'),
                brand: item.get('brand'),
                produceModel: item.get('produceModel'),
                batchNo: item.get('batchNo'),
                productionDate: item.get('productionDate') ? new moment(item.get('productionDate')).format('YYYY-MM-DD') : "",
                expirationDate: item.get('expirationDate') ? new moment(item.get('expirationDate')).format('YYYY-MM-DD') : "",
                quantity: item.get('quantity'),
                unitCost: fixedDecimal(item.get('unitCost'), priceDecimalNum),
                unit: item.get('unit'),
                amount: (item.get('amount') || 0).toFixed(2),
            }
        }).toArray();

        return (
            <React.Fragment>
                <Fold title={"消耗原料"}>
                    <ProductList
                        productList={outData}
                        moduleType={"consume"}
                        fieldConfigType={'outsource_product'}
                        batchShelfLifeVipFlag={batchShelfLifeVipFlag}
                    />
                </Fold>
                <Fold title={"加工成品"}>
                    <ProductList
                        moduleType={"preform"}
                        productList={enterData}
                        fieldConfigType={'outsource_product'}
                        batchShelfLifeVipFlag={batchShelfLifeVipFlag}
                    />
                </Fold>
            </React.Fragment>
        )

    };

    openModal = type => {
        this.setState({
            [type]: true
        })
    };

    closeModal = type => {
        this.setState({
            [type]: false
        })
    };

    operateBar = () => {
        const info = this.getInfo();
        const {subcontractInfo} = this.props;
        if (!info) {
            return null;
        }
        const upData = subcontractInfo && subcontractInfo.getIn(['data']);
        const editFlag = !!(upData && upData.getIn(["outBillNo"]) || upData.getIn(["enterBillNo"]));
        const inboundFlag = !!(upData && upData.getIn(["enterBillNo"]));
        const outboundFlag = !!(upData && upData.getIn(["outBillNo"]));

        let listAction = [];
        listAction = listAction.concat([
            {
                name: 'rowMaterialOutbound',
                onClick: () => {
                    Modal.confirm({
                        title: "提示信息",
                        content: "确认消耗原料出库？",
                        onOk: () => {
                            this.props.asyncGenerateOut(info.get('billNo'), (res) => {
                                if(res.retCode==="0"){
                                    message.success('操作成功!');
                                    this.loadData();
                                } else {
                                    message.error(res.retMsg);
                                }
                            });
                        }
                    })
                },
                disabled: outboundFlag
            },
            {
                name: 'finishProdInbound',
                onClick: () => {
                    Modal.confirm({
                        title: "提示信息",
                        content: "确认成品入库？",
                        onOk: () => {
                            this.props.asyncGenerateIn(info.get('billNo'), (res) => {
                                if(res.retCode==="0"){
                                    message.success('操作成功!');
                                    this.loadData();
                                } else {
                                    message.error(res.retMsg);
                                }
                            });
                        }
                    })

                },
                disabled: inboundFlag
            },
            {
                name: 'edit',
                onClick: () => {
                    this.props.history.push('/subcontract/modify/' + this.getInfo().get('billNo'));
                },
                disabled: editFlag
            },
            {
                name: 'delete',
                onClick: () => {
                    this.showConfirm();
                },
                disabled: false
            },
            {
                name: 'copy',
                onClick: () => {
                    this.props.vipTipPop({source:"subContract",onTryOrOpenCallback:()=>{
                            this.props.history.push('/subcontract/copy/' + this.getInfo().get('billNo'));
                    }})
                }
            }
        ]);

        listAction = listAction.concat([
            {
                name: 'print',
                displayBillNo: this.getInfo().get('billNo'),
                templateType: 'Subcontract'
            },{
                name: 'export',
                module: 'outbound',
                label: intl.get("outbound.show.index.export"),
                href: `${BASE_URL}/file/download?url=/outsource/excel/export/${this.getInfo().get('billNo')}`,
                displayBillNo: this.getInfo().get('billNo'),
                templateType: 'Subcontract'
            }
        ]);



        return (
            <React.Fragment>
                <OpeBar data={{
                    listData: listAction,
                    moreData: []
                }}/>
            </React.Fragment>
        )
    };

    purchaseBaseInfo = () => {
        const {subcontractInfo} = this.props;
        const info = this.getInfo() || {};


        const data = [
            {
                name: intl.get("purchase.show.index.projectName"),
                value: info.get('projectName')
            },
            {
                name: "经办人",
                value: info.get('ourContacterName')
            }
        ];
        const tags = subcontractInfo && subcontractInfo.getIn(['data', 'tags']);
        const data1 = subcontractInfo.getIn(['data', 'data']);
        const detailData = subcontractInfo && data1 !== '' && data1;


        tags && tags.forEach((value) => {
            let propName = value.get('propName');
            let mappingName = value.get('mappingName');
            const propertyIndex = mappingName && parseInt(mappingName.substr(mappingName.length - 1));
            if (propName && propName !== "" && mappingName) {
                data.push({
                    name: propName,
                    value: info.get(`propertyValue${propertyIndex}`) || ""
                })
            }
        });
        return (
            <div className="detail-sub-attr">
                <AttributeBlock data={data}/>
                <AttributeBlock data={[{
                    name: intl.get("purchase.show.index.contractTerms"),
                    value: info.get('remark')
                }]}/>
                <div>
                    <div style={{
                        display: 'inline-block',
                        verticalAlign: 'top',
                        fontSize: '14px',
                        color: '#666',
                        marginRight: '10px',
                        lineHeight: '30px'
                    }}> {intl.get("purchase.show.index.tempAtt")}：
                    </div>
                    <div style={{display: 'inline-block', lineHeight: '30px'}}>
                        {
                            detailData && detailData.get("fileInfo") && detailData.get("fileInfo").toJS().map((file) => {
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
        );
    };

    resetDefaultFields = (billNo)=>{
        this.props.asyncFetchSubcontractById(billNo)
    };

    render() {
        const {subcontractInfo} = this.props;
        const data = subcontractInfo.getIn(['data', 'data']);
        const listFields = subcontractInfo && subcontractInfo.getIn(['data', 'listFields']);
        const billNo = data && data.get('billNo');
        const printStatus =data && data.get('printState');
        const detailData = subcontractInfo && data !== '' && data;
        const {match} = this.props;
        const id = match.params.id;
        let renderContent = null;
        if (subcontractInfo && subcontractInfo.get('isFetching')) {
            renderContent = <Spin className="gb-data-loading"/>;
        }
        else if (detailData) {
            renderContent = (
                <React.Fragment>
                    <PrintArea>
                        {
                            (printStatus === 0 ||  printStatus === 1)?<PrintStatus status={printStatus} billNo={billNo}/>:null
                        }
                        {this.purchaseBillInfo()}
                        {this.materialsProductList()}
                        {this.purchaseBaseInfo()}
                        <OperatorLog logInfo={{
                            creator: data.get('addedName')||data.get('addedLoginName'),
                            createDate: getYmd(data.get('addedTime')),
                            lastModifier: data.get('updatedName')||data.get('updatedLoginName'),
                            lastModifyDate: getYmd(data.get('updatedTime')),
                            approvedLoginName: data.get('approvedLoginName'),
                            approvedTime: data.get('approvedTime') && getYmd(data.get('approvedTime'))
                        }}/>
                    </PrintArea>
                </React.Fragment>
            )
        }

        return (
            <Layout>
                <div>
                    <Crumb data={[
                        {
                            url: '/subcontract/',
                            title: "委外加工"
                        },
                        {
                            url: '/subcontract/',
                            title: "委外加工列表"
                        },
                        {
                            title: "委外加工详情页"
                        }
                    ]}/>
                    <div className={cx("float-right")}>
                        <GoodsTableFieldConfigMenu
                            tableConfigList={listFields}
                            refresh={() => this.resetDefaultFields(billNo)}
                            type={'outsource_product'}
                        />
                    </div>
                </div>
                <div className="detail-content" style={{position:"relative"}}>
                    {this.operateBar()}
                    <div className="detail-content-bd"  style={{position:"relative"}}>
                        {renderContent}
                    </div>
                </div>
            </Layout>
        )
    }
}

