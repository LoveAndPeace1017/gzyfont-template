import React, {Component} from 'react';
import intl from 'react-intl-universal';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Layout, Modal, Spin, Tabs} from 'antd';
import Crumb from 'components/business/crumb';
import FileView from 'components/business/fileView';
import {Auth} from 'utils/authComponent';
import PrintArea from 'components/widgets/printArea';
import { asyncFetchSaleById } from '../actions';
import styles from '../styles/index.scss';
import classNames from "classnames/bind";
import {AttributeBlock, AttributeInfo} from 'components/business/attributeBlock';
import GoodsTableFieldConfigMenu from 'components/business/goodsTableFieldConfigMenu';
import {getYmd} from "utils/format";
import {fixedDecimal} from "utils/Decimal";
import {getCookie} from 'utils/cookie';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Shanghai");
import Icon from 'components/widgets/icon';
import Tooltip from 'components/widgets/tooltip';
import { backApproveStatusImg } from 'components/business/approve';
import {detailPage} from  'components/layout/listPage';
import ProductList from './productList';
import OutboundRecord from './outboundRecord';
import IncomeRecord from './incomeRecord';
import SaleInvoiceRecord from './saleInvoiceRecord';
import ProduceRecord from './produceRecord';
import {PRICE_NO_AUTH_RENDER} from 'utils/constants';
import {getUrlParamValue} from 'utils/urlParam';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const cx = classNames.bind(styles);
const {TabPane} = Tabs;
const InterchangeStatus = {
    notSend: 0,
    unAccepted: 1,
    accepted: 2,
    cancelled: 3
};

const mapStateToProps = (state) => ({
    saleInfo: state.getIn(['traceShow', 'saleInfo']),
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        asyncFetchSaleById
    }, dispatch)
};

@connect(mapStateToProps, mapDispatchToProps)
export default class Index extends detailPage {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = (nextId) => {
        const {match} = this.props;
        const id = nextId || match.params.id;
        if (id) {
            this.props.asyncFetchSaleById(id, (res) => {
                let errorMsg = res.retCode != 0 && res.retMsg;
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
        const {saleInfo} = this.props;
        return saleInfo && saleInfo.getIn(['data', 'data']);
    }

    saleBillInfo = () => {
        const info = this.getInfo();
        let currencyVipFlag = getCookie("currencyVipFlag");
        return (
            <div className={"detail-main-attr cf"}>
                <AttributeInfo data={{
                    name: intl.get("sale.show.index.displayBillNo"),
                    value: info.get('displayBillNo'),
                    highlight: true
                }}/>
                <AttributeInfo data={{
                    name: intl.get("sale.show.index.saleOrderDate"),
                    value: moment(info.get('saleOrderDate')).format('YYYY-MM-DD')
                }}/>
                <AttributeInfo data={{
                    name: intl.get("sale.show.index.warehouseName"),
                    value: info.get('warehouseName')
                }}/>
                <AttributeInfo data={{
                    name: intl.get("sale.show.index.customerName"),
                    value: info.get('customerName')
                }}/>
                <AttributeInfo data={{
                    name: intl.get("sale.add.baseInfo.customerContacterName"),
                    value: info.get('customerContacterName')
                }}/>
                <AttributeInfo data={{
                    name: intl.get("sale.show.index.customerTelNo"),
                    value: info.get('customerTelNo')
                }}/>
                {
                    currencyVipFlag === 'true' && (
                        <>
                            <AttributeInfo data={{
                                name: "币种",
                                value: info.get('currencyName')
                            }}/>
                            <AttributeInfo data={{
                                name: "牌价",
                                value: info.get('quotation')
                            }}/>
                        </>
                    )
                }
            </div>
        );
    };


    isLocalBill = () => {
        const interchangeStatus = this.getInfo() && this.getInfo().get('interchangeStatus');
        return interchangeStatus === InterchangeStatus.notSend;
    };

    saleProductList = () => {
        const {saleInfo} = this.props;
        const prodList = saleInfo && saleInfo.getIn(['data', 'data', 'prodList']);
        /**
         *  aggregateAmount 订单优惠后总金额
         *  discountAmount 订单优惠金额
         *  taxAllAmount  订单含税总金额
         * */
        const aggregateAmount = saleInfo && saleInfo.getIn(['data', 'data', 'aggregateAmount']);
        const discountAmount = saleInfo && saleInfo.getIn(['data', 'data', 'discountAmount']);
        const taxAllAmount = saleInfo && saleInfo.getIn(['data', 'data', 'taxAllAmount']);
        const currencyAggregateAmount = saleInfo && saleInfo.getIn(['data', 'data', 'currencyAggregateAmount']);
        const billProdDataTags = saleInfo && saleInfo.getIn(['data', 'billProdDataTags']) && saleInfo.getIn(['data', 'billProdDataTags']).toJS();
        const prodDataTags = saleInfo && saleInfo.getIn(['data', 'prodDataTags']) && saleInfo.getIn(['data', 'prodDataTags']).toJS();

        let quantityDecimalNum = getCookie("quantityDecimalNum");
        let priceDecimalNum = getCookie("priceDecimalNum");
        let currencyVipFlag = getCookie("currencyVipFlag");

        const isLocalBill = this.isLocalBill();
        const data = prodList.map((item, index) => {
            const unBind = (item.get('productCode') || '').length <= 1;
            let operateAction = null;
            if (!isLocalBill) {
                if (unBind) {
                    operateAction = intl.get("sale.show.index.bind");
                } else if ((item.get('customerProductCode') || '').length > 1) {
                    operateAction = intl.get("sale.show.index.unBind");
                }
            }
            let prodItem = item && item.toJS();
            billProdDataTags.forEach(tag => { // 处理自定义字段中的特殊值
                let propertyValue = this.preProcessDataTagValue(tag, prodItem[tag.mappingName]);
                if(propertyValue){
                    prodItem[tag.mappingName] = propertyValue;
                }
            });
            prodDataTags.forEach(tag => { // 处理自定义字段中的特殊值
                let propertyValue = this.preProcessDataTagValue(tag, prodItem[tag.mappingName]);
                if(propertyValue){
                    prodItem[tag.mappingName] = propertyValue;
                }
            });

            return {
                ...prodItem,
                serial: index + 1,
                key: item.get('id'),
                customerProdNo: prodItem.customerProductCode,
                displayCode: unBind ? prodItem.customerProductDisplayCode : prodItem.prodCustomNo,
                quantity: fixedDecimal(prodItem.quantity, quantityDecimalNum),
                untaxedPrice: fixedDecimal(prodItem.untaxedPrice, priceDecimalNum),
                unitPrice: fixedDecimal(prodItem.unitPrice, priceDecimalNum),
                untaxedAmount: (prodItem.untaxedAmount || 0).toFixed(2),
                taxRate: prodItem.taxRate || 0,
                tax: prodItem.tax,
                amount: (prodItem.amount || 0).toFixed(2),
                deliveryDeadlineDate: prodItem.deliveryDeadlineDate && moment(prodItem.deliveryDeadlineDate).format('YYYY-MM-DD'),
                outQuantity: fixedDecimal(prodItem.outNum, quantityDecimalNum),
                unStockOut: fixedDecimal(prodItem.unOutNum, quantityDecimalNum),
                producedQuantity: fixedDecimal(prodItem.producedQuantity, quantityDecimalNum),
                operate: operateAction,
                isFetching: prodItem.isFetching || false,
                unitConverter: `1${prodItem.recUnit}=${prodItem.unitConverter}${prodItem.unit}`,
                recQuantity: fixedDecimal(prodItem.recQuantity, quantityDecimalNum),
                returnNum: fixedDecimal(prodItem.returnNum, quantityDecimalNum),
                actualNum: fixedDecimal(prodItem.actualNum, quantityDecimalNum),
                currencyUnitPrice: fixedDecimal(prodItem.currencyUnitPrice, priceDecimalNum),
                currencyAmount: fixedDecimal(prodItem.currencyAmount, priceDecimalNum)
            }
        }).toArray();

        return (
            <ProductList
                productList={data}
                aggregateAmount={aggregateAmount}
                discountAmount={discountAmount}
                taxAllAmount={taxAllAmount}
                currencyAggregateAmount={currencyAggregateAmount}
                moduleType={'sale'}
                priceType={'salePrice'}
                fieldConfigType={'saleOrder'}
                currencyVipFlag={currencyVipFlag}
                billProdDataTags={billProdDataTags}
                prodDataTags={prodDataTags}
                operateClick={this.handleBindOrUnBind}
            />
        );
    };

    saleBaseInfo = () => {
        const {saleInfo} = this.props;
        const info = this.getInfo() || {};
        const address = [];

        if (info.get('deliveryProvinceText')) {
            address.push(info.get('deliveryProvinceText'));
        }
        if (info.get('deliveryCityText')) {
            address.push(info.get('deliveryCityText'));
        }
        if (info.get('deliveryAddress')) {
            address.push(info.get('deliveryAddress'));
        }

        const data = [
            {
                name: intl.get("sale.show.index.deliveryAddress"),
                value: (address.length > 0 && address.join('  ')) || ''
            },
            {
                name: intl.get("sale.show.index.projectName"),
                value: info.get('projectName')
            },
            {
                name: intl.get("sale.show.index.settlement"),
                value: info.get('settlement')
            },
            {
                name: intl.get("sale.show.index.customerOrderNo"),
                value: info.get('customerOrderNo')
            },
            {
                name: intl.get("sale.show.index.ourName"),
                value: info.get('ourName')
            },
            {
                name: intl.get("sale.show.index.ourContacterName"),
                value: info.get('ourContacterName')
            },
            {
                name: intl.get("sale.show.index.ourTelNo"),
                value: info.get('ourTelNo')
            }
        ];
        const tags = saleInfo && saleInfo.getIn(['data', 'tags']) && saleInfo.getIn(['data', 'tags']).toJS();
        const data1 = saleInfo.getIn(['data', 'data']);
        const detailData = saleInfo && data1 !== '' && data1;
        tags && tags.forEach((value) => {
            let propName = value.propName;
            let mappingName = value.mappingName;
            let propertyValues = (data1.get('propertyValues') && data1.get('propertyValues').toJS()) || {};
            if (propName && propName !== "" && mappingName) {
                data.push({
                    name: propName,
                    value: this.preProcessDataTagValue(value, propertyValues[mappingName])
                })
            }
        });
        return (
            <div className="detail-sub-attr">
                <AttributeBlock data={data}/>
               {/* <div>
                    <div style={{
                        display: 'inline-block',
                        verticalAlign: 'top',
                        fontSize: '14px',
                        color: '#666',
                        marginRight: '10px',
                        lineHeight: '30px'
                    }}>{intl.get("sale.show.index.tempAtt")}：
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
                </div>*/}
            </div>
        );
    };

    closeModal = (type) => {
        this.setState({
            [type]: false
        })
    };

    openModal = (type) => {
        this.setState({
            [type]: true
        })
    };

    handleTabClick = (activeKey) => {
        this.props.history.replace({
            pathname: this.props.location.pathname,
            search: this.props.location.search,
            hash: activeKey
        });
    };

    resetDefaultFields = (billNo)=>{
        this.props.asyncFetchSaleById(billNo)
    };

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.match.params.id!=this.props.match.params.id){
            this.loadData(nextProps.match.params.id);
        }
    }

    render() {
        const {match} = this.props;
        const id = match.params.id;
        const {saleInfo} = this.props;
        const data = saleInfo.getIn(['data', 'data']);
        const listFields = saleInfo && saleInfo.getIn(['data', 'listFields']);
        const detailData = saleInfo && data !== '' && data;
        const activeKey = this.props.location.hash.replace('#', '');

        const approveModuleFlag = saleInfo.getIn(['data', 'approveModuleFlag']); //是否开启审批权
        const approveStatus = data && data.get('approveStatus');  //审批状态 0 未通过 1通过
        const interchangeStatus = data && data.get('interchangeStatus');
        const billNo = data && data.get('billNo');

        let renderContent = null;
        if (saleInfo && saleInfo.get('isFetching')) {
            renderContent = <Spin className="gb-data-loading"/>;
        } else if (detailData) {
            renderContent = (
                <React.Fragment>
                    {this.saleBillInfo()}
                    {this.saleProductList()}
                    {this.saleBaseInfo()}
                </React.Fragment>
            )
        }

        return (
            <Layout>
                <div>
                    <Crumb data={getUrlParamValue('source') === 'mall'?[
                        {
                            url: '/mall/',
                            title: intl.get("sale.show.index.myMall")
                        },
                        {
                            url: '/mall/sale/',
                            title: intl.get("sale.show.index.onlineSaleOrder")
                        },
                        {
                            title: intl.get("sale.show.index.detail")
                        }
                    ]:[
                        {title: intl.get("sale.show.index.sale")},
                        {url: '/', title: intl.get("sale.show.index.saleList")},
                        {title: intl.get("sale.show.index.detail")}
                    ]}/>
                    <div className={cx("float-right")}>
                        <GoodsTableFieldConfigMenu
                            tableConfigList={listFields}
                            refresh={() => this.resetDefaultFields(billNo)}
                            isShowFooter={false}
                            type={'saleOrder'}
                        />
                    </div>
                </div>
                <div className="detail-content"  style={{position:"relative"}}>
                    <div className="detail-content-bd"  style={{position:"relative"}}>
                        {
                            interchangeStatus == InterchangeStatus.notSend && approveModuleFlag == 1 && (
                                <div className={cx("status-img")}>
                                    <img src={backApproveStatusImg(approveStatus, intl.get("home.picFlag"))} width={120}/>
                                </div>
                            )
                        }
                        <Tabs
                        onTabClick={this.handleTabClick}
                        defaultActiveKey={activeKey}
                        className="record-tab"
                        >
                            <TabPane tab={
                                <span ga-data={'sale-detail-tab-order'} className={cx("tab-tit")}>
                                    订单信息
                                </span>
                            } key="saleInfo">
                                <PrintArea>{renderContent}</PrintArea>
                            </TabPane>
                            <TabPane tab={
                                <span  className={cx("tab-tit")}>生产追踪</span>
                            } key="produceRecord">
                                <ProduceRecord
                                    recordFor={id}
                                    noAuthRender={<span style={{paddingTop: '30px'}}>{intl.get("sale.show.index.noAuthRender")}</span>}/>
                            </TabPane>
                            <TabPane tab={
                                <span ga-data={'sale-detail-tab-outbound'} className={cx("tab-tit")}>
                                    出库追踪
                                    {
                                        detailData && (detailData.get('interchangeStatus') !== InterchangeStatus.unAccepted
                                            && detailData.get('interchangeStatus') !== InterchangeStatus.cancelled) ? (
                                            <Tooltip
                                                type={"info"}
                                                title={detailData && detailData.get('state') == 0 ? intl.get("sale.show.index.outboundStatus_notFinish"): intl.get("sale.show.index.outboundStatus_finish")}
                                            >
                                                {
                                                    detailData && detailData.get('state') == 0 ?  <Icon type="icon-state-unfinished"  className="icon-state-unfinish"/> :
                                                        <Icon type="icon-state-finished"  className="icon-state-finished"/>
                                                }
                                            </Tooltip>
                                        ) : null
                                    }
                                </span>
                            } key="outboundRecord">
                                <OutboundRecord
                                    onRef={(record) => this.wareOut = record}
                                    module={"outbound"} option={"show"} type="saleOrder" recordFor={id}
                                    noAuthRender={<span style={{paddingTop: '30px'}}>{intl.get("sale.show.index.noAuthRender")}</span>}/>
                            </TabPane>
                            <TabPane tab={
                                <span ga-data={'sale-detail-tab-saleInvoice'} className={cx("tab-tit")}>
                                    开票追踪
                                    <Tooltip
                                        type={"info"}
                                        title={detailData && detailData.get('invoiceState') == 0 ? intl.get("sale.show.index.invoiceState_notFinish"): intl.get("sale.show.index.invoiceState_finish")}
                                    >
                                        {
                                            detailData && detailData.get('invoiceState') == 0 ?  <Icon type="icon-state-unfinished"  className="icon-state-unfinish"/> :
                                                <Icon type="icon-state-finished"  className="icon-state-finished"/>
                                        }
                                    </Tooltip>
                                </span>
                            } key="saleInvoiceRecord">
                                <SaleInvoiceRecord
                                    onRef={(record) => this.invoiceRecord = record}
                                    module={"saleInvoice"} option={"show"} type={'saleOrder'} recordFor={id}
                                    noAuthRender={<span style={{paddingTop: '30px'}}>{intl.get("sale.show.index.noAuthRender")}</span>}/>
                            </TabPane>
                            <TabPane tab={
                                <span ga-data={'sale-detail-tab-income'} className={cx("tab-tit")}>
                                    收款追踪
                                    <Tooltip
                                        type={"open"}
                                        title={detailData && detailData.get('payState') == 0 ? intl.get("sale.show.index.payState_notFinish") : intl.get("sale.show.index.payState_finish")}
                                    >
                                        {
                                            detailData && detailData.get('payState') == 0 ?  <Icon type="icon-state-unfinished"  className="icon-state-unfinish"/> :
                                                <Icon type="icon-state-finished"  className="icon-state-finished"/>
                                        }
                                    </Tooltip>
                                </span>
                            } key="incomeRecord">
                                <IncomeRecord
                                    onRef={(record) => this.incomeRecord = record}
                                    type={'saleOrder'}
                                    module={"income"}
                                    option={"show"}
                                    recordFor={id}
                                    noAuthRender={<span style={{paddingTop: '30px'}}>{intl.get("sale.show.index.noAuthRender")}</span>}/>
                            </TabPane>
                        </Tabs>
                    </div>
                </div>
            </Layout>
        )
    }
}

